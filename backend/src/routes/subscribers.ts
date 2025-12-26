import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function subscriberRoutes(fastify: FastifyInstance) {
  // Subscribe to newsletter
  fastify.post('/', async (request: FastifyRequest<{ Body: { email: string; source?: string } }>, reply: FastifyReply) => {
    try {
      const { email, source } = subscribeSchema.parse(request.body);

      // Check if already subscribed
      const existing = await prisma.subscriber.findUnique({
        where: { email },
      });

      if (existing) {
        if (existing.status === 'unsubscribed') {
          // Re-subscribe
          await prisma.subscriber.update({
            where: { email },
            data: { status: 'pending', source },
          });
          return { success: true, message: 'Re-subscribed successfully' };
        }
        return { success: true, message: 'Already subscribed' };
      }

      // Create new subscriber
      await prisma.subscriber.create({
        data: {
          email,
          source: source || 'unknown',
          status: 'pending',
        },
      });

      return reply.status(201).send({ success: true, message: 'Subscribed successfully' });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return { success: true, message: 'Already subscribed' };
      }
      throw error;
    }
  });

  // Get all subscribers (admin only)
  fastify.get('/', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return subscribers;
  });

  // Get subscriber count
  fastify.get('/count', async (request, reply) => {
    const count = await prisma.subscriber.count({
      where: { status: { not: 'unsubscribed' } },
    });
    return { count };
  });

  // Unsubscribe
  fastify.post('/unsubscribe', async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
    const { email } = request.body;

    await prisma.subscriber.updateMany({
      where: { email },
      data: { status: 'unsubscribed' },
    });

    return { success: true, message: 'Unsubscribed successfully' };
  });

  // Delete subscriber (admin only)
  fastify.delete('/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    await prisma.subscriber.delete({
      where: { id: parseInt(id) },
    });

    return reply.status(204).send();
  });

  // Export subscribers as CSV (admin only)
  fastify.get('/export', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const subscribers = await prisma.subscriber.findMany({
      where: { status: { not: 'unsubscribed' } },
      orderBy: { createdAt: 'desc' },
    });

    const csv = [
      'email,source,status,created_at',
      ...subscribers.map(s => `${s.email},${s.source || ''},${s.status},${s.createdAt.toISOString()}`),
    ].join('\n');

    reply.header('Content-Type', 'text/csv');
    reply.header('Content-Disposition', 'attachment; filename="subscribers.csv"');
    return csv;
  });
}

