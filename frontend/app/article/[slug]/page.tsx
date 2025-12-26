import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleClient from './ArticleClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE_URL = 'https://sagessedafrique.blog';

// Fetch article data on server
async function getArticle(slug: string, lang: string = 'fr') {
  try {
    const res = await fetch(`${API_URL}/api/articles/${encodeURIComponent(slug)}?lang=${lang}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Article non trouvé | Sagesse d\'Afrique',
      description: 'Cet article n\'existe pas ou a été déplacé.',
    };
  }

  const title = `${article.title} | Sagesse d'Afrique`;
  const description = article.excerpt || `Découvrez ${article.title} sur Sagesse d'Afrique, votre magazine sur l'héritage intellectuel africain.`;
  const imageUrl = article.heroImage?.startsWith('http') 
    ? article.heroImage 
    : `${SITE_URL}${article.heroImage || '/logo-sagesse.png'}`;
  const articleUrl = `${SITE_URL}/article/${article.slug}`;

  return {
    title,
    description,
    keywords: [
      article.category?.name,
      ...article.tags.map((t: { name: string }) => t.name),
      'Afrique',
      'histoire',
      'culture',
      'sagesse',
    ].filter(Boolean),
    authors: [{ name: article.author.name }],
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: "Sagesse d'Afrique",
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'fr_FR',
    },
    
    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@sagessedafrique',
    },
    
    // Canonical URL
    alternates: {
      canonical: articleUrl,
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

// Generate JSON-LD Schema.org structured data
function generateArticleSchema(article: any) {
  const imageUrl = article.heroImage?.startsWith('http') 
    ? article.heroImage 
    : `${SITE_URL}${article.heroImage || '/logo-sagesse.png'}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      description: article.author.bio || 'Historien et passeur de savoirs africains',
    },
    publisher: {
      '@type': 'Organization',
      name: "Sagesse d'Afrique",
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-sagesse.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/article/${article.slug}`,
    },
    articleSection: article.category?.name,
    keywords: article.tags.map((t: { name: string }) => t.name).join(', '),
    wordCount: Math.round(article.readingMinutes * 200),
    timeRequired: `PT${article.readingMinutes}M`,
  };
}

// Generate BreadcrumbList Schema
function generateBreadcrumbSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.category?.name || 'Articles',
        item: `${SITE_URL}/category/${article.category?.slug || 'biographies'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${SITE_URL}/article/${article.slug}`,
      },
    ],
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(article)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(article)),
        }}
      />
      
      {/* Client Component for interactive UI */}
      <ArticleClient initialArticle={article} slug={params.slug} />
    </>
  );
}
