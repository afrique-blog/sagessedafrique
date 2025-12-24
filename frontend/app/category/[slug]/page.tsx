'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { api, Article, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const { lang } = useApp();
  const [category, setCategory] = useState<(Category & { articles: Article[] }) | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      try {
        const [categoryData, categoriesData] = await Promise.all([
          api.getCategory(slug as string, lang),
          api.getCategories(lang),
        ]);
        setCategory(categoryData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-lg">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
            <p className="text-slate-500 mb-8">{lang === 'fr' ? 'Catégorie non trouvée' : 'Category not found'}</p>
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
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent text-sm uppercase tracking-widest mb-4">
              {lang === 'fr' ? 'Catégorie' : 'Category'}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{category.name}</h1>
            <p className="text-white/80 max-w-2xl mx-auto">{category.description}</p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 py-12">
          {category.articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.articles.map((article: any) => (
                <ArticleCard 
                  key={article.id} 
                  article={{
                    ...article,
                    category: { slug: category.slug, name: category.name },
                    tags: [],
                    dossiers: [],
                  }} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">
              {lang === 'fr' ? 'Aucun article dans cette catégorie.' : 'No articles in this category.'}
            </p>
          )}
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}


