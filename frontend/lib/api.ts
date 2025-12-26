const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  takeaway: string;
  heroImage: string | null;
  featured: boolean;
  views: number;
  readingMinutes: number;
  publishedAt: string;
  author: { id: number; name: string; avatar?: string | null; bio?: string | null };
  category: { slug: string; name: string } | null;
  tags: { slug: string; name: string }[];
  dossiers: { slug: string; title: string }[];
  personnaliteCategorie?: { slug: string; nom: string } | null;
}

export interface Category {
  id: number;
  slug: string;
  image: string | null;
  name: string;
  description: string;
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
  };
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
  categorieId: number;
  image: string | null;
  youtubeUrl: string | null;
  articleId: number | null;
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

  async getPersonnaliteAdmin(id: number): Promise<PersonnaliteAdmin> {
    return this.fetch(`/personnalites/admin/${id}`);
  }

  async createPersonnalite(data: { slug: string; nom: string; categorieId: number; image?: string | null; youtubeUrl?: string | null; articleId?: number | null }): Promise<PersonnaliteAdmin> {
    return this.fetch('/personnalites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePersonnalite(id: number, data: { slug: string; nom: string; categorieId: number; image?: string | null; youtubeUrl?: string | null; articleId?: number | null }): Promise<PersonnaliteAdmin> {
    return this.fetch(`/personnalites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePersonnalite(id: number): Promise<void> {
    return this.fetch(`/personnalites/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
