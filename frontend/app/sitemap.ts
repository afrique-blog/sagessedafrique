import { MetadataRoute } from 'next';

const BASE_URL = 'https://sagessedafrique.blog';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getArticles() {
  try {
    const res = await fetch(`${API_URL}/articles?limit=200`, { cache: 'no-store' });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    return await res.json();
  } catch { return []; }
}

async function getDossiers() {
  try {
    const res = await fetch(`${API_URL}/dossiers`, { cache: 'no-store' });
    return await res.json();
  } catch { return []; }
}

async function getTags() {
  try {
    const res = await fetch(`${API_URL}/tags`, { cache: 'no-store' });
    return await res.json();
  } catch { return []; }
}

async function getCategoriesPersonnalites() {
  try {
    const res = await fetch(`${API_URL}/categories-personnalites`, { cache: 'no-store' });
    return await res.json();
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, dossiers, tags, categoriesPerso] = await Promise.all([
    getArticles(),
    getCategories(),
    getDossiers(),
    getTags(),
    getCategoriesPersonnalites(),
  ]);

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/personnalites`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/legal`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  const articlePages = articles.map((article: any) => ({
    url: `${BASE_URL}/article/${encodeURIComponent(article.slug)}`,
    lastModified: new Date(article.publishedAt || article.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const categoryPages = categories.map((cat: any) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const dossierPages = dossiers.map((d: any) => ({
    url: `${BASE_URL}/dossier/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const tagPages = tags.map((t: any) => ({
    url: `${BASE_URL}/tag/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const persoPages = categoriesPerso.map((c: any) => ({
    url: `${BASE_URL}/personnalites/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages, ...categoryPages, ...dossierPages, ...tagPages, ...persoPages];
}

