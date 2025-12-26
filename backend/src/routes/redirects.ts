import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

export async function redirectRoutes(fastify: FastifyInstance) {
  // GET /api/redirects - Liste toutes les redirections actives
  fastify.get('/', async (request, reply) => {
    try {
      const redirects = await prisma.redirect.findMany({
        select: {
          oldPath: true,
          newPath: true,
        },
      });
      
      return redirects;
    } catch (error) {
      // Si la table n'existe pas encore, retourner un tableau vide
      console.error('Redirects table not found or error:', error);
      return [];
    }
  });

  // POST /api/redirects - Ajouter une redirection (admin only)
  fastify.post('/', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const { oldPath, newPath, entityType, entityId } = request.body as {
      oldPath: string;
      newPath: string;
      entityType: string;
      entityId: number;
    };

    try {
      const redirect = await prisma.redirect.create({
        data: {
          oldPath,
          newPath,
          entityType,
          entityId,
        },
      });

      return reply.status(201).send(redirect);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.status(409).send({ error: 'Redirect already exists for this path' });
      }
      throw error;
    }
  });

  // PUT /api/redirects/:id/hit - Incrémenter le compteur de hits
  fastify.put('/:id/hit', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.redirect.update({
        where: { id: parseInt(id) },
        data: { hits: { increment: 1 } },
      });

      return { success: true };
    } catch (error) {
      return reply.status(404).send({ error: 'Redirect not found' });
    }
  });

  // DELETE /api/redirects/:id - Supprimer une redirection (admin only)
  fastify.delete('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.redirect.delete({
        where: { id: parseInt(id) },
      });

      return { success: true };
    } catch (error) {
      return reply.status(404).send({ error: 'Redirect not found' });
    }
  });

  // GET /api/redirects/stats - Statistiques des redirections (admin only)
  fastify.get('/stats', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const stats = await prisma.redirect.groupBy({
      by: ['entityType'],
      _count: true,
      _sum: { hits: true },
    });

    const total = await prisma.redirect.count();
    const totalHits = await prisma.redirect.aggregate({
      _sum: { hits: true },
    });

    return {
      total,
      totalHits: totalHits._sum.hits || 0,
      byType: stats,
    };
  });
}

