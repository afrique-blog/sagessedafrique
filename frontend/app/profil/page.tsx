'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMemberAuth, useMemberFavorites, useReadingHistory } from '@/lib/memberAuth';
import { useApp } from '@/lib/context';

const translations = {
  fr: {
    title: "Mon profil",
    loading: "Chargement...",
    notVerified: "Votre email n'est pas vérifié. Vérifiez votre boîte de réception.",
    resendVerification: "Renvoyer l'email de vérification",
    tabs: {
      profile: "Profil",
      favorites: "Favoris",
      history: "Historique",
      settings: "Paramètres",
    },
    profile: {
      memberSince: "Membre depuis",
      editProfile: "Modifier le profil",
      name: "Nom",
      bio: "Biographie",
      bioPlaceholder: "Parlez-nous de vous...",
      language: "Langue préférée",
      newsletter: "Inscrit à la newsletter",
      save: "Enregistrer",
      saving: "Enregistrement...",
      saved: "Profil mis à jour !",
    },
    favorites: {
      title: "Mes articles favoris",
      empty: "Vous n'avez pas encore de favoris",
      explore: "Explorer les articles",
    },
    history: {
      title: "Historique de lecture",
      empty: "Aucun historique de lecture",
      progress: "Lu à",
      readAt: "Lu le",
    },
    settings: {
      title: "Paramètres du compte",
      changePassword: "Changer le mot de passe",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      updatePassword: "Mettre à jour",
      dangerZone: "Zone de danger",
      deleteAccount: "Supprimer mon compte",
      deleteWarning: "Cette action est irréversible. Toutes vos données seront supprimées.",
      logout: "Se déconnecter",
      logoutAll: "Se déconnecter de tous les appareils",
    },
  },
  en: {
    title: "My profile",
    loading: "Loading...",
    notVerified: "Your email is not verified. Check your inbox.",
    resendVerification: "Resend verification email",
    tabs: {
      profile: "Profile",
      favorites: "Favorites",
      history: "History",
      settings: "Settings",
    },
    profile: {
      memberSince: "Member since",
      editProfile: "Edit profile",
      name: "Name",
      bio: "Biography",
      bioPlaceholder: "Tell us about yourself...",
      language: "Preferred language",
      newsletter: "Newsletter subscription",
      save: "Save",
      saving: "Saving...",
      saved: "Profile updated!",
    },
    favorites: {
      title: "My favorite articles",
      empty: "You don't have any favorites yet",
      explore: "Explore articles",
    },
    history: {
      title: "Reading history",
      empty: "No reading history",
      progress: "Read at",
      readAt: "Read on",
    },
    settings: {
      title: "Account settings",
      changePassword: "Change password",
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      updatePassword: "Update",
      dangerZone: "Danger zone",
      deleteAccount: "Delete my account",
      deleteWarning: "This action is irreversible. All your data will be deleted.",
      logout: "Log out",
      logoutAll: "Log out from all devices",
    },
  },
};

export default function ProfilPage() {
  const router = useRouter();
  const { lang } = useApp();
  const { member, isLoading, isAuthenticated, updateProfile, logout } = useMemberAuth();
  const { favorites } = useMemberFavorites();
  const { getHistory } = useReadingHistory();
  const t = translations[lang as keyof typeof translations] || translations.fr;

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    bio: '',
    preferredLang: 'fr',
    isSubscriber: false,
  });

  // Rediriger si non connecté
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/connexion?redirect=/profil');
    }
  }, [isLoading, isAuthenticated, router]);

  // Initialiser le formulaire
  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || '',
        bio: member.bio || '',
        preferredLang: member.preferredLang || 'fr',
        isSubscriber: member.isSubscriber || false,
      });
    }
  }, [member]);

  // Charger l'historique
  useEffect(() => {
    if (activeTab === 'history' && isAuthenticated) {
      getHistory(lang).then(setHistory);
    }
  }, [activeTab, isAuthenticated, lang, getHistory]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage(null);

    const result = await updateProfile({
      name: form.name,
      bio: form.bio,
      preferredLang: form.preferredLang as 'fr' | 'en',
      isSubscriber: form.isSubscriber,
    } as any);

    if (result.success) {
      setMessage({ type: 'success', text: t.profile.saved });
    } else {
      setMessage({ type: 'error', text: result.error || 'Erreur' });
    }

    setIsSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Retour à l'accueil */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{member.name}</h1>
              <p className="text-slate-600 dark:text-slate-400">{member.email}</p>
              {!member.isEmailVerified && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ {t.notVerified}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex">
              {(['profile', 'favorites', 'history', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-slate-600 dark:text-slate-400 hover:text-primary'
                  }`}
                >
                  {t.tabs[tab]}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {message && (
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {message.text}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.profile.name}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.profile.bio}
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder={t.profile.bioPlaceholder}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.profile.language}
                  </label>
                  <select
                    value={form.preferredLang}
                    onChange={(e) => setForm({ ...form, preferredLang: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isSubscriber}
                    onChange={(e) => setForm({ ...form, isSubscriber: e.target.checked })}
                    className="w-5 h-5 text-primary rounded"
                  />
                  <span className="text-slate-700 dark:text-slate-300">{t.profile.newsletter}</span>
                </label>

                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? t.profile.saving : t.profile.save}
                </button>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  {t.favorites.title}
                </h2>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{t.favorites.empty}</p>
                    <Link 
                      href="/categories" 
                      className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
                    >
                      {t.favorites.explore}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Les favoris seraient affichés ici */}
                    <p className="text-slate-600 dark:text-slate-400">
                      {favorites.length} article(s) en favoris
                    </p>
                    <Link 
                      href="/favoris" 
                      className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
                    >
                      Voir tous les favoris
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  {t.history.title}
                </h2>
                {history.length === 0 ? (
                  <p className="text-center py-12 text-slate-600 dark:text-slate-400">
                    {t.history.empty}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div 
                        key={item.articleId}
                        className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                      >
                        {item.article?.heroImage && (
                          <img 
                            src={item.article.heroImage} 
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <Link 
                            href={`/article/${item.article?.slug}`}
                            className="font-medium text-slate-900 dark:text-white hover:text-primary"
                          >
                            {item.article?.title}
                          </Link>
                          <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <span>{t.history.progress} {item.progress}%</span>
                            <span>
                              {t.history.readAt} {new Date(item.readAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {t.settings.title}
                  </h2>
                  
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {t.settings.logout}
                  </button>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-red-600 mb-4">{t.settings.dangerZone}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {t.settings.deleteWarning}
                  </p>
                  <button
                    className="px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    {t.settings.deleteAccount}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
