'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, Personnalite } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

function PersonnalitesList() {
  const [personnalites, setPersonnalites] = useState<Personnalite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPersonnalites('fr')
      .then(setPersonnalites)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Article</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">YouTube</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {personnalites.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-sm">{p.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{p.nom}</td>
                    <td className="px-6 py-4 text-sm">{p.categorie.nom}</td>
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
                ))}
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

