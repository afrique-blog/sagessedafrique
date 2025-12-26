import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const IMAGE_PREFIX = '/images/personnalites/';

// Normalise l'URL de l'image hero
function normalizeHeroImage(image: string | null | undefined): string | null {
  if (!image) return null;
  if (image.startsWith('/') || image.startsWith('http')) return image;
  return `${IMAGE_PREFIX}${image}`;
}

const createCategorySchema = z.object({
  slug: z.string().min(1),
  translations: z.array(z.object({
    lang: z.enum(['fr', 'en']),
    name: z.string().min(1),
    description: z.string().optional(),
  })),
});

export async function categoryRoutes(fastify: FastifyInstance) {
  // GET /api/categories - List all categories
  fastify.get('/', async (request: FastifyRequest<{ Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const lang = (request.query.lang as 'fr' | 'en') || 'fr';

    const categories = await prisma.category.findMany({
      include: {
        translations: { where: { lang } },
        _count: { select: { articles: true } },
      },
      orderBy: { slug: 'asc' },
    });

    return categories.map((cat: any) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.translations[0]?.name || '',
      description: cat.translations[0]?.description || '',
      articleCount: cat._count.articles,
    }));
  });

  // GET /api/categories/:slug - Get single category with articles
  fastify.get('/:slug', async (request: FastifyRequest<{ Params: { slug: string }; Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;
    const lang = (request.query.lang as 'fr' | 'en') || 'fr';

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        translations: { where: { lang } },
        articles: {
          include: {
            translations: { where: { lang } },
            author: { select: { id: true, name: true, avatar: true, bio: true } },
            personnalites: {
              include: {
                categorie: {
                  include: {
                    translations: { where: { lang } },
                  },
                },
              },
            },
          },
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!category) {
      return reply.status(404).send({ error: 'Category not found' });
    }

    return {
      id: category.id,
      slug: category.slug,
      name: category.translations[0]?.name || '',
      description: category.translations[0]?.description || '',
      articles: category.articles.map((a: any) => {
        // Get personality category if article is linked to a personality
        const personnalite = a.personnalites?.[0];
        const personnaliteCategorie = personnalite?.categorie;
        
        return {
          id: a.id,
          slug: a.slug,
          title: a.translations[0]?.title || '',
          excerpt: a.translations[0]?.excerpt || '',
          heroImage: normalizeHeroImage(a.heroImage),
          readingMinutes: a.readingMinutes,
          publishedAt: a.publishedAt,
          author: a.author,
          personnaliteCategorie: personnaliteCategorie ? {
            slug: personnaliteCategorie.slug,
            nom: personnaliteCategorie.translations[0]?.nom || '',
          } : null,
        };
      }),
    };
  });

  // POST /api/categories - Create category (protected)
  fastify.post('/', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createCategorySchema.parse(request.body);

    const category = await prisma.category.create({
      data: {
        slug: body.slug,
        translations: {
          create: body.translations,
        },
      },
      include: { translations: true },
    });

    return reply.status(201).send(category);
  });

  // GET /api/categories/admin/:id - Get category with all translations (for admin)
  fastify.get('/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const category = await prisma.category.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!category) {
      return reply.status(404).send({ error: 'Category not found' });
    }

    return category;
  });

  // PUT /api/categories/:id - Update category (protected)
  fastify.put('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);
    const body = createCategorySchema.parse(request.body);

    // Delete existing translations and recreate
    await prisma.categoryTranslation.deleteMany({ where: { categoryId: id } });

    const category = await prisma.category.update({
      where: { id },
      data: {
        slug: body.slug,
        translations: {
          create: body.translations,
        },
      },
      include: { translations: true },
    });

    return category;
  });

  // DELETE /api/categories/:id - Delete category (protected)
  fastify.delete('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    await prisma.category.delete({ where: { id } });

    return { success: true };
  });
}


