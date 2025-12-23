import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

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

    return categories.map(cat => ({
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
            author: { select: { id: true, name: true } },
          },
          orderBy: { publishedAt: 'desc' },
          take: 20,
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
      articles: category.articles.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.translations[0]?.title || '',
        excerpt: a.translations[0]?.excerpt || '',
        heroImage: a.heroImage,
        readingMinutes: a.readingMinutes,
        publishedAt: a.publishedAt,
        author: a.author,
      })),
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

  // DELETE /api/categories/:id - Delete category (protected)
  fastify.delete('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    await prisma.category.delete({ where: { id } });

    return { success: true };
  });
}

