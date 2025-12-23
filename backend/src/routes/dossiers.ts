import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const createDossierSchema = z.object({
  slug: z.string().min(1),
  heroImage: z.string().optional(),
  translations: z.array(z.object({
    lang: z.enum(['fr', 'en']),
    title: z.string().min(1),
    description: z.string().optional(),
  })),
});

export async function dossierRoutes(fastify: FastifyInstance) {
  // GET /api/dossiers - List all dossiers
  fastify.get('/', async (request: FastifyRequest<{ Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const lang = (request.query.lang as 'fr' | 'en') || 'fr';

    const dossiers = await prisma.dossier.findMany({
      include: {
        translations: { where: { lang } },
        _count: { select: { articles: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return dossiers.map(d => ({
      id: d.id,
      slug: d.slug,
      heroImage: d.heroImage,
      title: d.translations[0]?.title || '',
      description: d.translations[0]?.description || '',
      articleCount: d._count.articles,
    }));
  });

  // GET /api/dossiers/:slug - Get single dossier with articles
  fastify.get('/:slug', async (request: FastifyRequest<{ Params: { slug: string }; Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;
    const lang = (request.query.lang as 'fr' | 'en') || 'fr';

    const dossier = await prisma.dossier.findUnique({
      where: { slug },
      include: {
        translations: { where: { lang } },
        articles: {
          include: {
            article: {
              include: {
                translations: { where: { lang } },
                author: { select: { id: true, name: true } },
                category: { include: { translations: { where: { lang } } } },
              },
            },
          },
        },
      },
    });

    if (!dossier) {
      return reply.status(404).send({ error: 'Dossier not found' });
    }

    return {
      id: dossier.id,
      slug: dossier.slug,
      heroImage: dossier.heroImage,
      title: dossier.translations[0]?.title || '',
      description: dossier.translations[0]?.description || '',
      articles: dossier.articles.map(ad => ({
        id: ad.article.id,
        slug: ad.article.slug,
        title: ad.article.translations[0]?.title || '',
        excerpt: ad.article.translations[0]?.excerpt || '',
        heroImage: ad.article.heroImage,
        readingMinutes: ad.article.readingMinutes,
        publishedAt: ad.article.publishedAt,
        author: ad.article.author,
        category: ad.article.category?.translations?.[0]?.name || '',
      })),
    };
  });

  // POST /api/dossiers - Create dossier (protected)
  fastify.post('/', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createDossierSchema.parse(request.body);

    const dossier = await prisma.dossier.create({
      data: {
        slug: body.slug,
        heroImage: body.heroImage,
        translations: {
          create: body.translations,
        },
      },
      include: { translations: true },
    });

    return reply.status(201).send(dossier);
  });

  // DELETE /api/dossiers/:id - Delete dossier (protected)
  fastify.delete('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    await prisma.dossier.delete({ where: { id } });

    return { success: true };
  });
}

