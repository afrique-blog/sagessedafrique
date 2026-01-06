'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, RequireAuth } from '@/lib/auth';
import { api, CommentAdmin, PaginatedResponse } from '@/lib/api';

function CommentsAdminPage() {
  const { user, logout } = useAuth();
  const [comments, setComments] = useState<CommentAdmin[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const [commentsRes, statsRes] = await Promise.all([
        api.getCommentsAdmin({ 
          status: filter === 'all' ? undefined : filter, 
          page, 
          limit: 20 
        }),
        api.getCommentsStats(),
      ]);
      setComments(commentsRes.data);
      setTotalPages(commentsRes.pagination.totalPages);
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filter, page]);

  const handleStatusChange = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await api.updateCommentStatus(id, status);
      fetchComments();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    try {
      await api.deleteComment(id);
      fetchComments();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !confirm(`Supprimer ${selectedIds.length} commentaire(s) ?`)) return;
    
    setActionLoading(true);
    try {
      await api.bulkCommentAction(selectedIds, action);
      setSelectedIds([]);
      fetchComments();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === comments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(comments.map(c => c.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
      pending: '⏳ En attente',
      approved: '✅ Approuvé',
      rejected: '❌ Rejeté',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-primary dark:text-accent">Admin</Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-600 dark:text-slate-400">Commentaires</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">{user?.name}</span>
            <button onClick={logout} className="text-red-600 hover:text-red-700 text-sm font-medium">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">💬 Modération des Commentaires</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-slate-500">Total</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">En attente</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Approuvés</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
            <div className="text-sm text-red-700 dark:text-red-300">Rejetés</div>
          </div>
        </div>

        {/* Filters & Bulk Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1); setSelectedIds([]); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {f === 'all' ? 'Tous' : f === 'pending' ? '⏳ En attente' : f === 'approved' ? '✅ Approuvés' : '❌ Rejetés'}
                </button>
              ))}
            </div>
            
            {selectedIds.length > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedIds.length} sélectionné(s)
                </span>
                <button
                  onClick={() => handleBulkAction('approve')}
                  disabled={actionLoading}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  ✅ Approuver
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  disabled={actionLoading}
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                >
                  ❌ Rejeter
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={actionLoading}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  🗑️ Supprimer
                </button>
              </div>
            )}
          </div>

          {/* Comments Table */}
          {loading ? (
            <div className="p-8 text-center">Chargement...</div>
          ) : comments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <span className="text-4xl mb-4 block">💬</span>
              Aucun commentaire {filter !== 'all' && `${filter === 'pending' ? 'en attente' : filter === 'approved' ? 'approuvé' : 'rejeté'}`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === comments.length && comments.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Auteur</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Commentaire</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Article</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(comment.id)}
                          onChange={() => toggleSelect(comment.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{comment.authorName}</div>
                        <div className="text-xs text-slate-500">{comment.authorEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 max-w-md">
                          {comment.content}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Link 
                          href={`/article/${comment.article.slug}`}
                          target="_blank"
                          className="text-sm text-primary dark:text-accent hover:underline line-clamp-1 max-w-[200px]"
                        >
                          {comment.article.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {statusBadge(comment.status)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(comment.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {comment.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(comment.id, 'approved')}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                              title="Approuver"
                            >
                              ✅
                            </button>
                          )}
                          {comment.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(comment.id, 'rejected')}
                              className="p-1 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded"
                              title="Rejeter"
                            >
                              ❌
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-slate-300 dark:border-slate-600 disabled:opacity-50"
              >
                ←
              </button>
              <span className="px-3 py-1 text-sm">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-slate-300 dark:border-slate-600 disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Back Link */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent">
          ← Retour au tableau de bord
        </Link>
      </main>
    </div>
  );
}

export default function CommentsAdmin() {
  return (
    <RequireAuth>
      <CommentsAdminPage />
    </RequireAuth>
  );
}
