import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

// Déclaration du type authenticate
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// Schémas de validation
const editionQuerySchema = z.object({
  year: z.coerce.number().optional(),
  limit: z.coerce.number().min(1).max(52).default(12),
  offset: z.coerce.number().min(0).default(0),
});

const editionCreateSchema = z.object({
  weekNumber: z.number().min(1).max(53),
  year: z.number().min(2020).max(2100),
  title: z.string().optional(),
  contentHtml: z.string().optional(),
  publishedAt: z.string().optional(),
});

export async function weeklyRoutes(fastify: FastifyInstance) {

  // GET /api/weekly/current - Édition courante (dernière publiée)
  fastify.get('/current', async () => {
    const edition = await prisma.weeklyEdition.findFirst({
      where: { publishedAt: { not: null } },
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
    });

    return edition;
  });

  // GET /api/weekly/editions - Liste des éditions publiées
  fastify.get('/editions', async (request) => {
    const { year, limit, offset } = editionQuerySchema.parse(request.query);

    const where: any = { publishedAt: { not: null } };
    if (year) where.year = year;

    const [editions, total] = await Promise.all([
      prisma.weeklyEdition.findMany({
        where,
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        take: limit,
        skip: offset,
        select: {
          id: true,
          slug: true,
          weekNumber: true,
          year: true,
          title: true,
          publishedAt: true,
          // Ne pas inclure contentHtml dans la liste (trop lourd)
        },
      }),
      prisma.weeklyEdition.count({ where }),
    ]);

    return {
      data: editions,
      pagination: { total, limit, offset },
    };
  });

  // GET /api/weekly/editions/:slug - Détail d'une édition
  fastify.get('/editions/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const edition = await prisma.weeklyEdition.findUnique({
      where: { slug },
    });

    if (!edition) {
      return reply.status(404).send({ error: 'Édition non trouvée' });
    }

    return edition;
  });

  // GET /api/weekly/years - Années disponibles (pour filtres)
  fastify.get('/years', async () => {
    const years = await prisma.weeklyEdition.groupBy({
      by: ['year'],
      where: { publishedAt: { not: null } },
      orderBy: { year: 'desc' },
    });
    return years.map(y => y.year);
  });

  // ==========================================
  // ROUTES ADMIN (protégées)
  // ==========================================

  // GET /api/weekly/admin/editions - Liste admin (toutes les éditions)
  fastify.get('/admin/editions', { preHandler: [fastify.authenticate] }, async (request) => {
    const { limit, offset } = editionQuerySchema.parse(request.query);

    const [editions, total] = await Promise.all([
      prisma.weeklyEdition.findMany({
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        take: limit,
        skip: offset,
        select: {
          id: true,
          slug: true,
          weekNumber: true,
          year: true,
          title: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.weeklyEdition.count(),
    ]);

    return {
      data: editions,
      pagination: { total, limit, offset },
    };
  });

  // GET /api/weekly/admin/editions/:id - Détail admin
  fastify.get('/admin/editions/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const edition = await prisma.weeklyEdition.findUnique({
      where: { id: parseInt(id) },
    });

    if (!edition) {
      return reply.status(404).send({ error: 'Édition non trouvée' });
    }

    return edition;
  });

  // POST /api/weekly/admin/editions - Créer une édition
  fastify.post('/admin/editions', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const data = editionCreateSchema.parse(request.body);
    
    // Générer le slug
    const slug = `${data.year}-semaine-${String(data.weekNumber).padStart(2, '0')}`;

    // Vérifier si l'édition existe déjà
    const existing = await prisma.weeklyEdition.findFirst({
      where: { year: data.year, weekNumber: data.weekNumber },
    });

    if (existing) {
      return reply.status(400).send({ error: 'Une édition existe déjà pour cette semaine' });
    }

    // Créer l'édition
    const edition = await prisma.weeklyEdition.create({
      data: {
        weekNumber: data.weekNumber,
        year: data.year,
        slug,
        title: data.title || `Une semaine en Afrique - Semaine ${data.weekNumber}, ${data.year}`,
        contentHtml: data.contentHtml,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    });

    return edition;
  });

  // PUT /api/weekly/admin/editions/:id - Modifier une édition
  fastify.put('/admin/editions/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = editionCreateSchema.partial().parse(request.body);

    const editionId = parseInt(id);

    // Vérifier que l'édition existe
    const existing = await prisma.weeklyEdition.findUnique({ where: { id: editionId } });
    if (!existing) {
      return reply.status(404).send({ error: 'Édition non trouvée' });
    }

    // Mise à jour
    const updateData: any = {};
    if (data.weekNumber !== undefined) updateData.weekNumber = data.weekNumber;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.contentHtml !== undefined) updateData.contentHtml = data.contentHtml;
    if (data.publishedAt !== undefined) {
      updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
    }

    // Mettre à jour le slug si année ou semaine changée
    if (data.year || data.weekNumber) {
      const year = data.year || existing.year;
      const week = data.weekNumber || existing.weekNumber;
      updateData.slug = `${year}-semaine-${String(week).padStart(2, '0')}`;
    }

    const edition = await prisma.weeklyEdition.update({
      where: { id: editionId },
      data: updateData,
    });

    return edition;
  });

  // DELETE /api/weekly/admin/editions/:id - Supprimer une édition
  fastify.delete('/admin/editions/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.weeklyEdition.delete({ where: { id: parseInt(id) } });

    return { success: true };
  });

  // POST /api/weekly/admin/editions/:id/publish - Publier/dépublier
  fastify.post('/admin/editions/:id/publish', { preHandler: [fastify.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    const { publish } = request.body as { publish: boolean };

    const edition = await prisma.weeklyEdition.update({
      where: { id: parseInt(id) },
      data: { publishedAt: publish ? new Date() : null },
    });

    return edition;
  });
}

export default weeklyRoutes;
