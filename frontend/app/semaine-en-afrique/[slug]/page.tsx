'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, WeeklyEdition } from '@/lib/api';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Fonction pour convertir code pays en emoji drapeau
function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Calculer les dates de la semaine
function getWeekDates(year: number, weekNumber: number): { start: string; end: string } {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const dow = simple.getDay();
  const monday = new Date(simple);
  if (dow <= 4) {
    monday.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    monday.setDate(simple.getDate() + 8 - simple.getDay());
  }
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  return {
    start: monday.toLocaleDateString('fr-FR', options),
    end: sunday.toLocaleDateString('fr-FR', { ...options, year: 'numeric' }),
  };
}

export default function WeeklyEditionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useApp();
  
  const [edition, setEdition] = useState<WeeklyEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEdition();
  }, [slug, language]);

  async function loadEdition() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWeeklyEdition(slug, language);
      setEdition(data);
    } catch (err) {
      setError('Édition non trouvée');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !edition) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl mb-4 block">😕</span>
            <h1 className="text-2xl font-bold text-gray-700 mb-4">
              {error || 'Édition non trouvée'}
            </h1>
            <Link 
              href="/semaine-en-afrique"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              ← Retour aux actualités
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const weekDates = getWeekDates(edition.year, edition.weekNumber);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-900 via-amber-800 to-red-900 text-white py-12">
          <div className="container mx-auto px-4">
            <Link 
              href="/semaine-en-afrique"
              className="inline-flex items-center gap-2 text-amber-200 hover:text-white transition mb-6"
            >
              ← Retour aux actualités
            </Link>
            
            <div className="text-center">
              <span className="text-5xl mb-4 block">🌍</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {edition.title}
              </h1>
              <p className="text-xl text-amber-200">
                {weekDates.start} - {weekDates.end}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {edition.summary && (
            <div className="bg-white rounded-xl shadow p-6 mb-8 -mt-8 relative z-10">
              <p className="text-gray-600 text-lg">{edition.summary}</p>
            </div>
          )}

          {/* Liste des actualités */}
          <div className="space-y-4">
            {edition.news.map((news, index) => (
              <article 
                key={news.id} 
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Numéro */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  
                  {/* Drapeau */}
                  <span className="text-4xl flex-shrink-0">
                    {countryCodeToFlag(news.countryCode)}
                  </span>
                  
                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                        {news.country}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {news.title}
                    </h2>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {news.excerpt}
                    </p>
                    
                    {news.sourceName && (
                      <p className="text-sm text-gray-400 mt-3">
                        📎 Source : {news.sourceUrl ? (
                          <a 
                            href={news.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-amber-600 transition"
                          >
                            {news.sourceName}
                          </a>
                        ) : news.sourceName}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link 
              href="/semaine-en-afrique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              <span>📚</span>
              Voir toutes les éditions
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
