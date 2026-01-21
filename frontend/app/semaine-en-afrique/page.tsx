'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, WeeklyEdition, WeeklyEditionPreview } from '@/lib/api';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Nettoyer le HTML du GPT (supprimer les artefacts OpenAI)
function cleanGptHtml(html: string): string {
  return html
    // Supprimer les références contentReference
    .replace(/::contentReference\[.*?\]\{.*?\}/g, '')
    // Supprimer les lignes vides multiples
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

export default function SemaineEnAfriquePage() {
  const { lang } = useApp();
  const [currentEdition, setCurrentEdition] = useState<WeeklyEdition | null>(null);
  const [editions, setEditions] = useState<WeeklyEditionPreview[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [current, editionsList, yearsList] = await Promise.all([
        api.getCurrentWeeklyEdition(),
        api.getWeeklyEditions({ limit: 12 }),
        api.getWeeklyYears(),
      ]);
      
      setCurrentEdition(current);
      setEditions(editionsList.data);
      setYears(yearsList);
    } catch (error) {
      console.error('Erreur chargement données:', error);
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-900 via-amber-800 to-red-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <span className="text-6xl mb-4 block">🌍</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {lang === 'fr' ? 'Une semaine en Afrique' : 'A Week in Africa'}
            </h1>
            <p className="text-lg text-white/80 mt-4 max-w-2xl mx-auto">
              {lang === 'fr' 
                ? 'Les 10 actualités majeures du continent africain, chaque semaine.'
                : '10 key news stories from Africa, every week.'}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Édition courante */}
          {currentEdition && currentEdition.contentHtml ? (
            <section className="mb-12">
              {/* Afficher le HTML généré par le GPT - data-lang contrôle quelle version est visible */}
              <div 
                className="weekly-content"
                data-lang={lang}
                dangerouslySetInnerHTML={{ __html: cleanGptHtml(currentEdition.contentHtml) }}
              />
            </section>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center mb-12">
              <span className="text-6xl mb-4 block">📭</span>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                {lang === 'fr' ? "Pas encore d'édition publiée" : 'No edition published yet'}
              </h2>
              <p className="text-gray-500">
                {lang === 'fr' 
                  ? 'La première édition de "Une semaine en Afrique" arrive bientôt !'
                  : 'The first edition of "A Week in Africa" is coming soon!'}
              </p>
            </div>
          )}

          {/* Archives */}
          {editions.length > 1 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📚</span>
                {lang === 'fr' ? 'Archives' : 'Archives'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {editions
                  .filter(e => currentEdition ? e.id !== currentEdition.id : true)
                  .map((edition) => (
                    <Link 
                      key={edition.id}
                      href={`/semaine-en-afrique/${edition.slug}`}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-amber-600 font-medium">
                          {lang === 'fr' ? 'Semaine' : 'Week'} {edition.weekNumber}
                        </span>
                        <span className="text-sm text-gray-500">{edition.year}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition">
                        {edition.title || `${lang === 'fr' ? 'Semaine' : 'Week'} ${edition.weekNumber}, ${edition.year}`}
                      </h3>
                    </Link>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
