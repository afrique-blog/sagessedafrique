'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface StickyTOCProps {
  sections: TOCItem[];
  readingTime: number;
}

export default function StickyTOC({ sections, readingTime }: StickyTOCProps) {
  const { lang } = useApp();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav className="sticky top-8 p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-lg">
      <h5 className="uppercase text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-4">
        {lang === 'fr' ? 'Sommaire du Dossier' : 'Table of Contents'}
      </h5>
      
      <ul className="space-y-3 text-sm border-l-2 border-gray-100 dark:border-slate-700">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block pl-4 transition-colors border-l-2 ${
                activeSection === section.id
                  ? 'text-yellow-600 dark:text-yellow-500 font-medium border-yellow-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 border-transparent hover:border-yellow-500'
              } ${section.level === 3 ? 'pl-8 text-xs' : ''}`}
              style={{ marginLeft: section.level === 3 ? '0.5rem' : '0' }}
            >
              {section.text}
            </a>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {lang === 'fr' ? 'Temps de lecture estimé :' : 'Estimated reading time:'} <br />
          <span className="text-gray-800 dark:text-gray-200 font-semibold text-base">
            {readingTime} {lang === 'fr' ? 'minutes' : 'minutes'}
          </span>
        </p>
      </div>
    </nav>
  );
}
