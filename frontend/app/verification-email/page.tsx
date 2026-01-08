'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sagessedafrique.blog/api';

const translations = {
  fr: {
    title: "Vérification de l'email",
    verifying: "Vérification en cours...",
    success: "Votre email a été vérifié avec succès !",
    successSubtitle: "Vous pouvez maintenant profiter de toutes les fonctionnalités.",
    error: "La vérification a échoué",
    errorSubtitle: "Le lien est peut-être expiré ou invalide.",
    goToProfile: "Aller à mon profil",
    requestNew: "Demander un nouveau lien",
    backHome: "Retour à l'accueil",
  },
  en: {
    title: "Email verification",
    verifying: "Verifying...",
    success: "Your email has been verified successfully!",
    successSubtitle: "You can now enjoy all features.",
    error: "Verification failed",
    errorSubtitle: "The link may be expired or invalid.",
    goToProfile: "Go to my profile",
    requestNew: "Request new link",
    backHome: "Back to home",
  },
};

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.fr;
  
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage(t.errorSubtitle);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/members/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur de vérification');
        }

        setStatus('success');
        
        // Rediriger vers la connexion après 3 secondes
        setTimeout(() => {
          router.push('/connexion?verified=true');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setErrorMessage((err as Error).message);
      }
    };

    verifyEmail();
  }, [token, router, t.errorSubtitle]);

  return (
    <div className="text-center">
      {status === 'loading' && (
        <>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t.verifying}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.success}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{t.successSubtitle}</p>
          <Link 
            href="/profil"
            className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t.goToProfile}
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.error}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{errorMessage || t.errorSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {t.backHome}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerificationEmailPage() {
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
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.title}
            </h1>
          </div>

          <Suspense fallback={
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-lg text-slate-600 dark:text-slate-400">Chargement...</p>
            </div>
          }>
            <VerificationContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
