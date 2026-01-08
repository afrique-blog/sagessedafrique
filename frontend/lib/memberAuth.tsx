'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types
export interface Member {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  bio?: string | null;
  preferredLang: string;
  isEmailVerified: boolean;
  isSubscriber: boolean;
}

interface AuthContextType {
  member: Member | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (accessToken: string) => Promise<{ success: boolean; error?: string }>;
  loginWithFacebook: (accessToken: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Member>) => Promise<{ success: boolean; error?: string }>;
  refreshMember: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  preferredLang?: 'fr' | 'en';
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sagessedafrique.blog/api';
const TOKEN_KEY = 'member_token';

// Helper pour les requêtes API
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue');
  }

  return data;
}

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le membre au démarrage
  const refreshMember = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setMember(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiRequest('/members/me');
      setMember(data.member);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMember();
  }, [refreshMember]);

  // Inscription
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest('/members/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      localStorage.setItem(TOKEN_KEY, response.token);
      setMember(response.member);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  // Connexion email/mot de passe
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest('/members/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem(TOKEN_KEY, response.token);
      setMember(response.member);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  // Connexion Google
  const loginWithGoogle = async (accessToken: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest('/members/oauth', {
        method: 'POST',
        body: JSON.stringify({ provider: 'google', accessToken }),
      });

      localStorage.setItem(TOKEN_KEY, response.token);
      setMember(response.member);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  // Connexion Facebook
  const loginWithFacebook = async (accessToken: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest('/members/oauth', {
        method: 'POST',
        body: JSON.stringify({ provider: 'facebook', accessToken }),
      });

      localStorage.setItem(TOKEN_KEY, response.token);
      setMember(response.member);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await apiRequest('/members/logout', { method: 'POST' });
    } catch {
      // Ignorer les erreurs de déconnexion
    }
    localStorage.removeItem(TOKEN_KEY);
    setMember(null);
  };

  // Mise à jour du profil
  const updateProfile = async (data: Partial<Member>): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiRequest('/members/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      setMember(response.member);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const value: AuthContextType = {
    member,
    isLoading,
    isAuthenticated: !!member,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    updateProfile,
    refreshMember,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useMemberAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useMemberAuth must be used within a MemberAuthProvider');
  }
  return context;
}

// Hook pour les favoris persistants
export function useMemberFavorites() {
  const { member, isAuthenticated } = useMemberAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les favoris
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      // Charger depuis localStorage
      const stored = localStorage.getItem('article_favorites');
      setFavorites(stored ? JSON.parse(stored) : []);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest('/members/favorites');
      setFavorites(data.favorites.map((f: any) => f.id));
    } catch {
      // Fallback sur localStorage
      const stored = localStorage.getItem('article_favorites');
      setFavorites(stored ? JSON.parse(stored) : []);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites, member]);

  // Ajouter/retirer des favoris
  const toggleFavorite = async (articleId: number) => {
    const isFav = favorites.includes(articleId);
    const newFavorites = isFav
      ? favorites.filter(id => id !== articleId)
      : [...favorites, articleId];

    setFavorites(newFavorites);

    if (isAuthenticated) {
      try {
        if (isFav) {
          await apiRequest(`/members/favorites/${articleId}`, { method: 'DELETE' });
        } else {
          await apiRequest(`/members/favorites/${articleId}`, { method: 'POST' });
        }
      } catch {
        // Reverter en cas d'erreur
        setFavorites(favorites);
      }
    } else {
      // Sauvegarder dans localStorage
      localStorage.setItem('article_favorites', JSON.stringify(newFavorites));
    }
  };

  const isFavorite = (articleId: number) => favorites.includes(articleId);

  return { favorites, toggleFavorite, isFavorite, isLoading };
}

// Hook pour l'historique de lecture
export function useReadingHistory() {
  const { isAuthenticated } = useMemberAuth();

  const trackReading = useCallback(async (articleId: number, progress: number) => {
    if (!isAuthenticated) return;

    try {
      await apiRequest('/members/reading-history', {
        method: 'POST',
        body: JSON.stringify({ articleId, progress }),
      });
    } catch {
      // Ignorer les erreurs silencieusement
    }
  }, [isAuthenticated]);

  const getHistory = useCallback(async (lang: string = 'fr') => {
    if (!isAuthenticated) return [];

    try {
      const data = await apiRequest(`/members/reading-history?lang=${lang}`);
      return data.history;
    } catch {
      return [];
    }
  }, [isAuthenticated]);

  return { trackReading, getHistory };
}
