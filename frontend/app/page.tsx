'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import { t } from '@/lib/i18n';
import { api, Article, Category, Dossier } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

function HomeContent() {
  const { lang } = useApp();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesRes, categoriesRes, dossiersRes] = await Promise.all([
          api.getArticles({ lang, limit: 20, search: searchQuery || undefined }),
          api.getCategories(lang),
          api.getDossiers(lang),
        ]);
        setArticles(articlesRes.data);
        setCategories(categoriesRes);
        setDossiers(dossiersRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [lang, searchQuery]);

  const featured = articles.find(a => a.featured) || articles[0];
  const mustRead = articles.slice(1, 4);
  const latest = articles.slice(4, 12);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-lg">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  if (searchQuery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />
        <main className="flex-grow container mx-auto px-4 py-12">
          <h1 className="text-3xl font-serif font-bold mb-8">
            {t('resultsFor', lang)} &quot;{searchQuery}&quot;
          </h1>
          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          ) : (
            <p className="text-slate-500">{t('noResults', lang)}</p>
          )}
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <main className="flex-grow">
        <div className="space-y-16 pb-16">
          <section className="bg-slate-100 dark:bg-slate-900 pt-8 pb-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  {t('heroTitle', lang)}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg italic">
                  {t('heroQuote', lang)}
                </p>
              </div>
              {featured && <ArticleCard article={featured} variant="large" />}
            </div>
          </section>

          {mustRead.length > 0 && (
            <section className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-2xl font-serif font-bold uppercase tracking-tight">
                  {t('featured', lang)}
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {mustRead.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            </section>
          )}

          <section className="bg-primary text-white py-16">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/3 text-center">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-accent mb-6 shadow-xl relative">
                  <Image src="/malick-diarra.png" alt="Malick Diarra" fill className="object-cover" />
                </div>
                <h3 className="text-xl font-serif font-bold">Malick Diarra</h3>
                <p className="text-accent text-sm uppercase tracking-widest">{t('historian', lang)}</p>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-serif font-bold mb-6">{t('historianPerspective', lang)}</h2>
                <p className="text-lg leading-relaxed mb-8 text-slate-200 italic">
                  {lang === 'fr' 
                    ? "Mon role n est pas seulement de raconter des faits, mais de tisser des liens entre le genie de nos ancetres et les defis de notre present."
                    : "My role is not only to recount facts, but to weave links between the genius of our ancestors and the challenges of our present."}
                </p>
                <Link href="/about" className="inline-block px-8 py-3 bg-accent text-slate-900 font-bold rounded hover:opacity-90 transition-opacity">
                  {t('discoverApproach', lang)}
                </Link>
              </div>
            </div>
          </section>

          {latest.length > 0 && (
            <section className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3">
                  <h2 className="text-2xl font-serif font-bold mb-8 border-b pb-4">{t('latestArticles', lang)}</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {latest.map(a => <ArticleCard key={a.id} article={a} />)}
                  </div>
                  <div className="mt-12 text-center">
                    <button className="px-10 py-3 border-2 border-primary text-primary dark:border-accent dark:text-accent font-bold hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:text-slate-900 transition-all">
                      {t('viewMore', lang)}
                    </button>
                  </div>
                </div>
                <aside className="lg:w-1/3 space-y-12">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold mb-6 text-slate-400">{t('popularCategories', lang)}</h3>
                    <div className="space-y-4">
                      {categories.map(cat => (
                        <Link key={cat.slug} href={'/category/' + cat.slug} className="flex justify-between items-center group">
                          <span className="group-hover:text-primary dark:group-hover:text-accent font-medium">{cat.name}</span>
                          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{cat.articleCount}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl">
                    <h3 className="font-serif font-bold text-xl mb-4">{t('newsletter', lang)}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('newsletterDesc', lang)}</p>
                    <form className="space-y-3">
                      <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 focus:outline-none ring-1 ring-slate-200 dark:ring-slate-600" />
                      <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-bold">{t('subscribe', lang)}</button>
                    </form>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {dossiers.length > 0 && (
            <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold mb-4">{t('specialReports', lang)}</h2>
                  <p className="text-slate-500 max-w-md mx-auto">{t('deepDives', lang)}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dossiers.slice(0, 4).map(d => (
                    <Link key={d.slug} href={'/dossier/' + d.slug} className="relative group overflow-hidden rounded-xl h-64">
                      {d.heroImage && (
                        <Image src={d.heroImage} fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                        <h4 className="text-white font-serif font-bold text-lg leading-tight group-hover:text-accent transition-colors">{d.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-pulse text-lg">Chargement...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
