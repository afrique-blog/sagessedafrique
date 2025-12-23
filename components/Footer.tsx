
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';
import { categories } from '../data/categories';

const Footer: React.FC = () => {
  const { lang } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-serif font-bold text-white">Sagesse d'Afrique</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {lang === 'fr' 
                ? "Exploration de l'héritage intellectuel et culturel de l'Afrique pour une humanité plus éclairée."
                : "Exploring Africa's intellectual and cultural heritage for a more enlightened humanity."}
            </p>
            <div className="flex gap-4">
              {/* Simple icons placeholders */}
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
                  <Link to={`/category/${cat.slug}`} className="hover:text-white transition-colors">{cat.name[lang]}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">{lang === 'fr' ? 'Accueil' : 'Home'}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{lang === 'fr' ? 'À propos' : 'About'}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{lang === 'fr' ? 'Contact' : 'Contact'}</Link></li>
              <li><Link to="/legal" className="hover:text-white transition-colors">{lang === 'fr' ? 'Mentions légales' : 'Legal Mentions'}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <p className="text-sm mb-4">
              {lang === 'fr' ? 'Une question, une contribution ?' : 'A question, a contribution?'}
            </p>
            <a href="mailto:contact@sagessedafrique.blog" className="text-primary dark:text-accent font-medium hover:underline">
              contact@sagessedafrique.blog
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-widest text-slate-500">
          &copy; {new Date().getFullYear()} Sagesse d'Afrique — {lang === 'fr' ? 'Tous droits réservés' : 'All rights reserved'} — par Malick Diarra
        </div>
      </div>
    </footer>
  );
};

export default Footer;
