'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { api, Article, Category, Tag } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

export default function TagPage() {
  const { slug } = useParams();
  const { lang } = useApp();
  const [tag, setTag] = useState<(Tag & { articles: Article[] }) | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      try {
        const [tagData, categoriesData] = await Promise.all([
          api.getTag(slug as string, lang),
          api.getCategories(lang),
        ]);
        setTag(tagData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch tag:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-lg">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
            <p className="text-slate-500 mb-8">{lang === 'fr' ? 'Tag non trouvé' : 'Tag not found'}</p>
            <Link href="/" className="text-primary dark:text-accent hover:underline">
              {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-slate-100 dark:bg-slate-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary dark:text-accent text-sm uppercase tracking-widest mb-4">Tag</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">#{tag.name}</h1>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 py-12">
          {tag.articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tag.articles.map((article: any) => (
                <ArticleCard 
                  key={article.id} 
                  article={{
                    ...article,
                    tags: [{ slug: tag.slug, name: tag.name }],
                    dossiers: [],
                  }} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">
              {lang === 'fr' ? 'Aucun article avec ce tag.' : 'No articles with this tag.'}
            </p>
          )}
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

