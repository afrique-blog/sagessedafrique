import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../lib/prisma.js';

export const paysRoutes: FastifyPluginAsync = async (fastify) => {

  // ══════════════════════════════════════════════════════════════════════════
  // PUBLIC ROUTES
  // ══════════════════════════════════════════════════════════════════════════

  // GET /api/pays - Liste tous les dossiers pays publiés
  fastify.get('/', async (request, reply) => {
    const { lang = 'fr' } = request.query as { lang?: string };
    
    const dossiers = await prisma.paysDossier.findMany({
      where: { 
        publishedAt: { not: null, lte: new Date() }
      },
      include: {
        translations: { where: { lang } },
        chapitres: { select: { id: true, readingMinutes: true } }
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' }
      ]
    });

    return dossiers.map(d => ({
      id: d.id,
      slug: d.slug,
      countryCode: d.countryCode,
      heroImage: d.heroImage,
      featured: d.featured,
      publishedAt: d.publishedAt,
      title: d.translations[0]?.title || '',
      subtitle: d.translations[0]?.subtitle || '',
      chapitresCount: d.chapitres.length,
      totalReadingMinutes: d.chapitres.reduce((sum, c) => sum + c.readingMinutes, 0)
    }));
  });

  // GET /api/pays/:slug - Détail d'un dossier avec sommaire
  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const { lang = 'fr' } = request.query as { lang?: string };

    const dossier = await prisma.paysDossier.findUnique({
      where: { slug },
      include: {
        translations: { where: { lang } },
        chapitres: {
          orderBy: { ordre: 'asc' },
          include: {
            translations: { 
              where: { lang },
              select: { title: true }
            }
          }
        }
      }
    });

    if (!dossier) {
      return reply.status(404).send({ error: 'Dossier non trouvé' });
    }

    // Vérifier si publié (sauf admin)
    if (!dossier.publishedAt || dossier.publishedAt > new Date()) {
      // Vérifier si admin
      try {
        await (fastify as any).authenticate(request, reply);
      } catch {
        return reply.status(404).send({ error: 'Dossier non trouvé' });
      }
    }

    const trans = dossier.translations[0];
    const totalMinutes = dossier.chapitres.reduce((sum, c) => sum + c.readingMinutes, 0);

    return {
      id: dossier.id,
      slug: dossier.slug,
      countryCode: dossier.countryCode,
      heroImage: dossier.heroImage,
      featured: dossier.featured,
      publishedAt: dossier.publishedAt,
      title: trans?.title || '',
      subtitle: trans?.subtitle || '',
      metaTitle: trans?.metaTitle || trans?.title || '',
      metaDescription: trans?.metaDescription || '',
      totalReadingMinutes: totalMinutes,
      chapitres: dossier.chapitres.map(c => ({
        id: c.id,
        slug: c.slug,
        ordre: c.ordre,
        title: c.translations[0]?.title || '',
        readingMinutes: c.readingMinutes
      }))
    };
  });

  // GET /api/pays/:slug/:chapitre - Contenu d'un chapitre
  fastify.get('/:slug/:chapitre', async (request, reply) => {
    const { slug, chapitre } = request.params as { slug: string; chapitre: string };
    const { lang = 'fr' } = request.query as { lang?: string };

    const dossier = await prisma.paysDossier.findUnique({
      where: { slug },
      include: {
        translations: { where: { lang } },
        chapitres: {
          orderBy: { ordre: 'asc' },
          include: {
            translations: { where: { lang } }
          }
        }
      }
    });

    if (!dossier) {
      return reply.status(404).send({ error: 'Dossier non trouvé' });
    }

    // Vérifier si publié
    if (!dossier.publishedAt || dossier.publishedAt > new Date()) {
      try {
        await (fastify as any).authenticate(request, reply);
      } catch {
        return reply.status(404).send({ error: 'Dossier non trouvé' });
      }
    }

    const chapitreData = dossier.chapitres.find(c => c.slug === chapitre);
    if (!chapitreData) {
      return reply.status(404).send({ error: 'Chapitre non trouvé' });
    }

    const trans = chapitreData.translations[0];
    const currentIndex = dossier.chapitres.findIndex(c => c.slug === chapitre);
    const prevChapitre = currentIndex > 0 ? dossier.chapitres[currentIndex - 1] : null;
    const nextChapitre = currentIndex < dossier.chapitres.length - 1 
      ? dossier.chapitres[currentIndex + 1] : null;

    return {
      dossier: {
        id: dossier.id,
        slug: dossier.slug,
        title: dossier.translations[0]?.title || '',
        countryCode: dossier.countryCode
      },
      chapitre: {
        id: chapitreData.id,
        slug: chapitreData.slug,
        ordre: chapitreData.ordre,
        heroImage: chapitreData.heroImage,
        readingMinutes: chapitreData.readingMinutes,
        title: trans?.title || '',
        contentHtml: trans?.contentHtml || ''
      },
      navigation: {
        prev: prevChapitre ? {
          slug: prevChapitre.slug,
          title: prevChapitre.translations[0]?.title || ''
        } : null,
        next: nextChapitre ? {
          slug: nextChapitre.slug,
          title: nextChapitre.translations[0]?.title || ''
        } : null
      },
      sommaire: dossier.chapitres.map(c => ({
        slug: c.slug,
        ordre: c.ordre,
        title: c.translations[0]?.title || '',
        current: c.slug === chapitre
      }))
    };
  });

  // ══════════════════════════════════════════════════════════════════════════
  // AI ROUTES (Chat & TTS)
  // ══════════════════════════════════════════════════════════════════════════

  // POST /api/pays/ai/chat
  fastify.post('/ai/chat', async (request, reply) => {
    const { message, paysSlug, chapitreSlug, history = [] } = request.body as {
      message: string;
      paysSlug: string;
      chapitreSlug?: string;
      history?: Array<{ role: string; content: string }>;
    };

    if (!message || !paysSlug) {
      return reply.status(400).send({ error: 'Message et paysSlug requis' });
    }

    // Récupérer contexte
    const dossier = await prisma.paysDossier.findUnique({
      where: { slug: paysSlug },
      include: {
        translations: { where: { lang: 'fr' } }
      }
    });

    const countryName = dossier?.translations[0]?.title?.split(':')[0]?.trim() || paysSlug;

    const systemPrompt = `Tu es un guide expert sur ${countryName} pour le blog 'Sagesses d'Afrique'.
Tu es passionné, précis et culturellement conscient.
Réponds en français de manière concise (max 3-4 phrases sauf si demandé autrement).
Ne fabule pas - si tu ne sais pas, dis-le.
Évite les clichés et le sensationnalisme.
Sois factuel et nuancé.`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('GEMINI_API_KEY not configured');
        return reply.status(500).send({ error: 'API Key non configurée' });
      }

      console.log('Calling Gemini API with model gemini-1.5-flash...');
      
      const requestBody = {
        contents: [
          ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json() as any;
      
      // Log the full response for debugging
      if (!response.ok || data.error) {
        console.error('Gemini API error:', JSON.stringify(data, null, 2));
        return reply.status(500).send({ 
          error: data.error?.message || 'Erreur Gemini API',
          details: data.error 
        });
      }
      
      console.log('Gemini response status:', response.status);
      
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!replyText) {
        console.error('No text in Gemini response:', JSON.stringify(data, null, 2));
        return reply.status(500).send({ error: 'Réponse vide de Gemini' });
      }

      return {
        reply: replyText,
        history: [
          ...history,
          { role: 'user', content: message },
          { role: 'assistant', content: replyText }
        ]
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      return reply.status(500).send({ error: 'Erreur lors de la génération de la réponse' });
    }
  });

  // POST /api/pays/ai/tts - Désactivé temporairement (modèle non disponible)
  fastify.post('/ai/tts', async (request, reply) => {
    return reply.status(503).send({ 
      error: 'Service TTS temporairement indisponible',
      message: 'La fonctionnalité de lecture audio sera disponible prochainement.'
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN ROUTES
  // ══════════════════════════════════════════════════════════════════════════

  // GET /api/pays/admin/all - Liste tous les dossiers (admin)
  fastify.get('/admin/all', {
    preHandler: [(fastify as any).authenticate]
  }, async (request, reply) => {
    const { lang = 'fr' } = request.query as { lang?: string };
    
    const dossiers = await prisma.paysDossier.findMany({
      include: {
        translations: { where: { lang } },
        chapitres: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return dossiers.map(d => ({
      id: d.id,
      slug: d.slug,
      countryCode: d.countryCode,
      heroImage: d.heroImage,
      featured: d.featured,
      publishedAt: d.publishedAt,
      title: d.translations[0]?.title || '',
      subtitle: d.translations[0]?.subtitle || '',
      chapitresCount: d.chapitres.length,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    }));
  });

  // POST /api/pays/admin - Créer un dossier
  fastify.post('/admin', {
    preHandler: [(fastify as any).authenticate]
  }, async (request, reply) => {
    const data = request.body as {
      slug: string;
      countryCode: string;
      heroImage?: string;
      featured?: boolean;
      publishedAt?: string;
      titleFr: string;
      subtitleFr?: string;
      metaTitleFr?: string;
      metaDescriptionFr?: string;
      titleEn?: string;
      subtitleEn?: string;
      metaTitleEn?: string;
      metaDescriptionEn?: string;
    };

    const dossier = await prisma.paysDossier.create({
      data: {
        slug: data.slug,
        countryCode: data.countryCode.toUpperCase(),
        heroImage: data.heroImage,
        featured: data.featured || false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        translations: {
          create: [
            {
              lang: 'fr',
              title: data.titleFr,
              subtitle: data.subtitleFr,
              metaTitle: data.metaTitleFr,
              metaDescription: data.metaDescriptionFr
            },
            ...(data.titleEn ? [{
              lang: 'en',
              title: data.titleEn,
              subtitle: data.subtitleEn,
              metaTitle: data.metaTitleEn,
              metaDescription: data.metaDescriptionEn
            }] : [])
          ]
        }
      },
      include: { translations: true }
    });

    return dossier;
  });

  // PUT /api/pays/admin/:id - Modifier un dossier
  fastify.put('/admin/:id', {
    preHandler: [(fastify as any).authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as {
      slug?: string;
      countryCode?: string;
      heroImage?: string;
      featured?: boolean;
      publishedAt?: string | null;
      titleFr?: string;
      subtitleFr?: string;
      metaTitleFr?: string;
      metaDescriptionFr?: string;
      titleEn?: string;
      subtitleEn?: string;
      metaTitleEn?: string;
      metaDescriptionEn?: string;
    };

    const dossier = await prisma.paysDossier.update({
      where: { id: parseInt(id) },
      data: {
        slug: data.slug,
        countryCode: data.countryCode?.toUpperCase(),
        heroImage: data.heroImage,
        featured: data.featured,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.publishedAt === null ? null : undefined)
      }
    });

    // Update translations
    if (data.titleFr) {
      await prisma.paysDossierTranslation.upsert({
        where: { dossierId_lang: { dossierId: dossier.id, lang: 'fr' } },
        create: {
          dossierId: dossier.id,
          lang: 'fr',
          title: data.titleFr,
          subtitle: data.subtitleFr,
          metaTitle: data.metaTitleFr,
          metaDescription: data.metaDescriptionFr
        },
        update: {
          title: data.titleFr,
          subtitle: data.subtitleFr,
          metaTitle: data.metaTitleFr,
          metaDescription: data.metaDescriptionFr
        }
      });
    }

    if (data.titleEn) {
      await prisma.paysDossierTranslation.upsert({
        where: { dossierId_lang: { dossierId: dossier.id, lang: 'en' } },
        create: {
          dossierId: dossier.id,
          lang: 'en',
          title: data.titleEn,
          subtitle: data.subtitleEn,
          metaTitle: data.metaTitleEn,
          metaDescription: data.metaDescriptionEn
        },
        update: {
          title: data.titleEn,
          subtitle: data.subtitleEn,
          metaTitle: data.metaTitleEn,
          metaDescription: data.metaDescriptionEn
        }
      });
    }

    return { success: true, id: dossier.id };
  });

  // DELETE /api/pays/admin/:id - Supprimer un dossier
  fastify.delete('/admin/:id', {
    preHandler: [(fastify as any).authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    
    await prisma.paysDossier.delete({
      where: { id: parseInt(id) }
    });

    return { success: true };
  });

  // ══════════════════════════════════════════════════════════════════════════
  // CHAPITRES ADMIN ROUTES
  // ══════════════════════════════════════════════════════════════════════════

  // POST /api/pays/admin/:dossierId/chapitres - Créer un chapitre
  fastify.post('/admin/:dossierId/chapitres', {
    preHandler: [(fastify as any).authenticate]
  }, async (request, reply) => {
    const { dossierId } = request.params as { dossierId: string };
    const data = request.body as {
      slug: string;
      ordre: number;
      heroImage?: string;
      readingMinutes?: number;
      titleFr: string;
      contentHtmlFr: string;
      titleEn?: string;
      contentHtmlEn?: string;
    };

    const chapitre = await prisma.paysChapitre.create({
      data: {
        dossierId: parseInt(dossierId),
        slug: data.slug,
        ordre: data.ordre,
        heroImage: data.heroImage,
        readingMinutes: data.readingMinutes || 5,
        translations: {
          create: [
            {
              lang: 'fr',
              title: data.titleFr,
              contentHtml: data.contentHtmlFr
            },
            ...(data.titleEn && data.contentHtmlEn ? [{
              lang: 'en',
              title: data.titleEn,
              contentHtml: data.contentHtmlEn
            }] : [])
          ]
        }
      },
      include: { translations: true }
    });

    return chapitre;
  });

  // PUT /api/pays/admin/chapitres/:id - Modifier un chapitre
  fastify.put('/admin/chapitres/:id', {
    preHandler: [(fastify as any).authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as {
      slug?: string;
      ordre?: number;
      heroImage?: string;
      readingMinutes?: number;
      titleFr?: string;
      contentHtmlFr?: string;
      titleEn?: string;
      contentHtmlEn?: string;
    };

    const chapitre = await prisma.paysChapitre.update({
      where: { id: parseInt(id) },
      data: {
        slug: data.slug,
        ordre: data.ordre,
        heroImage: data.heroImage,
        readingMinutes: data.readingMinutes
      }
    });

    // Update translations
    if (data.titleFr && data.contentHtmlFr) {
      await prisma.paysChapitreTranslation.upsert({
        where: { chapitreId_lang: { chapitreId: chapitre.id, lang: 'fr' } },
        create: {
          chapitreId: chapitre.id,
          lang: 'fr',
          title: data.titleFr,
          contentHtml: data.contentHtmlFr
        },
        update: {
          title: data.titleFr,
          contentHtml: data.contentHtmlFr
        }
      });
    }

    if (data.titleEn && data.contentHtmlEn) {
      await prisma.paysChapitreTranslation.upsert({
        where: { chapitreId_lang: { chapitreId: chapitre.id, lang: 'en' } },
        create: {
          chapitreId: chapitre.id,
          lang: 'en',
          title: data.titleEn,
          contentHtml: data.contentHtmlEn
        },
        update: {
          title: data.titleEn,
          contentHtml: data.contentHtmlEn
        }
      });
    }

    return { success: true, id: chapitre.id };
  });

  // DELETE /api/pays/admin/chapitres/:id - Supprimer un chapitre
  fastify.delete('/admin/chapitres/:id', {
    preHandler: [(fastify as any).authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    
    await prisma.paysChapitre.delete({
      where: { id: parseInt(id) }
    });

    return { success: true };
  });
};
