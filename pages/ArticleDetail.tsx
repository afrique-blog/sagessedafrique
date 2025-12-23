
import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '../App';
import { articles } from '../data/articles';
import { categories } from '../data/categories';
import { tags as allTags } from '../data/tags';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams();
  const { lang } = useApp();
  
  const article = articles.find(a => a.slug === slug);
  
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter(a => a.id !== article.id && (a.category === article.category || a.tags.some(t => article.tags.includes(t))))
      .slice(0, 3);
  }, [article]);

  if (!article) return <Navigate to="/404" />;

  const t = article.lang[lang];
  const cat = categories.find(c => c.slug === article.category);

  return (
    <article className="pb-24">
      {/* Hero Header */}
      <div className="bg-slate-100 dark:bg-slate-900 py-12 lg:py-24 mb-12 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Link to={`/category/${article.category}`} className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest mb-6 inline-block hover:underline">
            {cat?.name[lang]}
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-light max-w-3xl mx-auto mb-10 leading-relaxed italic">
            {t.excerpt}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Malick Diarra</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>{new Date(article.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>{article.readingMinutes} min read</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 -mt-20 relative z-10">
               <img src={article.heroImage} alt={t.title} className="w-full aspect-video object-cover" />
            </div>

            {/* Takeaway Box */}
            <div className="bg-primary/5 dark:bg-accent/5 border-l-4 border-primary dark:border-accent p-8 mb-12 rounded-r-xl">
               <h4 className="text-xs uppercase tracking-widest font-bold mb-2 text-primary dark:text-accent">
                {lang === 'fr' ? 'À retenir' : 'The Takeaway'}
               </h4>
               <p className="text-lg font-medium">{t.takeaway}</p>
            </div>

            <div 
              className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                         prose-headings:font-serif prose-headings:font-bold prose-blockquote:italic
                         prose-blockquote:border-primary prose-a:text-primary dark:prose-a:text-accent"
              dangerouslySetInnerHTML={{ __html: t.contentHtml }}
            />

            <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
              {article.tags.map(tagSlug => {
                const tag = allTags.find(ts => ts.slug === tagSlug);
                return (
                  <Link 
                    key={tagSlug} 
                    to={`/tag/${tagSlug}`} 
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-medium rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    #{tag?.name[lang]}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-12">
             <div className="sticky top-28 space-y-12">
                {/* Table of contents mockup */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <h3 className="text-xs uppercase tracking-widest font-bold mb-6 text-slate-400">Sommaire</h3>
                  <ul className="space-y-4 text-sm font-medium">
                    <li className="hover:text-primary transition-colors cursor-pointer">1. Introduction</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">2. Contexte Historique</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">3. Contributions Majeures</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">4. Impact Moderne</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">5. Conclusion</li>
                  </ul>
                </div>

                {/* Related Articles */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold mb-8 border-b pb-4">{lang === 'fr' ? 'Articles Liés' : 'Related Articles'}</h3>
                  <div className="space-y-8">
                    {relatedArticles.map(rel => (
                      <Link key={rel.id} to={`/article/${rel.slug}`} className="group flex gap-4">
                        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                          <img src={rel.heroImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold font-serif leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {rel.lang[lang].title}
                           </h4>
                           <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">
                            {categories.find(c => c.slug === rel.category)?.name[lang]}
                           </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
