
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';

const NotFound: React.FC = () => {
  const { lang } = useApp();

  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-9xl font-serif font-bold text-slate-200 dark:text-slate-800 mb-8">404</h1>
      <h2 className="text-3xl font-serif font-bold mb-4">
        {lang === 'fr' ? 'Page Introuvable' : 'Page Not Found'}
      </h2>
      <p className="text-slate-500 mb-12 max-w-md mx-auto">
        {lang === 'fr' 
          ? "Le lien que vous avez suivi est peut-être rompu ou la page a été déplacée."
          : "The link you followed may be broken or the page has been moved."}
      </p>
      <Link to="/" className="px-8 py-3 bg-primary text-white rounded font-bold hover:opacity-90 transition-opacity inline-block">
        {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
      </Link>
    </div>
  );
};

export default NotFound;
