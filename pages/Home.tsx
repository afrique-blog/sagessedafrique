
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../App';
import { articles } from '../data/articles';
import { categories } from '../data/categories';
import { dossiers } from '../data/dossiers';
import ArticleCard from '../components/ArticleCard';

const Home: React.FC = () => {
  const { lang } = useApp();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles;
    const query = searchQuery.toLowerCase();
    return articles.filter(a => 
      a.lang[lang].title.toLowerCase().includes(query) || 
      a.lang[lang].excerpt.toLowerCase().includes(query)
    );
  }, [searchQuery, lang]);

  const featured = articles.find(a => a.featured) || articles[0];
  const mustRead = articles.slice(1, 4);
  const latest = articles.slice(4, 12);

  if (searchQuery) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">
          {lang === 'fr' ? `Résultats pour "${searchQuery}"` : `Results for "${searchQuery}"`}
        </h1>
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(a => <ArticleCard key={a.id} article={a} lang={lang} />)}
          </div>
        ) : (
          <p className="text-slate-500">{lang === 'fr' ? 'Aucun article trouvé.' : 'No articles found.'}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-slate-100 dark:bg-slate-900 pt-8 pb-16">
        <div className="container mx-auto px-4">
           <div className="text-center mb-12 max-w-2xl mx-auto">
             <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                {lang === 'fr' ? 'L\'Héritage d\'un Continent' : 'The Legacy of a Continent'}
             </h1>
             <p className="text-slate-600 dark:text-slate-400 text-lg italic">
                {lang === 'fr' 
                  ? "« L'humanité a un futur parce qu'elle a un passé à partager. »"
                  : "“Humanity has a future because it has a past to share.”"}
             </p>
           </div>
           <ArticleCard article={featured} lang={lang} variant="large" />
        </div>
      </section>

      {/* Must Read */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-serif font-bold uppercase tracking-tight">
            {lang === 'fr' ? 'À la Une' : 'Featured'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {mustRead.map(a => <ArticleCard key={a.id} article={a} lang={lang} />)}
        </div>
      </section>

      {/* Malick Diarra Insight */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 text-center">
             <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-accent mb-6 shadow-xl">
               <img src="https://picsum.photos/id/64/400/400" alt="Malick Diarra" className="w-full h-full object-cover" />
             </div>
             <h3 className="text-xl font-serif font-bold">Malick Diarra</h3>
             <p className="text-accent text-sm uppercase tracking-widest">{lang === 'fr' ? 'Historien & Passeur' : 'Historian & Guide'}</p>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-serif font-bold mb-6">{lang === 'fr' ? 'Le regard de l\'historien' : 'The Historian\'s Perspective'}</h2>
            <p className="text-lg leading-relaxed mb-8 text-slate-200 italic">
              {lang === 'fr' 
                ? "« Mon rôle n'est pas seulement de raconter des faits, mais de tisser des liens entre le génie de nos ancêtres et les défis de notre présent. Chaque article de ce magazine est une invitation à la réflexion. »"
                : "“My role is not only to recount facts, but to weave links between the genius of our ancestors and the challenges of our present. Each article in this magazine is an invitation to reflection.”"}
            </p>
            <Link to="/about" className="inline-block px-8 py-3 bg-accent text-slate-900 font-bold rounded hover:opacity-90 transition-opacity">
              {lang === 'fr' ? 'Découvrir ma démarche' : 'Discover my approach'}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles + Sidebar */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-serif font-bold mb-8 border-b pb-4">{lang === 'fr' ? 'Derniers Articles' : 'Latest Articles'}</h2>
            <div className="grid md:grid-cols-2 gap-8">
               {latest.map(a => <ArticleCard key={a.id} article={a} lang={lang} />)}
            </div>
            <div className="mt-12 text-center">
              <button className="px-10 py-3 border-2 border-primary text-primary dark:border-accent dark:text-accent font-bold hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:text-slate-900 transition-all">
                {lang === 'fr' ? 'Voir plus d\'articles' : 'View more articles'}
              </button>
            </div>
          </div>
          <aside className="lg:w-1/3 space-y-12">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-6 text-slate-400">{lang === 'fr' ? 'Catégories Populaires' : 'Popular Categories'}</h3>
              <div className="space-y-4">
                {categories.map(cat => (
                  <Link key={cat.slug} to={`/category/${cat.slug}`} className="flex justify-between items-center group">
                    <span className="group-hover:text-primary dark:group-hover:text-accent font-medium">{cat.name[lang]}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">12</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl">
              <h3 className="font-serif font-bold text-xl mb-4">{lang === 'fr' ? 'Newsletter' : 'Newsletter'}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{lang === 'fr' ? 'Recevez nos dossiers exclusifs chaque mois.' : 'Receive our exclusive dossiers every month.'}</p>
              <form className="space-y-3">
                <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 focus:outline-none ring-1 ring-slate-200 dark:ring-slate-600" />
                <button className="w-full py-2 bg-primary text-white rounded-lg font-bold">{lang === 'fr' ? 'S\'abonner' : 'Subscribe'}</button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {/* Dossiers Grid */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-serif font-bold mb-4">{lang === 'fr' ? 'Dossiers Spéciaux' : 'Special Reports'}</h2>
             <p className="text-slate-500 max-w-md mx-auto">{lang === 'fr' ? 'Des plongées profondes dans les thématiques majeures.' : 'Deep dives into major themes.'}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dossiers.slice(0, 4).map(d => (
              <Link key={d.slug} to={`/dossier/${d.slug}`} className="relative group overflow-hidden rounded-xl h-64">
                <img src={d.heroImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-white font-serif font-bold text-lg leading-tight group-hover:text-accent transition-colors">{d.title[lang]}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
