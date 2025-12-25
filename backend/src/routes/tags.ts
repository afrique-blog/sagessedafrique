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

const createTagSchema = z.object({
  slug: z.string().min(1),
  translations: z.array(z.object({
    lang: z.enum(['fr', 'en']),
    name: z.string().min(1),
  })),
});

export async function tagRoutes(fastify: FastifyInstance) {
  // GET /api/tags - List all tags
  fastify.get('/', async (request: FastifyRequest<{ Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const lang = (request.query.lang as 'fr' | 'en') || 'fr';

    const tags = await prisma.tag.findMany({
      include: {
        translations: { where: { lang } },
        _count: { select: { articles: true } },
      },
      orderBy: { slug: 'asc' },
    });

    return tags.map((tag: any) => ({
      id: tag.id,
      slug: tag.slug,
      name: tag.translations[0]?.name || '',
      articleCount: tag._count.articles,
    }));
  });

  // GET /api/tags/:slug - Get single tag with articles
  fastify.get('/:slug', async (request: FastifyRequest<{ Params: { slug: string }; Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;
    const lang = (request.query.lang as 'fr' | 'en') || 'fr';

    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        translations: { where: { lang } },
        articles: {
          include: {
            article: {
              include: {
                translations: { where: { lang } },
                author: { select: { id: true, name: true, avatar: true, bio: true } },
                category: { include: { translations: { where: { lang } } } },
              },
            },
          },
        },
      },
    });

    if (!tag) {
      return reply.status(404).send({ error: 'Tag not found' });
    }

    return {
      id: tag.id,
      slug: tag.slug,
      name: tag.translations[0]?.name || '',
      articles: tag.articles.map((at: any) => ({
        id: at.article.id,
        slug: at.article.slug,
        title: at.article.translations[0]?.title || '',
        excerpt: at.article.translations[0]?.excerpt || '',
        heroImage: normalizeHeroImage(at.article.heroImage),
        readingMinutes: at.article.readingMinutes,
        publishedAt: at.article.publishedAt,
        author: at.article.author,
        category: at.article.category ? {
          slug: at.article.category.slug,
          name: at.article.category.translations?.[0]?.name || '',
        } : null,
      })),
    };
  });

  // POST /api/tags - Create tag (protected)
  fastify.post('/', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createTagSchema.parse(request.body);

    const tag = await prisma.tag.create({
      data: {
        slug: body.slug,
        translations: {
          create: body.translations,
        },
      },
      include: { translations: true },
    });

    return reply.status(201).send(tag);
  });

  // GET /api/tags/admin/:id - Get tag with all translations (for admin)
  fastify.get('/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!tag) {
      return reply.status(404).send({ error: 'Tag not found' });
    }

    return tag;
  });

  // PUT /api/tags/:id - Update tag (protected)
  fastify.put('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);
    const body = createTagSchema.parse(request.body);

    // Delete existing translations and recreate
    await prisma.tagTranslation.deleteMany({ where: { tagId: id } });

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        slug: body.slug,
        translations: {
          create: body.translations,
        },
      },
      include: { translations: true },
    });

    return tag;
  });

  // DELETE /api/tags/:id - Delete tag (protected)
  fastify.delete('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    await prisma.tag.delete({ where: { id } });

    return { success: true };
  });
}


