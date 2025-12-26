import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Table de redirections statiques (générée à partir de la migration)
// Ces redirections sont chargées au démarrage pour des performances optimales
const REDIRECTS: Record<string, string> = {
  // Articles avec espaces/accents → slugs propres
  '/article/Achille%20Mbembe': '/article/achille-mbembe',
  '/article/Achille Mbembe': '/article/achille-mbembe',
  
  // Tags avec espaces/accents → slugs propres
  '/tag/Pens%C3%A9e%20africaine': '/tag/pensee-africaine',
  '/tag/Pensée africaine': '/tag/pensee-africaine',
  '/tag/Philosophie%20contemporaine': '/tag/philosophie-contemporaine',
  '/tag/Philosophie contemporaine': '/tag/philosophie-contemporaine',
  '/tag/Postcolonialisme': '/tag/postcolonialisme',
  '/tag/Intellectuels%20africains': '/tag/intellectuels-africains',
  '/tag/Intellectuels africains': '/tag/intellectuels-africains',
  
  // Ajouter plus de redirections après la migration...
};

// Cache pour les redirections dynamiques (chargées depuis l'API)
let dynamicRedirects: Record<string, string> | null = null;
let lastFetch = 0;
const CACHE_TTL = 60000; // 1 minute

async function loadDynamicRedirects(): Promise<Record<string, string>> {
  const now = Date.now();
  
  // Utiliser le cache si valide
  if (dynamicRedirects && (now - lastFetch) < CACHE_TTL) {
    return dynamicRedirects;
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/redirects`, {
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const data = await response.json();
      dynamicRedirects = {};
      for (const r of data) {
        dynamicRedirects[r.oldPath] = r.newPath;
      }
      lastFetch = now;
      return dynamicRedirects;
    }
  } catch (error) {
    // Silently fail - use static redirects only
    console.error('Failed to load dynamic redirects:', error);
  }
  
  return {};
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Ignorer les assets, API, et admin
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Vérifier les redirections statiques d'abord (plus rapide)
  const decodedPath = decodeURIComponent(pathname);
  
  // Chercher dans les redirections statiques
  let newPath = REDIRECTS[pathname] || REDIRECTS[decodedPath];
  
  // Si pas trouvé, chercher dans les redirections dynamiques
  if (!newPath) {
    const dynamic = await loadDynamicRedirects();
    newPath = dynamic[pathname] || dynamic[decodedPath];
  }
  
  // Si une redirection est trouvée, faire une 301
  if (newPath) {
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    
    // Log pour debug
    console.log(`301 Redirect: ${pathname} → ${newPath}`);
    
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matcher pour les pages qui peuvent avoir des redirections
    '/article/:path*',
    '/tag/:path*',
    '/personnalites/:path*',
    '/category/:path*',
    '/dossier/:path*',
  ],
};

