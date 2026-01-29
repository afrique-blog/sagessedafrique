'use client';

import Image from 'next/image';
import { useApp } from '@/lib/context';

interface DossierPaysHeroProps {
  title: string;
  subtitle: string;
  image: string | null;
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

export default function DossierPaysHero({ title, subtitle, image, countryCode }: DossierPaysHeroProps) {
  const { lang } = useApp();
  const emoji = countryCode ? countryEmojis[countryCode] || '🌍' : '🌍';

  return (
    <header className="w-full h-[60vh] min-h-[400px] relative flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Image */}
      {image ? (
        <div className="absolute inset-0">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      )}
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-3 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-2 mb-6">
          <span className="text-2xl">{emoji}</span>
          <span className="uppercase tracking-[0.3em] text-sm font-semibold text-yellow-400">
            {lang === 'fr' ? 'Dossier Spécial' : 'Special Report'} &mdash; Sagesses d'Afrique
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-serif leading-tight">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-white/60" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </header>
  );
}
