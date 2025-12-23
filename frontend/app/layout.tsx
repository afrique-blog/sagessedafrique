import type { Metadata } from 'next';
import { AppProvider } from '@/lib/context';
import './globals.css';

export const metadata: Metadata = {
  title: "Sagesse d'Afrique - Magazine Éditorial",
  description: "Exploration de l'héritage intellectuel et culturel de l'Afrique pour une humanité plus éclairée.",
  keywords: ['Afrique', 'histoire', 'culture', 'sagesse', 'philosophie', 'sciences'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

