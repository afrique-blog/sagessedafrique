'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, Article, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Skeleton, ArticleCardSkeleton } from '@/components/Skeleton';

const ARTICLES_PER_PAGE = 12;

export default function CategoryPage() {
  const { slug } = useParams();
  const { lang } = useApp();
  const [category, setCategory] = useState<(Category & { articles: Article[] }) | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      try {
        const [categoryData, categoriesData] = await Promise.all([
          api.getCategory(slug as string, lang),
          api.getCategories(lang),
        ]);
        setCategory(categoryData);
        setCategories(categoriesData);
        setCurrentPage(1); // Reset page when category changes
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, lang]);

  // Pagination logic
  const totalArticles = category?.articles.length || 0;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = category?.articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {/* Hero Skeleton */}
          <section className="relative h-80 bg-slate-200 dark:bg-slate-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto">
                <Skeleton className="w-24 h-4 mb-4 bg-white/20" />
                <Skeleton className="w-64 h-10 mb-4 bg-white/20" />
                <Skeleton className="w-96 h-5 bg-white/20" />
              </div>
            </div>
          </section>

          {/* Articles Grid Skeleton */}
          <section className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </main>
        <Footer categories={[]} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
            <p className="text-slate-500 mb-8">{lang === 'fr' ? 'Catégorie non trouvée' : 'Category not found'}</p>
            <Link href="/" className="text-primary dark:text-accent hover:underline">
              {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero with Image */}
        <section className="relative h-[300px] md:h-[350px]">
          {category.image ? (
            <>
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/70 to-primary/50" />
            </>
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center text-center text-white">
            <p className="text-accent text-sm uppercase tracking-widest mb-4">
              {lang === 'fr' ? 'Catégorie' : 'Category'}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{category.name}</h1>
            <p className="text-white/80 max-w-2xl mx-auto">{category.description}</p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 py-12">
          {category.articles.length > 0 ? (
            <>
              {/* Count */}
              <p className="text-sm text-slate-500 mb-6">
                {lang === 'fr' 
                  ? `${totalArticles} article${totalArticles > 1 ? 's' : ''} • Page ${currentPage} sur ${totalPages}`
                  : `${totalArticles} article${totalArticles > 1 ? 's' : ''} • Page ${currentPage} of ${totalPages}`
                }
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((article: any) => (
                  <ArticleCard 
                    key={article.id} 
                    article={{
                      ...article,
                      category: { slug: category.slug, name: category.name },
                      tags: [],
                      dossiers: [],
                      personnaliteCategorie: article.personnaliteCategorie || null,
                    }} 
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {lang === 'fr' ? '← Précédent' : '← Previous'}
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-white dark:bg-accent dark:text-slate-900'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {lang === 'fr' ? 'Suivant →' : 'Next →'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-slate-500 py-12">
              {lang === 'fr' ? 'Aucun article dans cette catégorie.' : 'No articles in this category.'}
            </p>
          )}
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}


