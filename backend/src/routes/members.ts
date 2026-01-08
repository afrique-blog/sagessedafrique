import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../services/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const BCRYPT_ROUNDS = 12;

// Validation schemas avec sécurité renforcée
const registerSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100)
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  name: z.string().min(2).max(100).trim(),
  preferredLang: z.enum(['fr', 'en']).default('fr'),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().max(500).optional().nullable(),
  preferredLang: z.enum(['fr', 'en']).optional(),
  isSubscriber: z.boolean().optional(),
});

const oauthSchema = z.object({
  provider: z.enum(['google', 'facebook']),
  accessToken: z.string().min(1),
});

// Générer un token sécurisé
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Générer JWT
function generateJWT(memberId: number): string {
  return jwt.sign({ memberId, type: 'member' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Vérifier JWT et extraire member
async function verifyMemberToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { memberId: number; type: string };
    if (decoded.type !== 'member') return null;
    
    const member = await prisma.member.findUnique({
      where: { id: decoded.memberId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        preferredLang: true,
        isEmailVerified: true,
        isSubscriber: true,
        createdAt: true,
      },
    });
    
    return member;
  } catch {
    return null;
  }
}

// Middleware d'authentification membre
async function requireMemberAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Token requis' });
  }

  const token = authHeader.slice(7);
  const member = await verifyMemberToken(token);
  
  if (!member) {
    return reply.status(401).send({ error: 'Token invalide ou expiré' });
  }

  (request as any).member = member;
}

