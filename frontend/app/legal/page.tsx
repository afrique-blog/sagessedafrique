'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';
import { api, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LegalPage() {
  const { lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories(lang).then(setCategories).catch(console.error);
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-slate-100 dark:bg-slate-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-serif font-bold">
              {lang === 'fr' ? 'Mentions Légales' : 'Legal Mentions'}
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto prose dark:prose-invert">
            <h2>{lang === 'fr' ? 'Éditeur du site' : 'Site Publisher'}</h2>
            <p>
              Sagesse d&apos;Afrique<br />
              {lang === 'fr' ? 'Magazine éditorial en ligne' : 'Online editorial magazine'}<br />
              Email: contact@sagessedafrique.blog
            </p>

            <h2>{lang === 'fr' ? 'Directeur de la publication' : 'Publication Director'}</h2>
            <p>Malick Diarra</p>

            <h2>{lang === 'fr' ? 'Hébergement' : 'Hosting'}</h2>
            <p>
              {lang === 'fr' 
                ? 'Ce site est hébergé par des services cloud modernes respectant les normes RGPD.'
                : 'This site is hosted by modern cloud services respecting GDPR standards.'}
            </p>

            <h2>{lang === 'fr' ? 'Propriété intellectuelle' : 'Intellectual Property'}</h2>
            <p>
              {lang === 'fr'
                ? "L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) est la propriété exclusive de Sagesse d'Afrique, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs."
                : "All content on this site (texts, images, graphics, logo, icons, etc.) is the exclusive property of Sagesse d'Afrique, with the exception of trademarks, logos or content belonging to other partner companies or authors."}
            </p>

            <h2>{lang === 'fr' ? 'Protection des données personnelles' : 'Personal Data Protection'}</h2>
            <p>
              {lang === 'fr'
                ? "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant."
                : "In accordance with the General Data Protection Regulation (GDPR), you have the right to access, rectify and delete data concerning you."}
            </p>

            <h2>Cookies</h2>
            <p>
              {lang === 'fr'
                ? "Ce site utilise des cookies essentiels au fonctionnement du site (préférences de langue, thème). Aucun cookie de tracking n'est utilisé sans votre consentement explicite."
                : "This site uses cookies essential to the functioning of the site (language preferences, theme). No tracking cookies are used without your explicit consent."}
            </p>

            <h2>{lang === 'fr' ? 'Contact' : 'Contact'}</h2>
            <p>
              {lang === 'fr'
                ? 'Pour toute question relative à ces mentions légales, vous pouvez nous contacter à :'
                : 'For any questions regarding these legal notices, you can contact us at:'}
              <br />
              <a href="mailto:contact@sagessedafrique.blog" className="text-primary dark:text-accent">
                contact@sagessedafrique.blog
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

