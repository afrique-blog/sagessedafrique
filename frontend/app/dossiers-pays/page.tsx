'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, PaysDossier, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Helper function to get country emoji from ISO code
function getCountryEmoji(countryCode: string | null): string {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function DossiersPaysList() {
  const { lang } = useApp();
  const [dossiers, setDossiers] = useState<PaysDossier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dossiersData, categoriesData] = await Promise.all([
          api.getPaysList(lang),
          api.getCategories(lang),
        ]);
        setDossiers(dossiersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch dossiers pays:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Header />

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-african.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block uppercase tracking-[0.3em] text-sm font-semibold text-amber-400 mb-4">
              {lang === 'fr' ? 'Explorez l\'Afrique' : 'Explore Africa'}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {lang === 'fr' ? 'Dossiers Pays' : 'Country Reports'}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {lang === 'fr'
                ? 'Des guides complets pour comprendre l\'Afrique en profondeur, pays par pays.'
                : 'Comprehensive guides to understand Africa in depth, country by country.'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-80" />
            ))}
          </div>
        ) : dossiers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {lang === 'fr'
                ? 'Les dossiers pays sont en cours de préparation.'
                : 'Country reports are being prepared.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dossiers.map((dossier) => (
              <Link
                key={dossier.id}
                href={`/dossier-pays/${dossier.slug}`}
                className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 overflow-hidden">
                  {dossier.heroImage ? (
                    <Image
                      src={dossier.heroImage}
                      alt={dossier.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl opacity-50">
                        {getCountryEmoji(dossier.countryCode)}
                      </span>
                    </div>
                  )}
                  {/* Country Badge */}
                  <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 rounded-full px-3 py-1 shadow-lg flex items-center gap-2">
                    <span className="text-xl">{getCountryEmoji(dossier.countryCode)}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                      {dossier.countryCode}
                    </span>
                  </div>
                  {/* Featured Badge */}
                  {dossier.featured && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {lang === 'fr' ? 'À la une' : 'Featured'}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                    {dossier.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
                    {dossier.subtitle}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {dossier.chapitresCount} {lang === 'fr' ? 'chapitres' : 'chapters'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {dossier.totalReadingMinutes} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}
