'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import AdminNav from '@/components/AdminNav';
import ImageUpload from '@/components/ImageUpload';

// Liste des codes pays africains
const AFRICAN_COUNTRIES = [
  { code: 'DZ', name: 'Algérie' },
  { code: 'AO', name: 'Angola' },
  { code: 'BJ', name: 'Bénin' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cap-Vert' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'CF', name: 'Centrafrique' },
  { code: 'TD', name: 'Tchad' },
  { code: 'KM', name: 'Comores' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'RD Congo' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'EG', name: 'Égypte' },
  { code: 'GQ', name: 'Guinée équatoriale' },
  { code: 'ER', name: 'Érythrée' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Éthiopie' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambie' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GN', name: 'Guinée' },
  { code: 'GW', name: 'Guinée-Bissau' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libye' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'ML', name: 'Mali' },
  { code: 'MR', name: 'Mauritanie' },
  { code: 'MU', name: 'Maurice' },
  { code: 'MA', name: 'Maroc' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibie' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ST', name: 'São Tomé-et-Príncipe' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SO', name: 'Somalie' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'SS', name: 'Soudan du Sud' },
  { code: 'SD', name: 'Soudan' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'TG', name: 'Togo' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'UG', name: 'Ouganda' },
  { code: 'ZM', name: 'Zambie' },
  { code: 'ZW', name: 'Zimbabwe' },
].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

function getCountryEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function NewDossierPaysForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    slug: '',
    countryCode: 'SN',
    heroImage: '',
    featured: false,
    titleFr: '',
    subtitleFr: '',
    metaTitleFr: '',
    metaDescriptionFr: '',
    titleEn: '',
    subtitleEn: '',
    metaTitleEn: '',
    metaDescriptionEn: '',
  });

  // Auto-générer le slug à partir du titre
  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      titleFr: title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.createPaysDossier({
        slug: formData.slug,
        countryCode: formData.countryCode,
        heroImage: formData.heroImage || undefined,
        featured: formData.featured,
        titleFr: formData.titleFr,
        subtitleFr: formData.subtitleFr || undefined,
        metaTitleFr: formData.metaTitleFr || undefined,
        metaDescriptionFr: formData.metaDescriptionFr || undefined,
        titleEn: formData.titleEn || undefined,
        subtitleEn: formData.subtitleEn || undefined,
        metaTitleEn: formData.metaTitleEn || undefined,
        metaDescriptionEn: formData.metaDescriptionEn || undefined,
      });

      router.push(`/admin/dossiers-pays/${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = AFRICAN_COUNTRIES.find(c => c.code === formData.countryCode);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/dossiers-pays"
            className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-2"
          >
            ← Retour à la liste
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
            Nouveau Dossier Pays
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Informations de base
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pays */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Pays *
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getCountryEmoji(formData.countryCode)}</span>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    required
                  >
                    {AFRICAN_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="senegal"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  URL: /dossier-pays/{formData.slug || 'slug'}
                </p>
              </div>
            </div>

            {/* Featured */}
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Mettre en avant (featured)
                </span>
              </label>
            </div>
          </div>

          {/* Image Hero */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Image Hero
            </h2>
            <ImageUpload
              value={formData.heroImage}
              onChange={(url) => setFormData({ ...formData, heroImage: url })}
              folder="pays"
            />
          </div>

          {/* Contenu FR */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              🇫🇷 Contenu Français
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.titleFr}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Sénégal : Terre de Téranga"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sous-titre
                </label>
                <textarea
                  value={formData.subtitleFr}
                  onChange={(e) => setFormData({ ...formData, subtitleFr: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  rows={2}
                  placeholder="Du fleuve au désert, un pays qui cultive l'hospitalité comme un art de vivre."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Meta Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitleFr}
                    onChange={(e) => setFormData({ ...formData, metaTitleFr: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                    placeholder="Sénégal : Dossier Pays | Sagesses d'Afrique"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Meta Description (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.metaDescriptionFr}
                    onChange={(e) => setFormData({ ...formData, metaDescriptionFr: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                    placeholder="Découvrez le Sénégal en profondeur..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contenu EN (optionnel) */}
          <details className="bg-white dark:bg-slate-800 rounded-lg shadow">
            <summary className="p-6 cursor-pointer text-lg font-semibold text-slate-900 dark:text-white">
              🇬🇧 Contenu Anglais (optionnel)
            </summary>
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Senegal: Land of Téranga"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={formData.subtitleEn}
                  onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  rows={2}
                />
              </div>
            </div>
          </details>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/dossiers-pays"
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer le dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewDossierPaysPage() {
  return (
    <RequireAuth>
      <NewDossierPaysForm />
    </RequireAuth>
  );
}
