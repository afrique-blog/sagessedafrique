'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { api, Article, Category } from '@/lib/api';
import { extractSections, getCountryName } from '@/lib/dossier-pays-utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DossierPaysHero from '@/components/DossierPaysHero';
import StickyTOC from '@/components/StickyTOC';
import SignupCTA from '@/components/SignupCTA';
import AIChatWidget from '@/components/AIChatWidget';

export default function DossierPaysPage() {
  const { slug } = useParams();
  const { lang } = useApp();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Failed to fetch article:', error);
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
          <div className="animate-pulse text-lg">
            {lang === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  if (!article || article.type !== 'dossier-pays') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              {lang === 'fr' ? 'Dossier non trouvé' : 'Report not found'}
            </p>
            <Link
              href="/"
              className="text-primary dark:text-accent hover:underline"
            >
              {lang === 'fr' ? "Retour à l'accueil" : 'Back to home'}
            </Link>
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  const sections = extractSections(article.contentHtml);
  const canReadFull = !article.restricted; // Backend handles restriction
  const contentToShow = article.contentHtml; // Backend already truncates if needed

  const countryName = getCountryName(article.countryCode, lang);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Header />

      {/* Hero Section */}
      <DossierPaysHero
        title={article.title}
        subtitle={article.excerpt || ''}
        image={article.heroImage}
        countryCode={article.countryCode}
      />

      {/* Main Content */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-12 px-4 py-12">
        {/* Sticky TOC - Hidden on mobile */}
        <aside className="hidden lg:block w-1/4">
          <StickyTOC sections={sections} readingTime={article.readingMinutes} />
        </aside>

        {/* Article Body */}
        <main className="w-full lg:w-3/4">
          {/* Mobile TOC - Collapsible */}
          <details className="lg:hidden mb-8 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
            <summary className="font-bold cursor-pointer text-gray-900 dark:text-white">
              📋 {lang === 'fr' ? 'Sommaire' : 'Table of Contents'}
            </summary>
            <ul className="mt-4 space-y-2 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`block text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 ${
                      section.level === 3 ? 'pl-4 text-xs' : ''
                    }`}
                  >
                    {section.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          {/* Article Content */}
          <article
            className="prose prose-lg dark:prose-invert max-w-none 
                       prose-headings:font-serif prose-headings:font-bold
                       prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b-2 prose-h2:border-yellow-400 prose-h2:pb-3 prose-h2:inline-block
                       prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                       prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-relaxed
                       prose-a:text-yellow-600 dark:prose-a:text-yellow-500 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-gray-900 dark:prose-strong:text-white
                       prose-blockquote:border-l-4 prose-blockquote:border-yellow-600 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                       prose-img:rounded-lg prose-img:shadow-lg
                       prose-ul:list-disc prose-ul:pl-6
                       prose-ol:list-decimal prose-ol:pl-6"
            dangerouslySetInnerHTML={{ __html: contentToShow }}
          />

          {/* CTA Inscription si contenu restreint */}
          {article.restricted && <SignupCTA countryCode={article.countryCode} />}

          {/* Author & Date Info */}
          {canReadFull && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {article.author.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(article.publishedAt).toLocaleDateString(
                      lang === 'fr' ? 'fr-FR' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {article.views.toLocaleString()} {lang === 'fr' ? 'vues' : 'views'}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AI Chat Widget - Available to all users */}
      <AIChatWidget articleId={article.id} countryName={countryName} />

      <Footer categories={categories} />
    </div>
  );
}
