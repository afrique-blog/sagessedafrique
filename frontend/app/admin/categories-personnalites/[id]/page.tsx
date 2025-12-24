'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, CategoriePersonnaliteAdmin } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

function EditCategoriePersonnaliteForm() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    image: '',
    nomFr: '',
    descriptionFr: '',
    nomEn: '',
    descriptionEn: '',
  });

  useEffect(() => {
    api.getCategoriePersonnaliteAdmin(id)
      .then((cat: CategoriePersonnaliteAdmin) => {
        const fr = cat.translations.find(t => t.lang === 'fr');
        const en = cat.translations.find(t => t.lang === 'en');
        setForm({
          slug: cat.slug,
          image: cat.image || '',
          nomFr: fr?.nom || '',
          descriptionFr: fr?.description || '',
          nomEn: en?.nom || '',
          descriptionEn: en?.description || '',
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateCategoriePersonnalite(id, {
        slug: form.slug,
        image: form.image || null,
        translations: [
          { lang: 'fr', nom: form.nomFr, description: form.descriptionFr },
          { lang: 'en', nom: form.nomEn, description: form.descriptionEn },
        ],
      });
      router.push('/admin/categories-personnalites');
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <AdminNav />
        <main className="container mx-auto px-4 py-8">
          <p>Chargement...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/categories-personnalites" className="text-sm text-slate-500 hover:text-primary">← Retour aux catégories</Link>
          <h1 className="text-3xl font-serif font-bold mt-2">Modifier la catégorie de personnalités</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 max-w-2xl">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
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
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
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

export default function EditCategoriePersonnalitePage() {
  return (
    <RequireAuth>
      <EditCategoriePersonnaliteForm />
    </RequireAuth>
  );
}

