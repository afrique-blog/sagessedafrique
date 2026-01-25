'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, Personnalite } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

// Helper pour déterminer le statut de publication
function getPublishStatus(publishedAt: string | null | undefined): { status: 'draft' | 'scheduled' | 'published'; label: string; color: string; icon: string } {
  if (!publishedAt) {
    return { status: 'draft', label: 'Brouillon', color: 'orange', icon: '🔶' };
  }
  const pubDate = new Date(publishedAt);
  const now = new Date();
  if (pubDate > now) {
    return { status: 'scheduled', label: `Programmé (${pubDate.toLocaleDateString('fr-FR')})`, color: 'blue', icon: '🕐' };
  }
  return { status: 'published', label: 'Publié', color: 'green', icon: '✅' };
}

type SortField = 'id' | 'nom' | 'status' | 'categories' | 'article' | 'youtube';
type SortOrder = 'asc' | 'desc';

function PersonnalitesList() {
  const [personnalites, setPersonnalites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    // Utiliser l'API avec includeUnpublished pour voir tous les statuts
    api.getPersonnalitesWithStatus('fr')
      .then(setPersonnalites)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Fonction de tri
  function handleSort(field: SortField) {
    if (sortField === field) {
      // Inverser l'ordre si on clique sur la même colonne
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouvelle colonne, tri ascendant par défaut
      setSortField(field);
      setSortOrder('asc');
    }
  }

  // Trier les personnalités
  const sortedPersonnalites = [...personnalites].sort((a, b) => {
    let compareValue = 0;

    switch (sortField) {
      case 'id':
        compareValue = a.id - b.id;
        break;
      case 'nom':
        compareValue = a.nom.localeCompare(b.nom, 'fr');
        break;
      case 'status':
        const statusA = getPublishStatus(a.publishedAt);
        const statusB = getPublishStatus(b.publishedAt);
        // Ordre: draft < scheduled < published
        const statusOrder = { draft: 0, scheduled: 1, published: 2 };
        compareValue = statusOrder[statusA.status] - statusOrder[statusB.status];
        break;
      case 'categories':
        const catA = a.categories?.[0]?.nom || a.categories?.[0]?.translations?.[0]?.nom || '';
        const catB = b.categories?.[0]?.nom || b.categories?.[0]?.translations?.[0]?.nom || '';
        compareValue = catA.localeCompare(catB, 'fr');
        break;
      case 'article':
        // Tri par présence d'article (avec article = 1, sans = 0)
        compareValue = (a.article ? 1 : 0) - (b.article ? 1 : 0);
        break;
      case 'youtube':
        // Tri par présence de lien YouTube (avec lien = 1, sans = 0)
        compareValue = (a.youtubeUrl ? 1 : 0) - (b.youtubeUrl ? 1 : 0);
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

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette personnalité ?')) return;
    try {
      await api.deletePersonnalite(id);
      setPersonnalites(personnalites.filter(p => p.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">Personnalités Africaines</h1>
          <Link href="/admin/personnalites/new" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
            + Nouvelle personnalité
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-6 text-center">Chargement...</p>
          ) : personnalites.length === 0 ? (
            <p className="p-6 text-center text-slate-500">Aucune personnalité</p>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th 
                    onClick={() => handleSort('id')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span>ID</span>
                      <SortIcon field="id" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('nom')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span>Nom</span>
                      <SortIcon field="nom" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span>Statut</span>
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('categories')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span>Catégories</span>
                      <SortIcon field="categories" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('article')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span>Article</span>
                      <SortIcon field="article" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('youtube')}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span>YouTube</span>
                      <SortIcon field="youtube" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {sortedPersonnalites.map(p => {
                  const pubStatus = getPublishStatus(p.publishedAt);
                  return (
                  <tr key={p.id} className={pubStatus.status === 'draft' ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}>
                    <td className="px-6 py-4 text-sm">{p.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{p.nom}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${pubStatus.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                        ${pubStatus.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${pubStatus.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                      `}>
                        <span>{pubStatus.icon}</span>
                        {pubStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {p.categories && p.categories.length > 0 ? (
                          p.categories.map((cat: any) => (
                            <span key={cat.id} className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              {cat.nom || cat.translations?.[0]?.nom || 'Sans nom'}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {p.article ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {p.youtubeUrl ? (
                        <a href={p.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                          🎬
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/personnalites/${p.id}`} className="text-primary hover:underline text-sm mr-4">
                        Modifier
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-sm">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PersonnalitesPage() {
  return (
    <RequireAuth>
      <PersonnalitesList />
    </RequireAuth>
  );
}

