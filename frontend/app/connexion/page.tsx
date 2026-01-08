'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMemberAuth } from '@/lib/memberAuth';
import { useLanguage } from '@/lib/context';

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
    title: "Connexion",
    subtitle: "Connectez-vous à votre compte",
    email: "Adresse email",
    emailPlaceholder: "votre@email.com",
    password: "Mot de passe",
    passwordPlaceholder: "••••••••",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié ?",
    login: "Se connecter",
    loggingIn: "Connexion...",
    or: "ou continuer avec",
    google: "Google",
    facebook: "Facebook",
    noAccount: "Pas encore de compte ?",
    register: "Créer un compte",
    verified: "Email vérifié avec succès ! Vous pouvez vous connecter.",
  },
  en: {
    title: "Login",
    subtitle: "Sign in to your account",
    email: "Email address",
    emailPlaceholder: "your@email.com",
    password: "Password",
    passwordPlaceholder: "••••••••",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    login: "Log in",
    loggingIn: "Logging in...",
    or: "or continue with",
    google: "Google",
    facebook: "Facebook",
    noAccount: "Don't have an account?",
    register: "Create an account",
    verified: "Email verified successfully! You can now log in.",
  },
};

export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const { login, loginWithGoogle, loginWithFacebook, isAuthenticated } = useMemberAuth();
  const t = translations[lang as keyof typeof translations] || translations.fr;

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/profil';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  // Message de succès après vérification email
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccess(t.verified);
    }
  }, [searchParams, t.verified]);

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

    const result = await loginWithGoogle(response.credential);
    
    if (result.success) {
      const redirect = searchParams.get('redirect') || '/profil';
      router.push(redirect);
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
      const redirect = searchParams.get('redirect') || '/profil';
      router.push(redirect);
    } else {
      setError(result.error || 'Erreur de connexion Facebook');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const result = await login(form.email, form.password);

    if (result.success) {
      const redirect = searchParams.get('redirect') || '/profil';
      router.push(redirect);
    } else {
      setError(result.error || 'Email ou mot de passe incorrect');
    }

    setIsLoading(false);
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
                {t.email}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t.emailPlaceholder}
                required
                autoComplete="email"
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
                  autoComplete="current-password"
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">{t.rememberMe}</span>
              </label>
              
              <Link 
                href="/mot-de-passe-oublie" 
                className="text-sm text-primary hover:underline"
              >
                {t.forgotPassword}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.loggingIn : t.login}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            {t.noAccount}{' '}
            <Link href="/inscription" className="text-primary font-medium hover:underline">
              {t.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
