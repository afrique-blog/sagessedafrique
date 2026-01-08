'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMemberAuth } from '@/lib/memberAuth';
import { useApp } from '@/lib/context';

declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';

const translations = {
  fr: {
    title: "Rejoindre la communauté",
    subtitle: "Créez votre compte pour accéder à tous les avantages",
    name: "Nom complet",
    namePlaceholder: "Votre nom",
    email: "Adresse email",
    emailPlaceholder: "votre@email.com",
    password: "Mot de passe",
    passwordPlaceholder: "••••••••",
    passwordHint: "Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre",
    confirmPassword: "Confirmer le mot de passe",
    subscribe: "S'inscrire à la newsletter",
    terms: "J'accepte les",
    termsLink: "conditions d'utilisation",
    register: "Créer mon compte",
    registering: "Création en cours...",
    or: "ou continuer avec",
    google: "Google",
    facebook: "Facebook",
    haveAccount: "Déjà un compte ?",
    login: "Se connecter",
    benefits: [
      "💬 Commenter les articles",
      "⭐ Sauvegarder vos favoris",
      "📚 Suivre votre historique",
      "🔔 Notifications personnalisées",
    ],
    errors: {
      passwordMismatch: "Les mots de passe ne correspondent pas",
      acceptTerms: "Vous devez accepter les conditions d'utilisation",
    },
    success: "Compte créé ! Vérifiez votre email.",
  },
  en: {
    title: "Join the community",
    subtitle: "Create your account to access all benefits",
    name: "Full name",
    namePlaceholder: "Your name",
    email: "Email address",
    emailPlaceholder: "your@email.com",
    password: "Password",
    passwordPlaceholder: "••••••••",
    passwordHint: "At least 8 characters, 1 uppercase, 1 lowercase, 1 number",
    confirmPassword: "Confirm password",
    subscribe: "Subscribe to newsletter",
    terms: "I accept the",
    termsLink: "terms of service",
    register: "Create my account",
    registering: "Creating...",
    or: "or continue with",
    google: "Google",
    facebook: "Facebook",
    haveAccount: "Already have an account?",
    login: "Log in",
    benefits: [
      "💬 Comment on articles",
      "⭐ Save your favorites",
      "📚 Track your history",
      "🔔 Personalized notifications",
    ],
    errors: {
      passwordMismatch: "Passwords do not match",
      acceptTerms: "You must accept the terms of service",
    },
    success: "Account created! Check your email.",
  },
};

export default function InscriptionPage() {
  const router = useRouter();
  const { lang } = useApp();
  const { register, loginWithGoogle, loginWithFacebook, isAuthenticated } = useMemberAuth();
  const t = translations[lang as keyof typeof translations] || translations.fr;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subscribe: true,
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profil');
    }
  }, [isAuthenticated, router]);

  // Charger Google SDK
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Charger Facebook SDK
  useEffect(() => {
    if (!FACEBOOK_APP_ID) return;

    window.fbAsyncInit = function() {
      window.FB?.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
      });
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleCallback = async (response: any) => {
    setIsLoading(true);
    setError('');

    // Utiliser le credential (ID token) pour obtenir l'access token
    const result = await loginWithGoogle(response.credential);
    
    if (result.success) {
      router.push('/profil');
    } else {
      setError(result.error || 'Erreur de connexion Google');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    window.google?.accounts.id.prompt();
  };

  const handleFacebookLogin = () => {
    window.FB?.login((response: any) => {
      if (response.authResponse) {
        handleFacebookCallback(response.authResponse.accessToken);
      }
    }, { scope: 'email,public_profile' });
  };

  const handleFacebookCallback = async (accessToken: string) => {
    setIsLoading(true);
    setError('');

    const result = await loginWithFacebook(accessToken);
    
    if (result.success) {
      router.push('/profil');
    } else {
      setError(result.error || 'Erreur de connexion Facebook');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (form.password !== form.confirmPassword) {
      setError(t.errors.passwordMismatch);
      return;
    }

    if (!form.acceptTerms) {
      setError(t.errors.acceptTerms);
      return;
    }

    setIsLoading(true);

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      preferredLang: lang as 'fr' | 'en',
    });

    if (result.success) {
      setSuccess(t.success);
      setTimeout(() => router.push('/profil'), 2000);
    } else {
      setError(result.error || 'Erreur lors de l\'inscription');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Benefits */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-6 font-serif">Sagesse d'Afrique</h2>
              <p className="text-lg mb-8 opacity-90">
                Rejoignez notre communauté de passionnés du patrimoine intellectuel africain.
              </p>
              <ul className="space-y-4">
                {t.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg">
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pt-6 border-t border-white/20">
                <p className="text-sm opacity-75">
                  Déjà plus de 1 000 membres actifs
                </p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">
                {t.title}
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {t.subtitle}
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              {GOOGLE_CLIENT_ID && (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.google}
                </button>
              )}
              
              {FACEBOOK_APP_ID && (
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t.facebook}
                </button>
              )}
            </div>

            {(GOOGLE_CLIENT_ID || FACEBOOK_APP_ID) && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-800 text-slate-500">{t.or}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t.namePlaceholder}
                  required
                  minLength={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t.emailPlaceholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

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

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.subscribe}
                    onChange={(e) => setForm({ ...form, subscribe: e.target.checked })}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{t.subscribe}</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
                    className="w-5 h-5 mt-0.5 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t.terms}{' '}
                    <Link href="/legal" className="text-primary hover:underline">
                      {t.termsLink}
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t.registering : t.register}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              {t.haveAccount}{' '}
              <Link href="/connexion" className="text-primary font-medium hover:underline">
                {t.login}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
