
export type Language = 'fr' | 'en';

export interface MultiLangString {
  fr: string;
  en: string;
}

export interface Category {
  slug: string;
  name: MultiLangString;
  description: MultiLangString;
}

export interface Tag {
  slug: string;
  name: MultiLangString;
}

export interface Dossier {
  slug: string;
  title: MultiLangString;
  description: MultiLangString;
  heroImage: string;
}

export interface Article {
  id: number;
  slug: string;
  category: string;
  tags: string[];
  dossiers: string[];
  author: string;
  date: string;
  readingMinutes: number;
  heroImage: string;
  featured?: boolean;
  viewsMock: number;
  lang: {
    fr: {
      title: string;
      excerpt: string;
      contentHtml: string;
      takeaway: string;
    };
    en: {
      title: string;
      excerpt: string;
      contentHtml: string;
      takeaway: string;
    };
  };
}

export interface Dictionary {
  [key: string]: MultiLangString;
}
