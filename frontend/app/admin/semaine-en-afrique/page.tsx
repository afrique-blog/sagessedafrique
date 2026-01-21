'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

interface WeeklyEditionAdmin {
  id: number;
  slug: string;
  weekNumber: number;
  year: number;
  publishedAt: string | null;
  newsCount: number;
  translations: { lang: string; title: string; summary: string | null }[];
}

export default function AdminWeeklyPage() {
  const [editions, setEditions] = useState<WeeklyEditionAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEditions();
  }, []);

  async function loadEditions() {
    try {
      const result = await api.getWeeklyEditionsAdmin({ limit: 52 });
      setEditions(result.data);
    } catch (error) {
      console.error('Erreur chargement éditions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(id: number, publish: boolean) {
    try {
      await api.publishWeeklyEdition(id, publish);
      loadEditions();
    } catch (error) {
      alert('Erreur lors de la publication');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cette édition ?')) return;
    try {
      await api.deleteWeeklyEdition(id);
      loadEditions();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  }

  const getTitle = (ed: WeeklyEditionAdmin) => {
    const trans = ed.translations.find(t => t.lang === 'fr') || ed.translations[0];
    return trans?.title || `Semaine ${ed.weekNumber} - ${ed.year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🌍 Une semaine en Afrique</h1>
            <p className="text-gray-500 mt-1">Gérez les éditions hebdomadaires</p>
          </div>
          <Link
            href="/admin/semaine-en-afrique/new"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
          >
            <span>➕</span>
            Nouvelle édition
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : editions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Aucune édition</h2>
            <p className="text-gray-500 mb-6">Créez votre première édition hebdomadaire</p>
            <Link
              href="/admin/semaine-en-afrique/new"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Créer une édition
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Édition</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Année</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Semaine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actualités</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Statut</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {editions.map((ed) => (
                  <tr key={ed.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/admin/semaine-en-afrique/${ed.id}`} className="font-medium text-gray-900 hover:text-amber-600">
                        {getTitle(ed)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{ed.year}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium">
                        S{String(ed.weekNumber).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${ed.newsCount >= 10 ? 'text-green-600' : ed.newsCount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {ed.newsCount}/10
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ed.publishedAt ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ Publiée
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                          Brouillon
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handlePublish(ed.id, !ed.publishedAt)}
                          className={`px-3 py-1 rounded text-sm font-medium transition ${
                            ed.publishedAt 
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {ed.publishedAt ? 'Dépublier' : 'Publier'}
                        </button>
                        <Link
                          href={`/admin/semaine-en-afrique/${ed.id}`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(ed.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
