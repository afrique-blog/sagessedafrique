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
  const [dossierDuMoisData, setDossierDuMoisData] = useState<{ dossier: Dossier; article: Article } | null>(null);
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

        // Charger le dossier du mois avec ses articles
        if (dossiersRes.length > 0) {
          const dossierComplet = await api.getDossier(dossiersRes[0].slug, lang);
          if (dossierComplet.articles && dossierComplet.articles.length > 0) {
            setDossierDuMoisData({
              dossier: dossiersRes[0],
              article: dossierComplet.articles[0], // L'article le plus récent
            });
          }
        }
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
  const latest = articles.slice(4, 8); // Limité à 4 articles

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
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
        <Header />
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
      <Header />
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

          {/* Section "Commencer ici" */}
          <section className="container mx-auto px-4 -mt-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <span className="text-accent text-sm font-bold uppercase tracking-widest">✨ {t('startHere', lang)}</span>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{t('startHereDesc', lang)}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Personnalités */}
                <Link 
                  href="/personnalites" 
                  className="group p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-transparent hover:border-accent transition-all hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                    {t('discoverPersonalities', lang)}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('discoverPersonalitiesDesc', lang)}
                  </p>
                  <div className="mt-4 flex items-center text-accent text-sm font-medium">
                    <span>{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                {/* Catégories */}
                <Link 
                  href="/categories" 
                  className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-transparent hover:border-primary transition-all hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {t('exploreCategories', lang)}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('exploreCategoriesDesc', lang)}
                  </p>
                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                    <span>{lang === 'fr' ? 'Parcourir' : 'Browse'}</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                {/* Dossiers */}
                <Link 
                  href="#dossiers" 
                  className="group p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-transparent hover:border-emerald-500 transition-all hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">📖</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                    {t('readDossiers', lang)}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('readDossiersDesc', lang)}
                  </p>
                  <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                    <span>{lang === 'fr' ? 'Découvrir' : 'Discover'}</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
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
                    ? "Mon rôle n'est pas seulement de raconter des faits, mais de tisser des liens entre le génie de nos ancêtres et les défis de notre présent."
                    : "My role is not only to recount facts, but to weave links between the genius of our ancestors and the challenges of our present."}
                </p>
                <Link href="/about" className="inline-block px-8 py-3 bg-accent text-slate-900 font-bold rounded hover:opacity-90 transition-opacity">
                  {t('discoverApproach', lang)}
                </Link>
              </div>
            </div>
          </section>

          {/* Dossier du Mois - Affiche l'article le plus récent */}
          {dossierDuMoisData && (
            <section className="container mx-auto px-4 py-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image 
                    src="/images/dossiers/le-dossier-du-mois.webp" 
                    alt="Dossier du mois" 
                    fill 
                    className="object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 via-transparent to-amber-900/90" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
                  {/* Left: Badge + Title */}
                  <div className="md:w-1/2 text-center md:text-left">
                    <span className="inline-block px-4 py-1 bg-accent text-slate-900 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                      📖 {dossierDuMoisData.dossier.title}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                      {dossierDuMoisData.article.title}
                    </h2>
                    <p className="text-white/80 mb-6 line-clamp-3">
                      {dossierDuMoisData.article.excerpt || (lang === 'fr' 
                        ? 'Plongez dans notre dossier spécial du mois, une exploration approfondie d\'un thème majeur de l\'histoire africaine.'
                        : 'Dive into our special dossier of the month, an in-depth exploration of a major theme in African history.')}
                    </p>
                    <Link 
                      href={`/article/${dossierDuMoisData.article.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-900 rounded-lg font-bold hover:bg-accent transition-colors"
                    >
                      {lang === 'fr' ? 'Lire l\'article' : 'Read article'}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Right: Article Image */}
                  <div className="md:w-1/2">
                    <Link href={`/article/${dossierDuMoisData.article.slug}`} className="block relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl group">
                      {dossierDuMoisData.article.heroImage ? (
                        <Image 
                          src={dossierDuMoisData.article.heroImage} 
                          alt={dossierDuMoisData.article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-800 flex items-center justify-center">
                          <span className="text-6xl opacity-50">📖</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

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
            <section id="dossiers" className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold mb-4">{t('specialReports', lang)}</h2>
                  <p className="text-slate-500 max-w-md mx-auto">{t('deepDives', lang)}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {dossiers.slice(0, 5).map(d => (
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
