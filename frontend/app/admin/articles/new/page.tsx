'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, RequireAuth } from '@/lib/auth';
import { api, Category, Tag, Dossier } from '@/lib/api';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
});

function NewArticleForm() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    slug: '',
    categoryId: 0,
    heroImage: '',
    youtubeUrl: '',
    featured: false,
    readingMinutes: 5,
    publishStatus: 'draft' as 'draft' | 'scheduled' | 'published', // Statut de publication
    scheduledDate: '', // Date programmée
    titleFr: '',
    titleEn: '',
    excerptFr: '',
    excerptEn: '',
    contentFr: '',
    contentEn: '',
    takeawayFr: '',
    takeawayEn: '',
    sourcesFr: '',
    sourcesEn: '',
    tagIds: [] as number[],
    dossierIds: [] as number[],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, tgs, doss] = await Promise.all([
          api.getCategories('fr'),
          api.getTags('fr'),
          api.getDossiers('fr'),
        ]);
        setCategories(cats);
        setTags(tgs);
        setDossiers(doss);
        if (cats.length > 0) {
          setFormData(f => ({ ...f, categoryId: cats[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Calculer publishedAt selon le statut
      let publishedAt: string | undefined;
      if (formData.publishStatus === 'published') {
        publishedAt = new Date().toISOString();
      } else if (formData.publishStatus === 'scheduled' && formData.scheduledDate) {
        publishedAt = new Date(formData.scheduledDate).toISOString();
      }
      // Si 'draft', publishedAt reste undefined (null en BDD)

      await api.createArticle({
        slug: formData.slug,
        categoryId: formData.categoryId,
        heroImage: formData.heroImage || undefined,
        youtubeUrl: formData.youtubeUrl || undefined,
        featured: formData.featured,
        readingMinutes: formData.readingMinutes,
        publishedAt,
        translations: [
          {
            lang: 'fr',
            title: formData.titleFr,
            excerpt: formData.excerptFr,
            contentHtml: formData.contentFr,
            takeaway: formData.takeawayFr,
            sources: formData.sourcesFr,
          },
          {
            lang: 'en',
            title: formData.titleEn,
            excerpt: formData.excerptEn,
            contentHtml: formData.contentEn,
            takeaway: formData.takeawayEn,
            sources: formData.sourcesEn,
          },
        ],
        tagIds: formData.tagIds,
        dossierIds: formData.dossierIds,
      });
      router.push('/admin/articles');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-serif font-bold text-primary dark:text-accent">
              Admin
            </Link>
            <nav className="hidden md:flex items-center gap-4 ml-8">
              <Link href="/admin/articles" className="text-sm text-primary dark:text-accent">
                Articles
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm">Nouveau</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-600">
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Nouvel article</h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">Informations generales</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="mon-article"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categorie</label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Image hero (URL)</label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={e => setFormData({ ...formData, heroImage: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Temps de lecture (min)</label>
                <input
                  type="number"
                  value={formData.readingMinutes}
                  onChange={e => setFormData({ ...formData, readingMinutes: parseInt(e.target.value) })}
                  min={1}
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL YouTube (vidéo liée à l'article)</label>
              <input
                type="text"
                value={formData.youtubeUrl}
                onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm">Article a la une</label>
            </div>

            {/* Statut de publication */}
            <div className="border-t pt-6 mt-6">
              <label className="block text-sm font-medium mb-3">📅 Statut de publication</label>
              <div className="flex flex-wrap gap-4">
                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border-2 transition-colors ${formData.publishStatus === 'draft' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input
                    type="radio"
                    name="publishStatus"
                    value="draft"
                    checked={formData.publishStatus === 'draft'}
                    onChange={() => setFormData({ ...formData, publishStatus: 'draft', scheduledDate: '' })}
                    className="sr-only"
                  />
                  <span className="text-orange-500">🔶</span>
                  <span className="text-sm font-medium">Brouillon</span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border-2 transition-colors ${formData.publishStatus === 'scheduled' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input
                    type="radio"
                    name="publishStatus"
                    value="scheduled"
                    checked={formData.publishStatus === 'scheduled'}
                    onChange={() => setFormData({ ...formData, publishStatus: 'scheduled' })}
                    className="sr-only"
                  />
                  <span className="text-blue-500">🕐</span>
                  <span className="text-sm font-medium">Programmé</span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border-2 transition-colors ${formData.publishStatus === 'published' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input
                    type="radio"
                    name="publishStatus"
                    value="published"
                    checked={formData.publishStatus === 'published'}
                    onChange={() => setFormData({ ...formData, publishStatus: 'published', scheduledDate: '' })}
                    className="sr-only"
                  />
                  <span className="text-green-500">✅</span>
                  <span className="text-sm font-medium">Publier maintenant</span>
                </label>
              </div>
              
              {formData.publishStatus === 'scheduled' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Date et heure de publication</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    required={formData.publishStatus === 'scheduled'}
                    className="w-full md:w-auto px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">Contenu Francais</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <input
                type="text"
                value={formData.titleFr}
                onChange={e => {
                  setFormData({ 
                    ...formData, 
                    titleFr: e.target.value,
                    slug: formData.slug || generateSlug(e.target.value)
                  });
                }}
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Extrait</label>
              <textarea
                value={formData.excerptFr}
                onChange={e => setFormData({ ...formData, excerptFr: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">À retenir</label>
              <RichTextEditor
                value={formData.takeawayFr}
                onChange={(content) => setFormData({ ...formData, takeawayFr: content })}
                placeholder="Points clés à retenir..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contenu</label>
              <RichTextEditor
                value={formData.contentFr}
                onChange={(content) => setFormData({ ...formData, contentFr: content })}
                placeholder="Commencez a rediger votre article..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">📚 Sources & Références</label>
              <textarea
                value={formData.sourcesFr}
                onChange={e => setFormData({ ...formData, sourcesFr: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="• Livre 1, Auteur, Année&#10;• Article, Journal, Date&#10;• Site web, URL"
              />
              <p className="text-xs text-slate-500 mt-1">Une source par ligne, format libre</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">Contenu Anglais</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={formData.excerptEn}
                onChange={e => setFormData({ ...formData, excerptEn: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Key Takeaway</label>
              <RichTextEditor
                value={formData.takeawayEn}
                onChange={(content) => setFormData({ ...formData, takeawayEn: content })}
                placeholder="Key points to remember..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <RichTextEditor
                value={formData.contentEn}
                onChange={(content) => setFormData({ ...formData, contentEn: content })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">📚 Sources & References</label>
              <textarea
                value={formData.sourcesEn}
                onChange={e => setFormData({ ...formData, sourcesEn: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="• Book 1, Author, Year&#10;• Article, Journal, Date&#10;• Website, URL"
              />
              <p className="text-xs text-slate-500 mt-1">One source per line, free format</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">Tags et Dossiers</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.tagIds.includes(tag.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFormData({ ...formData, tagIds: [...formData.tagIds, tag.id] });
                        } else {
                          setFormData({ ...formData, tagIds: formData.tagIds.filter(id => id !== tag.id) });
                        }
                      }}
                      className="w-3 h-3"
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dossiers</label>
              <div className="flex flex-wrap gap-2">
                {dossiers.map(d => (
                  <label key={d.id} className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.dossierIds.includes(d.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFormData({ ...formData, dossierIds: [...formData.dossierIds, d.id] });
                        } else {
                          setFormData({ ...formData, dossierIds: formData.dossierIds.filter(id => id !== d.id) });
                        }
                      }}
                      className="w-3 h-3"
                    />
                    <span className="text-sm">{d.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creation...' : 'Creer l\'article'}
            </button>
            <Link
              href="/admin/articles"
              className="px-8 py-3 border border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Annuler
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <RequireAuth>
      <NewArticleForm />
    </RequireAuth>
  );
}

