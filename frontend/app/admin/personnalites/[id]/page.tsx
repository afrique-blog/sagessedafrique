'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, CategoriePersonnalite, Article, PersonnaliteAdmin } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

function EditPersonnaliteForm() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoriePersonnalite[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState({
    slug: '',
    nom: '',
    categorieId: 0,
    image: '',
    youtubeUrl: '',
    articleId: '',
  });

  useEffect(() => {
    Promise.all([
      api.getPersonnaliteAdmin(id),
      api.getCategoriesPersonnalites('fr'),
      api.getArticles({ limit: 100 }),
    ]).then(([p, cats, arts]) => {
      setCategories(cats);
      setArticles(arts.data);
      setForm({
        slug: p.slug,
        nom: p.nom,
        categorieId: p.categorieId,
        image: p.image || '',
        youtubeUrl: p.youtubeUrl || '',
        articleId: p.articleId ? String(p.articleId) : '',
      });
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updatePersonnalite(id, {
        slug: form.slug,
        nom: form.nom,
        categorieId: form.categorieId,
        image: form.image || null,
        youtubeUrl: form.youtubeUrl || null,
        articleId: form.articleId ? parseInt(form.articleId) : null,
      });
      router.push('/admin/personnalites');
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
          <Link href="/admin/personnalites" className="text-sm text-slate-500 hover:text-primary">← Retour aux personnalités</Link>
          <h1 className="text-3xl font-serif font-bold mt-2">Modifier la personnalité</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom *</label>
              <input
                type="text"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 font-mono"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Catégorie *</label>
            <select
              value={form.categorieId}
              onChange={e => setForm({ ...form, categorieId: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
              ))}
            </select>
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

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">URL YouTube</label>
            <input
              type="text"
              value={form.youtubeUrl}
              onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Article associé (optionnel)</label>
            <select
              value={form.articleId}
              onChange={e => setForm({ ...form, articleId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            >
              <option value="">— Aucun article —</option>
              {articles.map(art => (
                <option key={art.id} value={art.id}>{art.title}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link href="/admin/personnalites" className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg">
              Annuler
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function EditPersonnalitePage() {
  return (
    <RequireAuth>
      <EditPersonnaliteForm />
    </RequireAuth>
  );
}

