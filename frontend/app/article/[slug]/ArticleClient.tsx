'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { t } from '@/lib/i18n';
import { api, Article, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import Comments from '@/components/Comments';

interface ArticleClientProps {
  initialArticle: Article;
  slug: string;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Extract headings from HTML content for Table of Contents
function extractHeadings(html: string): TOCItem[] {
  const headings: TOCItem[] = [];
  // Match h2 and h3 tags
  const regex = /<h([23])[^>]*>([^<]+)<\/h[23]>/gi;
  let match;
  let index = 0;
  
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/&[^;]+;/g, '').trim(); // Remove HTML entities
    const id = `heading-${index}`;
    headings.push({ id, text, level });
    index++;
  }
  
  return headings;
}

// Add IDs to headings in HTML content
function addHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h([23])([^>]*)>([^<]+)<\/h([23])>/gi, (match, level, attrs, text, closeLevel) => {
    const id = `heading-${index}`;
    index++;
    return `<h${level}${attrs} id="${id}">${text}</h${closeLevel}>`;
  });
}

export default function ArticleClient({ initialArticle, slug }: ArticleClientProps) {
  const { lang } = useApp();
  const [article, setArticle] = useState<Article>(initialArticle);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [showTOC, setShowTOC] = useState(false);

  // Extract TOC from content
  const toc = useMemo(() => extractHeadings(article.contentHtml || ''), [article.contentHtml]);
  const contentWithIds = useMemo(() => addHeadingIds(article.contentHtml || ''), [article.contentHtml]);
  const hasTOC = toc.length >= 3; // Show TOC if at least 3 headings

  // Fetch categories and related articles on client
  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesData = await api.getCategories(lang);
        setCategories(categoriesData);

        // Fetch article in current language if different
        if (lang !== 'fr') {
          const articleData = await api.getArticle(slug, lang);
          setArticle(articleData);
        }

        // Fetch related articles from same category
        if (article.category) {
          const related = await api.getArticles({ 
            lang, 
            category: article.category.slug, 
            limit: 4 
          });
          setRelatedArticles(related.data.filter(a => a.slug !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  }, [slug, lang, article.category]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Share buttons
  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://sagessedafrique.blog/article/${slug}`;
  const shareTitle = article.title;

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
              <div className="flex items-center gap-6 text-white/80 text-sm flex-wrap">
                <Link href={`/auteur/${article.author.id}`} className="hover:text-white transition-colors">
                  {article.author.name}
                </Link>
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

        {/* Breadcrumb */}
        <nav className="container mx-auto max-w-4xl px-4 py-4">
          <ol className="flex items-center text-sm text-slate-500 dark:text-slate-400 flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-primary dark:hover:text-accent transition-colors">
                {lang === 'fr' ? 'Accueil' : 'Home'}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              {article.category && (
                <Link href={`/category/${article.category.slug}`} className="hover:text-primary dark:hover:text-accent transition-colors">
                  {article.category.name}
                </Link>
              )}
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px] md:max-w-none">
                {article.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Content */}
        <article className="container mx-auto max-w-4xl px-4 py-8">
          {/* Share buttons - floating */}
          <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-50">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Partager sur Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Partager sur Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#0A66C2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Partager sur LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Partager sur WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>

          {/* Table of Contents */}
          {hasTOC && (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-8">
              <button 
                onClick={() => setShowTOC(!showTOC)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  📑 {lang === 'fr' ? 'Table des matières' : 'Table of Contents'}
                </h3>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform ${showTOC ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTOC && (
                <nav className="mt-4 space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm hover:text-primary dark:hover:text-accent transition-colors ${
                        item.level === 3 ? 'ml-4 text-slate-500' : 'font-medium text-slate-700 dark:text-slate-300'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item.level === 3 ? '└ ' : '• '}{item.text}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          )}

          {/* Takeaway */}
          {article.takeaway && (
            <div className="bg-accent/10 border-l-4 border-accent p-6 mb-8 rounded-r-lg">
              <h3 className="font-bold text-sm uppercase tracking-wider text-accent mb-2">{t('keyTakeaway', lang)}</h3>
              <div 
                className="text-lg prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.takeaway }} 
              />
            </div>
          )}

          {/* Main content */}
          <div 
            className="article-content prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {/* Mobile share buttons */}
          <div className="lg:hidden flex justify-center gap-4 mt-8 py-4 border-y border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-500 self-center">Partager :</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>

          {/* Sources & Références */}
          {article.sources && article.sources.trim() !== '' && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="flex items-center gap-2 font-bold text-lg mb-4">
                <span className="text-2xl">📚</span>
                {lang === 'fr' ? 'Sources & Références' : 'Sources & References'}
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
                  dangerouslySetInnerHTML={{ __html: article.sources }}
                />
              </div>
            </div>
          )}

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
              <Link href={`/auteur/${article.author.id}`} className="hover:text-primary dark:hover:text-accent transition-colors">
                <h4 className="font-serif font-bold text-xl mb-2">{article.author.name}</h4>
              </Link>
              <p className="text-slate-500 dark:text-slate-400">
                {article.author.bio || (lang === 'fr' 
                  ? 'Historien et passeur de savoirs africains'
                  : 'Historian and transmitter of African knowledge')}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <Comments articleId={article.id} articleSlug={slug} lang={lang} />
        </article>

        {/* Related Articles - Enhanced */}
        {relatedArticles.length > 0 && (
          <section className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-widest mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lang === 'fr' ? 'Continuez votre lecture' : 'Continue Reading'}
                </span>
                <h2 className="text-3xl font-serif font-bold mb-4">{t('relatedArticles', lang)}</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                  {lang === 'fr' 
                    ? `Découvrez d'autres articles sur ${article.category?.name || 'ce thème'}.`
                    : `Discover more articles on ${article.category?.name || 'this topic'}.`}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedArticles.slice(0, 3).map(a => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
              {article.category && (
                <div className="text-center mt-12">
                  <Link 
                    href={`/category/${article.category.slug}`}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                  >
                    {lang === 'fr' ? `Tous les articles ${article.category.name}` : `All ${article.category.name} articles`}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer categories={categories} />
    </div>
  );
}

