'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: '📊' },
  { href: '/admin/articles', label: 'Articles', icon: '📝' },
  { href: '/admin/semaine-en-afrique', label: 'Semaine Afrique', icon: '🌍' },
  { href: '/admin/categories', label: 'Catégories', icon: '📁' },
  { href: '/admin/tags', label: 'Tags', icon: '🏷️' },
  { href: '/admin/dossiers', label: 'Dossiers', icon: '📚' },
  { href: '/admin/dossiers-pays', label: 'Dossiers Pays', icon: '🗺️' },
  { href: '/admin/categories-personnalites', label: 'Cat. Personnalités', icon: '👥' },
  { href: '/admin/personnalites', label: 'Personnalités', icon: '👤' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xl font-serif font-bold text-primary dark:text-accent">
            Admin
          </Link>
          <nav className="hidden lg:flex items-center gap-1 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent font-medium'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-slate-400 hover:text-primary dark:hover:text-accent">
            ← Voir le site
          </Link>
          <span className="text-sm text-slate-500 hidden md:inline">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Déconnexion
          </button>
        </div>
      </div>
      {/* Mobile Nav */}
      <nav className="lg:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 text-xs whitespace-nowrap rounded-lg transition-colors ${
              pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent font-medium'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

