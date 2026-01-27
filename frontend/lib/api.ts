const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  takeaway: string;
  sources: string;
  heroImage: string | null;
  featured: boolean;
  views: number;
  readingMinutes: number;
  publishedAt: string;
  youtubeUrl: string | null;
  author: { id: number; name: string; avatar?: string; bio?: string };
  category: { slug: string; name: string } | null;
  tags: { slug: string; name: string }[];
  dossiers: { slug: string; title: string }[];
  personnaliteCategorie?: { slug: string; nom: string } | null;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  articleCount: number;
}

export interface CategoryAdmin {
  id: number;
  slug: string;
  image: string | null;
  translations: { id: number; lang: string; name: string; description: string | null }[];
}

export interface Tag {
  id: number;
  slug: string;
  name: string;
  articleCount: number;
}

export interface TagAdmin {
  id: number;
  slug: string;
  translations: { id: number; lang: string; name: string }[];
}

export interface Dossier {
  id: number;
  slug: string;
  heroImage: string | null;
  title: string;
  description: string;
  articleCount: number;
}

export interface DossierAdmin {
  id: number;
  slug: string;
  heroImage: string | null;
  translations: { id: number; lang: string; title: string; description: string | null }[];
}

export interface CategoriePersonnalite {
  id: number;
  slug: string;
  nom: string;
  description: string;
  image: string | null;
  personnalitesCount: number;
}

export interface CategoriePersonnaliteAdmin {
  id: number;
  slug: string;
  image: string | null;
  translations: { id: number; lang: string; nom: string; description: string }[];
}

export interface Personnalite {
  id: number;
  slug: string;
  nom: string;
  image: string | null;
  youtubeUrl: string | null;
  categorie: {
    id: number;
    slug: string;
    nom: string;
  } | null;
  categories: {
    id: number;
    slug: string;
    nom: string;
  }[];
  article: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    heroImage?: string;
  } | null;
}

export interface PersonnaliteAdmin {
  id: number;
  slug: string;
  nom: string;
  categorieIds: number[];
  categories?: {
    id: number;
    slug: string;
    translations?: { id: number; lang: string; nom: string; description: string }[];
    nom?: string;
  }[];
  image: string | null;
  youtubeUrl: string | null;
  articleId: number | null;
  article?: {
    id: number;
    slug: string;
    title?: string;
    translations?: any[];
  } | null;
  publishedAt: string | null;
}

export interface Comment {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
  parentId?: number;
  replies?: Comment[];
}

