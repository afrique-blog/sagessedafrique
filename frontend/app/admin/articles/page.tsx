'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, Article } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

// Helper pour déterminer le statut de publication
function getPublishStatus(publishedAt: string | null | undefined): { status: 'draft' | 'scheduled' | 'published'; label: string; color: string; icon: string } {
  if (!publishedAt) {
    return { status: 'draft', label: 'Brouillon', color: 'orange', icon: '🔶' };
  }
  const pubDate = new Date(publishedAt);
  const now = new Date();
  if (pubDate > now) {
    return { status: 'scheduled', label: `${pubDate.toLocaleDateString('fr-FR')}`, color: 'blue', icon: '🕐' };
  }
  return { status: 'published', label: 'Publié', color: 'green', icon: '✅' };
}

function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  async function fetchArticles() {
    setLoading(true);
    try {
      // Inclure les non-publiés pour voir les brouillons
      const response = await api.getArticles({ page, limit: 20, includeUnpublished: true });
      setArticles(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
      await api.deleteArticle(id);
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Erreur lors de la suppression');
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminNav />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">Articles</h1>
          <Link
            href="/admin/articles/new"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            + Nouvel article
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider">Titre</th>
                    <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider">Catégorie</th>
                    <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider">Vues</th>
                    <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider">Statut</th>
                    <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {articles.map(article => {
                    const pubStatus = getPublishStatus(article.publishedAt);
                    return (
                    <tr key={article.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${pubStatus.status === 'draft' ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-slate-500">{article.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{article.category?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm">{article.views}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit
                            ${pubStatus.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                            ${pubStatus.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                            ${pubStatus.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                          `}>
                            <span>{pubStatus.icon}</span>
                            {pubStatus.label}
                          </span>
                          {article.featured && (
                            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded w-fit">⭐ À la une</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/article/${article.slug}?preview=true`}
                            target="_blank"
                            className="px-3 py-1 text-sm text-slate-500 hover:text-primary dark:hover:text-accent"
                          >
                            Voir
                          </Link>
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="px-3 py-1 text-red-500 text-sm hover:text-red-600"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="px-4">
                  Page {page} sur {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminArticlesPage() {
  return (
    <RequireAuth>
      <ArticlesList />
    </RequireAuth>
  );
}
