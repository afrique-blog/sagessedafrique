'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { Article } from '@/lib/api';

interface Props {
  article: Article;
  variant?: 'large' | 'medium' | 'compact';
}

const ArticleCard: React.FC<Props> = ({ article, variant = 'medium' }) => {
  const { lang } = useApp();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteArticles') || '[]');
    setIsFavorite(favorites.includes(article.id));
  }, [article.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favoriteArticles') || '[]');
    let newFavorites: number[];
    
    if (isFavorite) {
      newFavorites = favorites.filter((id: number) => id !== article.id);
    } else {
      newFavorites = [...favorites, article.id];
    }
    
    localStorage.setItem('favoriteArticles', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (variant === 'large') {
    return (
      <article className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
        <Link href={`/article/${article.slug}`} className="aspect-[16/10] overflow-hidden relative">
          {article.heroImage ? (
            <Image 
              src={article.heroImage} 
              alt={article.title} 
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
          )}
        </Link>
        <div className="p-8">
          {article.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent text-[11px] font-bold uppercase tracking-wider mb-4">
              {article.category.name}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 hover:text-primary dark:hover:text-accent transition-colors">
            <Link href={`/article/${article.slug}`}>{article.title}</Link>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
            <Link href={`/auteur/${article.author.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              {article.author.avatar ? (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                  {article.author.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <span className="text-xs font-medium hover:text-primary dark:hover:text-accent transition-colors">{article.author.name}</span>
            </Link>
            <span className="text-xs text-slate-400">{article.readingMinutes} min read</span>
          </div>
          <Link 
            href={`/article/${article.slug}`}
            className="inline-block mt-6 px-6 py-2 bg-primary text-white dark:bg-accent dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {lang === 'fr' ? 'Lire la suite' : 'Read more'}
          </Link>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="group flex gap-4 items-start">
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative">
          {article.heroImage ? (
            <Image 
              src={article.heroImage} 
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold font-serif leading-snug line-clamp-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
            {article.title}
          </h4>
          <span className="text-[10px] text-slate-400 uppercase tracking-tight mt-1 inline-block">
            {article.publishedAt && formatDate(article.publishedAt)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article className="flex flex-col bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
      {/* Favorite Button - Always visible */}
      <button
        onClick={toggleFavorite}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
          isFavorite 
            ? 'bg-amber-500 text-white scale-110' 
            : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-amber-500 hover:scale-110'
        }`}
        title={isFavorite ? (lang === 'fr' ? 'Retirer des favoris' : 'Remove from favorites') : (lang === 'fr' ? 'Ajouter aux favoris' : 'Add to favorites')}
      >
        <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>

      <Link href={`/article/${article.slug}`} className="aspect-[3/2] overflow-hidden relative">
        {article.heroImage ? (
          <Image 
            src={article.heroImage} 
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
        )}
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2 mb-3">
          {article.category && (
            <Link href={`/category/${article.category.slug}`} className="text-[10px] font-bold text-primary dark:text-accent uppercase tracking-widest hover:underline">
              {article.category.name}
            </Link>
          )}
          {article.personnaliteCategorie && (
            <Link 
              href={`/personnalites/${article.personnaliteCategorie.slug}`} 
              className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-primary dark:hover:text-accent transition-colors"
            >
              {article.personnaliteCategorie.nom}
            </Link>
          )}
        </div>
        <h3 className="text-xl font-serif font-bold mb-3 line-clamp-2 leading-tight">
          <Link href={`/article/${article.slug}`} className="hover:text-primary dark:hover:text-accent transition-colors">{article.title}</Link>
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 dark:border-slate-700">
          <Link href={`/auteur/${article.author.id}`} className="flex items-center gap-2 hover:text-primary dark:hover:text-accent transition-colors">
            {article.author.avatar ? (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[8px] font-bold">
                {article.author.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <span>{article.author.name}</span>
          </Link>
          <span>{article.readingMinutes} min</span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;


