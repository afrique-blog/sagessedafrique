import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const createCommentSchema = z.object({
  articleId: z.number(),
  authorName: z.string().min(2).max(100),
  authorEmail: z.string().email(),
  content: z.string().min(10).max(2000),
  recaptchaToken: z.string().min(1),
  subscribeNewsletter: z.boolean().optional(), // Option inscription newsletter
});

const updateStatusSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
});

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured, skipping verification');
    return true; // Skip verification if not configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json() as { success: boolean; score?: number };
    
    // For reCAPTCHA v3, check score (0.0 - 1.0, higher is more likely human)
    if (data.score !== undefined) {
      return data.success && data.score >= 0.5;
    }
    
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function commentRoutes(fastify: FastifyInstance) {
  // GET /api/comments - Get approved comments for an article
  fastify.get('/', async (request: FastifyRequest<{ Querystring: { articleId?: string; articleSlug?: string } }>, reply: FastifyReply) => {
    const { articleId, articleSlug } = request.query;

    if (!articleId && !articleSlug) {
      return reply.status(400).send({ error: 'articleId or articleSlug is required' });
    }

    const where: any = { status: 'approved' };

    if (articleId) {
      where.articleId = parseInt(articleId);
    } else if (articleSlug) {
      const article = await prisma.article.findUnique({ where: { slug: articleSlug } });
      if (!article) {
        return reply.status(404).send({ error: 'Article not found' });
      }
      where.articleId = article.id;
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        authorName: true,
        content: true,
        createdAt: true,
      },
    });

    return comments;
  });

  // GET /api/comments/count - Get comment count for an article
  fastify.get('/count', async (request: FastifyRequest<{ Querystring: { articleSlug: string } }>, reply: FastifyReply) => {
    const { articleSlug } = request.query;

    if (!articleSlug) {
      return reply.status(400).send({ error: 'articleSlug is required' });
    }

    const article = await prisma.article.findUnique({ where: { slug: articleSlug } });
    if (!article) {
      return { count: 0 };
    }

    const count = await prisma.comment.count({
      where: { articleId: article.id, status: 'approved' },
    });

    return { count };
  });

  // POST /api/comments - Create a new comment (with reCAPTCHA)
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createCommentSchema.parse(request.body);

      // Verify reCAPTCHA
      const isHuman = await verifyRecaptcha(body.recaptchaToken);
      if (!isHuman) {
        return reply.status(400).send({ error: 'Échec de la vérification reCAPTCHA. Veuillez réessayer.' });
      }

      // Check if article exists
      const article = await prisma.article.findUnique({ where: { id: body.articleId } });
      if (!article) {
        return reply.status(404).send({ error: 'Article not found' });
      }

      // Créer ou mettre à jour le contact
      const contact = await prisma.contact.upsert({
        where: { email: body.authorEmail },
        update: {
          name: body.authorName,
          // Si demande inscription newsletter
          ...(body.subscribeNewsletter && {
            isSubscriber: true,
            subscribedAt: new Date(),
            subscriptionSource: 'comment',
            subscriptionStatus: 'pending',
          }),
        },
        create: {
          email: body.authorEmail,
          name: body.authorName,
          isSubscriber: body.subscribeNewsletter || false,
          subscribedAt: body.subscribeNewsletter ? new Date() : null,
          subscriptionSource: body.subscribeNewsletter ? 'comment' : null,
          subscriptionStatus: body.subscribeNewsletter ? 'pending' : null,
        },
      });

      // Aussi ajouter à subscribers si inscription newsletter (rétrocompatibilité)
      if (body.subscribeNewsletter) {
        try {
          await prisma.subscriber.upsert({
            where: { email: body.authorEmail },
            update: { status: 'pending', source: 'comment' },
            create: { email: body.authorEmail, source: 'comment', status: 'pending' },
          });
        } catch (e) {
          // Ignorer les erreurs de la table legacy
        }
      }

      // Create comment (pending moderation) avec lien vers contact
      const comment = await prisma.comment.create({
        data: {
          articleId: body.articleId,
          contactId: contact.id,
          authorName: body.authorName,
          authorEmail: body.authorEmail,
          content: body.content,
          status: 'pending',
        },
      });

      return reply.status(201).send({
        success: true,
        message: body.subscribeNewsletter 
          ? 'Votre commentaire a été soumis et sera publié après modération. Vous êtes également inscrit à notre newsletter !'
          : 'Votre commentaire a été soumis et sera publié après modération.',
        comment: {
          id: comment.id,
          authorName: comment.authorName,
          createdAt: comment.createdAt,
        },
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ error: 'Données invalides', details: error.errors });
      }
      throw error;
    }
  });

  // =====================================================
  // ADMIN ROUTES (protected)
  // =====================================================

  // GET /api/comments/admin - Get all comments for moderation
  fastify.get('/admin', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Querystring: { status?: string; page?: string; limit?: string } }>, reply: FastifyReply) => {
    const { status, page = '1', limit = '20' } = request.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const where: any = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status;
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          article: {
            select: {
              id: true,
              slug: true,
              translations: {
                where: { lang: 'fr' },
                select: { title: true },
              },
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      data: comments.map(c => ({
        id: c.id,
        authorName: c.authorName,
        authorEmail: c.authorEmail,
        content: c.content,
        status: c.status,
        createdAt: c.createdAt,
        article: {
          id: c.article.id,
          slug: c.article.slug,
          title: c.article.translations[0]?.title || '',
        },
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  });

  // GET /api/comments/admin/stats - Get comment statistics
  fastify.get('/admin/stats', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const [pending, approved, rejected, total] = await Promise.all([
      prisma.comment.count({ where: { status: 'pending' } }),
      prisma.comment.count({ where: { status: 'approved' } }),
      prisma.comment.count({ where: { status: 'rejected' } }),
      prisma.comment.count(),
    ]);

    return { pending, approved, rejected, total };
  });

  // PUT /api/comments/admin/:id/status - Update comment status
  fastify.put('/admin/:id/status', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);
    const body = updateStatusSchema.parse(request.body);

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Comment not found' });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status: body.status },
    });

    return { success: true, comment };
  });

  // DELETE /api/comments/admin/:id - Delete a comment
  fastify.delete('/admin/:id', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const id = parseInt(request.params.id);

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Comment not found' });
    }

    await prisma.comment.delete({ where: { id } });

    return reply.status(204).send();
  });

  // POST /api/comments/admin/bulk - Bulk actions on comments
  fastify.post('/admin/bulk', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Body: { ids: number[]; action: 'approve' | 'reject' | 'delete' } }>, reply: FastifyReply) => {
    const { ids, action } = request.body as { ids: number[]; action: string };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return reply.status(400).send({ error: 'ids array is required' });
    }

    if (action === 'delete') {
      await prisma.comment.deleteMany({ where: { id: { in: ids } } });
    } else if (action === 'approve' || action === 'reject') {
      await prisma.comment.updateMany({
        where: { id: { in: ids } },
        data: { status: action === 'approve' ? 'approved' : 'rejected' },
      });
    } else {
      return reply.status(400).send({ error: 'Invalid action' });
    }

    return { success: true, affected: ids.length };
  });
}
