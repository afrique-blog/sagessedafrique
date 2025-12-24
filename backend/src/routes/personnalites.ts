import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export async function personnalitesRoutes(fastify: FastifyInstance) {
  // GET /api/categories-personnalites - Liste toutes les categories de personnalites
  fastify.get('/categories-personnalites', async (request: FastifyRequest, reply: FastifyReply) => {
    const categories = await prisma.categoriePersonnalite.findMany({
      include: {
        _count: { select: { personnalites: true } },
      },
      orderBy: { nom: 'asc' },
    });

    return categories.map((cat: any) => ({
      id: cat.id,
      slug: cat.slug,
      nom: cat.nom,
      description: cat.description,
      image: cat.image,
      personnalitesCount: cat._count.personnalites,
    }));
  });

  // GET /api/categories-personnalites/:slug - Une categorie avec ses personnalites
  fastify.get('/categories-personnalites/:slug', async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;

    const categorie = await prisma.categoriePersonnalite.findUnique({
      where: { slug },
      include: {
        personnalites: {
          include: {
            article: {
              include: {
                translations: { where: { lang: 'fr' } },
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
      nom: categorie.nom,
      description: categorie.description,
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
  fastify.get('/personnalites', async (request: FastifyRequest, reply: FastifyReply) => {
    const personnalites = await prisma.personnalite.findMany({
      include: {
        categorie: true,
        article: {
          include: {
            translations: { where: { lang: 'fr' } },
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
        nom: p.categorie.nom,
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
  fastify.get('/personnalites/:slug', async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
    const { slug } = request.params;

    const personnalite = await prisma.personnalite.findUnique({
      where: { slug },
      include: {
        categorie: true,
        article: {
          include: {
            translations: { where: { lang: 'fr' } },
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
        nom: personnalite.categorie.nom,
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

