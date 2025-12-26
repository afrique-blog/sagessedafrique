'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, Article, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

interface Author {
  id: number;
  name: string;
  avatar: string | null;
  bio: string | null;
  articles: Article[];
}

export default function AuthorPage() {
  const { id } = useParams();
  const { lang } = useApp();
  const [author, setAuthor] = useState<Author | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, articlesData] = await Promise.all([
          api.getCategories(lang),
          api.getArticles({ lang, limit: 100 }),
        ]);
        setCategories(categoriesData);

        // Filter articles by author ID
        const authorId = parseInt(id as string);
        const authorArticles = articlesData.data.filter(a => a.author.id === authorId);
        
        if (authorArticles.length > 0) {
          const firstArticle = authorArticles[0];
          setAuthor({
            id: firstArticle.author.id,
            name: firstArticle.author.name,
            avatar: firstArticle.author.avatar,
            bio: firstArticle.author.bio,
            articles: authorArticles,
          });
        }
      } catch (error) {
        console.error('Failed to fetch author data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-pulse text-lg">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{lang === 'fr' ? 'Auteur non trouvé' : 'Author not found'}</h1>
            <Link href="/" className="text-primary dark:text-accent hover:underline">
              {lang === 'fr' ? "Retour à l'accueil" : 'Back to home'}
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
        <section className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
              {/* Avatar */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-accent shadow-2xl flex-shrink-0">
                {author.avatar ? (
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-4xl font-bold">
                    {author.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="text-center md:text-left">
                <span className="text-accent text-sm font-bold uppercase tracking-widest mb-2 block">
                  {lang === 'fr' ? 'Auteur' : 'Author'}
                </span>
                <h1 className="text-4xl font-serif font-bold mb-4">{author.name}</h1>
                <p className="text-white/80 text-lg max-w-xl">
                  {author.bio || (lang === 'fr' 
                    ? 'Historien et passeur de savoirs africains'
                    : 'Historian and transmitter of African knowledge')}
                </p>
                <div className="mt-6 flex items-center gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-white/70">
                    <span className="text-accent text-xl">📝</span>
                    <span>{author.articles.length} {lang === 'fr' ? 'articles' : 'articles'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-serif font-bold mb-8 border-b pb-4">
            {lang === 'fr' ? `Articles de ${author.name}` : `Articles by ${author.name}`}
          </h2>
          
          {author.articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {author.articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-12">
              {lang === 'fr' ? 'Aucun article publié pour le moment.' : 'No articles published yet.'}
            </p>
          )}
        </section>

        {/* CTA */}
        <section className="bg-slate-100 dark:bg-slate-900/50 py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h3 className="text-2xl font-serif font-bold mb-4">
              {lang === 'fr' ? 'Explorez plus de contenu' : 'Explore more content'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {lang === 'fr'
                ? "Découvrez tous nos articles sur l'histoire et la sagesse africaines."
                : 'Discover all our articles on African history and wisdom.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/categories"
                className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                {lang === 'fr' ? 'Voir les catégories' : 'View categories'}
              </Link>
              <Link
                href="/personnalites"
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors"
              >
                {lang === 'fr' ? 'Personnalités africaines' : 'African personalities'}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

