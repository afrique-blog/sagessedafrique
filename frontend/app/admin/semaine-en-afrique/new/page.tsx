'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, AfricanCountry } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

interface NewsItem {
  id?: number;
  position: number;
  country: string;
  countryCode: string;
  sourceUrl: string;
  sourceName: string;
  translations: {
    fr: { title: string; excerpt: string };
  };
}

export default function NewWeeklyEditionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<AfricanCountry[]>([]);
  
  // Données de l'édition
  const [weekNumber, setWeekNumber] = useState(getCurrentWeekNumber());
  const [year, setYear] = useState(new Date().getFullYear());
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [news, setNews] = useState<NewsItem[]>([createEmptyNews(1)]);

  useEffect(() => {
    api.getAfricanCountries().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    // Générer le titre automatiquement
    const weekDates = getWeekDates(year, weekNumber);
    setTitle(`Une semaine en Afrique - ${weekDates.start} au ${weekDates.end}`);
  }, [weekNumber, year]);

  function createEmptyNews(position: number): NewsItem {
    return {
      position,
      country: '',
      countryCode: '',
      sourceUrl: '',
      sourceName: '',
      translations: {
        fr: { title: '', excerpt: '' },
      },
    };
  }

  function addNews() {
    if (news.length >= 10) return;
    setNews([...news, createEmptyNews(news.length + 1)]);
  }

  function removeNews(index: number) {
    const updated = news.filter((_, i) => i !== index);
    // Recalculer les positions
    setNews(updated.map((n, i) => ({ ...n, position: i + 1 })));
  }

  function updateNews(index: number, field: string, value: string) {
    const updated = [...news];
    if (field === 'countryCode') {
      const country = countries.find(c => c.code === value);
      updated[index] = { 
        ...updated[index], 
        countryCode: value,
        country: country?.name || '',
      };
    } else if (field.startsWith('translations.')) {
      const [, , subField] = field.split('.');
      updated[index] = {
        ...updated[index],
        translations: {
          ...updated[index].translations,
          fr: { ...updated[index].translations.fr, [subField]: value },
        },
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setNews(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert('Le titre est requis');
      return;
    }
    
    const validNews = news.filter(n => n.countryCode && n.translations.fr.title && n.translations.fr.excerpt);
    if (validNews.length === 0) {
      alert('Ajoutez au moins une actualité');
      return;
    }

    setLoading(true);
    try {
      await api.createWeeklyEdition({
        weekNumber,
        year,
        translations: {
          fr: { title, summary },
        },
        news: validNews.map((n, i) => ({
          ...n,
          position: i + 1,
        })),
      });
      
      router.push('/admin/semaine-en-afrique');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/semaine-en-afrique" className="text-gray-500 hover:text-gray-700">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle édition hebdomadaire</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">📅 Informations générales</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de semaine</label>
                <select
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {Array.from({ length: 52 }, (_, i) => i + 1).map(w => (
                    <option key={w} value={w}>Semaine {w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Résumé (optionnel)</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Un bref résumé de la semaine..."
              />
            </div>
          </div>

          {/* Actualités */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">📰 Actualités ({news.length}/10)</h2>
              {news.length < 10 && (
                <button
                  type="button"
                  onClick={addNews}
                  className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm font-medium"
                >
                  + Ajouter une actualité
                </button>
              )}
            </div>

            <div className="space-y-6">
              {news.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-700">Actualité #{index + 1}</span>
                    </span>
                    {news.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNews(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                      <select
                        value={item.countryCode}
                        onChange={(e) => updateNews(index, 'countryCode', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        required
                      >
                        <option value="">Sélectionner un pays</option>
                        {countries.map(c => (
                          <option key={c.code} value={c.code}>
                            {countryCodeToFlag(c.code)} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                      <input
                        type="text"
                        value={item.sourceName}
                        onChange={(e) => updateNews(index, 'sourceName', e.target.value)}
                        placeholder="Ex: Le Monde Afrique"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de la source</label>
                    <input
                      type="url"
                      value={item.sourceUrl}
                      onChange={(e) => updateNews(index, 'sourceUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'actualité *</label>
                    <input
                      type="text"
                      value={item.translations.fr.title}
                      onChange={(e) => updateNews(index, 'translations.fr.title', e.target.value)}
                      placeholder="Titre accrocheur de l'actualité"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Résumé *</label>
                    <textarea
                      value={item.translations.fr.excerpt}
                      onChange={(e) => updateNews(index, 'translations.fr.excerpt', e.target.value)}
                      rows={3}
                      placeholder="Résumé en 2-3 phrases..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/admin/semaine-en-afrique"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 flex-1"
            >
              {loading ? 'Création...' : 'Créer l\'édition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helpers
function getCurrentWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

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

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
