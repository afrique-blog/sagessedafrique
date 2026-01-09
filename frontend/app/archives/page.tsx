'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, Article, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton, ArticleCardSkeleton } from '@/components/Skeleton';

interface GroupedArticles {
  [year: string]: {
    [month: string]: Article[];
  };
}

const monthNames = {
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export default function ArchivesPage() {
  const { lang } = useApp();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          api.getArticles({ lang, limit: 500 }), // Get all articles
          api.getCategories(lang),
        ]);
        setArticles(articlesRes.data);
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [lang]);

  // Group articles by year and month
  const groupedArticles = useMemo(() => {
    const grouped: GroupedArticles = {};
    
    articles.forEach(article => {
      if (!article.publishedAt) return;
      
      const date = new Date(article.publishedAt);
      const year = date.getFullYear().toString();
      const month = date.getMonth().toString();
      
      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][month]) {
        grouped[year][month] = [];
      }
      grouped[year][month].push(article);
    });

    // Sort articles within each month by date (newest first)
    Object.keys(grouped).forEach(year => {
      Object.keys(grouped[year]).forEach(month => {
        grouped[year][month].sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      });
    });

    return grouped;
  }, [articles]);

  // Get sorted years (newest first)
  const years = useMemo(() => 
    Object.keys(groupedArticles).sort((a, b) => parseInt(b) - parseInt(a)),
    [groupedArticles]
  );

  // Set default selected year
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  // Get statistics
  const stats = useMemo(() => {
    const totalArticles = articles.length;
    const totalYears = years.length;
    const categoriesCount = categories.length;
    return { totalArticles, totalYears, categoriesCount };
  }, [articles, years, categories]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {/* Hero Skeleton */}
          <section className="bg-gradient-to-br from-primary via-primary to-slate-900 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="w-32 h-6 mx-auto mb-4 bg-white/20" />
              <Skeleton className="w-48 h-12 mx-auto mb-4 bg-white/20" />
              <Skeleton className="w-96 h-6 mx-auto bg-white/20" />
            </div>
          </section>
          
          {/* Stats Skeleton */}
          <section className="container mx-auto px-4 -mt-8 relative z-10">
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl text-center">
                  <Skeleton className="w-16 h-10 mx-auto mb-2" />
                  <Skeleton className="w-20 h-4 mx-auto" />
                </div>
              ))}
            </div>
          </section>

          {/* Content Skeleton */}
          <section className="container mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Years sidebar */}
              <div className="lg:w-1/4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <Skeleton className="w-32 h-6 mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="w-full h-12" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Articles */}
              <div className="lg:w-3/4">
                <div className="grid gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 flex gap-4">
                      <Skeleton className="w-32 h-24 flex-shrink-0" />
                      <div className="flex-grow">
                        <Skeleton className="w-20 h-4 mb-2" />
                        <Skeleton className="w-full h-5 mb-2" />
                        <Skeleton className="w-3/4 h-5 mb-2" />
                        <Skeleton className="w-24 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer categories={[]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-slate-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              📚 {lang === 'fr' ? 'Bibliothèque' : 'Library'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {lang === 'fr' ? 'Archives' : 'Archives'}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">
              {lang === 'fr' 
                ? "Parcourez l'ensemble de nos articles classés par date de publication"
                : "Browse all our articles sorted by publication date"}
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{stats.totalArticles}</div>
                <div className="text-sm text-white/60">{lang === 'fr' ? 'Articles' : 'Articles'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{stats.totalYears}</div>
                <div className="text-sm text-white/60">{lang === 'fr' ? 'Années' : 'Years'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{stats.categoriesCount}</div>
                <div className="text-sm text-white/60">{lang === 'fr' ? 'Catégories' : 'Categories'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Year Tabs */}
        <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                    selectedYear === year
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {year}
                  <span className="ml-2 text-xs opacity-70">
                    ({Object.values(groupedArticles[year] || {}).flat().length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles by Month */}
        <section className="container mx-auto px-4 py-12">
          {selectedYear && groupedArticles[selectedYear] && (
            <div className="space-y-12">
              {Object.keys(groupedArticles[selectedYear])
                .sort((a, b) => parseInt(b) - parseInt(a)) // Sort months (newest first)
                .map(month => {
                  const monthArticles = groupedArticles[selectedYear][month];
                  const monthName = monthNames[lang as 'fr' | 'en'][parseInt(month)];
                  
                  return (
                    <div key={`${selectedYear}-${month}`}>
                      {/* Month Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-serif font-bold">
                          {monthName} {selectedYear}
                        </h2>
                        <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                          {monthArticles.length} {lang === 'fr' ? 'article(s)' : 'article(s)'}
                        </span>
                        <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700" />
                      </div>

                      {/* Articles Grid */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {monthArticles.map(article => (
                          <Link
                            key={article.id}
                            href={`/article/${article.slug}`}
                            className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
                          >
                            <div className="relative h-40 bg-slate-100 dark:bg-slate-700">
                              {article.heroImage ? (
                                <Image
                                  src={article.heroImage}
                                  alt={article.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                                  <span className="text-4xl opacity-50">📰</span>
                                </div>
                              )}
                              {article.category && (
                                <span className="absolute top-3 left-3 px-2 py-1 bg-accent text-slate-900 text-xs font-bold rounded">
                                  {article.category.name}
                                </span>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-serif font-bold text-lg leading-tight mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors line-clamp-2">
                                {article.title}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <span>{article.readingMinutes} min</span>
                                <span>•</span>
                                <span>{article.views} {lang === 'fr' ? 'vues' : 'views'}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {articles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">
                {lang === 'fr' ? 'Aucun article disponible pour le moment.' : 'No articles available at the moment.'}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}
