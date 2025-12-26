'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';

const POPUP_DELAY = 45000; // 45 seconds
const STORAGE_KEY = 'newsletter_popup_dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function NewsletterPopup() {
  const { lang } = useApp();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if popup was dismissed recently
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      if (Date.now() - dismissedTime < DISMISS_DURATION) {
        return; // Don't show popup
      }
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setShow(true);
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setShow(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // TODO: Intégrer avec service email
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
    
    // Auto-close after success
    setTimeout(() => {
      handleDismiss();
    }, 3000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors z-10"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-8 text-center">
          <span className="text-5xl mb-4 block">📚</span>
          <h2 className="text-2xl font-serif font-bold mb-2">
            {lang === 'fr' 
              ? 'Rejoignez la Communauté' 
              : 'Join the Community'}
          </h2>
          <p className="text-white/80 text-sm">
            {lang === 'fr'
              ? 'Des milliers de lecteurs reçoivent déjà nos articles exclusifs'
              : 'Thousands of readers already receive our exclusive articles'}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {submitted ? (
            <div className="text-center py-4">
              <span className="text-5xl mb-4 block">🎉</span>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                {lang === 'fr' ? 'Bienvenue !' : 'Welcome!'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {lang === 'fr'
                  ? 'Vérifiez votre boîte mail pour confirmer votre inscription.'
                  : 'Check your inbox to confirm your subscription.'}
              </p>
            </div>
          ) : (
            <>
              {/* Benefits */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-sm">
                  <span className="text-accent text-lg">✓</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {lang === 'fr'
                      ? 'Articles inédits chaque semaine'
                      : 'Exclusive articles every week'}
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="text-accent text-lg">✓</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {lang === 'fr'
                      ? 'Accès aux guides PDF gratuits'
                      : 'Access to free PDF guides'}
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="text-accent text-lg">✓</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {lang === 'fr'
                      ? 'Découvertes historiques exclusives'
                      : 'Exclusive historical discoveries'}
                  </span>
                </li>
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'fr' ? 'Entrez votre email' : 'Enter your email'}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-center"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-accent text-slate-900 rounded-lg font-bold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <>
                      {lang === 'fr' ? "Rejoindre gratuitement" : 'Join for free'}
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-center text-slate-400 mt-4">
                {lang === 'fr'
                  ? '🔒 Pas de spam. Désabonnement en 1 clic.'
                  : '🔒 No spam. Unsubscribe in 1 click.'}
              </p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

