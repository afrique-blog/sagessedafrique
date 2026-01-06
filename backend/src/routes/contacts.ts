import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
});

export async function contactRoutes(fastify: FastifyInstance) {
  // =====================================================
  // PUBLIC ROUTES
  // =====================================================

  // POST /api/contacts/subscribe - Subscribe to newsletter
  fastify.post('/subscribe', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, name, source } = subscribeSchema.parse(request.body);

      // Upsert contact
      const contact = await prisma.contact.upsert({
        where: { email },
        update: {
          name: name || undefined,
          isSubscriber: true,
          subscribedAt: new Date(),
          subscriptionSource: source || 'popup',
          subscriptionStatus: 'pending',
        },
        create: {
          email,
          name: name || null,
          isSubscriber: true,
          subscribedAt: new Date(),
          subscriptionSource: source || 'popup',
          subscriptionStatus: 'pending',
        },
      });

      return reply.status(201).send({ 
        success: true, 
        message: 'Inscription réussie !',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ error: 'Email invalide' });
      }
      throw error;
    }
  });

  // POST /api/contacts/unsubscribe - Unsubscribe from newsletter
  fastify.post('/unsubscribe', async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
    const { email } = request.body;

    if (!email) {
      return reply.status(400).send({ error: 'Email requis' });
    }

    await prisma.contact.updateMany({
      where: { email },
      data: { 
        isSubscriber: false,
        subscriptionStatus: 'unsubscribed',
      },
    });

    return { success: true, message: 'Désinscription réussie' };
  });

  // GET /api/contacts/subscribers/count - Get subscriber count (public)
  fastify.get('/subscribers/count', async (request, reply) => {
    const count = await prisma.contact.count({
      where: { 
        isSubscriber: true,
        subscriptionStatus: { not: 'unsubscribed' },
      },
    });
    return { count };
  });

  // =====================================================
  // ADMIN ROUTES (protected)
  // =====================================================

  // GET /api/contacts/admin - Get all contacts
  fastify.get('/admin', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Querystring: { page?: string; limit?: string; filter?: string } }>, reply: FastifyReply) => {
    const { page = '1', limit = '50', filter } = request.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const where: any = {};
    if (filter === 'subscribers') {
      where.isSubscriber = true;
      where.subscriptionStatus = { not: 'unsubscribed' };
    } else if (filter === 'commenters') {
      where.comments = { some: {} };
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          _count: { select: { comments: true } },
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return {
      data: contacts.map(c => ({
        id: c.id,
        email: c.email,
        name: c.name,
        isSubscriber: c.isSubscriber,
        subscribedAt: c.subscribedAt,
        subscriptionSource: c.subscriptionSource,
        subscriptionStatus: c.subscriptionStatus,
        commentsCount: c._count.comments,
        createdAt: c.createdAt,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  });

  // GET /api/contacts/admin/stats - Get contact statistics
  fastify.get('/admin/stats', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const [totalContacts, subscribers, activeSubscribers, commenters] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { isSubscriber: true } }),
      prisma.contact.count({ 
        where: { 
          isSubscriber: true, 
          subscriptionStatus: { not: 'unsubscribed' } 
        } 
      }),
      prisma.contact.count({ where: { comments: { some: {} } } }),
    ]);

    return { 
      totalContacts, 
      subscribers, 
      activeSubscribers,
      commenters,
    };
  });

  // GET /api/contacts/admin/:id - Get single contact details
  fastify.get('/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            article: {
              select: {
                slug: true,
                translations: {
                  where: { lang: 'fr' },
                  select: { title: true },
                },
              },
            },
          },
        },
      },
    });

    if (!contact) {
      return reply.status(404).send({ error: 'Contact non trouvé' });
    }

    return contact;
  });

  // PUT /api/contacts/admin/:id - Update contact
  fastify.put('/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);
    const body = request.body as any;

    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Contact non trouvé' });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        name: body.name,
        isSubscriber: body.isSubscriber,
        subscriptionStatus: body.subscriptionStatus,
      },
    });

    return { success: true, contact };
  });

  // DELETE /api/contacts/admin/:id - Delete contact
  fastify.delete('/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Contact non trouvé' });
    }

    await prisma.contact.delete({ where: { id } });

    return reply.status(204).send();
  });

  // GET /api/contacts/admin/export - Export contacts as CSV
  fastify.get('/admin/export', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Querystring: { filter?: string } }>, reply: FastifyReply) => {
    const { filter } = request.query;

    const where: any = {};
    if (filter === 'subscribers') {
      where.isSubscriber = true;
      where.subscriptionStatus = { not: 'unsubscribed' };
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { comments: true } },
      },
    });

    const csv = [
      'email,name,is_subscriber,subscription_source,subscription_status,comments_count,created_at',
      ...contacts.map(c => 
        `${c.email},${c.name || ''},${c.isSubscriber},${c.subscriptionSource || ''},${c.subscriptionStatus || ''},${c._count.comments},${c.createdAt.toISOString()}`
      ),
    ].join('\n');

    reply.header('Content-Type', 'text/csv');
    reply.header('Content-Disposition', 'attachment; filename="contacts.csv"');
    return csv;
  });
}
