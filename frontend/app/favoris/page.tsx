'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, Article, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Skeleton, ArticleCardSkeleton } from '@/components/Skeleton';

export default function FavorisPage() {
  const { lang } = useApp();
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    // Get favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteArticles');
    const ids: number[] = savedFavorites ? JSON.parse(savedFavorites) : [];
    setFavoriteIds(ids);

    async function fetchData() {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          api.getArticles({ lang, limit: 100 }),
          api.getCategories(lang),
        ]);
        
        // Filter only favorited articles
        const favorites = articlesRes.data.filter(a => ids.includes(a.id));
        setFavoriteArticles(favorites);
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [lang]);

  const removeFavorite = (articleId: number) => {
    const newFavorites = favoriteIds.filter(id => id !== articleId);
    localStorage.setItem('favoriteArticles', JSON.stringify(newFavorites));
    setFavoriteIds(newFavorites);
    setFavoriteArticles(prev => prev.filter(a => a.id !== articleId));
  };

  const clearAllFavorites = () => {
    localStorage.removeItem('favoriteArticles');
    setFavoriteIds([]);
    setFavoriteArticles([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {/* Hero Skeleton */}
          <section className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="w-32 h-6 mx-auto mb-4 bg-white/20" />
              <Skeleton className="w-48 h-12 mx-auto mb-4 bg-white/20" />
              <Skeleton className="w-80 h-6 mx-auto bg-white/20" />
            </div>
          </section>

          {/* Articles Grid Skeleton */}
          <section className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="w-40 h-8" />
              <Skeleton className="w-32 h-10" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <ArticleCardSkeleton key={i} />
              ))}
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
        <section className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              ⭐ {lang === 'fr' ? 'Ma Collection' : 'My Collection'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {lang === 'fr' ? 'Mes Favoris' : 'My Favorites'}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              {lang === 'fr' 
                ? "Retrouvez tous les articles que vous avez sauvegardés pour les lire plus tard"
                : "Find all the articles you've saved to read later"}
            </p>
            
            {favoriteArticles.length > 0 && (
              <div className="mt-8">
                <span className="text-3xl font-bold">{favoriteArticles.length}</span>
                <span className="text-white/60 ml-2">
                  {lang === 'fr' ? 'article(s) sauvegardé(s)' : 'saved article(s)'}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-16">
          {favoriteArticles.length > 0 ? (
            <>
              {/* Actions */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={clearAllFavorites}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {lang === 'fr' ? 'Tout supprimer' : 'Clear all'}
                </button>
              </div>

              {/* Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteArticles.map(article => (
                  <div key={article.id} className="relative group">
                    <ArticleCard article={article} />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(article.id);
                      }}
                      className="absolute top-4 right-4 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30"
                      title={lang === 'fr' ? 'Retirer des favoris' : 'Remove from favorites'}
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-serif font-bold mb-4">
                {lang === 'fr' ? 'Aucun favori pour le moment' : 'No favorites yet'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                {lang === 'fr' 
                  ? "Cliquez sur l'étoile ⭐ sur un article pour l'ajouter à vos favoris"
                  : "Click the star ⭐ on an article to add it to your favorites"}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                {lang === 'fr' ? 'Découvrir les articles' : 'Discover articles'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}
