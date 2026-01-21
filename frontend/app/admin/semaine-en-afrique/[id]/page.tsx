'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditWeeklyEditionPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<AfricanCountry[]>([]);
  
  // Données de l'édition
  const [weekNumber, setWeekNumber] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [edition, countriesList] = await Promise.all([
        api.getWeeklyEditionAdmin(id),
        api.getAfricanCountries(),
      ]);
      
      setCountries(countriesList);
      setWeekNumber(edition.weekNumber);
      setYear(edition.year);
      setPublishedAt(edition.publishedAt);
      
      const frTrans = edition.translations.find((t: any) => t.lang === 'fr');
      setTitle(frTrans?.title || '');
      setSummary(frTrans?.summary || '');
      
      setNews(edition.news.map((n: any) => {
        const nTrans = n.translations.find((t: any) => t.lang === 'fr');
        return {
          id: n.id,
          position: n.position,
          country: n.country,
          countryCode: n.countryCode,
          sourceUrl: n.sourceUrl || '',
          sourceName: n.sourceName || '',
          translations: {
            fr: {
              title: nTrans?.title || '',
              excerpt: nTrans?.excerpt || '',
            },
          },
        };
      }));
    } catch (error) {
      alert('Erreur lors du chargement');
      router.push('/admin/semaine-en-afrique');
    } finally {
      setLoading(false);
    }
  }

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
    
    if (!title.trim()) {
      alert('Le titre est requis');
      return;
    }
    
    const validNews = news.filter(n => n.countryCode && n.translations.fr.title && n.translations.fr.excerpt);
    if (validNews.length === 0) {
      alert('Ajoutez au moins une actualité');
      return;
    }

    setSaving(true);
    try {
      await api.updateWeeklyEdition(id, {
        weekNumber,
        year,
        publishedAt: publishedAt || undefined,
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
      alert(error.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    try {
      await api.publishWeeklyEdition(id, !publishedAt);
      setPublishedAt(publishedAt ? null : new Date().toISOString());
    } catch (error) {
      alert('Erreur lors de la publication');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/semaine-en-afrique" className="text-gray-500 hover:text-gray-700">
              ← Retour
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Modifier l'édition</h1>
          </div>
          <button
            onClick={handlePublish}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              publishedAt 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {publishedAt ? '✓ Publiée - Dépublier' : 'Publier'}
          </button>
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
              disabled={saving}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 flex-1"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
