'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sagessedafrique.blog/api';

const translations = {
  fr: {
    title: "Mot de passe oublié",
    subtitle: "Entrez votre email pour recevoir un lien de réinitialisation",
    email: "Adresse email",
    emailPlaceholder: "votre@email.com",
    submit: "Envoyer le lien",
    sending: "Envoi en cours...",
    success: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
    backToLogin: "Retour à la connexion",
  },
  en: {
    title: "Forgot password",
    subtitle: "Enter your email to receive a reset link",
    email: "Email address",
    emailPlaceholder: "your@email.com",
    submit: "Send reset link",
    sending: "Sending...",
    success: "If an account exists with this email, you will receive a reset link.",
    backToLogin: "Back to login",
  },
};

export default function MotDePasseOubliePage() {
  const { lang } = useApp();
  const t = translations[lang as keyof typeof translations] || translations.fr;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/members/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur');
      }

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 flex items-center">
      <div className="max-w-md mx-auto w-full px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-bold text-primary font-serif">Sagesse d'Afrique</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.title}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {t.subtitle}
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{t.success}</p>
              <Link 
                href="/connexion"
                className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                {t.backToLogin}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? t.sending : t.submit}
              </button>

              <p className="text-center">
                <Link href="/connexion" className="text-sm text-primary hover:underline">
                  {t.backToLogin}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
