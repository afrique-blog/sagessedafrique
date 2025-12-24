'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

function NewCategoriePersonnaliteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    image: '',
    nomFr: '',
    descriptionFr: '',
    nomEn: '',
    descriptionEn: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createCategoriePersonnalite({
        slug: form.slug,
        image: form.image || null,
        translations: [
          { lang: 'fr', nom: form.nomFr, description: form.descriptionFr },
          { lang: 'en', nom: form.nomEn, description: form.descriptionEn },
        ],
      });
      router.push('/admin/categories-personnalites');
    } catch (error) {
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/categories-personnalites" className="text-sm text-slate-500 hover:text-primary">← Retour aux catégories</Link>
          <h1 className="text-3xl font-serif font-bold mt-2">Nouvelle catégorie de personnalités</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 max-w-2xl">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              placeholder="ex: leaders-politiques"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Image (URL ou chemin)</label>
            <input
              type="text"
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              placeholder="/images/categories/leaders-politiques.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-4 text-primary">🇫🇷 Français</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <input
                  type="text"
                  value={form.nomFr}
                  onChange={e => setForm({ ...form, nomFr: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={form.descriptionFr}
                  onChange={e => setForm({ ...form, descriptionFr: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  rows={4}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-accent">🇬🇧 English</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={form.nomEn}
                  onChange={e => setForm({ ...form, nomEn: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={form.descriptionEn}
                  onChange={e => setForm({ ...form, descriptionEn: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
            <Link href="/admin/categories-personnalites" className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg">
              Annuler
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NewCategoriePersonnalitePage() {
  return (
    <RequireAuth>
      <NewCategoriePersonnaliteForm />
    </RequireAuth>
  );
}

