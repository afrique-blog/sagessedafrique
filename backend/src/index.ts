import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { articleRoutes } from './routes/articles.js';
import { categoryRoutes } from './routes/categories.js';
import { tagRoutes } from './routes/tags.js';
import { dossierRoutes } from './routes/dossiers.js';
import { authRoutes } from './routes/auth.js';
import { personnalitesRoutes } from './routes/personnalites.js';
import { redirectRoutes } from './routes/redirects.js';
import { subscriberRoutes } from './routes/subscribers.js';
import { commentRoutes } from './routes/comments.js';
import { contactRoutes } from './routes/contacts.js';
import { uploadRoutes } from './routes/uploads.js';
import { memberRoutes } from './routes/members.js';
import { weeklyRoutes } from './routes/weekly.js';
import { verifyEmailConnection } from './services/email.js';

const fastify = Fastify({
  logger: true,
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
});

// Decorate fastify with authenticate
fastify.decorate('authenticate', async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Register routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(articleRoutes, { prefix: '/api/articles' });
await fastify.register(categoryRoutes, { prefix: '/api/categories' });
await fastify.register(tagRoutes, { prefix: '/api/tags' });
await fastify.register(dossierRoutes, { prefix: '/api/dossiers' });
await fastify.register(personnalitesRoutes, { prefix: '/api' });
await fastify.register(redirectRoutes, { prefix: '/api/redirects' });
await fastify.register(subscriberRoutes, { prefix: '/api/subscribers' });
await fastify.register(commentRoutes, { prefix: '/api/comments' });
await fastify.register(contactRoutes, { prefix: '/api/contacts' });
await fastify.register(uploadRoutes, { prefix: '/api/uploads' });
await fastify.register(memberRoutes, { prefix: '/api/members' });
await fastify.register(weeklyRoutes, { prefix: '/api/weekly' });

// Health check
fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    // Vérifier le service email
    await verifyEmailConnection();
    
    const port = parseInt(process.env.PORT || '3001');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();


