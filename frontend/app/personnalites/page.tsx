'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, Category, CategoriePersonnalite } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton, CategorySkeleton } from '@/components/Skeleton';

export default function PersonnalitesPage() {
  const { lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesPersonnalites, setCategoriesPersonnalites] = useState<CategoriePersonnalite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCategories(lang),
      api.getCategoriesPersonnalites(lang),
    ])
      .then(([cats, catsPers]) => {
        setCategories(cats);
        setCategoriesPersonnalites(catsPers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {/* Hero Skeleton */}
          <section className="bg-primary text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="w-72 h-12 mx-auto mb-4 bg-white/20" />
              <Skeleton className="w-96 h-6 mx-auto bg-white/20" />
            </div>
          </section>

          {/* Categories Grid Skeleton */}
          <section className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CategorySkeleton key={i} />
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
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {lang === 'fr' ? 'Personnalités Africaines' : 'African Personalities'}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              {lang === 'fr' 
                ? "Découvrez les figures qui ont marqué l'histoire et la culture africaine"
                : "Discover the figures who have shaped African history and culture"}
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesPersonnalites.map((cat) => (
              <Link
                key={cat.slug}
                href={`/personnalites/${cat.slug}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-56 bg-slate-100 dark:bg-slate-700">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.nom}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-50">👤</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-serif font-bold text-white">{cat.nom}</h2>
                    <span className="text-white/80 text-sm">
                      {cat.personnalitesCount} {lang === 'fr' ? 'personnalités' : 'personalities'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary dark:text-accent text-sm font-medium group-hover:gap-2 transition-all">
                    <span>{lang === 'fr' ? 'Découvrir' : 'Discover'}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {categoriesPersonnalites.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">
                {lang === 'fr' ? 'Aucune catégorie disponible pour le moment.' : 'No categories available at the moment.'}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}
