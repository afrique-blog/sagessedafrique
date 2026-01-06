'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/lib/auth';
import { api, Article } from '@/lib/api';
import AdminNav from '@/components/AdminNav';

function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, categories: 0, tags: 0, dossiers: 0, catPersonnalites: 0, personnalites: 0, pendingComments: 0 });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [articles, categories, tags, dossiers, catPers, personnalites, commentsStats] = await Promise.all([
          api.getArticles({ limit: 5 }),
          api.getCategories(),
          api.getTags(),
          api.getDossiers(),
          api.getCategoriesPersonnalites(),
          api.getPersonnalites(),
          api.getCommentsStats().catch(() => ({ pending: 0 })),
        ]);
        setStats({
          articles: articles.pagination.total,
          categories: categories.length,
          tags: tags.length,
          dossiers: dossiers.length,
          catPersonnalites: catPers.length,
          personnalites: personnalites.length,
          pendingComments: commentsStats.pending,
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
      <AdminNav />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Tableau de bord</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <Link href="/admin/articles" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-primary dark:text-accent">{stats.articles}</p>
            <p className="text-sm text-slate-500 mt-1">Articles</p>
          </Link>
          <Link href="/admin/categories" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-primary dark:text-accent">{stats.categories}</p>
            <p className="text-sm text-slate-500 mt-1">Catégories</p>
          </Link>
          <Link href="/admin/tags" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-primary dark:text-accent">{stats.tags}</p>
            <p className="text-sm text-slate-500 mt-1">Tags</p>
          </Link>
          <Link href="/admin/dossiers" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-primary dark:text-accent">{stats.dossiers}</p>
            <p className="text-sm text-slate-500 mt-1">Dossiers</p>
          </Link>
          <Link href="/admin/categories-personnalites" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-primary dark:text-accent">{stats.catPersonnalites}</p>
            <p className="text-sm text-slate-500 mt-1">Cat. Personnalités</p>
          </Link>
          <Link href="/admin/personnalites" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-primary dark:text-accent">{stats.personnalites}</p>
            <p className="text-sm text-slate-500 mt-1">Personnalités</p>
          </Link>
          <Link href="/admin/comments" className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${stats.pendingComments > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 ring-2 ring-yellow-400' : 'bg-white dark:bg-slate-800'}`}>
            <p className={`text-3xl font-bold ${stats.pendingComments > 0 ? 'text-yellow-600' : 'text-primary dark:text-accent'}`}>
              {stats.pendingComments > 0 ? `⏳ ${stats.pendingComments}` : '💬'}
            </p>
            <p className="text-sm text-slate-500 mt-1">Commentaires à modérer</p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/admin/articles/new" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
            + Nouvel article
          </Link>
          <Link href="/admin/categories/new" className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600">
            + Catégorie
          </Link>
          <Link href="/admin/tags/new" className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600">
            + Tag
          </Link>
          <Link href="/admin/personnalites/new" className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600">
            + Personnalité
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
