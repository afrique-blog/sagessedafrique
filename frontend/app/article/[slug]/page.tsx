'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { t } from '@/lib/i18n';
import { api, Article, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

export default function ArticlePage() {
  const { slug } = useParams();
  const { lang } = useApp();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      try {
        const [articleData, categoriesData] = await Promise.all([
          api.getArticle(slug as string, lang),
          api.getCategories(lang),
        ]);
        setArticle(articleData);
        setCategories(categoriesData);

        // Fetch related articles from same category
        if (articleData.category) {
          const related = await api.getArticles({ 
            lang, 
            category: articleData.category.slug, 
            limit: 3 
          });
          setRelatedArticles(related.data.filter(a => a.slug !== slug));
        }
      } catch (err) {
        setError('Article not found');
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

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
            <p className="text-slate-500 mb-8">{lang === 'fr' ? 'Article non trouvé' : 'Article not found'}</p>
            <Link href="/" className="text-primary dark:text-accent hover:underline">
              {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[400px]">
          {article.heroImage ? (
            <Image 
              src={article.heroImage} 
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-4xl">
              {article.category && (
                <Link 
                  href={`/category/${article.category.slug}`}
                  className="inline-block px-3 py-1 rounded-full bg-accent text-slate-900 text-xs font-bold uppercase tracking-wider mb-4"
                >
                  {article.category.name}
                </Link>
              )}
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {article.title}
              </h1>
              <div className="flex items-center gap-6 text-white/80 text-sm">
                <span>{article.author.name}</span>
                <span>•</span>
                <span>{article.publishedAt && formatDate(article.publishedAt)}</span>
                <span>•</span>
                <span>{article.readingMinutes} {t('readingTime', lang)}</span>
                <span>•</span>
                <span>{article.views} {t('views', lang)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="container mx-auto max-w-4xl px-4 py-12">
          {/* Takeaway */}
          {article.takeaway && (
            <div className="bg-accent/10 border-l-4 border-accent p-6 mb-8 rounded-r-lg">
              <h3 className="font-bold text-sm uppercase tracking-wider text-accent mb-2">{t('keyTakeaway', lang)}</h3>
              <p className="text-lg">{article.takeaway}</p>
            </div>
          )}

          {/* Main content */}
          <div 
            className="article-content prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link 
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:text-slate-900 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author */}
          <div className="mt-12 p-8 bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
            {article.author.avatar ? (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold">
                {article.author.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
            )}
            <div className="text-center md:text-left">
              <h4 className="font-serif font-bold text-xl mb-2">{article.author.name}</h4>
              <p className="text-slate-500 dark:text-slate-400">
                {article.author.bio || (lang === 'fr' 
                  ? 'Historien et passeur de savoirs africains'
                  : 'Historian and transmitter of African knowledge')}
              </p>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-serif font-bold mb-8">{t('relatedArticles', lang)}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedArticles.slice(0, 3).map(a => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer categories={categories} />
    </div>
  );
}


