'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, WeeklyEdition, WeeklyNews, AfricanCountry } from '@/lib/api';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Fonction pour convertir code pays en emoji drapeau
function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Calculer les dates de la semaine
function getWeekDates(year: number, weekNumber: number): { start: string; end: string } {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const dow = simple.getDay();
  const monday = new Date(simple);
  if (dow <= 4) {
    monday.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    monday.setDate(simple.getDate() + 8 - simple.getDay());
  }
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  return {
    start: monday.toLocaleDateString('fr-FR', options),
    end: sunday.toLocaleDateString('fr-FR', { ...options, year: 'numeric' }),
  };
}

export default function SemaineEnAfriquePage() {
  const { lang: language } = useApp();
  const [currentEdition, setCurrentEdition] = useState<WeeklyEdition | null>(null);
  const [editions, setEditions] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [countries, setCountries] = useState<AfricanCountry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [searchYear, setSearchYear] = useState<number | ''>('');
  const [searchCountry, setSearchCountry] = useState('');
  const [searchResults, setSearchResults] = useState<WeeklyNews[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTotal, setSearchTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, [language]);

  async function loadData() {
    setLoading(true);
    try {
      const [current, editionsList, yearsList, countriesList] = await Promise.all([
        api.getCurrentWeeklyEdition(language),
        api.getWeeklyEditions({ lang: language, limit: 12 }),
        api.getWeeklyYears(),
        api.getAfricanCountries(),
      ]);
      
      setCurrentEdition(current);
      setEditions(editionsList.data);
      setYears(yearsList);
      setCountries(countriesList);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!searchQuery && !searchYear && !searchCountry) return;
    
    setIsSearching(true);
    setShowSearch(true);
    try {
      const result = await api.searchWeeklyNews({
        lang: language,
        query: searchQuery || undefined,
        year: searchYear || undefined,
        countryCode: searchCountry || undefined,
        limit: 20,
      });
      setSearchResults(result.data);
      setSearchTotal(result.pagination.total);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setIsSearching(false);
    }
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchYear('');
    setSearchCountry('');
    setSearchResults([]);
    setShowSearch(false);
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const weekDates = currentEdition 
    ? getWeekDates(currentEdition.year, currentEdition.weekNumber)
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-900 via-amber-800 to-red-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <span className="text-6xl mb-4 block">🌍</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Une semaine en Afrique
            </h1>
            {currentEdition && weekDates && (
              <p className="text-xl text-amber-200">
                {weekDates.start} - {weekDates.end}
              </p>
            )}
            <p className="text-lg text-white/80 mt-4 max-w-2xl mx-auto">
              Les 10 actualités majeures du continent africain, chaque semaine.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Barre de recherche */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 -mt-12 relative z-10">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rechercher
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Mot-clé..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année
                </label>
                <select
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Toutes</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <select
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Tous les pays</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>
                      {countryCodeToFlag(c.code)} {c.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                >
                  {isSearching ? 'Recherche...' : 'Rechercher'}
                </button>
                {showSearch && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Résultats de recherche */}
          {showSearch ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🔍</span>
                Résultats de recherche
                <span className="text-sm font-normal text-gray-500">
                  ({searchTotal} résultat{searchTotal !== 1 ? 's' : ''})
                </span>
              </h2>
              
              {searchResults.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                  Aucun résultat trouvé pour votre recherche.
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((news) => (
                    <div key={news.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{countryCodeToFlag(news.countryCode)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-amber-600 font-medium">{news.country}</span>
                            {news.edition && (
                              <Link 
                                href={`/semaine-en-afrique/${news.edition.slug}`}
                                className="text-xs text-gray-500 hover:text-amber-600"
                              >
                                • Semaine {news.edition.weekNumber}, {news.edition.year}
                              </Link>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{news.title}</h3>
                          <p className="text-gray-600">{news.excerpt}</p>
                          {news.sourceName && (
                            <p className="text-sm text-gray-400 mt-2">
                              📎 Source : {news.sourceUrl ? (
                                <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600">
                                  {news.sourceName}
                                </a>
                              ) : news.sourceName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Édition courante */}
              {currentEdition ? (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span>📰</span>
                    {currentEdition.title}
                  </h2>
                  
                  {currentEdition.summary && (
                    <p className="text-gray-600 mb-6">{currentEdition.summary}</p>
                  )}

                  <div className="space-y-4">
                    {currentEdition.news.map((news, index) => (
                      <article 
                        key={news.id} 
                        className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
                      >
                        <div className="flex items-start gap-4">
                          {/* Numéro */}
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          
                          {/* Drapeau */}
                          <span className="text-4xl flex-shrink-0">
                            {countryCodeToFlag(news.countryCode)}
                          </span>
                          
                          {/* Contenu */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                                {news.country}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {news.title}
                            </h3>
                            
                            <p className="text-gray-600 leading-relaxed">
                              {news.excerpt}
                            </p>
                            
                            {news.sourceName && (
                              <p className="text-sm text-gray-400 mt-3">
                                📎 Source : {news.sourceUrl ? (
                                  <a 
                                    href={news.sourceUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-amber-600 transition"
                                  >
                                    {news.sourceName}
                                  </a>
                                ) : news.sourceName}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center mb-12">
                  <span className="text-6xl mb-4 block">📭</span>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Pas encore d'édition publiée
                  </h2>
                  <p className="text-gray-500">
                    La première édition de "Une semaine en Afrique" arrive bientôt !
                  </p>
                </div>
              )}

              {/* Archives */}
              {editions.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span>📚</span>
                    Archives
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {editions.filter(e => currentEdition ? e.id !== currentEdition.id : true).map((edition) => {
                      const dates = getWeekDates(edition.year, edition.weekNumber);
                      return (
                        <Link 
                          key={edition.id}
                          href={`/semaine-en-afrique/${edition.slug}`}
                          className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-amber-600 font-medium">
                              Semaine {edition.weekNumber}
                            </span>
                            <span className="text-sm text-gray-500">{edition.year}</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition mb-2">
                            {dates.start} - {dates.end}
                          </h3>
                          {edition.news && edition.news.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {edition.news.slice(0, 5).map((n: WeeklyNews) => (
                                <span key={n.id} className="text-lg" title={n.country}>
                                  {countryCodeToFlag(n.countryCode)}
                                </span>
                              ))}
                              {edition.news.length > 5 && (
                                <span className="text-sm text-gray-400">+{edition.news.length - 5}</span>
                              )}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
