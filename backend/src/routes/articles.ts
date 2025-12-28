import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const IMAGE_PREFIX = '/images/personnalites/';

// Normalise l'URL de l'image hero de l'article
function normalizeHeroImage(image: string | null | undefined): string | null {
  if (!image) return null;
  if (image.startsWith('/') || image.startsWith('http')) return image;
  return `${IMAGE_PREFIX}${image}`;
}

// Calcule le temps de lecture basé sur le contenu (environ 200 mots/minute)
function calculateReadingTime(contentHtml: string | null | undefined): number {
  if (!contentHtml) return 1;
  
  // Supprimer les balises HTML
  const textContent = contentHtml.replace(/<[^>]*>/g, ' ');
  
  // Compter les mots (séparés par des espaces)
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // 200 mots par minute, minimum 1 minute
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

const articleQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(200).default(10),
  lang: z.enum(['fr', 'en']).default('fr'),
  category: z.string().optional(),
  tag: z.string().optional(),
  dossier: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  includeUnpublished: z.coerce.boolean().optional(), // Pour l'admin uniquement
});

const createArticleSchema = z.object({
  slug: z.string().min(1),
  categoryId: z.number(),
  heroImage: z.string().optional(),
  featured: z.boolean().default(false),
  readingMinutes: z.number().default(5),
  publishedAt: z.string().datetime().optional().nullable(), // null = brouillon
  translations: z.array(z.object({
    lang: z.enum(['fr', 'en']),
    title: z.string().min(1),
    excerpt: z.string().optional(),
    contentHtml: z.string().optional(),
    takeaway: z.string().optional(),
    sources: z.string().optional(),
  })),
  tagIds: z.array(z.number()).optional(),
  dossierIds: z.array(z.number()).optional(),
});

const updateArticleSchema = createArticleSchema.partial();

