'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from './i18n';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get stored values on mount
    const storedLang = localStorage.getItem('lang') as Language;
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (storedLang) setLangState(storedLang);
    if (storedTheme) setThemeState(storedTheme);
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}


