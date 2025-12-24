'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, RequireAuth } from '@/lib/auth';
import { api, Article, Category } from '@/lib/api';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ articles: 0, categories: 0, tags: 0, dossiers: 0 });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [articles, categories, tags, dossiers] = await Promise.all([
          api.getArticles({ limit: 5 }),
          api.getCategories(),
          api.getTags(),
          api.getDossiers(),
        ]);
        setStats({
          articles: articles.pagination.total,
          categories: categories.length,
          tags: tags.length,
          dossiers: dossiers.length,
        });
        setRecentArticles(articles.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-serif font-bold text-primary dark:text-accent">
              Admin
            </Link>
            <nav className="hidden md:flex items-center gap-4 ml-8">
              <Link href="/admin/articles" className="text-sm hover:text-primary dark:hover:text-accent">
                Articles
              </Link>
              <Link href="/" className="text-sm text-slate-400 hover:text-primary dark:hover:text-accent">
                ← Voir le site
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Tableau de bord</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <p className="text-4xl font-bold text-primary dark:text-accent">{stats.articles}</p>
            <p className="text-sm text-slate-500 mt-1">Articles</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <p className="text-4xl font-bold text-primary dark:text-accent">{stats.categories}</p>
            <p className="text-sm text-slate-500 mt-1">Catégories</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <p className="text-4xl font-bold text-primary dark:text-accent">{stats.tags}</p>
            <p className="text-sm text-slate-500 mt-1">Tags</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <p className="text-4xl font-bold text-primary dark:text-accent">{stats.dossiers}</p>
            <p className="text-sm text-slate-500 mt-1">Dossiers</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/admin/articles/new"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            + Nouvel article
          </Link>
        </div>

        {/* Recent Articles */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold">Articles récents</h2>
              <Link href="/admin/articles" className="text-sm text-primary dark:text-accent hover:underline">
                Voir tous →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {recentArticles.map(article => (
              <div key={article.id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-slate-500">
                    {article.category?.name} • {article.views} vues
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {article.featured && (
                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">Featured</span>
                  )}
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            ))}
            {recentArticles.length === 0 && (
              <p className="p-6 text-center text-slate-500">Aucun article pour le moment</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth>
      <AdminDashboard />
    </RequireAuth>
  );
}


