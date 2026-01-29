'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, PaysDossierAdmin } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

// Helper pour déterminer le statut de publication
function getPublishStatus(publishedAt: string | null | undefined): { status: 'draft' | 'scheduled' | 'published'; label: string; color: string; icon: string } {
  if (!publishedAt) {
    return { status: 'draft', label: 'Brouillon', color: 'orange', icon: '🔶' };
  }
  const pubDate = new Date(publishedAt);
  const now = new Date();
  if (pubDate > now) {
    return { status: 'scheduled', label: `${pubDate.toLocaleDateString('fr-FR')}`, color: 'blue', icon: '🕐' };
  }
  return { status: 'published', label: 'Publié', color: 'green', icon: '✅' };
}

// Helper pour emoji drapeau
function getCountryEmoji(countryCode: string | null): string {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

type SortField = 'title' | 'country' | 'chapitres' | 'status';
type SortOrder = 'asc' | 'desc';

function DossiersPaysList() {
  const [dossiers, setDossiers] = useState<PaysDossierAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    fetchDossiers();
  }, []);

  async function fetchDossiers() {
    setLoading(true);
    try {
      const data = await api.getPaysListAdmin('fr');
      setDossiers(data);
    } catch (error) {
      console.error('Failed to fetch dossiers:', error);
    } finally {
      setLoading(false);
    }
  }

  // Fonction de tri
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  // Trier les dossiers
  const sortedDossiers = [...dossiers].sort((a, b) => {
    let compareValue = 0;

    switch (sortField) {
      case 'title':
        compareValue = a.title.localeCompare(b.title, 'fr');
        break;
      case 'country':
        compareValue = a.countryCode.localeCompare(b.countryCode);
        break;
      case 'chapitres':
        compareValue = a.chapitresCount - b.chapitresCount;
        break;
      case 'status':
        const statusA = getPublishStatus(a.publishedAt);
        const statusB = getPublishStatus(b.publishedAt);
        const statusOrder = { draft: 0, scheduled: 1, published: 2 };
        compareValue = statusOrder[statusA.status] - statusOrder[statusB.status];
        break;
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  // Composant pour l'icône de tri
  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <span className="text-slate-400">⇅</span>;
    }
    return <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  }

  async function handleDelete(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce dossier pays et tous ses chapitres ?')) return;

    try {
      await api.deletePaysDossier(id);
      fetchDossiers();
    } catch (error) {
      console.error('Failed to delete dossier:', error);
      alert('Erreur lors de la suppression');
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dossiers Pays
          </h1>
          <Link
            href="/admin/dossiers-pays/new"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <span>+</span> Nouveau Dossier
          </Link>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
            <div className="animate-pulse">Chargement...</div>
          </div>
        ) : dossiers.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Aucun dossier pays pour le moment.
            </p>
            <Link
              href="/admin/dossiers-pays/new"
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Créer votre premier dossier →
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <button onClick={() => handleSort('country')} className="flex items-center gap-2 hover:text-slate-700">
                      Pays <SortIcon field="country" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <button onClick={() => handleSort('title')} className="flex items-center gap-2 hover:text-slate-700">
                      Titre <SortIcon field="title" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <button onClick={() => handleSort('chapitres')} className="flex items-center gap-2 hover:text-slate-700">
                      Chapitres <SortIcon field="chapitres" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <button onClick={() => handleSort('status')} className="flex items-center gap-2 hover:text-slate-700">
                      Statut <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {sortedDossiers.map((dossier) => {
                  const status = getPublishStatus(dossier.publishedAt);
                  return (
                    <tr key={dossier.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCountryEmoji(dossier.countryCode)}</span>
                          <span className="text-xs text-slate-500 font-mono">{dossier.countryCode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/dossiers-pays/${dossier.id}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-amber-600 transition-colors"
                        >
                          {dossier.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{dossier.subtitle}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-600 rounded text-sm">
                          📚 {dossier.chapitresCount}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            status.status === 'published'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : status.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}
                        >
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dossier-pays/${dossier.slug}`}
                            target="_blank"
                            className="text-slate-400 hover:text-slate-600 p-1"
                            title="Voir"
                          >
                            👁️
                          </Link>
                          <Link
                            href={`/admin/dossiers-pays/${dossier.id}`}
                            className="text-slate-400 hover:text-amber-600 p-1"
                            title="Modifier"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(dossier.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DossiersPaysPage() {
  return (
    <RequireAuth>
      <DossiersPaysList />
    </RequireAuth>
  );
}
