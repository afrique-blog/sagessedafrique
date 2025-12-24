import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/login - Login
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(body.password, user.passwordHash);

    if (!isValidPassword) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  });

  // POST /api/auth/register - Register (protected - only admins can create new users)
  fastify.post('/register', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body);

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existing) {
      return reply.status(400).send({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
      },
    });

    return reply.status(201).send({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  });

  // GET /api/auth/me - Get current user
  fastify.get('/me', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = (request as any).user;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return user;
  });

  // POST /api/auth/refresh - Refresh token
  fastify.post('/refresh', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = (request as any).user;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return reply.status(401).send({ error: 'User not found' });
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }, { expiresIn: '7d' });

    return { token };
  });
}


