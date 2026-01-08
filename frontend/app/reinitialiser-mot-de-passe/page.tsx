'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sagessedafrique.blog/api';

const translations = {
  fr: {
    title: "Nouveau mot de passe",
    subtitle: "Créez votre nouveau mot de passe",
    password: "Nouveau mot de passe",
    passwordPlaceholder: "••••••••",
    passwordHint: "Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre",
    confirmPassword: "Confirmer le mot de passe",
    submit: "Réinitialiser",
    resetting: "Réinitialisation...",
    success: "Mot de passe réinitialisé avec succès !",
    loginNow: "Se connecter",
    errors: {
      invalidToken: "Le lien est invalide ou expiré",
      passwordMismatch: "Les mots de passe ne correspondent pas",
    },
  },
  en: {
    title: "New password",
    subtitle: "Create your new password",
    password: "New password",
    passwordPlaceholder: "••••••••",
    passwordHint: "At least 8 characters, 1 uppercase, 1 lowercase, 1 number",
    confirmPassword: "Confirm password",
    submit: "Reset",
    resetting: "Resetting...",
    success: "Password reset successfully!",
    loginNow: "Log in",
    errors: {
      invalidToken: "The link is invalid or expired",
      passwordMismatch: "Passwords do not match",
    },
  },
};

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.fr;
  
  const token = searchParams.get('token');

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError(t.errors.invalidToken);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t.errors.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/members/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur');
      }

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{t.errors.invalidToken}</p>
        <Link 
          href="/mot-de-passe-oublie"
          className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  if (success) {
    return (
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
          {t.loginNow}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {t.password}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder={t.passwordPlaceholder}
            required
            minLength={8}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">{t.passwordHint}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {t.confirmPassword}
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder={t.passwordPlaceholder}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? t.resetting : t.submit}
      </button>
    </form>
  );
}

export default function ReinitialiserMotDePassePage() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.fr;

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

          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
