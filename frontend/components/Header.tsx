'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { t } from '@/lib/i18n';
import { api, CategoriePersonnalite, Category } from '@/lib/api';

const Header: React.FC = () => {
  const { lang, setLang, theme, setTheme } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesPersonnalites, setCategoriesPersonnalites] = useState<CategoriePersonnalite[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.getCategoriesPersonnalites(lang)
      .then(setCategoriesPersonnalites)
      .catch(console.error);
    api.getCategories(lang)
      .then(setCategories)
      .catch(console.error);
  }, [lang]);

  const toggleLang = () => setLang(lang === 'fr' ? 'en' : 'fr');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <Image 
            src="/logo-sagesse-small.png" 
            alt="Sagesse d'Afrique" 
            width={180} 
            height={60} 
            className="h-12 w-auto group-hover:opacity-80 transition-opacity"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {/* Accueil */}
          <Link 
            href="/"
            className="text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors"
          >
            {t('home', lang)}
          </Link>

          {/* Menu Catégories */}
          {categories.length > 0 && (
            <div className="relative group">
              <button className="text-sm font-medium flex items-center gap-1 hover:text-primary dark:hover:text-accent">
                {lang === 'fr' ? 'Catégories' : 'Categories'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-lg p-2">
                  <Link
                    href="/categories"
                    className="block px-4 py-2 text-sm font-semibold text-primary dark:text-accent hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors border-b border-slate-100 dark:border-slate-700 mb-1"
                  >
                    {lang === 'fr' ? '📚 Toutes les catégories' : '📚 All categories'}
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Menu Personnalités Africaines */}
          {categoriesPersonnalites.length > 0 && (
            <div className="relative group">
              <button className="text-sm font-medium flex items-center gap-1 hover:text-primary dark:hover:text-accent">
                {lang === 'fr' ? 'Personnalités Africaines' : 'African Personalities'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-0 w-72 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-lg p-2 max-h-[70vh] overflow-y-auto">
                  <Link
                    href="/personnalites"
                    className="block px-4 py-2 text-sm font-semibold text-primary dark:text-accent hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors border-b border-slate-100 dark:border-slate-700 mb-1"
                  >
                    {lang === 'fr' ? '📚 Toutes les catégories' : '📚 All categories'}
                  </Link>
                  {categoriesPersonnalites.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/personnalites/${cat.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                      {cat.nom}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ressources */}
          <Link 
            href="/ressources"
            className="text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1"
          >
            <span>📚</span>
            {lang === 'fr' ? 'Ressources' : 'Resources'}
          </Link>

          {/* Archives */}
          <Link 
            href="/archives"
            className="text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1"
          >
            <span>📅</span>
            {lang === 'fr' ? 'Archives' : 'Archives'}
          </Link>

          {/* Favoris */}
          <Link 
            href="/favoris"
            className="text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1"
          >
            <span>⭐</span>
            {lang === 'fr' ? 'Favoris' : 'Favorites'}
          </Link>

          {/* Contact - en dernier */}
          <Link 
            href="/contact"
            className="text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors"
          >
            {t('contact', lang)}
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder={t('search', lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 transition-all focus:w-64"
            />
            <svg className="absolute left-2.5 top-2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </form>

          <button onClick={toggleTheme} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button 
            onClick={toggleLang}
            className="text-xs font-bold px-3 py-1 border-2 border-slate-200 dark:border-slate-700 rounded-md hover:border-primary dark:hover:border-accent transition-all"
          >
            {t('switchLang', lang)}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col space-y-4">
            {/* Accueil */}
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
              {t('home', lang)}
            </Link>
            
            {/* Mobile Catégories */}
            {categories.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link 
                  href="/categories" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-lg font-bold text-primary dark:text-accent mb-3 block"
                >
                  {lang === 'fr' ? 'Catégories' : 'Categories'}
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent py-1"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mobile Personnalités */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link 
                href="/personnalites" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-lg font-bold text-primary dark:text-accent mb-3 block"
              >
                {lang === 'fr' ? 'Personnalités Africaines' : 'African Personalities'}
              </Link>
              <div className="grid grid-cols-2 gap-2">
                {categoriesPersonnalites.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/personnalites/${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent py-1"
                  >
                    {cat.nom}
                  </Link>
                ))}
              </div>
            </div>

            {/* Ressources */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link href="/ressources" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">
                <span>📚</span>
                {lang === 'fr' ? 'Ressources Gratuites' : 'Free Resources'}
              </Link>
            </div>

            {/* Contact - en dernier */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
                {t('contact', lang)}
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button onClick={toggleTheme} className="text-sm">{theme === 'light' ? t('darkMode', lang) : t('lightMode', lang)}</button>
              <button onClick={toggleLang} className="text-sm font-bold">{t('switchLang', lang)}</button>
            </div>
            <form onSubmit={handleSearch} className="relative mt-4">
              <input 
                type="text" 
                placeholder={t('search', lang)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </form>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
