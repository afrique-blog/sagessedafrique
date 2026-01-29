/**
 * Utilities for Dossier Pays functionality
 */

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract table of contents from HTML content
 * Parses H2 and H3 tags and generates TOC structure
 */
export function extractSections(htmlContent: string): TOCItem[] {
  if (!htmlContent) return [];

  const sections: TOCItem[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const headings = doc.querySelectorAll('h2, h3');
  
  headings.forEach((heading, index) => {
    const level = heading.tagName === 'H2' ? 2 : 3;
    const text = heading.textContent?.trim() || '';
    
    // Get existing ID or generate one
    let id = heading.id;
    if (!id) {
      // Generate ID from text
      id = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove multiple hyphens
        .trim();
      
      // Ensure uniqueness
      if (sections.find(s => s.id === id)) {
        id = `${id}-${index}`;
      }
      
      // Set the ID on the actual element for anchor navigation
      heading.id = id;
    }
    
    sections.push({ id, text, level });
  });
  
  return sections;
}

/**
 * Get country name from country code
 */
export function getCountryName(countryCode: string | null, lang: 'fr' | 'en' = 'fr'): string {
  const countryNames: Record<string, { fr: string; en: string }> = {
    'ET': { fr: "Éthiopie", en: 'Ethiopia' },
    'SN': { fr: 'Sénégal', en: 'Senegal' },
    'MA': { fr: 'Maroc', en: 'Morocco' },
    'KE': { fr: 'Kenya', en: 'Kenya' },
    'GH': { fr: 'Ghana', en: 'Ghana' },
    'NG': { fr: 'Nigeria', en: 'Nigeria' },
    'ZA': { fr: 'Afrique du Sud', en: 'South Africa' },
    'EG': { fr: 'Égypte', en: 'Egypt' },
  };
  
  if (!countryCode) return lang === 'fr' ? 'ce pays' : 'this country';
  return countryNames[countryCode]?.[lang] || countryCode;
}

/**
 * Add IDs to headings in HTML content (server-side safe)
 */
export function addHeadingIds(htmlContent: string): string {
  if (!htmlContent) return '';
  
  // This is a simple regex-based approach for server-side rendering
  // It adds IDs to h2 and h3 tags that don't have them
  let idCounter = 0;
  const usedIds = new Set<string>();
  
  return htmlContent.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
    // Check if ID already exists
    if (attrs.includes('id=')) {
      return match;
    }
    
    // Generate ID from content
    const text = content.replace(/<[^>]*>/g, '').trim();
    let id = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Ensure uniqueness
    if (usedIds.has(id)) {
      id = `${id}-${idCounter++}`;
    }
    usedIds.add(id);
    
    return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
  });
}
