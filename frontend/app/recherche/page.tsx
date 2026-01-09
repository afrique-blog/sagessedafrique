'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { api, Article, Category, Tag, Dossier } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Skeleton, ArticleCardSkeleton } from '@/components/Skeleton';

const translations = {
  fr: {
    title: 'Recherche avancée',
    subtitle: 'Trouvez les articles qui vous intéressent',
    searchPlaceholder: 'Rechercher par mot-clé...',
    filters: 'Filtres',
    category: 'Catégorie',
    tag: 'Tag',
    dossier: 'Dossier',
    dateFrom: 'Du',
    dateTo: 'Au',
    sortBy: 'Trier par',
    sortDate: 'Date',
    sortViews: 'Popularité',
    sortTitle: 'Titre',
    sortOrder: 'Ordre',
    sortDesc: 'Décroissant',
    sortAsc: 'Croissant',
    allCategories: 'Toutes les catégories',
    allTags: 'Tous les tags',
    allDossiers: 'Tous les dossiers',
    search: 'Rechercher',
    reset: 'Réinitialiser',
    results: 'résultats',
    result: 'résultat',
    noResults: 'Aucun résultat trouvé',
    noResultsDesc: 'Essayez de modifier vos critères de recherche',
    loading: 'Chargement...',
    showFilters: 'Afficher les filtres',
    hideFilters: 'Masquer les filtres',
  },
  en: {
    title: 'Advanced Search',
    subtitle: 'Find the articles that interest you',
    searchPlaceholder: 'Search by keyword...',
    filters: 'Filters',
    category: 'Category',
    tag: 'Tag',
    dossier: 'Dossier',
    dateFrom: 'From',
    dateTo: 'To',
    sortBy: 'Sort by',
    sortDate: 'Date',
    sortViews: 'Popularity',
    sortTitle: 'Title',
    sortOrder: 'Order',
    sortDesc: 'Descending',
    sortAsc: 'Ascending',
    allCategories: 'All categories',
    allTags: 'All tags',
    allDossiers: 'All dossiers',
    search: 'Search',
    reset: 'Reset',
    results: 'results',
    result: 'result',
    noResults: 'No results found',
    noResultsDesc: 'Try modifying your search criteria',
    loading: 'Loading...',
    showFilters: 'Show filters',
    hideFilters: 'Hide filters',
  },
};

function SearchContent() {
  const { lang } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = translations[lang];

  // Filter states
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || '');
  const [dossier, setDossier] = useState(searchParams.get('dossier') || '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('from') || '');
  const [dateTo, setDateTo] = useState(searchParams.get('to') || '');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>(
    (searchParams.get('sort') as any) || 'date'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('order') as any) || 'desc'
  );

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Load filter options
  useEffect(() => {
    async function loadFilters() {
      try {
        const [cats, tgs, doss] = await Promise.all([
          api.getCategories(lang),
          api.getTags(lang),
          api.getDossiers(lang),
        ]);
        setCategories(cats);
        setTags(tgs);
        setDossiers(doss);
      } catch (error) {
        console.error('Failed to load filters:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFilters();
  }, [lang]);

  // Search function
  const performSearch = useCallback(async () => {
    setSearching(true);
    try {
      const params: any = {
        lang,
        limit: 12,
        page,
      };

      if (search) params.search = search;
      if (category) params.category = category;
      if (tag) params.tag = tag;
      if (dossier) params.dossier = dossier;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      const result = await api.getArticles(params);
      setArticles(result.data);
      setTotal(result.pagination.total);

      // Update URL
      const urlParams = new URLSearchParams();
      if (search) urlParams.set('q', search);
      if (category) urlParams.set('category', category);
      if (tag) urlParams.set('tag', tag);
      if (dossier) urlParams.set('dossier', dossier);
      if (dateFrom) urlParams.set('from', dateFrom);
      if (dateTo) urlParams.set('to', dateTo);
      if (sortBy !== 'date') urlParams.set('sort', sortBy);
      if (sortOrder !== 'desc') urlParams.set('order', sortOrder);

      const newUrl = urlParams.toString() ? `/recherche?${urlParams.toString()}` : '/recherche';
      window.history.replaceState(null, '', newUrl);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  }, [lang, search, category, tag, dossier, dateFrom, dateTo, sortBy, sortOrder, page]);

  // Auto-search on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [performSearch]);

  // Reset filters
  const handleReset = () => {
    setSearch('');
    setCategory('');
    setTag('');
    setDossier('');
    setDateFrom('');
    setDateTo('');
    setSortBy('date');
    setSortOrder('desc');
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-primary via-primary to-slate-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="w-64 h-12 mx-auto mb-4 bg-white/20" />
              <Skeleton className="w-96 h-6 mx-auto bg-white/20" />
            </div>
          </section>
          <section className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </main>
        <Footer categories={[]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-slate-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              🔍 {t.title}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {t.title}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              {t.subtitle}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {t.filters}
                  </h2>
                  <button
                    onClick={handleReset}
                    className="text-sm text-primary dark:text-accent hover:underline"
                  >
                    {t.reset}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      🔎 {t.search}
                    </label>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      📁 {t.category}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                    >
                      <option value="">{t.allCategories}</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tag */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      🏷️ {t.tag}
                    </label>
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                    >
                      <option value="">{t.allTags}</option>
                      {tags.map((tg) => (
                        <option key={tg.slug} value={tg.slug}>
                          {tg.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dossier */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      📚 {t.dossier}
                    </label>
                    <select
                      value={dossier}
                      onChange={(e) => setDossier(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                    >
                      <option value="">{t.allDossiers}</option>
                      {dossiers.map((dos) => (
                        <option key={dos.slug} value={dos.slug}>
                          {dos.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        📅 {t.dateFrom}
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        📅 {t.dateTo}
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        ↕️ {t.sortBy}
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent text-sm"
                      >
                        <option value="date">{t.sortDate}</option>
                        <option value="views">{t.sortViews}</option>
                        <option value="title">{t.sortTitle}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        🔄 {t.sortOrder}
                      </label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent text-sm"
                      >
                        <option value="desc">{t.sortDesc}</option>
                        <option value="asc">{t.sortAsc}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:w-3/4">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow text-slate-700 dark:text-slate-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilters ? t.hideFilters : t.showFilters}
              </button>

              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">{total}</span>{' '}
                  {total === 1 ? t.result : t.results}
                </p>
                {searching && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    {t.loading}
                  </div>
                )}
              </div>

              {/* Results grid */}
              {articles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {t.noResults}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {t.noResultsDesc}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === p
                          ? 'bg-primary text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

export default function RecherchePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
