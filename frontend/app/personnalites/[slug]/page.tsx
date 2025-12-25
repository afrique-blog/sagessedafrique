'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, Category, CategoriePersonnalite, Personnalite } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const IMAGE_PREFIX = '/images/personnalites/';

// Construit le chemin complet de l'image si nécessaire
function getImageUrl(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith('/') || image.startsWith('http')) return image;
  return `${IMAGE_PREFIX}${image}`;
}

interface CategorieDetail extends CategoriePersonnalite {
  personnalites: Personnalite[];
}

export default function CategoriePersonnalitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorie, setCategorie] = useState<CategorieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getCategories(lang),
      api.getCategoriePersonnalite(slug, lang),
    ])
      .then(([cats, catDetail]) => {
        setCategories(cats);
        setCategorie(catDetail);
      })
      .catch((err) => {
        console.error(err);
        setError(lang === 'fr' ? 'Catégorie non trouvée' : 'Category not found');
      })
      .finally(() => setLoading(false));
  }, [lang, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-pulse text-lg">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</div>
      </div>
    );
  }

  if (error || !categorie) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-slate-500 mb-8">{error || (lang === 'fr' ? 'Catégorie non trouvée' : 'Category not found')}</p>
            <Link href="/personnalites" className="text-primary hover:underline">
              {lang === 'fr' ? 'Retour aux personnalités' : 'Back to personalities'}
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
        {/* Hero */}
        <section className="relative py-20 bg-gradient-to-br from-primary to-primary/80">
          {categorie.image && (
            <Image
              src={categorie.image}
              alt={categorie.nom}
              fill
              className="object-cover opacity-20"
            />
          )}
          <div className="relative container mx-auto px-4 text-center text-white">
            <Link 
              href="/personnalites" 
              className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {lang === 'fr' ? 'Toutes les catégories' : 'All categories'}
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {categorie.nom}
            </h1>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              {categorie.description}
            </p>
            <div className="mt-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                {categorie.personnalites.length} {lang === 'fr' ? 'personnalités' : 'personalities'}
              </span>
            </div>
          </div>
        </section>

        {/* Personnalites Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categorie.personnalites.map((personnalite) => (
              <div
                key={personnalite.slug}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                  {getImageUrl(personnalite.image) ? (
                    <Image
                      src={getImageUrl(personnalite.image)!}
                      alt={personnalite.nom}
                      fill
                      className="object-cover"
                    />
                  ) : personnalite.article?.heroImage ? (
                    <Image
                      src={personnalite.article.heroImage}
                      alt={personnalite.nom}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl opacity-30">👤</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold mb-2">{personnalite.nom}</h3>
                  
                  {personnalite.article && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                      {personnalite.article.excerpt}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {personnalite.article && (
                      <Link
                        href={`/article/${personnalite.article.slug}`}
                        className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent rounded-full text-xs font-medium hover:bg-primary/20 dark:hover:bg-accent/20 transition-colors"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {lang === 'fr' ? 'Lire article' : 'Read article'}
                      </Link>
                    )}
                    
                    {personnalite.youtubeUrl && (
                      <a
                        href={personnalite.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-medium hover:bg-red-500/20 transition-colors"
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categorie.personnalites.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">
                {lang === 'fr' ? 'Aucune personnalité dans cette catégorie pour le moment.' : 'No personalities in this category yet.'}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}
