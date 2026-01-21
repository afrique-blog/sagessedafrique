'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { t } from '@/lib/i18n';
import { api, CategoriePersonnalite, Category } from '@/lib/api';
import { useMemberAuth } from '@/lib/memberAuth';

const Header: React.FC = () => {
  const { lang, setLang, theme, setTheme } = useApp();
  const { member, isAuthenticated, isLoading: authLoading, logout } = useMemberAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoriesPersonnalites, setCategoriesPersonnalites] = useState<CategoriePersonnalite[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

          {/* Une semaine en Afrique */}
          <Link 
            href="/semaine-en-afrique"
            className="text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1"
          >
            <span>🌍</span>
            {lang === 'fr' ? 'Semaine en Afrique' : 'Week in Africa'}
          </Link>

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

          {/* Recherche avancée */}
          <Link 
            href="/recherche"
            className="text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1"
          >
            <span>🔍</span>
            {lang === 'fr' ? 'Recherche' : 'Search'}
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
          <button onClick={toggleTheme} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button 
            onClick={toggleLang}
            className="text-xs font-bold px-3 py-1 border-2 border-slate-200 dark:border-slate-700 rounded-md hover:border-primary dark:hover:border-accent transition-all"
          >
            {t('switchLang', lang)}
          </button>

          {/* Authentification */}
          {!authLoading && (
            isAuthenticated && member ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {member.avatar ? (
                      <img src={member.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{member.name}</span>
                </button>
                
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                      <Link 
                        href="/profil" 
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        {lang === 'fr' ? '👤 Mon profil' : '👤 My profile'}
                      </Link>
                      <Link 
                        href="/favoris" 
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        {lang === 'fr' ? '⭐ Mes favoris' : '⭐ My favorites'}
                      </Link>
                      <hr className="my-2 border-slate-200 dark:border-slate-700" />
                      <button 
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {lang === 'fr' ? '🚪 Déconnexion' : '🚪 Log out'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/connexion"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {lang === 'fr' ? 'Connexion' : 'Log in'}
                </Link>
                <Link 
                  href="/inscription"
                  className="text-sm font-medium px-4 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                  {lang === 'fr' ? 'Inscription' : 'Sign up'}
                </Link>
              </div>
            )
          )}
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

            {/* Une semaine en Afrique */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link href="/semaine-en-afrique" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">
                <span>🌍</span>
                {lang === 'fr' ? 'Semaine en Afrique' : 'Week in Africa'}
              </Link>
            </div>

            {/* Ressources */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link href="/ressources" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">
                <span>📚</span>
                {lang === 'fr' ? 'Ressources Gratuites' : 'Free Resources'}
              </Link>
            </div>

            {/* Liens rapides mobile */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3">
              <Link 
                href="/archives" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="text-2xl">📅</span>
                <span className="text-xs font-medium">{lang === 'fr' ? 'Archives' : 'Archives'}</span>
              </Link>
              <Link 
                href="/favoris" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="text-2xl">⭐</span>
                <span className="text-xs font-medium">{lang === 'fr' ? 'Favoris' : 'Favorites'}</span>
              </Link>
              <Link 
                href="/recherche" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="text-2xl">🔍</span>
                <span className="text-xs font-medium">{lang === 'fr' ? 'Recherche' : 'Search'}</span>
              </Link>
            </div>

            {/* Contact - en dernier */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
                {t('contact', lang)}
              </Link>
            </div>

            {/* Authentification Mobile */}
            {!authLoading && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                {isAuthenticated && member ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {member.avatar ? (
                          <img src={member.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          member.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <Link 
                      href="/profil" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-primary font-medium"
                    >
                      {lang === 'fr' ? '👤 Mon profil' : '👤 My profile'}
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="text-red-600 font-medium"
                    >
                      {lang === 'fr' ? '🚪 Déconnexion' : '🚪 Log out'}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link 
                      href="/connexion"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 py-2 text-center border border-primary text-primary rounded-lg font-medium"
                    >
                      {lang === 'fr' ? 'Connexion' : 'Log in'}
                    </Link>
                    <Link 
                      href="/inscription"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 py-2 text-center bg-primary text-white rounded-lg font-medium"
                    >
                      {lang === 'fr' ? 'Inscription' : 'Sign up'}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button onClick={toggleTheme} className="text-sm">{theme === 'light' ? t('darkMode', lang) : t('lightMode', lang)}</button>
              <button onClick={toggleLang} className="text-sm font-bold">{t('switchLang', lang)}</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
