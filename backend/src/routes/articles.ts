import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const articleQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  lang: z.enum(['fr', 'en']).default('fr'),
  category: z.string().optional(),
  tag: z.string().optional(),
  dossier: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

const createArticleSchema = z.object({
  slug: z.string().min(1),
  categoryId: z.number(),
  heroImage: z.string().optional(),
  featured: z.boolean().default(false),
  readingMinutes: z.number().default(5),
  publishedAt: z.string().datetime().optional(),
  translations: z.array(z.object({
    lang: z.enum(['fr', 'en']),
    title: z.string().min(1),
    excerpt: z.string().optional(),
    contentHtml: z.string().optional(),
    takeaway: z.string().optional(),
  })),
  tagIds: z.array(z.number()).optional(),
  dossierIds: z.array(z.number()).optional(),
});

const updateArticleSchema = createArticleSchema.partial();

export async function articleRoutes(fastify: FastifyInstance) {
  // GET /api/articles - List articles with pagination and filters
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = articleQuerySchema.parse(request.query);
    const { page, limit, lang, category, tag, dossier, featured, search } = query;

    const where: any = {};

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
          author: { select: { id: true, name: true } },
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
  fastify.get('/:slug', async (request: FastifyRequest<{ Params: { slug: string }; Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;
    const lang = (request.query.lang as 'fr' | 'en') || 'fr';

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            translations: { where: { lang } },
          },
        },
        author: { select: { id: true, name: true } },
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

    // Increment views
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });

    return formatArticle(article);
  });

  // POST /api/articles - Create article (protected)
  fastify.post('/', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createArticleSchema.parse(request.body);
    const user = (request as any).user;

    const article = await prisma.article.create({
      data: {
        slug: body.slug,
        categoryId: body.categoryId,
        authorId: user.id,
        heroImage: body.heroImage,
        featured: body.featured,
        readingMinutes: body.readingMinutes,
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
        author: { select: { id: true, name: true } },
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

    const article = await prisma.article.update({
      where: { id },
      data: {
        slug: body.slug,
        categoryId: body.categoryId,
        heroImage: body.heroImage,
        featured: body.featured,
        readingMinutes: body.readingMinutes,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      },
      include: {
        translations: true,
        category: { include: { translations: true } },
        author: { select: { id: true, name: true } },
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
    heroImage: article.heroImage,
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