// Rate limiting simple (à améliorer avec Redis en production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function memberRoutes(fastify: FastifyInstance) {
  // =====================================================
  // INSCRIPTION
  // =====================================================
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = request.ip;
    if (!checkRateLimit(ip, 5, 3600000)) { // 5 inscriptions par heure par IP
      return reply.status(429).send({ error: 'Trop de tentatives. Réessayez plus tard.' });
    }

    const data = registerSchema.parse(request.body);

    // Vérifier si l'email existe déjà
    const existing = await prisma.member.findUnique({ where: { email: data.email } });
    if (existing) {
      return reply.status(400).send({ error: 'Un compte existe déjà avec cet email' });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    // Créer le membre
    const member = await prisma.member.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        preferredLang: data.preferredLang,
      },
    });

    // Créer le token de vérification
    const verificationToken = generateSecureToken();
    await prisma.emailVerification.create({
      data: {
        memberId: member.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    // Envoyer l'email de vérification
    try {
      await sendVerificationEmail(member.email, member.name, verificationToken, data.preferredLang);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    // Générer le JWT
    const token = generateJWT(member.id);

    return {
      success: true,
      message: 'Compte créé. Vérifiez votre email.',
      token,
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        isEmailVerified: false,
      },
    };
  });

  // =====================================================
  // CONNEXION
  // =====================================================
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = request.ip;
    if (!checkRateLimit(ip, 10, 60000)) { // 10 tentatives par minute
      return reply.status(429).send({ error: 'Trop de tentatives. Réessayez dans 1 minute.' });
    }

    const data = loginSchema.parse(request.body);

    // Trouver le membre
    const member = await prisma.member.findUnique({
      where: { email: data.email },
    });

    if (!member || !member.passwordHash) {
      // Délai pour éviter timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(data.password, member.passwordHash);
    if (!isValid) {
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour les stats de connexion
    await prisma.member.update({
      where: { id: member.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // Créer une session
    const token = generateJWT(member.id);
    const sessionId = crypto.randomUUID();
    
    await prisma.memberSession.create({
      data: {
        id: sessionId,
        memberId: member.id,
        token,
        userAgent: request.headers['user-agent'] || null,
        ipAddress: ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      },
    });

    return {
      success: true,
      token,
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        avatar: member.avatar,
        isEmailVerified: member.isEmailVerified,
        preferredLang: member.preferredLang,
      },
    };
  });

  // =====================================================
  // VÉRIFICATION EMAIL
  // =====================================================
  fastify.post('/verify-email', async (request: FastifyRequest, reply: FastifyReply) => {
    const { token } = verifyEmailSchema.parse(request.body);

    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { member: true },
    });

    if (!verification || verification.usedAt || new Date() > verification.expiresAt) {
      return reply.status(400).send({ error: 'Lien invalide ou expiré' });
    }

    // Marquer comme vérifié
    await prisma.$transaction([
      prisma.member.update({
        where: { id: verification.memberId },
        data: { isEmailVerified: true },
      }),
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Envoyer email de bienvenue
    try {
      await sendWelcomeEmail(verification.member.email, verification.member.name, verification.member.preferredLang);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return { success: true, message: 'Email vérifié avec succès' };
  });

  // =====================================================
  // MOT DE PASSE OUBLIÉ
  // =====================================================
  fastify.post('/forgot-password', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = request.ip;
    if (!checkRateLimit(ip, 3, 3600000)) { // 3 demandes par heure
      return reply.status(429).send({ error: 'Trop de tentatives. Réessayez plus tard.' });
    }

    const { email } = forgotPasswordSchema.parse(request.body);

    const member = await prisma.member.findUnique({ where: { email } });
    
    // Toujours retourner succès pour éviter énumération d'emails
    if (!member) {
      return { success: true, message: 'Si un compte existe, un email a été envoyé.' };
    }

    // Invalider les anciens tokens
    await prisma.passwordReset.updateMany({
      where: { memberId: member.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Créer nouveau token
    const resetToken = generateSecureToken();
    await prisma.passwordReset.create({
      data: {
        memberId: member.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 heure
      },
    });

    // Envoyer email
    try {
      await sendPasswordResetEmail(member.email, member.name, resetToken, member.preferredLang);
    } catch (error) {
      console.error('Failed to send reset email:', error);
    }

    return { success: true, message: 'Si un compte existe, un email a été envoyé.' };
  });

  // =====================================================
  // RÉINITIALISER MOT DE PASSE
  // =====================================================
  fastify.post('/reset-password', async (request: FastifyRequest, reply: FastifyReply) => {
    const { token, password } = resetPasswordSchema.parse(request.body);

    const reset = await prisma.passwordReset.findUnique({
      where: { token },
      include: { member: true },
    });

    if (!reset || reset.usedAt || new Date() > reset.expiresAt) {
      return reply.status(400).send({ error: 'Lien invalide ou expiré' });
    }

    // Hasher le nouveau mot de passe
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Mettre à jour
    await prisma.$transaction([
      prisma.member.update({
        where: { id: reset.memberId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
      // Invalider toutes les sessions
      prisma.memberSession.deleteMany({
        where: { memberId: reset.memberId },
      }),
    ]);

    return { success: true, message: 'Mot de passe modifié avec succès' };
  });

  // =====================================================
  // OAUTH (Google/Facebook)
  // =====================================================
  fastify.post('/oauth', async (request: FastifyRequest, reply: FastifyReply) => {
    const { provider, accessToken } = oauthSchema.parse(request.body);

    let userInfo: { id: string; email: string; name: string; picture?: string } | null = null;

    // Vérifier le token avec le provider
    if (provider === 'google') {
      try {
        // Google Sign-In envoie un ID Token (JWT), on le vérifie via tokeninfo
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`);
        if (!response.ok) throw new Error('Invalid token');
        const data = await response.json() as { 
          sub: string; 
          email: string; 
          name: string; 
          picture?: string;
          aud: string;
        };
        
        // Optionnel: vérifier que le token est pour notre application
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        if (googleClientId && data.aud !== googleClientId) {
          throw new Error('Token not for this app');
        }
        
        userInfo = {
          id: data.sub,
          email: data.email,
          name: data.name,
          picture: data.picture,
        };
      } catch {
        return reply.status(401).send({ error: 'Token Google invalide' });
      }
    } else if (provider === 'facebook') {
      try {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,email,name,picture&access_token=${accessToken}`);
        if (!response.ok) throw new Error('Invalid token');
        const data = await response.json() as { id: string; email: string; name: string; picture?: { data?: { url?: string } } };
        userInfo = {
          id: data.id,
          email: data.email,
          name: data.name,
          picture: data.picture?.data?.url,
        };
      } catch {
        return reply.status(401).send({ error: 'Token Facebook invalide' });
      }
    }

    if (!userInfo || !userInfo.email) {
      return reply.status(400).send({ error: 'Impossible de récupérer les informations du compte' });
    }

    // Chercher un compte OAuth existant
    let oauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId: userInfo.id,
        },
      },
      include: { member: true },
    });

    let member;

    if (oauthAccount) {
      // Compte existant - mettre à jour le token
      member = oauthAccount.member;
      await prisma.oAuthAccount.update({
        where: { id: oauthAccount.id },
        data: { accessToken },
      });
    } else {
      // Vérifier si l'email existe déjà
      member = await prisma.member.findUnique({ where: { email: userInfo.email } });

      if (member) {
        // Lier le compte OAuth au membre existant
        await prisma.oAuthAccount.create({
          data: {
            memberId: member.id,
            provider,
            providerId: userInfo.id,
            accessToken,
          },
        });
      } else {
        // Créer un nouveau membre
        member = await prisma.member.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.picture,
            isEmailVerified: true, // L'email est vérifié par OAuth
            oauthAccounts: {
              create: {
                provider,
                providerId: userInfo.id,
                accessToken,
              },
            },
          },
        });

        // Envoyer email de bienvenue
        try {
          await sendWelcomeEmail(member.email, member.name, member.preferredLang);
        } catch (error) {
          console.error('Failed to send welcome email:', error);
        }
      }
    }

    // Mettre à jour les stats
    await prisma.member.update({
      where: { id: member.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // Générer JWT
    const token = generateJWT(member.id);

    return {
      success: true,
      token,
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        avatar: member.avatar,
        isEmailVerified: member.isEmailVerified,
        preferredLang: member.preferredLang,
      },
    };
  });

  // =====================================================
  // PROFIL (Authentifié)
  // =====================================================
  fastify.get('/me', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    return { member: (request as any).member };
  });

  fastify.put('/profile', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    const member = (request as any).member;
    const data = updateProfileSchema.parse(request.body);

    const updated = await prisma.member.update({
      where: { id: member.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        preferredLang: true,
        isEmailVerified: true,
        isSubscriber: true,
      },
    });

    return { success: true, member: updated };
  });

  // =====================================================
  // FAVORIS (Authentifié)
  // =====================================================
  fastify.get('/favorites', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    const member = (request as any).member;
    const lang = (request.query as any).lang || 'fr';

    const favorites = await prisma.memberFavorite.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: 'desc' },
    });

    // Récupérer les articles
    const articleIds = favorites.map(f => f.articleId);
    const articles = await prisma.article.findMany({
      where: { id: { in: articleIds } },
      include: {
        translations: { where: { lang } },
        category: { include: { translations: { where: { lang } } } },
        author: { select: { id: true, name: true } },
      },
    });

    return {
      favorites: articles.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.translations[0]?.title || '',
        excerpt: a.translations[0]?.excerpt || '',
        heroImage: a.heroImage,
        category: a.category ? {
          slug: a.category.slug,
          name: a.category.translations[0]?.name || '',
        } : null,
        author: a.author,
        readingMinutes: a.readingMinutes,
        publishedAt: a.publishedAt,
      })),
    };
  });

  fastify.post('/favorites/:articleId', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    const member = (request as any).member;
    const articleId = parseInt((request.params as any).articleId);

    await prisma.memberFavorite.upsert({
      where: {
        memberId_articleId: { memberId: member.id, articleId },
      },
      create: { memberId: member.id, articleId },
      update: {},
    });

    return { success: true };
  });

  fastify.delete('/favorites/:articleId', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    const member = (request as any).member;
    const articleId = parseInt((request.params as any).articleId);

    await prisma.memberFavorite.deleteMany({
      where: { memberId: member.id, articleId },
    });

    return { success: true };
  });

  // =====================================================
  // HISTORIQUE DE LECTURE (Authentifié)
  // =====================================================
  fastify.get('/reading-history', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    const member = (request as any).member;
    const lang = (request.query as any).lang || 'fr';

    const history = await prisma.readingHistory.findMany({
      where: { memberId: member.id },
      orderBy: { readAt: 'desc' },
      take: 50,
    });

    const articleIds = history.map(h => h.articleId);
    const articles = await prisma.article.findMany({
      where: { id: { in: articleIds } },
      include: {
        translations: { where: { lang } },
        category: { include: { translations: { where: { lang } } } },
      },
    });

    const articlesMap = new Map(articles.map(a => [a.id, a]));

    return {
      history: history.map(h => {
        const article = articlesMap.get(h.articleId);
        return {
          articleId: h.articleId,
          progress: h.progress,
          readAt: h.readAt,
          article: article ? {
            slug: article.slug,
            title: article.translations[0]?.title || '',
            heroImage: article.heroImage,
            category: article.category?.translations[0]?.name || '',
          } : null,
        };
      }).filter(h => h.article),
    };
  });

  fastify.post('/reading-history', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    const member = (request as any).member;
    const { articleId, progress } = z.object({
      articleId: z.number(),
      progress: z.number().min(0).max(100),
    }).parse(request.body);

    await prisma.readingHistory.upsert({
      where: {
        memberId_articleId: { memberId: member.id, articleId },
      },
      create: { memberId: member.id, articleId, progress },
      update: { progress, readAt: new Date() },
    });

    return { success: true };
  });

  // =====================================================
  // DÉCONNEXION
  // =====================================================
  fastify.post('/logout', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      await prisma.memberSession.deleteMany({ where: { token } });
    }

    return { success: true };
  });

  // Déconnexion de toutes les sessions
  fastify.post('/logout-all', { preHandler: requireMemberAuth }, async (request: FastifyRequest) => {
    const member = (request as any).member;
    await prisma.memberSession.deleteMany({ where: { memberId: member.id } });

    return { success: true, message: 'Déconnecté de tous les appareils' };
  });
}
