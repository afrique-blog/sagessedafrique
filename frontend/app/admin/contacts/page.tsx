'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, RequireAuth } from '@/lib/auth';
import { api } from '@/lib/api';

interface Contact {
  id: number;
  email: string;
  name: string | null;
  isSubscriber: boolean;
  subscribedAt: string | null;
  subscriptionSource: string | null;
  subscriptionStatus: string | null;
  commentsCount: number;
  createdAt: string;
}

interface ContactStats {
  totalContacts: number;
  subscribers: number;
  activeSubscribers: number;
  commenters: number;
}

function ContactsAdminPage() {
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'subscribers' | 'commenters'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const [contactsRes, statsRes] = await Promise.all([
        api.getContactsAdmin({ 
          filter: filter === 'all' ? undefined : filter, 
          page, 
          limit: 50 
        }),
        api.getContactsStats(),
      ]);
      setContacts(contactsRes.data);
      setTotalPages(contactsRes.pagination.totalPages);
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filter, page]);

  const handleExport = async () => {
    try {
      const csv = await api.exportContacts(filter === 'all' ? undefined : filter);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce contact ? Cela supprimera également tous ses commentaires.')) return;
    try {
      await api.deleteContact(id);
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleToggleSubscription = async (contact: Contact) => {
    try {
      await api.updateContact(contact.id, {
        isSubscriber: !contact.isSubscriber,
        subscriptionStatus: !contact.isSubscriber ? 'pending' : 'unsubscribed',
      });
      fetchContacts();
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredContacts = contacts.filter(c => 
    !searchTerm || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-primary dark:text-accent">Admin</Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-600 dark:text-slate-400">Contacts</span>
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
          <h1 className="text-3xl font-bold">📧 Gestion des Contacts</h1>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            📥 Exporter CSV
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalContacts}</div>
              <div className="text-sm text-slate-500">Total contacts</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.activeSubscribers}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Abonnés actifs</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.commenters}</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Commentateurs</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow-sm border-l-4 border-green-500">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.totalContacts > 0 ? Math.round((stats.activeSubscribers / stats.totalContacts) * 100) : 0}%
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Taux d'abonnement</div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'subscribers', 'commenters'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {f === 'all' ? '👥 Tous' : f === 'subscribers' ? '📧 Abonnés' : '💬 Commentateurs'}
                </button>
              ))}
            </div>
            
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Rechercher par email ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Contacts Table */}
          {loading ? (
            <div className="p-8 text-center">Chargement...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <span className="text-4xl mb-4 block">📧</span>
              Aucun contact trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Newsletter</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Source</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Commentaires</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Inscrit le</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                            {(contact.name || contact.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{contact.name || '-'}</div>
                            <div className="text-sm text-slate-500">{contact.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleSubscription(contact)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            contact.isSubscriber && contact.subscriptionStatus !== 'unsubscribed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {contact.isSubscriber && contact.subscriptionStatus !== 'unsubscribed' ? '✅ Abonné' : '➖ Non abonné'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {contact.subscriptionSource || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.commentsCount > 0 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          💬 {contact.commentsCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDelete(contact.id)}
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

export default function ContactsAdmin() {
  return (
    <RequireAuth>
      <ContactsAdminPage />
    </RequireAuth>
  );
}
