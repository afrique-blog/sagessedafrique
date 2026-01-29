'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context';

interface SignupCTAProps {
  countryCode: string | null;
}

const countryEmojis: Record<string, string> = {
  'ET': '🇪🇹',
  'SN': '🇸🇳',
  'MA': '🇲🇦',
  'KE': '🇰🇪',
  'GH': '🇬🇭',
  'NG': '🇳🇬',
  'ZA': '🇿🇦',
  'EG': '🇪🇬',
};

const countryNames: Record<string, { fr: string; en: string }> = {
  'ET': { fr: "l'Éthiopie", en: 'Ethiopia' },
  'SN': { fr: 'le Sénégal', en: 'Senegal' },
  'MA': { fr: 'le Maroc', en: 'Morocco' },
  'KE': { fr: 'le Kenya', en: 'Kenya' },
  'GH': { fr: 'le Ghana', en: 'Ghana' },
  'NG': { fr: 'le Nigeria', en: 'Nigeria' },
  'ZA': { fr: "l'Afrique du Sud", en: 'South Africa' },
  'EG': { fr: "l'Égypte", en: 'Egypt' },
};

export default function SignupCTA({ countryCode }: SignupCTAProps) {
  const { lang } = useApp();
  
  const emoji = countryCode ? countryEmojis[countryCode] || '🌍' : '🌍';
  const countryName = countryCode && countryNames[countryCode] 
    ? countryNames[countryCode][lang] 
    : (lang === 'fr' ? 'ce pays' : 'this country');

  return (
    <div className="relative mt-12 mb-8">
      {/* Gradient Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-900/50 dark:to-slate-900 h-64 -mt-64 pointer-events-none" />
      
      {/* CTA Box */}
      <div className="relative bg-white dark:bg-slate-800 border-2 border-yellow-500 rounded-xl p-8 md:p-12 text-center shadow-xl">
        <div className="text-6xl mb-6">{emoji}</div>
        
        <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-gray-900 dark:text-white">
          {lang === 'fr' 
            ? `Continuez votre voyage en ${countryName}`
            : `Continue your journey in ${countryName}`}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          {lang === 'fr'
            ? "Inscrivez-vous gratuitement pour accéder à l'intégralité de ce dossier pays et découvrir tous les secrets de cette destination fascinante."
            : "Sign up for free to access the full country report and discover all the secrets of this fascinating destination."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/inscription" 
            className="inline-block px-8 py-4 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-colors shadow-lg hover:shadow-xl text-lg"
          >
            {lang === 'fr' ? 'Créer mon compte gratuit' : 'Create my free account'}
          </Link>
          
          <Link 
            href="/connexion" 
            className="inline-block px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-yellow-500 dark:hover:border-yellow-500 transition-colors"
          >
            {lang === 'fr' ? 'Se connecter' : 'Log in'}
          </Link>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {lang === 'fr' 
              ? "✅ Gratuit et sans engagement  •  📚 Accès à tous les dossiers pays  •  💬 Chatbot IA personnalisé"
              : "✅ Free and no commitment  •  📚 Access to all country reports  •  💬 Personalized AI chatbot"}
          </p>
        </div>
      </div>
    </div>
  );
}
