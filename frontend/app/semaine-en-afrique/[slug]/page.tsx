'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, WeeklyEdition } from '@/lib/api';
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

export default function WeeklyEditionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { lang } = useApp();
  
  const [edition, setEdition] = useState<WeeklyEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadEdition();
  }, [slug]);

  async function loadEdition() {
    setLoading(true);
    setError(false);
    try {
      const data = await api.getWeeklyEdition(slug);
      setEdition(data);
    } catch (err) {
      console.error('Erreur chargement édition:', err);
      setError(true);
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
            <span className="text-6xl mb-4 block">❌</span>
            <h1 className="text-2xl font-bold text-gray-700 mb-2">
              {lang === 'fr' ? 'Édition introuvable' : 'Edition not found'}
            </h1>
            <Link 
              href="/semaine-en-afrique"
              className="text-amber-600 hover:text-amber-700"
            >
              ← {lang === 'fr' ? 'Retour aux éditions' : 'Back to editions'}
            </Link>
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
        <section className="bg-gradient-to-r from-green-900 via-amber-800 to-red-900 text-white py-12">
          <div className="container mx-auto px-4">
            <Link 
              href="/semaine-en-afrique"
              className="inline-flex items-center text-white/80 hover:text-white mb-4"
            >
              ← {lang === 'fr' ? 'Toutes les éditions' : 'All editions'}
            </Link>
            <div className="text-center">
              <span className="text-5xl mb-4 block">🌍</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {edition.title || `${lang === 'fr' ? 'Semaine' : 'Week'} ${edition.weekNumber}, ${edition.year}`}
              </h1>
              <p className="text-white/70">
                {lang === 'fr' ? 'Semaine' : 'Week'} {edition.weekNumber} — {edition.year}
              </p>
            </div>
          </div>
        </section>

        {/* Contenu */}
        <div className="container mx-auto px-4 py-8">
          {edition.contentHtml ? (
            <div 
              className="weekly-content"
              data-lang={lang}
              dangerouslySetInnerHTML={{ __html: cleanGptHtml(edition.contentHtml) }}
            />
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-500">
                {lang === 'fr' ? 'Contenu non disponible' : 'Content not available'}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t text-center">
            <Link 
              href="/semaine-en-afrique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              ← {lang === 'fr' ? 'Voir toutes les éditions' : 'View all editions'}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
