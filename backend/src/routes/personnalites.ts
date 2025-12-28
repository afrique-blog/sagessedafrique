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
  categorieIds: z.array(z.number().int()).min(1), // Au moins une catégorie
  image: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  articleId: z.number().int().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(), // null = brouillon, future = programmé
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
        categories: {
          include: {
            categorie: {
              include: { translations: true },
            },
          },
        },
        article: {
          include: { translations: true },
        },
      },
      orderBy: { nom: 'asc' },
    });

    return personnalites.map((p: any) => ({
      ...p,
      // Compatibilité: ajouter categorieId et categorie pour l'admin
      categorieIds: p.categories.map((pc: any) => pc.categorieId),
      categories: p.categories.map((pc: any) => pc.categorie),
    }));
  });

  // GET /api/personnalites/admin/:id - Get one for admin
  fastify.get('/personnalites/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const personnalite = await prisma.personnalite.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            categorie: true,
          },
        },
        article: true,
      },
    });

    if (!personnalite) {
      return reply.status(404).send({ error: 'Personnalite not found' });
    }

    return {
      ...personnalite,
      categorieIds: personnalite.categories.map((pc: any) => pc.categorieId),
    };
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
        _count: { select: { personnalites: true } }, // via la table de jointure
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
            personnalite: {
              include: {
                article: {
                  include: {
                    translations: { where: { lang } },
                  },
                },
                categories: {
                  include: {
                    categorie: {
                      include: { translations: { where: { lang } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!categorie) {
      return reply.status(404).send({ error: 'Categorie not found' });
    }

    // Extraire les personnalités, filtrer les brouillons/programmés, et trier par nom
    const now = new Date();
    const personnalites = categorie.personnalites
      .map((pc: any) => pc.personnalite)
      .filter((p: any) => p.publishedAt && new Date(p.publishedAt) <= now) // Exclure brouillons et programmés
      .sort((a: any, b: any) => a.nom.localeCompare(b.nom));

    return {
      id: categorie.id,
      slug: categorie.slug,
      nom: categorie.translations[0]?.nom || '',
      description: categorie.translations[0]?.description || '',
      image: categorie.image,
      personnalites: personnalites.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        nom: p.nom,
        image: normalizePersonnaliteImage(p.image),
        youtubeUrl: p.youtubeUrl,
        categories: p.categories.map((pc: any) => ({
          id: pc.categorie.id,
          slug: pc.categorie.slug,
          nom: pc.categorie.translations[0]?.nom || '',
        })),
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
  fastify.get('/personnalites', async (request: FastifyRequest<{ Querystring: { lang?: string; includeUnpublished?: string } }>, reply: FastifyReply) => {
    const lang = request.query.lang || 'fr';
    const includeUnpublished = request.query.includeUnpublished === 'true';
    
    // Par défaut, ne montrer que les personnalités publiées (publishedAt != null ET <= maintenant)
    // null = brouillon (non visible), future = programmé (non visible), passé = publié (visible)
    const where: any = {};
    if (!includeUnpublished) {
      where.publishedAt = {
        not: null,
        lte: new Date(),
      };
    }
    
    const personnalites = await prisma.personnalite.findMany({
      where,
      include: {
        categories: {
          include: {
            categorie: {
              include: {
                translations: { where: { lang } },
              },
            },
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
      publishedAt: p.publishedAt, // Pour le statut de publication
      categories: p.categories.map((pc: any) => ({
        id: pc.categorie.id,
        slug: pc.categorie.slug,
        nom: pc.categorie.translations[0]?.nom || '',
      })),
      // Compatibilité: garder "categorie" (la première) pour le code existant
      categorie: p.categories.length > 0 ? {
        id: p.categories[0].categorie.id,
        slug: p.categories[0].categorie.slug,
        nom: p.categories[0].categorie.translations[0]?.nom || '',
      } : null,
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
        categories: {
          include: {
            categorie: {
              include: {
                translations: { where: { lang } },
              },
            },
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

    // Vérifier si la personnalité est publiée (brouillon ou programmé = 404)
    const now = new Date();
    if (!personnalite.publishedAt || personnalite.publishedAt > now) {
      return reply.status(404).send({ error: 'Personnalite not found' });
    }

    return {
      id: personnalite.id,
      slug: personnalite.slug,
      nom: personnalite.nom,
      image: normalizePersonnaliteImage(personnalite.image),
      youtubeUrl: personnalite.youtubeUrl,
      categories: personnalite.categories.map((pc: any) => ({
        id: pc.categorie.id,
        slug: pc.categorie.slug,
        nom: pc.categorie.translations[0]?.nom || '',
      })),
      // Compatibilité: garder "categorie" (la première) pour le code existant
      categorie: personnalite.categories.length > 0 ? {
        id: personnalite.categories[0].categorie.id,
        slug: personnalite.categories[0].categorie.slug,
        nom: personnalite.categories[0].categorie.translations[0]?.nom || '',
      } : null,
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

    // Calculer le publishedAt
    const newPublishedAt = body.publishedAt ? new Date(body.publishedAt) : null;

    const personnalite = await prisma.personnalite.create({
      data: {
        slug: body.slug,
        nom: body.nom,
        image: body.image,
        youtubeUrl: body.youtubeUrl,
        articleId: body.articleId,
        publishedAt: newPublishedAt,
        categories: {
          create: body.categorieIds.map((categorieId: number) => ({
            categorieId,
          })),
        },
      },
      include: {
        categories: {
          include: {
            categorie: true,
          },
        },
      },
    });

    // 🔄 SYNCHRONISATION: Si la personnalité a un article lié, mettre à jour son statut aussi
    if (body.articleId) {
      await prisma.article.update({
        where: { id: body.articleId },
        data: { publishedAt: newPublishedAt },
      });
    }

    return reply.status(201).send({
      ...personnalite,
      categorieIds: personnalite.categories.map((pc: any) => pc.categorieId),
    });
  });

  // PUT /api/personnalites/:id - Update (protected)
  fastify.put('/personnalites/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);
    const body = createPersonnaliteSchema.parse(request.body);

    // Supprimer les anciennes associations de catégories
    await prisma.personnaliteCategorie.deleteMany({
      where: { personnaliteId: id },
    });

    // Calculer le nouveau publishedAt
    const newPublishedAt = body.publishedAt ? new Date(body.publishedAt) : null;

    // Mettre à jour la personnalité et créer les nouvelles associations
    const personnalite = await prisma.personnalite.update({
      where: { id },
      data: {
        slug: body.slug,
        nom: body.nom,
        image: body.image,
        youtubeUrl: body.youtubeUrl,
        articleId: body.articleId,
        publishedAt: newPublishedAt,
        categories: {
          create: body.categorieIds.map((categorieId: number) => ({
            categorieId,
          })),
        },
      },
      include: {
        categories: {
          include: {
            categorie: true,
          },
        },
      },
    });

    // 🔄 SYNCHRONISATION: Si la personnalité a un article lié, mettre à jour son statut aussi
    if (body.articleId) {
      await prisma.article.update({
        where: { id: body.articleId },
        data: { publishedAt: newPublishedAt },
      });
    }

    return {
      ...personnalite,
      categorieIds: personnalite.categories.map((pc: any) => pc.categorieId),
    };
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
