'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, Article, Category, Dossier } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

export default function DossierPage() {
  const { slug } = useParams();
  const { lang } = useApp();
  const [dossier, setDossier] = useState<(Dossier & { articles: Article[] }) | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      try {
        const [dossierData, categoriesData] = await Promise.all([
          api.getDossier(slug as string, lang),
          api.getCategories(lang),
        ]);
        setDossier(dossierData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch dossier:', error);
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

  if (!dossier) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
            <p className="text-slate-500 mb-8">{lang === 'fr' ? 'Dossier non trouvé' : 'Dossier not found'}</p>
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
        <div className="relative h-[40vh] min-h-[300px]">
          {dossier.heroImage ? (
            <Image 
              src={dossier.heroImage} 
              alt={dossier.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-primary" />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <p className="text-accent text-sm uppercase tracking-widest mb-4">
                {lang === 'fr' ? 'Dossier Spécial' : 'Special Report'}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{dossier.title}</h1>
              <p className="text-white/80 max-w-2xl mx-auto">{dossier.description}</p>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 py-12">
          {dossier.articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dossier.articles.map((article: any) => (
                <ArticleCard 
                  key={article.id} 
                  article={{
                    ...article,
                    tags: [],
                    dossiers: [{ slug: dossier.slug, title: dossier.title }],
                  }} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">
              {lang === 'fr' ? 'Aucun article dans ce dossier.' : 'No articles in this dossier.'}
            </p>
          )}
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}


