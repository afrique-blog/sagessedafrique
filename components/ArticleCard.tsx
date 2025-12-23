
import React from 'react';
import { Link } from 'react-router-dom';
import { Article, Language } from '../types';
import { categories } from '../data/categories';

interface Props {
  article: Article;
  lang: Language;
  variant?: 'large' | 'medium' | 'compact';
}

const ArticleCard: React.FC<Props> = ({ article, lang, variant = 'medium' }) => {
  const cat = categories.find(c => c.slug === article.category);
  const t = article.lang[lang];

  if (variant === 'large') {
    return (
      <article className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="aspect-[16/10] overflow-hidden">
          <img 
            src={article.heroImage} 
            alt={t.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="p-8">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent text-[11px] font-bold uppercase tracking-wider mb-4">
            {cat?.name[lang]}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 hover:text-primary dark:hover:text-accent transition-colors">
            <Link to={`/article/${article.slug}`}>{t.title}</Link>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
            {t.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">MD</div>
              <span className="text-xs font-medium">{article.author}</span>
            </div>
            <span className="text-xs text-slate-400">{article.readingMinutes} min read</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.slug}`} className="group flex gap-4 items-start">
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden">
          <img src={article.heroImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
        </div>
        <div>
          <h4 className="text-sm font-bold font-serif leading-snug line-clamp-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
            {t.title}
          </h4>
          <span className="text-[10px] text-slate-400 uppercase tracking-tight mt-1 inline-block">
            {new Date(article.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article className="flex flex-col bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <Link to={`/article/${article.slug}`} className="aspect-[3/2] overflow-hidden">
        <img src={article.heroImage} alt={t.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
           <Link to={`/category/${article.category}`} className="text-[10px] font-bold text-primary dark:text-accent uppercase tracking-widest hover:underline">
            {cat?.name[lang]}
          </Link>
        </div>
        <h3 className="text-xl font-serif font-bold mb-3 line-clamp-2 leading-tight">
          <Link to={`/article/${article.slug}`} className="hover:text-primary dark:hover:text-accent transition-colors">{t.title}</Link>
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
          {t.excerpt}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 dark:border-slate-700">
          <span>{new Date(article.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}</span>
          <span>{article.readingMinutes} min</span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
