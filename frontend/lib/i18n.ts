export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    contact: 'Contact',
    legal: 'Mentions légales',
    search: 'Rechercher...',
    
    // Home
    heroTitle: "L'Héritage d'un Continent",
    heroQuote: "« L'humanité a un futur parce qu'elle a un passé à partager. »",
    featured: 'À la Une',
    latestArticles: 'Derniers Articles',
    viewMore: "Voir plus d'articles",
    popularCategories: 'Catégories Populaires',
    specialReports: 'Dossiers Spéciaux',
    deepDives: 'Des plongées profondes dans les thématiques majeures.',
    
    // Article
    readingTime: 'min de lecture',
    views: 'vues',
    keyTakeaway: 'À retenir',
    relatedArticles: 'Articles similaires',
    
    // Newsletter
    newsletter: 'Newsletter',
    newsletterDesc: 'Recevez nos dossiers exclusifs chaque mois.',
    subscribe: "S'abonner",
    
    // About
    historianPerspective: "Le regard de l'historien",
    discoverApproach: 'Découvrir ma démarche',
    historian: 'Historien & Passeur',
    
    // Footer
    allRightsReserved: 'Tous droits réservés',
    
    // Search
    resultsFor: 'Résultats pour',
    noResults: 'Aucun article trouvé.',
    
    // Language
    switchLang: 'EN',
    
    // Theme
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre',
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    legal: 'Legal',
    search: 'Search...',
    
    // Home
    heroTitle: 'The Legacy of a Continent',
    heroQuote: '"Humanity has a future because it has a past to share."',
    featured: 'Featured',
    latestArticles: 'Latest Articles',
    viewMore: 'View more articles',
    popularCategories: 'Popular Categories',
    specialReports: 'Special Reports',
    deepDives: 'Deep dives into major themes.',
    
    // Article
    readingTime: 'min read',
    views: 'views',
    keyTakeaway: 'Key Takeaway',
    relatedArticles: 'Related Articles',
    
    // Newsletter
    newsletter: 'Newsletter',
    newsletterDesc: 'Receive our exclusive dossiers every month.',
    subscribe: 'Subscribe',
    
    // About
    historianPerspective: "The Historian's Perspective",
    discoverApproach: 'Discover my approach',
    historian: 'Historian & Guide',
    
    // Footer
    allRightsReserved: 'All rights reserved',
    
    // Search
    resultsFor: 'Results for',
    noResults: 'No articles found.',
    
    // Language
    switchLang: 'FR',
    
    // Theme
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
  },
};

export function t(key: keyof typeof translations['fr'], lang: Language): string {
  return translations[lang][key] || key;
}


