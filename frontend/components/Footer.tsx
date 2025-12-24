'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { t } from '@/lib/i18n';

interface Category {
  slug: string;
  name: string;
}

interface FooterProps {
  categories?: Category[];
}

const Footer: React.FC<FooterProps> = ({ categories = [] }) => {
  const { lang } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo-sagesse-small-footer.png" 
                alt="Sagesse d'Afrique" 
                width={160} 
                height={50} 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {lang === 'fr' 
                ? "Exploration de l'héritage intellectuel et culturel de l'Afrique pour une humanité plus éclairée."
                : "Exploring Africa's intellectual and cultural heritage for a more enlightened humanity."}
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">𝕏</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">f</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">in</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{lang === 'fr' ? 'Catégories' : 'Categories'}</h4>
            <ul className="space-y-3 text-sm">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">{t('home', lang)}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t('about', lang)}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('contact', lang)}</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">{t('legal', lang)}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <p className="text-sm mb-4">
              {lang === 'fr' ? 'Une question, une contribution ?' : 'A question, a contribution?'}
            </p>
            <a href="mailto:contact@sagessedafrique.blog" className="text-accent font-medium hover:underline">
              contact@sagessedafrique.blog
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-widest text-slate-500">
          &copy; {new Date().getFullYear()} Sagesse d&apos;Afrique — {t('allRightsReserved', lang)} — par Malick Diarra
        </div>
      </div>
    </footer>
  );
};

export default Footer;


