'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, CategoriePersonnalite, Article } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

const IMAGE_PREFIX = '/images/personnalites/';

// Extraire le nom du fichier depuis le chemin complet
function extractFilename(path: string | null): string {
  if (!path) return '';
  if (path.startsWith(IMAGE_PREFIX)) {
    return path.substring(IMAGE_PREFIX.length);
  }
  // Si c'est une URL externe ou autre chemin, retourner tel quel
  return path;
}

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
    categorieIds: [] as number[], // Plusieurs catégories possibles
    imageFilename: '', // Juste le nom du fichier
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
        categorieIds: p.categorieIds || [], // Tableau des IDs de catégories
        imageFilename: extractFilename(p.image),
        youtubeUrl: p.youtubeUrl || '',
        articleId: p.articleId ? String(p.articleId) : '',
      });
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.categorieIds.length === 0) {
      alert('Veuillez sélectionner au moins une catégorie');
      return;
    }
    
    setSaving(true);
    try {
      // Construire le chemin complet de l'image
      let imagePath: string | null = null;
      if (form.imageFilename) {
        // Si c'est déjà une URL complète ou un chemin absolu, le garder tel quel
        if (form.imageFilename.startsWith('http') || form.imageFilename.startsWith('/')) {
          imagePath = form.imageFilename;
        } else {
          imagePath = `${IMAGE_PREFIX}${form.imageFilename}`;
        }
      }

      await api.updatePersonnalite(id, {
        slug: form.slug,
        nom: form.nom,
        categorieIds: form.categorieIds,
        image: imagePath,
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
            <label className="block text-sm font-medium mb-2">Catégories * (sélectionnez une ou plusieurs)</label>
            <div className="space-y-2 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 max-h-48 overflow-y-auto">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={form.categorieIds.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, categorieIds: [...form.categorieIds, cat.id] });
                      } else {
                        setForm({ ...form, categorieIds: form.categorieIds.filter(id => id !== cat.id) });
                      }
                    }}
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                  />
                  <span>{cat.nom}</span>
                </label>
              ))}
            </div>
            {form.categorieIds.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {form.categorieIds.length} catégorie(s) sélectionnée(s)
              </p>
            )}
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