export interface CommentAdmin {
  id: number;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  article: {
    id: number;
    slug: string;
    title: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// =====================================================
// UNE SEMAINE EN AFRIQUE (Version simplifiée - HTML direct)
// =====================================================
export interface WeeklyEdition {
  id: number;
  slug: string;
  weekNumber: number;
  year: number;
  title: string | null;
  contentHtml: string | null;
  publishedAt: string | null;
}

export interface WeeklyEditionPreview {
  id: number;
  slug: string;
  weekNumber: number;
  year: number;
  title: string | null;
  publishedAt: string | null;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // =====================================================
  // ARTICLES
  // =====================================================
  async getArticles(params: {
    page?: number;
    limit?: number;
    lang?: string;
    category?: string;
    tag?: string;
    dossier?: string;
    featured?: boolean;
    search?: string;
    includeUnpublished?: boolean;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'date' | 'views' | 'title';
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<PaginatedResponse<Article>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
    return this.fetch(`/articles?${searchParams}`);
  }

  async getArticle(slug: string, lang: string = 'fr'): Promise<Article> {
    return this.fetch(`/articles/${slug}?lang=${lang}`);
  }

  async getArticleById(id: number, lang: string = 'fr'): Promise<Article> {
    return this.fetch(`/articles/admin/${id}?lang=${lang}`);
  }

  async createArticle(data: any): Promise<Article> {
    return this.fetch('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArticle(id: number, data: any): Promise<Article> {
    return this.fetch(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteArticle(id: number): Promise<void> {
    return this.fetch(`/articles/${id}`, { method: 'DELETE' });
  }

  // =====================================================
  // CATEGORIES
  // =====================================================
  async getCategories(lang: string = 'fr'): Promise<Category[]> {
    return this.fetch(`/categories?lang=${lang}`);
  }

  async getCategory(slug: string, lang: string = 'fr'): Promise<Category & { articles: Article[] }> {
    return this.fetch(`/categories/${slug}?lang=${lang}`);
  }

  async getCategoryAdmin(id: number): Promise<CategoryAdmin> {
    return this.fetch(`/categories/admin/${id}`);
  }

  async createCategory(data: { slug: string; image?: string | null; translations: { lang: string; name: string; description?: string }[] }): Promise<CategoryAdmin> {
    return this.fetch('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: number, data: { slug: string; image?: string | null; translations: { lang: string; name: string; description?: string }[] }): Promise<CategoryAdmin> {
    return this.fetch(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.fetch(`/categories/${id}`, { method: 'DELETE' });
  }

  // =====================================================
  // TAGS
  // =====================================================
  async getTags(lang: string = 'fr'): Promise<Tag[]> {
    return this.fetch(`/tags?lang=${lang}`);
  }

  async getTag(slug: string, lang: string = 'fr'): Promise<Tag & { articles: Article[] }> {
    return this.fetch(`/tags/${slug}?lang=${lang}`);
  }

  async getTagAdmin(id: number): Promise<TagAdmin> {
    return this.fetch(`/tags/admin/${id}`);
  }

  async createTag(data: { slug: string; translations: { lang: string; name: string }[] }): Promise<TagAdmin> {
    return this.fetch('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTag(id: number, data: { slug: string; translations: { lang: string; name: string }[] }): Promise<TagAdmin> {
    return this.fetch(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: number): Promise<void> {
    return this.fetch(`/tags/${id}`, { method: 'DELETE' });
  }

  // =====================================================
  // DOSSIERS
  // =====================================================
  async getDossiers(lang: string = 'fr'): Promise<Dossier[]> {
    return this.fetch(`/dossiers?lang=${lang}`);
  }

  async getDossier(slug: string, lang: string = 'fr'): Promise<Dossier & { articles: Article[] }> {
    return this.fetch(`/dossiers/${slug}?lang=${lang}`);
  }

  async getDossierAdmin(id: number): Promise<DossierAdmin> {
    return this.fetch(`/dossiers/admin/${id}`);
  }

  async createDossier(data: { slug: string; heroImage?: string; translations: { lang: string; title: string; description?: string }[] }): Promise<DossierAdmin> {
    return this.fetch('/dossiers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDossier(id: number, data: { slug: string; heroImage?: string; translations: { lang: string; title: string; description?: string }[] }): Promise<DossierAdmin> {
    return this.fetch(`/dossiers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDossier(id: number): Promise<void> {
    return this.fetch(`/dossiers/${id}`, { method: 'DELETE' });
  }

  // =====================================================
  // AUTH
  // =====================================================
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    return this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<any> {
    return this.fetch('/auth/me');
  }

  // =====================================================
  // CATEGORIES DE PERSONNALITES
  // =====================================================
  async getCategoriesPersonnalites(lang: string = 'fr'): Promise<CategoriePersonnalite[]> {
    return this.fetch(`/categories-personnalites?lang=${lang}`);
  }

  async getCategoriePersonnalite(slug: string, lang: string = 'fr'): Promise<CategoriePersonnalite & { personnalites: Personnalite[] }> {
    return this.fetch(`/categories-personnalites/${slug}?lang=${lang}`);
  }

  async getCategoriePersonnaliteAdmin(id: number): Promise<CategoriePersonnaliteAdmin> {
    return this.fetch(`/categories-personnalites/admin/${id}`);
  }

  async createCategoriePersonnalite(data: { slug: string; image?: string | null; translations: { lang: string; nom: string; description: string }[] }): Promise<CategoriePersonnaliteAdmin> {
    return this.fetch('/categories-personnalites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategoriePersonnalite(id: number, data: { slug: string; image?: string | null; translations: { lang: string; nom: string; description: string }[] }): Promise<CategoriePersonnaliteAdmin> {
    return this.fetch(`/categories-personnalites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategoriePersonnalite(id: number): Promise<void> {
    return this.fetch(`/categories-personnalites/${id}`, { method: 'DELETE' });
  }

  // =====================================================
  // PERSONNALITES
  // =====================================================
  async getPersonnalites(lang: string = 'fr'): Promise<Personnalite[]> {
    return this.fetch(`/personnalites?lang=${lang}`);
  }

  async getPersonnalite(slug: string, lang: string = 'fr'): Promise<Personnalite> {
    return this.fetch(`/personnalites/${slug}?lang=${lang}`);
  }

  async getPersonnalitesAdmin(): Promise<PersonnaliteAdmin[]> {
    return this.fetch('/personnalites/admin/all');
  }

  async getPersonnalitesWithStatus(lang: string = 'fr'): Promise<PersonnaliteAdmin[]> {
    return this.fetch(`/personnalites/admin/all?lang=${lang}`);
  }

  async getPersonnaliteAdmin(id: number): Promise<PersonnaliteAdmin> {
    return this.fetch(`/personnalites/admin/${id}`);
  }

  async createPersonnalite(data: { slug: string; nom: string; categorieId?: number; categorieIds?: number[]; image?: string | null; youtubeUrl?: string | null; articleId?: number | null; publishedAt?: string | null }): Promise<PersonnaliteAdmin> {
    return this.fetch('/personnalites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePersonnalite(id: number, data: { slug: string; nom: string; categorieId?: number; categorieIds?: number[]; image?: string | null; youtubeUrl?: string | null; articleId?: number | null; publishedAt?: string | null }): Promise<PersonnaliteAdmin> {
    return this.fetch(`/personnalites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePersonnalite(id: number): Promise<void> {
    return this.fetch(`/personnalites/${id}`, { method: 'DELETE' });
  }

  // =====================================================
  // SUBSCRIBERS / NEWSLETTER
  // =====================================================
  async subscribe(email: string, source?: string): Promise<{ success: boolean; message: string }> {
    return this.fetch('/contacts/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    });
  }

  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    return this.fetch('/contacts/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getSubscribersCount(): Promise<{ count: number }> {
    return this.fetch('/contacts/subscribers/count');
  }

  // =====================================================
  // COMMENTS
  // =====================================================
  async getComments(articleSlug: string): Promise<Comment[]> {
    return this.fetch(`/comments?articleSlug=${articleSlug}`);
  }

  async getCommentsCount(articleSlug: string): Promise<{ count: number }> {
    return this.fetch(`/comments/count?articleSlug=${articleSlug}`);
  }

  async createComment(data: { 
    articleId: number; 
    authorName: string; 
    authorEmail: string; 
    content: string; 
    recaptchaToken: string;
    subscribeNewsletter?: boolean;
    parentId?: number;
  }): Promise<{ success: boolean; message: string }> {
    return this.fetch('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // =====================================================
  // REACTIONS
  // =====================================================
  async getArticleReactions(articleId: number): Promise<{ counts: { like: number; love: number; fire: number }; userReaction: string | null }> {
    return this.fetch(`/articles/${articleId}/reactions`);
  }

  async addArticleReaction(articleId: number, reactionType: string): Promise<{ success: boolean }> {
    return this.fetch(`/articles/${articleId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ reactionType }),
    });
  }

  async deleteArticleReaction(articleId: number, reactionType: string): Promise<{ success: boolean }> {
    return this.fetch(`/articles/${articleId}/reactions/${reactionType}`, {
      method: 'DELETE',
    });
  }

  // Admin
  async getCommentsAdmin(params: { status?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<CommentAdmin>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
    return this.fetch(`/comments/admin?${searchParams}`);
  }

  async getCommentsStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }> {
    return this.fetch('/comments/admin/stats');
  }

  async updateCommentStatus(id: number, status: 'approved' | 'rejected' | 'pending'): Promise<{ success: boolean }> {
    return this.fetch(`/comments/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteComment(id: number): Promise<void> {
    return this.fetch(`/comments/admin/${id}`, { method: 'DELETE' });
  }

  async bulkCommentAction(ids: number[], action: 'approve' | 'reject' | 'delete'): Promise<{ success: boolean; affected: number }> {
    return this.fetch('/comments/admin/bulk', {
      method: 'POST',
      body: JSON.stringify({ ids, action }),
    });
  }

  // =====================================================
  // CONTACTS (Admin)
  // =====================================================
  
  async getContactsAdmin(params: { filter?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
    return this.fetch(`/contacts/admin?${searchParams}`);
  }

  async getContactsStats(): Promise<{ totalContacts: number; subscribers: number; activeSubscribers: number; commenters: number }> {
    return this.fetch('/contacts/admin/stats');
  }

  async updateContact(id: number, data: { name?: string; isSubscriber?: boolean; subscriptionStatus?: string }): Promise<{ success: boolean }> {
    return this.fetch(`/contacts/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContact(id: number): Promise<void> {
    return this.fetch(`/contacts/admin/${id}`, { method: 'DELETE' });
  }

  async exportContacts(filter?: string): Promise<string> {
    const url = filter ? `/contacts/admin/export?filter=${filter}` : '/contacts/admin/export';
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }
    const response = await fetch(`${API_URL}${url}`, { headers });
    return response.text();
  }

  // =====================================================
  // UNE SEMAINE EN AFRIQUE (Version simplifiée)
  // =====================================================

  // Édition courante (dernière publiée)
  async getCurrentWeeklyEdition(): Promise<WeeklyEdition | null> {
    return this.fetch('/weekly/current');
  }

  // Liste des éditions publiées
  async getWeeklyEditions(params: {
    year?: number;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data: WeeklyEditionPreview[]; pagination: { total: number; limit: number; offset: number } }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value));
    });
    return this.fetch(`/weekly/editions?${searchParams}`);
  }

  // Détail d'une édition par slug
  async getWeeklyEdition(slug: string): Promise<WeeklyEdition> {
    return this.fetch(`/weekly/editions/${slug}`);
  }

  // Années disponibles
  async getWeeklyYears(): Promise<number[]> {
    return this.fetch('/weekly/years');
  }

  // =====================================================
  // UNE SEMAINE EN AFRIQUE - ADMIN
  // =====================================================

  async getWeeklyEditionsAdmin(params: { limit?: number; offset?: number } = {}): Promise<{
    data: WeeklyEditionPreview[];
    pagination: { total: number; limit: number; offset: number };
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value));
    });
    return this.fetch(`/weekly/admin/editions?${searchParams}`);
  }

  async getWeeklyEditionAdmin(id: number): Promise<WeeklyEdition> {
    return this.fetch(`/weekly/admin/editions/${id}`);
  }

  async createWeeklyEdition(data: {
    weekNumber: number;
    year: number;
    title?: string;
    contentHtml?: string;
    publishedAt?: string;
  }): Promise<WeeklyEdition> {
    return this.fetch('/weekly/admin/editions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWeeklyEdition(id: number, data: {
    weekNumber?: number;
    year?: number;
    title?: string;
    contentHtml?: string;
    publishedAt?: string;
  }): Promise<WeeklyEdition> {
    return this.fetch(`/weekly/admin/editions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWeeklyEdition(id: number): Promise<void> {
    return this.fetch(`/weekly/admin/editions/${id}`, { method: 'DELETE' });
  }

  async publishWeeklyEdition(id: number, publish: boolean): Promise<WeeklyEdition> {
    return this.fetch(`/weekly/admin/editions/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify({ publish }),
    });
  }
}

export const api = new ApiClient();
