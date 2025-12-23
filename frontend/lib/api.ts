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
  author: { id: number; name: string };
  category: { slug: string; name: string } | null;
  tags: { slug: string; name: string }[];
  dossiers: { slug: string; title: string }[];
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  articleCount: number;
}

export interface Tag {
  id: number;
  slug: string;
  name: string;
  articleCount: number;
}

export interface Dossier {
  id: number;
  slug: string;
  heroImage: string | null;
  title: string;
  description: string;
  articleCount: number;
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

  // Articles
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

  // Categories
  async getCategories(lang: string = 'fr'): Promise<Category[]> {
    return this.fetch(`/categories?lang=${lang}`);
  }

  async getCategory(slug: string, lang: string = 'fr'): Promise<Category & { articles: Article[] }> {
    return this.fetch(`/categories/${slug}?lang=${lang}`);
  }

  // Tags
  async getTags(lang: string = 'fr'): Promise<Tag[]> {
    return this.fetch(`/tags?lang=${lang}`);
  }

  async getTag(slug: string, lang: string = 'fr'): Promise<Tag & { articles: Article[] }> {
    return this.fetch(`/tags/${slug}?lang=${lang}`);
  }

  // Dossiers
  async getDossiers(lang: string = 'fr'): Promise<Dossier[]> {
    return this.fetch(`/dossiers?lang=${lang}`);
  }

  async getDossier(slug: string, lang: string = 'fr'): Promise<Dossier & { articles: Article[] }> {
    return this.fetch(`/dossiers/${slug}?lang=${lang}`);
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    return this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<any> {
    return this.fetch('/auth/me');
  }
}

export const api = new ApiClient();

