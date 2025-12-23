
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../App';
import { articles } from '../data/articles';
import { categories } from '../data/categories';
import { tags } from '../data/tags';
import { dossiers } from '../data/dossiers';
import ArticleCard from '../components/ArticleCard';

interface Props {
  type: 'category' | 'tag' | 'dossier';
}

const Listing: React.FC<Props> = ({ type }) => {
  const { slug } = useParams();
  const { lang } = useApp();

  const info = useMemo(() => {
    if (type === 'category') return categories.find(c => c.slug === slug);
    if (type === 'tag') return tags.find(t => t.slug === slug);
    if (type === 'dossier') return dossiers.find(d => d.slug === slug);
    return null;
  }, [type, slug]);

  const list = useMemo(() => {
    if (type === 'category') return articles.filter(a => a.category === slug);
    if (type === 'tag') return articles.filter(a => a.tags.includes(slug || ''));
    if (type === 'dossier') return articles.filter(a => a.dossiers.includes(slug || ''));
    return [];
  }, [type, slug]);

  if (!info) return <div className="p-24 text-center">Not Found</div>;

  const title = (info as any).name ? (info as any).name[lang] : (info as any).title[lang];
  const description = (info as any).description ? (info as any).description[lang] : '';

  return (
    <div className="pb-24">
      <div className="bg-slate-100 dark:bg-slate-900 py-20 mb-12 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <nav className="mb-6 flex justify-center items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-200">{type}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            {title}
          </h1>
          {description && <p className="text-lg text-slate-500 max-w-2xl mx-auto">{description}</p>}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12 pb-4 border-b">
          <span className="text-sm font-medium text-slate-500">{list.length} {lang === 'fr' ? 'articles trouvés' : 'articles found'}</span>
          <div className="flex gap-4">
             <select className="bg-transparent text-sm font-bold focus:outline-none">
               <option>{lang === 'fr' ? 'Plus récents' : 'Newest'}</option>
               <option>{lang === 'fr' ? 'Plus populaires' : 'Most Popular'}</option>
             </select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map(a => <ArticleCard key={a.id} article={a} lang={lang} />)}
        </div>
      </div>
    </div>
  );
};

export default Listing;
