import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const IMAGE_PREFIX = '/images/personnalites/';

// Normalise l'URL de l'image de personnalité
function normalizePersonnaliteImage(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith('/') || image.startsWith('http')) return image;
  return `${IMAGE_PREFIX}${image}`;
}

// Schemas de validation
const createCategoriePersonnaliteSchema = z.object({
  slug: z.string().min(1),
  image: z.string().optional().nullable(),
  translations: z.array(z.object({
    lang: z.enum(['fr', 'en']),
    nom: z.string().min(1),
    description: z.string().min(1),
  })),
});

const createPersonnaliteSchema = z.object({
  slug: z.string().min(1),
  nom: z.string().min(1),
  categorieId: z.number().int(),
  image: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  articleId: z.number().int().optional().nullable(),
});

export async function personnalitesRoutes(fastify: FastifyInstance) {
  // =====================================================
  // CATEGORIES DE PERSONNALITES - ADMIN (AVANT les routes dynamiques!)
  // =====================================================

  // GET /api/categories-personnalites/admin/:id - Get with all translations
  fastify.get('/categories-personnalites/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const categorie = await prisma.categoriePersonnalite.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!categorie) {
      return reply.status(404).send({ error: 'Categorie not found' });
    }

    return categorie;
  });

  // =====================================================
  // PERSONNALITES - ADMIN (AVANT les routes dynamiques!)
  // =====================================================

  // GET /api/personnalites/admin/all - Liste admin avec toutes infos
  fastify.get('/personnalites/admin/all', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const personnalites = await prisma.personnalite.findMany({
      include: {
        categorie: {
          include: { translations: true },
        },
        article: {
          include: { translations: true },
        },
      },
      orderBy: { nom: 'asc' },
    });

    return personnalites;
  });

  // GET /api/personnalites/admin/:id - Get one for admin
  fastify.get('/personnalites/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const personnalite = await prisma.personnalite.findUnique({
      where: { id },
      include: {
        categorie: true,
        article: true,
      },
    });

    if (!personnalite) {
      return reply.status(404).send({ error: 'Personnalite not found' });
    }

    return personnalite;
  });

  // =====================================================
  // CATEGORIES DE PERSONNALITES - PUBLIC
  // =====================================================

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
        image: normalizePersonnaliteImage(p.image),
        youtubeUrl: p.youtubeUrl,
        article: p.article ? {
          id: p.article.id,
          slug: p.article.slug,
          title: p.article.translations[0]?.title || '',
          excerpt: p.article.translations[0]?.excerpt?.split(' ').slice(0, 6).join(' ') + '...' || '',
          heroImage: normalizePersonnaliteImage(p.article.heroImage),
        } : null,
      })),
    };
  });

  // POST /api/categories-personnalites - Create (protected)
  fastify.post('/categories-personnalites', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createCategoriePersonnaliteSchema.parse(request.body);

    const categorie = await prisma.categoriePersonnalite.create({
      data: {
        slug: body.slug,
        image: body.image,
        translations: {
          create: body.translations,
        },
      },
      include: { translations: true },
    });

    return reply.status(201).send(categorie);
  });

  // PUT /api/categories-personnalites/:id - Update (protected)
  fastify.put('/categories-personnalites/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);
    const body = createCategoriePersonnaliteSchema.parse(request.body);

    // Delete existing translations and recreate
    await prisma.categoriePersonnaliteTranslation.deleteMany({ where: { categorieId: id } });

    const categorie = await prisma.categoriePersonnalite.update({
      where: { id },
      data: {
        slug: body.slug,
        image: body.image,
        translations: {
          create: body.translations,
        },
      },
      include: { translations: true },
    });

    return categorie;
  });

  // DELETE /api/categories-personnalites/:id - Delete (protected)
  fastify.delete('/categories-personnalites/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    await prisma.categoriePersonnalite.delete({ where: { id } });

    return { success: true };
  });

  // =====================================================
  // PERSONNALITES - PUBLIC
  // =====================================================

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
      image: normalizePersonnaliteImage(p.image),
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

  // GET /api/personnalites/:slug - Une personnalite (APRÈS les routes admin!)
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
      image: normalizePersonnaliteImage(personnalite.image),
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
        heroImage: normalizePersonnaliteImage(personnalite.article.heroImage),
        author: personnalite.article.author,
      } : null,
    };
  });

  // POST /api/personnalites - Create (protected)
  fastify.post('/personnalites', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createPersonnaliteSchema.parse(request.body);

    const personnalite = await prisma.personnalite.create({
      data: {
        slug: body.slug,
        nom: body.nom,
        categorieId: body.categorieId,
        image: body.image,
        youtubeUrl: body.youtubeUrl,
        articleId: body.articleId,
      },
    });

    return reply.status(201).send(personnalite);
  });

  // PUT /api/personnalites/:id - Update (protected)
  fastify.put('/personnalites/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);
    const body = createPersonnaliteSchema.parse(request.body);

    const personnalite = await prisma.personnalite.update({
      where: { id },
      data: {
        slug: body.slug,
        nom: body.nom,
        categorieId: body.categorieId,
        image: body.image,
        youtubeUrl: body.youtubeUrl,
        articleId: body.articleId,
      },
    });

    return personnalite;
  });

  // DELETE /api/personnalites/:id - Delete (protected)
  fastify.delete('/personnalites/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    await prisma.personnalite.delete({ where: { id } });

    return { success: true };
  });
}
