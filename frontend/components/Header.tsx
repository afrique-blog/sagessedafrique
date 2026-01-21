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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex-shrink-0">
          <Image 
            src="/logo-sagesse-small.png" 
            alt="Sagesse d'Afrique" 
            width={150} 
            height={50} 
            className="h-10 w-auto group-hover:opacity-80 transition-opacity"
            priority
          />
        </Link>

        {/* Desktop Nav - SIMPLIFIÉ */}
        <nav className="hidden lg:flex items-center space-x-1">
          {/* Accueil */}
          <Link 
            href="/"
            className="px-3 py-2 text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('home', lang)}
          </Link>

          {/* Menu Catégories */}
          {categories.length > 0 && (
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium flex items-center gap-1 hover:text-primary dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                {lang === 'fr' ? 'Catégories' : 'Categories'}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
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

          {/* Menu Personnalités */}
          {categoriesPersonnalites.length > 0 && (
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium flex items-center gap-1 hover:text-primary dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                {lang === 'fr' ? 'Personnalités' : 'Personalities'}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-lg p-2 max-h-[70vh] overflow-y-auto">
                  <Link
                    href="/personnalites"
                    className="block px-4 py-2 text-sm font-semibold text-primary dark:text-accent hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors border-b border-slate-100 dark:border-slate-700 mb-1"
                  >
                    {lang === 'fr' ? '👤 Toutes les personnalités' : '👤 All personalities'}
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

          {/* Semaine en Afrique - Feature phare */}
          <Link 
            href="/semaine-en-afrique"
            className="px-3 py-2 text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span>🌍</span>
            {lang === 'fr' ? 'Semaine en Afrique' : 'Week in Africa'}
          </Link>

          {/* Menu Explorer - Regroupe les liens secondaires */}
          <div className="relative group">
            <button className="px-3 py-2 text-sm font-medium flex items-center gap-1 hover:text-primary dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {lang === 'fr' ? 'Explorer' : 'Explore'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-lg p-2">
                <Link
                  href="/ressources"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  📚 {lang === 'fr' ? 'Ressources' : 'Resources'}
                </Link>
                <Link
                  href="/archives"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  📅 Archives
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  ℹ️ {lang === 'fr' ? 'À propos' : 'About'}
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  ✉️ Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Actions - SIMPLIFIÉ */}
        <div className="hidden lg:flex items-center space-x-2">
          {/* Recherche - Icône */}
          <Link 
            href="/recherche" 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title={lang === 'fr' ? 'Recherche' : 'Search'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          
          {/* Favoris - Seulement si connecté */}
          {isAuthenticated && (
            <Link 
              href="/favoris" 
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title={lang === 'fr' ? 'Favoris' : 'Favorites'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </Link>
          )}

          {/* Theme toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          
          {/* Langue */}
          <button 
            onClick={toggleLang}
            className="text-xs font-bold px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md hover:border-primary dark:hover:border-accent transition-all"
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>

          {/* Authentification */}
          {!authLoading && (
            isAuthenticated && member ? (
              <div className="relative ml-2">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold overflow-hidden">
                    {member.avatar ? (
                      <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </button>
                
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="font-medium text-sm truncate">{member.name}</p>
                        <p className="text-xs text-slate-500 truncate">{member.email}</p>
                      </div>
                      <Link 
                        href="/profil" 
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {lang === 'fr' ? 'Mon profil' : 'My profile'}
                      </Link>
                      <Link 
                        href="/favoris" 
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {lang === 'fr' ? 'Mes favoris' : 'My favorites'}
                      </Link>
                      <hr className="my-2 border-slate-200 dark:border-slate-700" />
                      <button 
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {lang === 'fr' ? 'Déconnexion' : 'Log out'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
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
                  {lang === 'fr' ? "S'inscrire" : 'Sign up'}
                </Link>
              </div>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg max-h-[85vh] overflow-y-auto">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {/* Accueil */}
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)} 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span>🏠</span>
              <span className="font-medium">{t('home', lang)}</span>
            </Link>
            
            {/* Semaine en Afrique */}
            <Link 
              href="/semaine-en-afrique" 
              onClick={() => setIsMenuOpen(false)} 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 bg-amber-50 dark:bg-amber-900/20"
            >
              <span>🌍</span>
              <span className="font-medium">{lang === 'fr' ? 'Semaine en Afrique' : 'Week in Africa'}</span>
            </Link>

            {/* Catégories */}
            {categories.length > 0 && (
              <div className="pt-2">
                <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'fr' ? 'Catégories' : 'Categories'}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/categories"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-primary dark:text-accent font-medium"
                >
                  {lang === 'fr' ? 'Voir tout →' : 'See all →'}
                </Link>
              </div>
            )}
            
            {/* Personnalités */}
            {categoriesPersonnalites.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'fr' ? 'Personnalités' : 'Personalities'}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {categoriesPersonnalites.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/personnalites/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {cat.nom}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/personnalites"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-primary dark:text-accent font-medium"
                >
                  {lang === 'fr' ? 'Voir tout →' : 'See all →'}
                </Link>
              </div>
            )}

            {/* Liens rapides */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2">
              <Link 
                href="/recherche" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs">{lang === 'fr' ? 'Recherche' : 'Search'}</span>
              </Link>
              <Link 
                href="/archives" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span className="text-lg">📅</span>
                <span className="text-xs">Archives</span>
              </Link>
              <Link 
                href="/ressources" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span className="text-lg">📚</span>
                <span className="text-xs">{lang === 'fr' ? 'Ressources' : 'Resources'}</span>
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span className="text-lg">✉️</span>
                <span className="text-xs">Contact</span>
              </Link>
            </div>

            {/* Authentification Mobile */}
            {!authLoading && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                {isAuthenticated && member ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold overflow-hidden">
                        {member.avatar ? (
                          <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          member.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-sm text-slate-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 px-4">
                      <Link 
                        href="/profil" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 py-2 text-center text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {lang === 'fr' ? 'Profil' : 'Profile'}
                      </Link>
                      <Link 
                        href="/favoris" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 py-2 text-center text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {lang === 'fr' ? 'Favoris' : 'Favorites'}
                      </Link>
                    </div>
                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full px-4 py-2 text-sm text-red-600 font-medium text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      {lang === 'fr' ? '🚪 Déconnexion' : '🚪 Log out'}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 px-4">
                    <Link 
                      href="/connexion"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 py-2.5 text-center border border-primary text-primary rounded-lg font-medium"
                    >
                      {lang === 'fr' ? 'Connexion' : 'Log in'}
                    </Link>
                    <Link 
                      href="/inscription"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 py-2.5 text-center bg-primary text-white rounded-lg font-medium"
                    >
                      {lang === 'fr' ? "S'inscrire" : 'Sign up'}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-4">
              <button 
                onClick={toggleTheme} 
                className="flex items-center gap-2 text-sm py-2"
              >
                {theme === 'light' ? '🌙' : '☀️'}
                <span>{theme === 'light' ? (lang === 'fr' ? 'Mode sombre' : 'Dark mode') : (lang === 'fr' ? 'Mode clair' : 'Light mode')}</span>
              </button>
              <button 
                onClick={toggleLang} 
                className="text-sm font-bold px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md"
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
