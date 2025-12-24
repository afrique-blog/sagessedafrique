'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, Tag } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

function TagsList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTags('fr')
      .then(setTags)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce tag ?')) return;
    try {
      await api.deleteTag(id);
      setTags(tags.filter(t => t.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">Tags</h1>
          <Link href="/admin/tags/new" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
            + Nouveau tag
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-6 text-center">Chargement...</p>
          ) : tags.length === 0 ? (
            <p className="p-6 text-center text-slate-500">Aucun tag</p>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nom (FR)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Articles</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {tags.map(tag => (
                  <tr key={tag.id}>
                    <td className="px-6 py-4 text-sm">{tag.id}</td>
                    <td className="px-6 py-4 text-sm font-mono">{tag.slug}</td>
                    <td className="px-6 py-4 text-sm font-medium">{tag.name}</td>
                    <td className="px-6 py-4 text-sm">{tag.articleCount}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/tags/${tag.id}`} className="text-primary hover:underline text-sm mr-4">
                        Modifier
                      </Link>
                      <button onClick={() => handleDelete(tag.id)} className="text-red-500 hover:underline text-sm">
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

export default function TagsPage() {
  return (
    <RequireAuth>
      <TagsList />
    </RequireAuth>
  );
}

