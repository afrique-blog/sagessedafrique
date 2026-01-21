'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

export default function NewWeeklyEditionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Données de l'édition
  const [weekNumber, setWeekNumber] = useState(getCurrentWeekNumber());
  const [year, setYear] = useState(new Date().getFullYear());
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!contentHtml.trim()) {
      alert('Collez le HTML généré par le GPT');
      return;
    }

    setLoading(true);
    try {
      await api.createWeeklyEdition({
        weekNumber,
        year,
        title: title || `Une semaine en Afrique – n°${weekNumber}`,
        contentHtml,
      });
      
      router.push('/admin/semaine-en-afrique');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/semaine-en-afrique" className="text-gray-500 hover:text-gray-700">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle édition hebdomadaire</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">📅 Informations</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de semaine</label>
                <select
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {Array.from({ length: 52 }, (_, i) => i + 1).map(w => (
                    <option key={w} value={w}>Semaine {w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre (optionnel)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Une semaine en Afrique – n°${weekNumber}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Contenu HTML */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">📰 Contenu HTML (GPT)</h2>
              <span className="text-sm text-gray-500">Collez le HTML généré par votre GPT</span>
            </div>
            
            <textarea
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              rows={20}
              placeholder="<article class='weekly-africa weekly-africa-fr...'>
  ...
</article>"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              required
            />
            
            <p className="text-sm text-gray-500 mt-2">
              💡 Le HTML doit contenir les versions FR et EN générées par le GPT
            </p>
          </div>

          {/* Aperçu */}
          {contentHtml && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">👁️ Aperçu</h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/admin/semaine-en-afrique"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 flex-1"
            >
              {loading ? 'Création...' : 'Créer l\'édition (brouillon)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper
function getCurrentWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}
