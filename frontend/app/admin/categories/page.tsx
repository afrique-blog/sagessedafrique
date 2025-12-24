'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, Category } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories('fr')
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">Catégories</h1>
          <Link href="/admin/categories/new" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
            + Nouvelle catégorie
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-6 text-center">Chargement...</p>
          ) : categories.length === 0 ? (
            <p className="p-6 text-center text-slate-500">Aucune catégorie</p>
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
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td className="px-6 py-4 text-sm">{cat.id}</td>
                    <td className="px-6 py-4 text-sm font-mono">{cat.slug}</td>
                    <td className="px-6 py-4 text-sm font-medium">{cat.name}</td>
                    <td className="px-6 py-4 text-sm">{cat.articleCount}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/categories/${cat.id}`} className="text-primary hover:underline text-sm mr-4">
                        Modifier
                      </Link>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline text-sm">
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

export default function CategoriesPage() {
  return (
    <RequireAuth>
      <CategoriesList />
    </RequireAuth>
  );
}

