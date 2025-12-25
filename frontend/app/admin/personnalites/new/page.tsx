'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, CategoriePersonnalite, Article } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

const IMAGE_PREFIX = '/images/personnalites/';

function NewPersonnaliteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoriePersonnalite[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState({
    slug: '',
    nom: '',
    categorieId: 0,
    imageFilename: '', // Juste le nom du fichier
    youtubeUrl: '',
    articleId: '',
  });

  useEffect(() => {
    Promise.all([
      api.getCategoriesPersonnalites('fr'),
      api.getArticles({ limit: 100 }),
    ]).then(([cats, arts]) => {
      setCategories(cats);
      setArticles(arts.data);
      if (cats.length > 0) {
        setForm(f => ({ ...f, categorieId: cats[0].id }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Construire le chemin complet de l'image
      const imagePath = form.imageFilename 
        ? `${IMAGE_PREFIX}${form.imageFilename}`
        : null;

      await api.createPersonnalite({
        slug: form.slug,
        nom: form.nom,
        categorieId: form.categorieId,
        image: imagePath,
        youtubeUrl: form.youtubeUrl || null,
        articleId: form.articleId ? parseInt(form.articleId) : null,
      });
      router.push('/admin/personnalites');
    } catch (error) {
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from nom
  const handleNomChange = (nom: string) => {
    const slug = nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm({ ...form, nom, slug });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/personnalites" className="text-sm text-slate-500 hover:text-primary">← Retour aux personnalités</Link>
          <h1 className="text-3xl font-serif font-bold mt-2">Nouvelle personnalité</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom *</label>
              <input
                type="text"
                value={form.nom}
                onChange={e => handleNomChange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                placeholder="ex: Nelson Mandela"
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
            <label className="block text-sm font-medium mb-2">Image (nom du fichier)</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 dark:bg-slate-600 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg">
                {IMAGE_PREFIX}
              </span>
              <input
                type="text"
                value={form.imageFilename}
                onChange={e => setForm({ ...form, imageFilename: e.target.value })}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-700"
                placeholder="nelson-mandela.jpg"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Déposez l'image dans /public/images/personnalites/ puis entrez son nom ici</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">URL YouTube</label>
            <input
              type="text"
              value={form.youtubeUrl}
              onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              placeholder="https://www.youtube.com/watch?v=..."
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
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer'}
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

export default function NewPersonnalitePage() {
  return (
    <RequireAuth>
      <NewPersonnaliteForm />
    </RequireAuth>
  );
}
