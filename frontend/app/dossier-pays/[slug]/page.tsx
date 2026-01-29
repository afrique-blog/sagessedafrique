'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, PaysDossierDetail, Category } from '@/lib/api';
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

// Convert number to Roman numeral
function toRoman(num: number): string {
  if (num === 0) return '0';
  const lookup: Record<string, number> = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1,
  };
  let roman = '';
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

export default function DossierPaysSommaire() {
  const { slug } = useParams();
  const { lang } = useApp();
  const [dossier, setDossier] = useState<PaysDossierDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      try {
        const [dossierData, categoriesData] = await Promise.all([
          api.getPaysDossier(slug as string, lang),
          api.getCategories(lang),
        ]);
        setDossier(dossierData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch dossier:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-lg text-slate-600 dark:text-slate-400">
            {lang === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-serif font-bold text-slate-900 dark:text-white mb-4">404</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              {lang === 'fr' ? 'Dossier non trouvé' : 'Report not found'}
            </p>
            <Link
              href="/dossiers-pays"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {lang === 'fr' ? 'Retour aux dossiers' : 'Back to reports'}
            </Link>
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Header />

      {/* Hero Section */}
      <header className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {dossier.heroImage ? (
            <Image
              src={dossier.heroImage}
              alt={dossier.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-800 to-amber-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          {/* Country Badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-3xl">{getCountryEmoji(dossier.countryCode)}</span>
            <span className="uppercase tracking-[0.3em] text-sm font-semibold text-amber-400">
              {lang === 'fr' ? 'Dossier Spécial' : 'Special Report'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            {dossier.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto font-light">
            {dossier.subtitle}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-slate-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{dossier.chapitres.length} {lang === 'fr' ? 'chapitres' : 'chapters'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{dossier.totalReadingMinutes} min</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      {/* Sommaire */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Back link */}
          <Link
            href="/dossiers-pays"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 mb-8 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {lang === 'fr' ? 'Tous les dossiers pays' : 'All country reports'}
          </Link>

          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            {lang === 'fr' ? 'Sommaire' : 'Table of Contents'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10">
            {lang === 'fr'
              ? 'Cliquez sur un chapitre pour commencer votre lecture.'
              : 'Click on a chapter to start reading.'}
          </p>

          {/* Chapters List */}
          <div className="space-y-4">
            {dossier.chapitres.map((chapitre, idx) => (
              <Link
                key={chapitre.id}
                href={`/dossier-pays/${dossier.slug}/${chapitre.slug}`}
                className="group flex items-center gap-6 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-lg transition-all"
              >
                {/* Chapter Number */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border-2 border-amber-200 dark:border-amber-800">
                  <span className="font-serif font-bold text-amber-800 dark:text-amber-400 text-lg">
                    {idx === 0 ? '0' : toRoman(idx)}
                  </span>
                </div>

                {/* Chapter Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors truncate">
                    {chapitre.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {chapitre.readingMinutes} min {lang === 'fr' ? 'de lecture' : 'reading'}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          {dossier.chapitres.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href={`/dossier-pays/${dossier.slug}/${dossier.chapitres[0].slug}`}
                className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {lang === 'fr' ? 'Commencer la lecture' : 'Start Reading'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer categories={categories} />
    </div>
  );
}
