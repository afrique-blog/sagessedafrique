'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, PaysDossierAdmin } from '@/lib/api';
import AdminNav from '@/components/AdminNav';
import ImageUpload from '@/components/ImageUpload';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />,
});

interface Chapitre {
  id?: number;
  slug: string;
  ordre: number;
  title: string;
  readingMinutes: number;
  contentHtml: string;
  isNew?: boolean;
  isEditing?: boolean;
}

function getCountryEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function EditDossierPaysForm() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'chapitres'>('info');

  // Dossier data
  const [dossier, setDossier] = useState<PaysDossierAdmin | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    countryCode: '',
    heroImage: '',
    featured: false,
    publishedAt: '',
    titleFr: '',
    subtitleFr: '',
    metaTitleFr: '',
    metaDescriptionFr: '',
  });

  // Chapitres
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [editingChapitre, setEditingChapitre] = useState<Chapitre | null>(null);

  useEffect(() => {
    fetchDossier();
  }, [id]);

  async function fetchDossier() {
    setLoading(true);
    try {
      // Fetch dossier list to get slug
      const list = await api.getPaysListAdmin('fr');
      const found = list.find((d) => d.id === parseInt(id as string));
      if (!found) {
        setError('Dossier non trouvé');
        return;
      }
      setDossier(found);

      // Fetch full dossier details
      const detail = await api.getPaysDossier(found.slug, 'fr');

      setFormData({
        slug: found.slug,
        countryCode: found.countryCode,
        heroImage: found.heroImage || '',
        featured: found.featured,
        publishedAt: found.publishedAt ? new Date(found.publishedAt).toISOString().slice(0, 16) : '',
        titleFr: detail.title,
        subtitleFr: detail.subtitle,
        metaTitleFr: detail.metaTitle,
        metaDescriptionFr: detail.metaDescription,
      });

      // Fetch chapitres with content
      const chapitresWithContent = await Promise.all(
        detail.chapitres.map(async (c) => {
          const chapDetail = await api.getPaysChapitre(found.slug, c.slug, 'fr');
          return {
            id: c.id,
            slug: c.slug,
            ordre: c.ordre,
            title: c.title,
            readingMinutes: c.readingMinutes,
            contentHtml: chapDetail.chapitre.contentHtml,
          };
        })
      );

      setChapitres(chapitresWithContent.sort((a, b) => a.ordre - b.ordre));
    } catch (err: any) {
      console.error('Failed to fetch dossier:', err);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDossier(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.updatePaysDossier(parseInt(id as string), {
        slug: formData.slug,
        countryCode: formData.countryCode,
        heroImage: formData.heroImage || undefined,
        featured: formData.featured,
        publishedAt: formData.publishedAt || null,
        titleFr: formData.titleFr,
        subtitleFr: formData.subtitleFr,
        metaTitleFr: formData.metaTitleFr,
        metaDescriptionFr: formData.metaDescriptionFr,
      });

      setSuccess('Dossier sauvegardé !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setSaving(true);
    try {
      await api.updatePaysDossier(parseInt(id as string), {
        publishedAt: new Date().toISOString(),
      });
      setFormData({ ...formData, publishedAt: new Date().toISOString() });
      setSuccess('Dossier publié !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la publication');
    } finally {
      setSaving(false);
    }
  }

  async function handleUnpublish() {
    setSaving(true);
    try {
      await api.updatePaysDossier(parseInt(id as string), {
        publishedAt: null,
      });
      setFormData({ ...formData, publishedAt: '' });
      setSuccess('Dossier dépublié');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  function addNewChapitre() {
    const newOrdre = chapitres.length;
    setEditingChapitre({
      slug: '',
      ordre: newOrdre,
      title: '',
      readingMinutes: 5,
      contentHtml: '',
      isNew: true,
    });
  }

  async function saveChapitre() {
    if (!editingChapitre) return;

    setSaving(true);
    setError('');

    try {
      if (editingChapitre.isNew) {
        await api.createPaysChapitre(parseInt(id as string), {
          slug: editingChapitre.slug,
          ordre: editingChapitre.ordre,
          readingMinutes: editingChapitre.readingMinutes,
          titleFr: editingChapitre.title,
          contentHtmlFr: editingChapitre.contentHtml,
        });
      } else if (editingChapitre.id) {
        await api.updatePaysChapitre(editingChapitre.id, {
          slug: editingChapitre.slug,
          ordre: editingChapitre.ordre,
          readingMinutes: editingChapitre.readingMinutes,
          titleFr: editingChapitre.title,
          contentHtmlFr: editingChapitre.contentHtml,
        });
      }

      setEditingChapitre(null);
      fetchDossier(); // Recharger
      setSuccess('Chapitre sauvegardé !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde du chapitre');
    } finally {
      setSaving(false);
    }
  }

  async function deleteChapitre(chapitreId: number) {
    if (!confirm('Supprimer ce chapitre ?')) return;

    try {
      await api.deletePaysChapitre(chapitreId);
      fetchDossier();
      setSuccess('Chapitre supprimé');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <AdminNav />
        <div className="p-8 text-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <AdminNav />
        <div className="p-8 text-center">
          <p className="text-red-500">{error || 'Dossier non trouvé'}</p>
          <Link href="/admin/dossiers-pays" className="text-amber-600 mt-4 block">
            ← Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const isPublished = !!formData.publishedAt && new Date(formData.publishedAt) <= new Date();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />

      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/dossiers-pays"
            className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-2"
          >
            ← Retour à la liste
          </Link>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getCountryEmoji(formData.countryCode)}</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formData.titleFr || 'Nouveau Dossier'}
                </h1>
                <p className="text-sm text-slate-500">
                  {chapitres.length} chapitre{chapitres.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/dossier-pays/${formData.slug}`}
                target="_blank"
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm"
              >
                👁️ Voir
              </Link>
              {isPublished ? (
                <button
                  onClick={handleUnpublish}
                  disabled={saving}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200"
                >
                  Dépublier
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Publier
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('chapitres')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'chapitres'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Chapitres ({chapitres.length})
          </button>
        </div>

        {/* Tab: Informations */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveDossier} className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date de publication
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Mettre en avant</span>
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
              <h3 className="font-semibold mb-4">Image Hero</h3>
              <ImageUpload
                value={formData.heroImage}
                onChange={(url) => setFormData({ ...formData, heroImage: url })}
                folder="pays"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow space-y-4">
              <h3 className="font-semibold mb-4">Contenu</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.titleFr}
                  onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sous-titre</label>
                <textarea
                  value={formData.subtitleFr}
                  onChange={(e) => setFormData({ ...formData, subtitleFr: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitleFr}
                    onChange={(e) => setFormData({ ...formData, metaTitleFr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Description</label>
                  <input
                    type="text"
                    value={formData.metaDescriptionFr}
                    onChange={(e) => setFormData({ ...formData, metaDescriptionFr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        )}

        {/* Tab: Chapitres */}
        {activeTab === 'chapitres' && (
          <div className="space-y-6">
            {/* Editing Chapitre Modal */}
            {editingChapitre && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
                  <div className="sticky top-0 bg-white dark:bg-slate-800 border-b p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold">
                      {editingChapitre.isNew ? 'Nouveau Chapitre' : 'Modifier le Chapitre'}
                    </h3>
                    <button onClick={() => setEditingChapitre(null)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ordre</label>
                        <input
                          type="number"
                          value={editingChapitre.ordre}
                          onChange={(e) =>
                            setEditingChapitre({ ...editingChapitre, ordre: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                          min={0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Slug</label>
                        <input
                          type="text"
                          value={editingChapitre.slug}
                          onChange={(e) => setEditingChapitre({ ...editingChapitre, slug: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="introduction"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Temps lecture (min)</label>
                        <input
                          type="number"
                          value={editingChapitre.readingMinutes}
                          onChange={(e) =>
                            setEditingChapitre({ ...editingChapitre, readingMinutes: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                          min={1}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Titre</label>
                      <input
                        type="text"
                        value={editingChapitre.title}
                        onChange={(e) => setEditingChapitre({ ...editingChapitre, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="I. Géographie : Le Toit de l'Afrique"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Contenu HTML</label>
                      <RichTextEditor
                        value={editingChapitre.contentHtml}
                        onChange={(value) => setEditingChapitre({ ...editingChapitre, contentHtml: value })}
                      />
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-700 border-t p-4 flex justify-end gap-3">
                    <button
                      onClick={() => setEditingChapitre(null)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveChapitre}
                      disabled={saving}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chapitres List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Chapitres</h3>
                <button
                  onClick={addNewChapitre}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                >
                  + Ajouter un chapitre
                </button>
              </div>

              {chapitres.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  Aucun chapitre. Commencez par en créer un !
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {chapitres.map((chapitre) => (
                    <div
                      key={chapitre.id || chapitre.slug}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-800 dark:text-amber-400 font-bold">
                          {chapitre.ordre}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {chapitre.title || '(Sans titre)'}
                          </h4>
                          <p className="text-xs text-slate-500">
                            /{formData.slug}/{chapitre.slug} • {chapitre.readingMinutes} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingChapitre({ ...chapitre, isNew: false })}
                          className="p-2 text-slate-400 hover:text-amber-600"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => chapitre.id && deleteChapitre(chapitre.id)}
                          className="p-2 text-slate-400 hover:text-red-600"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">💡 Conseils HTML</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Premier paragraphe : <code className="bg-amber-100 px-1 rounded">&lt;p class="drop-cap"&gt;</code></li>
                <li>• Sous-titres : <code className="bg-amber-100 px-1 rounded">&lt;h3&gt;1) Titre&lt;/h3&gt;</code></li>
                <li>• Citation : <code className="bg-amber-100 px-1 rounded">&lt;blockquote class="quote-box"&gt;</code></li>
                <li>• Encadré jaune : <code className="bg-amber-100 px-1 rounded">&lt;div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6 rounded"&gt;</code></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditDossierPaysPage() {
  return (
    <RequireAuth>
      <EditDossierPaysForm />
    </RequireAuth>
  );
}
