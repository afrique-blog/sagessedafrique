import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

// Déclaration du type authenticate
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// Liste des pays africains avec codes ISO
const AFRICAN_COUNTRIES = [
  { code: 'DZ', name: 'Algérie' },
  { code: 'AO', name: 'Angola' },
  { code: 'BJ', name: 'Bénin' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cap-Vert' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'CF', name: 'Centrafrique' },
  { code: 'TD', name: 'Tchad' },
  { code: 'KM', name: 'Comores' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'RD Congo' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'EG', name: 'Égypte' },
  { code: 'GQ', name: 'Guinée équatoriale' },
  { code: 'ER', name: 'Érythrée' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Éthiopie' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambie' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GN', name: 'Guinée' },
  { code: 'GW', name: 'Guinée-Bissau' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Libéria' },
  { code: 'LY', name: 'Libye' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'ML', name: 'Mali' },
  { code: 'MR', name: 'Mauritanie' },
  { code: 'MU', name: 'Maurice' },
  { code: 'MA', name: 'Maroc' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibie' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ST', name: 'São Tomé-et-Príncipe' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SO', name: 'Somalie' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'SS', name: 'Soudan du Sud' },
  { code: 'SD', name: 'Soudan' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'TG', name: 'Togo' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'UG', name: 'Ouganda' },
  { code: 'ZM', name: 'Zambie' },
  { code: 'ZW', name: 'Zimbabwe' },
];

// Schémas de validation
const editionQuerySchema = z.object({
  lang: z.string().default('fr'),
  year: z.coerce.number().optional(),
  limit: z.coerce.number().min(1).max(52).default(12),
  offset: z.coerce.number().min(0).default(0),
});

const editionCreateSchema = z.object({
  weekNumber: z.number().min(1).max(53),
  year: z.number().min(2020).max(2100),
  publishedAt: z.string().optional(),
  translations: z.object({
    fr: z.object({
      title: z.string().min(1),
      summary: z.string().optional(),
    }),
    en: z.object({
      title: z.string().min(1),
      summary: z.string().optional(),
    }).optional(),
  }),
  news: z.array(z.object({
    position: z.number().min(1).max(10),
    country: z.string(),
    countryCode: z.string().length(2),
    sourceUrl: z.string().optional(),
    sourceName: z.string().optional(),
    translations: z.object({
      fr: z.object({
        title: z.string().min(1),
        excerpt: z.string().min(1),
      }),
      en: z.object({
        title: z.string().min(1),
        excerpt: z.string().min(1),
      }).optional(),
    }),
  })).max(10),
});

const searchSchema = z.object({
  lang: z.string().default('fr'),
  query: z.string().optional(),
  year: z.coerce.number().optional(),
  countryCode: z.string().length(2).optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export async function weeklyRoutes(fastify: FastifyInstance) {
  
  // GET /api/weekly/countries - Liste des pays africains
  fastify.get('/countries', async () => {
    return AFRICAN_COUNTRIES;
  });

  // GET /api/weekly/current - Édition courante (dernière publiée)
  fastify.get('/current', async (request) => {
    const { lang } = editionQuerySchema.parse(request.query);

    const edition = await prisma.weeklyEdition.findFirst({
      where: { publishedAt: { not: null } },
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
      include: {
        translations: { where: { lang } },
        news: {
          orderBy: { position: 'asc' },
          include: {
            translations: { where: { lang } },
          },
        },
      },
    });

    if (!edition) {
      return null;
    }

    return formatEdition(edition, lang);
  });

  // GET /api/weekly/editions - Liste des éditions
  fastify.get('/editions', async (request) => {
    const { lang, year, limit, offset } = editionQuerySchema.parse(request.query);

    const where: any = { publishedAt: { not: null } };
    if (year) where.year = year;

    const [editions, total] = await Promise.all([
      prisma.weeklyEdition.findMany({
        where,
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        take: limit,
        skip: offset,
        include: {
          translations: { where: { lang } },
          news: {
            orderBy: { position: 'asc' },
            take: 3, // Preview des 3 premières news
            include: {
              translations: { where: { lang } },
            },
          },
        },
      }),
      prisma.weeklyEdition.count({ where }),
    ]);

    return {
      data: editions.map(e => formatEdition(e, lang)),
      pagination: { total, limit, offset },
    };
  });

  // GET /api/weekly/editions/:slug - Détail d'une édition
  fastify.get('/editions/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const { lang } = editionQuerySchema.parse(request.query);

    const edition = await prisma.weeklyEdition.findUnique({
      where: { slug },
      include: {
        translations: { where: { lang } },
        news: {
          orderBy: { position: 'asc' },
          include: {
            translations: { where: { lang } },
          },
        },
      },
    });

    if (!edition) {
      return reply.status(404).send({ error: 'Édition non trouvée' });
    }

    return formatEdition(edition, lang);
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

  // GET /api/weekly/search - Recherche dans les actualités
  fastify.get('/search', async (request) => {
    const { lang, query, year, countryCode, limit, offset } = searchSchema.parse(request.query);

    // Construire la requête
    const whereNews: any = {};
    const whereEdition: any = { publishedAt: { not: null } };

    if (year) whereEdition.year = year;
    if (countryCode) whereNews.countryCode = countryCode;

    // Recherche fulltext si query fourni
    let news;
    let total;

    if (query) {
      // Recherche avec LIKE (fulltext alternatif)
      const searchTerm = `%${query}%`;
      
      const rawResults = await prisma.$queryRaw<any[]>`
        SELECT 
          wn.id, wn.position, wn.country, wn.country_code, wn.source_url, wn.source_name,
          wnt.title, wnt.excerpt,
          we.id as edition_id, we.slug as edition_slug, we.week_number, we.year
        FROM weekly_news wn
        JOIN weekly_news_translations wnt ON wnt.news_id = wn.id AND wnt.lang = ${lang}
        JOIN weekly_editions we ON we.id = wn.edition_id
        WHERE we.published_at IS NOT NULL
          AND (wnt.title LIKE ${searchTerm} OR wnt.excerpt LIKE ${searchTerm})
          ${year ? prisma.$queryRaw`AND we.year = ${year}` : prisma.$queryRaw``}
          ${countryCode ? prisma.$queryRaw`AND wn.country_code = ${countryCode}` : prisma.$queryRaw``}
        ORDER BY we.year DESC, we.week_number DESC, wn.position ASC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const countResult = await prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count
        FROM weekly_news wn
        JOIN weekly_news_translations wnt ON wnt.news_id = wn.id AND wnt.lang = ${lang}
        JOIN weekly_editions we ON we.id = wn.edition_id
        WHERE we.published_at IS NOT NULL
          AND (wnt.title LIKE ${searchTerm} OR wnt.excerpt LIKE ${searchTerm})
          ${year ? prisma.$queryRaw`AND we.year = ${year}` : prisma.$queryRaw``}
          ${countryCode ? prisma.$queryRaw`AND wn.country_code = ${countryCode}` : prisma.$queryRaw``}
      `;

      news = rawResults.map(r => ({
        id: r.id,
        position: r.position,
        country: r.country,
        countryCode: r.country_code,
        sourceUrl: r.source_url,
        sourceName: r.source_name,
        title: r.title,
        excerpt: r.excerpt,
        edition: {
          id: r.edition_id,
          slug: r.edition_slug,
          weekNumber: r.week_number,
          year: r.year,
        },
      }));
      total = Number(countResult[0].count);
    } else {
      // Sans recherche textuelle, liste simple
      const results = await prisma.weeklyNews.findMany({
        where: {
          ...whereNews,
          edition: whereEdition,
        },
        orderBy: [
          { edition: { year: 'desc' } },
          { edition: { weekNumber: 'desc' } },
          { position: 'asc' },
        ],
        take: limit,
        skip: offset,
        include: {
          translations: { where: { lang } },
          edition: { select: { id: true, slug: true, weekNumber: true, year: true } },
        },
      });

      const countTotal = await prisma.weeklyNews.count({
        where: {
          ...whereNews,
          edition: whereEdition,
        },
      });

      news = results.map(n => ({
        id: n.id,
        position: n.position,
        country: n.country,
        countryCode: n.countryCode,
        sourceUrl: n.sourceUrl,
        sourceName: n.sourceName,
        title: n.translations[0]?.title || '',
        excerpt: n.translations[0]?.excerpt || '',
        edition: n.edition,
      }));
      total = countTotal;
    }

    return {
      data: news,
      pagination: { total, limit, offset },
    };
  });

  // ==========================================
  // ROUTES ADMIN (protégées)
  // ==========================================

  // GET /api/weekly/admin/editions - Liste admin (toutes les éditions)
  fastify.get('/admin/editions', { preHandler: [fastify.authenticate] }, async (request) => {
    const { lang, limit, offset } = editionQuerySchema.parse(request.query);

    const [editions, total] = await Promise.all([
      prisma.weeklyEdition.findMany({
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        take: limit,
        skip: offset,
        include: {
          translations: true,
          _count: { select: { news: true } },
        },
      }),
      prisma.weeklyEdition.count(),
    ]);

    return {
      data: editions.map(e => ({
        id: e.id,
        slug: e.slug,
        weekNumber: e.weekNumber,
        year: e.year,
        publishedAt: e.publishedAt,
        newsCount: e._count.news,
        translations: e.translations,
      })),
      pagination: { total, limit, offset },
    };
  });

  // GET /api/weekly/admin/editions/:id - Détail admin
  fastify.get('/admin/editions/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const edition = await prisma.weeklyEdition.findUnique({
      where: { id: parseInt(id) },
      include: {
        translations: true,
        news: {
          orderBy: { position: 'asc' },
          include: { translations: true },
        },
      },
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

    // Créer l'édition avec ses traductions et actualités
    const edition = await prisma.weeklyEdition.create({
      data: {
        weekNumber: data.weekNumber,
        year: data.year,
        slug,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        translations: {
          create: [
            { lang: 'fr', title: data.translations.fr.title, summary: data.translations.fr.summary },
            ...(data.translations.en ? [{ lang: 'en', title: data.translations.en.title, summary: data.translations.en.summary }] : []),
          ],
        },
        news: {
          create: data.news.map(n => ({
            position: n.position,
            country: n.country,
            countryCode: n.countryCode,
            sourceUrl: n.sourceUrl,
            sourceName: n.sourceName,
            translations: {
              create: [
                { lang: 'fr', title: n.translations.fr.title, excerpt: n.translations.fr.excerpt },
                ...(n.translations.en ? [{ lang: 'en', title: n.translations.en.title, excerpt: n.translations.en.excerpt }] : []),
              ],
            },
          })),
        },
      },
      include: {
        translations: true,
        news: { include: { translations: true } },
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

    // Mise à jour de l'édition
    const updateData: any = {};
    if (data.weekNumber) updateData.weekNumber = data.weekNumber;
    if (data.year) updateData.year = data.year;
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

    // Mise à jour des traductions
    if (data.translations) {
      for (const [lang, trans] of Object.entries(data.translations)) {
        if (trans) {
          await prisma.weeklyEditionTranslation.upsert({
            where: { editionId_lang: { editionId, lang } },
            create: { editionId, lang, title: trans.title, summary: trans.summary },
            update: { title: trans.title, summary: trans.summary },
          });
        }
      }
    }

    // Mise à jour des actualités (supprimer et recréer)
    if (data.news) {
      await prisma.weeklyNews.deleteMany({ where: { editionId } });
      
      for (const n of data.news) {
        await prisma.weeklyNews.create({
          data: {
            editionId,
            position: n.position,
            country: n.country,
            countryCode: n.countryCode,
            sourceUrl: n.sourceUrl,
            sourceName: n.sourceName,
            translations: {
              create: [
                { lang: 'fr', title: n.translations.fr.title, excerpt: n.translations.fr.excerpt },
                ...(n.translations.en ? [{ lang: 'en', title: n.translations.en.title, excerpt: n.translations.en.excerpt }] : []),
              ],
            },
          },
        });
      }
    }

    return prisma.weeklyEdition.findUnique({
      where: { id: editionId },
      include: {
        translations: true,
        news: { include: { translations: true } },
      },
    });
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

// Helper pour formater une édition
function formatEdition(edition: any, lang: string) {
  const trans = edition.translations[0];
  
  return {
    id: edition.id,
    slug: edition.slug,
    weekNumber: edition.weekNumber,
    year: edition.year,
    publishedAt: edition.publishedAt,
    title: trans?.title || `Semaine ${edition.weekNumber} - ${edition.year}`,
    summary: trans?.summary || null,
    news: edition.news?.map((n: any) => {
      const nTrans = n.translations[0];
      return {
        id: n.id,
        position: n.position,
        country: n.country,
        countryCode: n.countryCode,
        sourceUrl: n.sourceUrl,
        sourceName: n.sourceName,
        title: nTrans?.title || '',
        excerpt: nTrans?.excerpt || '',
      };
    }) || [],
  };
}

export default weeklyRoutes;
