import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export async function personnalitesRoutes(fastify: FastifyInstance) {
  // GET /api/categories-personnalites - Liste toutes les categories de personnalites
  fastify.get('/categories-personnalites', async (request: FastifyRequest<{ Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const lang = request.query.lang || 'fr';
    
    const categories = await prisma.categoriePersonnalite.findMany({
      include: {
        translations: { where: { lang } },
        _count: { select: { personnalites: true } },
      },
      orderBy: { id: 'asc' },
    });

    return categories.map((cat: any) => ({
      id: cat.id,
      slug: cat.slug,
      nom: cat.translations[0]?.nom || '',
      description: cat.translations[0]?.description || '',
      image: cat.image,
      personnalitesCount: cat._count.personnalites,
    }));
  });

  // GET /api/categories-personnalites/:slug - Une categorie avec ses personnalites
  fastify.get('/categories-personnalites/:slug', async (request: FastifyRequest<{ Params: { slug: string }; Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;
    const lang = request.query.lang || 'fr';

    const categorie = await prisma.categoriePersonnalite.findUnique({
      where: { slug },
      include: {
        translations: { where: { lang } },
        personnalites: {
          include: {
            article: {
              include: {
                translations: { where: { lang } },
              },
            },
          },
          orderBy: { nom: 'asc' },
        },
      },
    });

    if (!categorie) {
      return reply.status(404).send({ error: 'Categorie not found' });
    }

    return {
      id: categorie.id,
      slug: categorie.slug,
      nom: categorie.translations[0]?.nom || '',
      description: categorie.translations[0]?.description || '',
      image: categorie.image,
      personnalites: categorie.personnalites.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        nom: p.nom,
        image: p.image,
        youtubeUrl: p.youtubeUrl,
        article: p.article ? {
          id: p.article.id,
          slug: p.article.slug,
          title: p.article.translations[0]?.title || '',
          excerpt: p.article.translations[0]?.excerpt?.split(' ').slice(0, 6).join(' ') + '...' || '',
          heroImage: p.article.heroImage,
        } : null,
      })),
    };
  });

  // GET /api/personnalites - Liste toutes les personnalites
  fastify.get('/personnalites', async (request: FastifyRequest<{ Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const lang = request.query.lang || 'fr';
    
    const personnalites = await prisma.personnalite.findMany({
      include: {
        categorie: {
          include: {
            translations: { where: { lang } },
          },
        },
        article: {
          include: {
            translations: { where: { lang } },
          },
        },
      },
      orderBy: { nom: 'asc' },
    });

    return personnalites.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      nom: p.nom,
      image: p.image,
      youtubeUrl: p.youtubeUrl,
      categorie: {
        id: p.categorie.id,
        slug: p.categorie.slug,
        nom: p.categorie.translations[0]?.nom || '',
      },
      article: p.article ? {
        id: p.article.id,
        slug: p.article.slug,
        title: p.article.translations[0]?.title || '',
        excerpt: p.article.translations[0]?.excerpt?.split(' ').slice(0, 6).join(' ') + '...' || '',
      } : null,
    }));
  });

  // GET /api/personnalites/:slug - Une personnalite
  fastify.get('/personnalites/:slug', async (request: FastifyRequest<{ Params: { slug: string }; Querystring: { lang?: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;
    const lang = request.query.lang || 'fr';

    const personnalite = await prisma.personnalite.findUnique({
      where: { slug },
      include: {
        categorie: {
          include: {
            translations: { where: { lang } },
          },
        },
        article: {
          include: {
            translations: { where: { lang } },
            author: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!personnalite) {
      return reply.status(404).send({ error: 'Personnalite not found' });
    }

    return {
      id: personnalite.id,
      slug: personnalite.slug,
      nom: personnalite.nom,
      image: personnalite.image,
      youtubeUrl: personnalite.youtubeUrl,
      categorie: {
        id: personnalite.categorie.id,
        slug: personnalite.categorie.slug,
        nom: (personnalite.categorie as any).translations[0]?.nom || '',
      },
      article: personnalite.article ? {
        id: personnalite.article.id,
        slug: personnalite.article.slug,
        title: personnalite.article.translations[0]?.title || '',
        excerpt: personnalite.article.translations[0]?.excerpt || '',
        contentHtml: personnalite.article.translations[0]?.contentHtml || '',
        heroImage: personnalite.article.heroImage,
        author: personnalite.article.author,
      } : null,
    };
  });
}
