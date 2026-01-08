import type { Metadata } from 'next';
import { AppProvider } from '@/lib/context';
import { MemberAuthProvider } from '@/lib/memberAuth';
import NewsletterPopup from '@/components/NewsletterPopup';
import './globals.css';

const SITE_URL = 'https://sagessedafrique.blog';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sagesse d'Afrique - Magazine Editorial sur l'Héritage Africain",
    template: "%s | Sagesse d'Afrique",
  },
  description: "Exploration de l'héritage intellectuel et culturel de l'Afrique. Découvrez les penseurs, leaders et innovateurs qui ont façonné le continent et le monde.",
  keywords: ['Afrique', 'histoire africaine', 'culture africaine', 'sagesse', 'philosophie africaine', 'sciences', 'panafricanisme', 'penseurs africains'],
  authors: [{ name: "Sagesse d'Afrique" }],
  creator: "Sagesse d'Afrique",
  publisher: "Sagesse d'Afrique",
  
  // Open Graph par défaut
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: "Sagesse d'Afrique",
    title: "Sagesse d'Afrique - L'Héritage Intellectuel Africain",
    description: "Exploration de l'héritage intellectuel et culturel de l'Afrique pour une humanité plus éclairée.",
    images: [
      {
        url: '/logo-sagesse.png',
        width: 1200,
        height: 630,
        alt: "Sagesse d'Afrique",
      },
    ],
  },
  
  // Twitter par défaut
  twitter: {
    card: 'summary_large_image',
    title: "Sagesse d'Afrique",
    description: "Exploration de l'héritage intellectuel et culturel de l'Afrique.",
    images: ['/logo-sagesse.png'],
    creator: '@sagessedafrique',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (à remplir si nécessaire)
  // verification: {
  //   google: 'votre-code-google',
  // },
  
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
};

// Schema.org Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: "Sagesse d'Afrique",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-sagesse.png`,
  description: "Magazine éditorial dédié à l'exploration de l'héritage intellectuel et culturel de l'Afrique.",
  sameAs: [
    'https://twitter.com/sagessedafrique',
    'https://facebook.com/sagessedafrique',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@sagessedafrique.blog',
    contactType: 'customer service',
  },
};

// Schema.org WebSite
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: "Sagesse d'Afrique",
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G77L80MD0W" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-G77L80MD0W');`,
          }}
        />
        {/* End Google Analytics 4 */}
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MVDCZPZN');`,
          }}
        />
        {/* End Google Tag Manager */}
        
        {/* Matomo Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
var _paq = window._paq = window._paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u="https://sagessedafrique.blog/stats/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '1']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();
            `,
          }}
        />
        {/* End Matomo Analytics */}
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MVDCZPZN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <AppProvider>
          <MemberAuthProvider>
            {children}
            <NewsletterPopup />
          </MemberAuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}


