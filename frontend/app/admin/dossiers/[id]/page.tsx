'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, DossierAdmin } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

function EditDossierForm() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    heroImage: '',
    titleFr: '',
    descriptionFr: '',
    titleEn: '',
    descriptionEn: '',
  });

  useEffect(() => {
    api.getDossierAdmin(id)
      .then((dossier: DossierAdmin) => {
        const fr = dossier.translations.find(t => t.lang === 'fr');
        const en = dossier.translations.find(t => t.lang === 'en');
        setForm({
          slug: dossier.slug,
          heroImage: dossier.heroImage || '',
          titleFr: fr?.title || '',
          descriptionFr: fr?.description || '',
          titleEn: en?.title || '',
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
      await api.updateDossier(id, {
        slug: form.slug,
        heroImage: form.heroImage || undefined,
        translations: [
          { lang: 'fr', title: form.titleFr, description: form.descriptionFr },
          { lang: 'en', title: form.titleEn, description: form.descriptionEn },
        ],
      });
      router.push('/admin/dossiers');
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
          <Link href="/admin/dossiers" className="text-sm text-slate-500 hover:text-primary">← Retour aux dossiers</Link>
          <h1 className="text-3xl font-serif font-bold mt-2">Modifier le dossier</h1>
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
            <label className="block text-sm font-medium mb-2">Image de couverture (URL)</label>
            <input
              type="text"
              value={form.heroImage}
              onChange={e => setForm({ ...form, heroImage: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-4 text-primary">🇫🇷 Français</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  value={form.titleFr}
                  onChange={e => setForm({ ...form, titleFr: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.descriptionFr}
                  onChange={e => setForm({ ...form, descriptionFr: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-accent">🇬🇧 English</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={form.titleEn}
                  onChange={e => setForm({ ...form, titleEn: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.descriptionEn}
                  onChange={e => setForm({ ...form, descriptionEn: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  rows={3}
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
            <Link href="/admin/dossiers" className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg">
              Annuler
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function EditDossierPage() {
  return (
    <RequireAuth>
      <EditDossierForm />
    </RequireAuth>
  );
}