export async function articleRoutes(fastify: FastifyInstance) {
  // GET /api/articles - List articles with pagination and filters
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = articleQuerySchema.parse(request.query);
    const { page, limit, lang, category, tag, dossier, featured, search, includeUnpublished } = query;

    const where: any = {};

    // Par défaut, ne montrer que les articles publiés (publishedAt <= maintenant)
    // Sauf si includeUnpublished est true (pour l'admin)
    if (!includeUnpublished) {
      where.publishedAt = {
        not: null,
        lte: new Date(),
      };
    }

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    if (dossier) {
      where.dossiers = { some: { dossier: { slug: dossier } } };
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (search) {
      where.translations = {
        some: {
          lang,
          OR: [
            { title: { contains: search } },
            { excerpt: { contains: search } },
          ],
        },
      };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: {
            include: {
              translations: { where: { lang } },
            },
          },
          author: { select: { id: true, name: true, avatar: true, bio: true } },
          translations: { where: { lang } },
          tags: {
            include: {
              tag: {
                include: {
                  translations: { where: { lang } },
                },
              },
            },
          },
          dossiers: {
            include: {
              dossier: {
                include: {
                  translations: { where: { lang } },
                },
              },
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return {
      data: articles.map(formatArticle),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  });

  // GET /api/articles/:slug - Get single article
  fastify.get('/:slug', async (request: FastifyRequest<{ Params: { slug: string }; Querystring: { lang?: string; preview?: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;
    const lang = (request.query.lang as 'fr' | 'en') || 'fr';
    const preview = request.query.preview === 'true'; // Pour prévisualiser un brouillon

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            translations: { where: { lang } },
          },
        },
        author: { select: { id: true, name: true, avatar: true, bio: true } },
        translations: { where: { lang } },
        tags: {
          include: {
            tag: {
              include: {
                translations: { where: { lang } },
              },
            },
          },
        },
        dossiers: {
          include: {
            dossier: {
              include: {
                translations: { where: { lang } },
              },
            },
          },
        },
      },
    });

    if (!article) {
      return reply.status(404).send({ error: 'Article not found' });
    }

    // Vérifier si l'article est publié (sauf en mode preview)
    if (!preview) {
      const now = new Date();
      if (!article.publishedAt || article.publishedAt > now) {
        return reply.status(404).send({ error: 'Article not found' });
      }
    }

    // Increment views and get updated count
    const updatedArticle = await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    // Return article with updated view count
    return formatArticle({ ...article, views: updatedArticle.views });
  });

  // POST /api/articles - Create article (protected)
  fastify.post('/', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createArticleSchema.parse(request.body);
    const user = (request as any).user;

    // Calculer automatiquement le temps de lecture basé sur le contenu français
    const frTranslation = body.translations.find(t => t.lang === 'fr');
    const autoReadingMinutes = calculateReadingTime(frTranslation?.contentHtml);

    const article = await prisma.article.create({
      data: {
        slug: body.slug,
        categoryId: body.categoryId,
        authorId: user.id,
        heroImage: body.heroImage,
        featured: body.featured,
        readingMinutes: autoReadingMinutes,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
        translations: {
          create: body.translations,
        },
        tags: body.tagIds ? {
          create: body.tagIds.map(tagId => ({ tagId })),
        } : undefined,
        dossiers: body.dossierIds ? {
          create: body.dossierIds.map(dossierId => ({ dossierId })),
        } : undefined,
      },
      include: {
        translations: true,
        category: { include: { translations: true } },
        author: { select: { id: true, name: true, avatar: true, bio: true } },
        tags: { include: { tag: { include: { translations: true } } } },
        dossiers: { include: { dossier: { include: { translations: true } } } },
      },
    });

    return reply.status(201).send(article);
  });

  // PUT /api/articles/:id - Update article (protected)
  fastify.put('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);
    const body = updateArticleSchema.parse(request.body);

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Article not found' });
    }

    // Update translations if provided
    if (body.translations) {
      await prisma.articleTranslation.deleteMany({ where: { articleId: id } });
      await prisma.articleTranslation.createMany({
        data: body.translations.map(t => ({ ...t, articleId: id })),
      });
    }

    // Update tags if provided
    if (body.tagIds) {
      await prisma.articleTag.deleteMany({ where: { articleId: id } });
      await prisma.articleTag.createMany({
        data: body.tagIds.map(tagId => ({ articleId: id, tagId })),
      });
    }

    // Update dossiers if provided
    if (body.dossierIds) {
      await prisma.articleDossier.deleteMany({ where: { articleId: id } });
      await prisma.articleDossier.createMany({
        data: body.dossierIds.map(dossierId => ({ articleId: id, dossierId })),
      });
    }

    // Calculer automatiquement le temps de lecture si les traductions sont mises à jour
    let autoReadingMinutes: number | undefined;
    if (body.translations) {
      const frTranslation = body.translations.find(t => t.lang === 'fr');
      autoReadingMinutes = calculateReadingTime(frTranslation?.contentHtml);
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        slug: body.slug,
        categoryId: body.categoryId,
        heroImage: body.heroImage,
        featured: body.featured,
        readingMinutes: autoReadingMinutes ?? body.readingMinutes,
        // Si publishedAt est explicitement null = brouillon, sinon date ou undefined (pas de changement)
        publishedAt: body.publishedAt !== undefined 
          ? (body.publishedAt ? new Date(body.publishedAt) : null)
          : undefined,
      },
      include: {
        translations: true,
        category: { include: { translations: true } },
        author: { select: { id: true, name: true, avatar: true, bio: true } },
        tags: { include: { tag: { include: { translations: true } } } },
        dossiers: { include: { dossier: { include: { translations: true } } } },
      },
    });

    return article;
  });

  // DELETE /api/articles/:id - Delete article (protected)
  fastify.delete('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Article not found' });
    }

    await prisma.article.delete({ where: { id } });

    return { success: true };
  });
}

function formatArticle(article: any) {
  const translation = article.translations[0];
  const categoryTranslation = article.category?.translations?.[0];

  return {
    id: article.id,
    slug: article.slug,
    title: translation?.title || '',
    excerpt: translation?.excerpt || '',
    contentHtml: translation?.contentHtml || '',
    takeaway: translation?.takeaway || '',
    sources: translation?.sources || '',
    heroImage: normalizeHeroImage(article.heroImage),
    featured: article.featured,
    views: article.views,
    readingMinutes: article.readingMinutes,
    publishedAt: article.publishedAt,
    author: article.author,
    category: categoryTranslation ? {
      slug: article.category.slug,
      name: categoryTranslation.name,
    } : null,
    tags: article.tags?.map((t: any) => ({
      slug: t.tag.slug,
      name: t.tag.translations[0]?.name || '',
    })) || [],
    dossiers: article.dossiers?.map((d: any) => ({
      slug: d.dossier.slug,
      title: d.dossier.translations[0]?.title || '',
    })) || [],
  };
}


