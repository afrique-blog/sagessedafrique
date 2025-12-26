'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { api, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EditorialPolicyPage() {
  const { lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories(lang).then(setCategories).catch(console.error);
  }, [lang]);

  const content = {
    fr: {
      title: 'Politique Éditoriale',
      subtitle: 'Nos principes et engagements',
      intro: "Sagesse d'Afrique est un magazine éditorial indépendant dédié à l'exploration et à la valorisation de l'héritage intellectuel, culturel et historique du continent africain. Cette politique éditoriale définit nos principes, nos méthodes et nos engagements envers nos lecteurs.",
      sections: [
        {
          title: '🎯 Notre Mission',
          content: `Notre mission est de rétablir l'Afrique à sa juste place dans l'histoire universelle en mettant en lumière les contributions intellectuelles, scientifiques et culturelles du continent.

Nous croyons que la connaissance du passé éclaire le présent et prépare l'avenir. C'est pourquoi nous nous engageons à produire un contenu rigoureux, accessible et inspirant.`,
        },
        {
          title: '📚 Principes Éditoriaux',
          content: `**Rigueur académique** : Chaque article est basé sur des sources fiables et vérifiables. Nous citons systématiquement nos références et privilégions les travaux d'historiens, d'anthropologues et de chercheurs reconnus.

**Équilibre et nuance** : Nous évitons les généralisations hâtives et les récits simplistes. L'histoire africaine est riche et complexe ; nous nous efforçons de refléter cette diversité.

**Accessibilité** : Nous rendons le savoir académique accessible au grand public sans sacrifier la précision. Notre écriture est claire, engageante et pédagogique.

**Indépendance** : Sagesse d'Afrique n'est affilié à aucun parti politique, organisation religieuse ou groupe d'intérêt. Nos analyses sont guidées uniquement par la recherche de la vérité historique.`,
        },
        {
          title: '🔍 Méthodologie',
          content: `**Recherche documentaire** : Nos articles s'appuient sur des archives, des études académiques, des ouvrages de référence et des entretiens avec des experts.

**Vérification des faits** : Chaque information factuelle est recoupée avec plusieurs sources indépendantes avant publication.

**Mise à jour** : Nous mettons à jour nos articles lorsque de nouvelles recherches ou découvertes apportent des éclairages pertinents.

**Sources** : Une section "Sources & Références" accompagne chaque article approfondi, permettant aux lecteurs de poursuivre leurs recherches.`,
        },
        {
          title: '✍️ Contributions et Auteurs',
          content: `Notre équipe éditoriale est composée d'historiens, de chercheurs et de passionnés d'histoire africaine. Chaque auteur est identifié et ses qualifications sont mentionnées.

Nous accueillons les contributions externes sous réserve qu'elles respectent notre ligne éditoriale et nos standards de qualité. Les propositions d'articles peuvent être envoyées à contact@sagessedafrique.blog.`,
        },
        {
          title: '🤝 Engagement envers les Lecteurs',
          content: `**Transparence** : Nous distinguons clairement les faits des opinions. Lorsqu'un article contient une analyse personnelle, elle est identifiée comme telle.

**Correction des erreurs** : Si une erreur est portée à notre attention, nous nous engageons à la corriger rapidement et de manière visible.

**Dialogue** : Nous encourageons les retours et les discussions. Les commentaires constructifs contribuent à enrichir notre travail.

**Respect** : Nous traitons tous les sujets avec respect et dignité, évitant les caricatures et les représentations dégradantes.`,
        },
        {
          title: '📖 Thématiques Couvertes',
          content: `• **Biographies** : Portraits de personnalités africaines remarquables
• **Histoire** : Des civilisations antiques aux mouvements contemporains
• **Philosophie** : Pensée africaine traditionnelle et contemporaine
• **Sciences** : Contributions africaines aux sciences et technologies
• **Arts & Culture** : Littérature, musique, arts visuels
• **Société** : Analyses des enjeux contemporains du continent`,
        },
        {
          title: '📧 Contact',
          content: `Pour toute question concernant notre politique éditoriale ou pour signaler une erreur, contactez-nous à : **contact@sagessedafrique.blog**

Dernière mise à jour : Décembre 2024`,
        },
      ],
    },
    en: {
      title: 'Editorial Policy',
      subtitle: 'Our principles and commitments',
      intro: "Sagesse d'Afrique is an independent editorial magazine dedicated to exploring and promoting the intellectual, cultural and historical heritage of the African continent. This editorial policy defines our principles, methods and commitments to our readers.",
      sections: [
        {
          title: '🎯 Our Mission',
          content: `Our mission is to restore Africa to its rightful place in universal history by highlighting the continent's intellectual, scientific and cultural contributions.

We believe that knowledge of the past illuminates the present and prepares the future. That's why we are committed to producing rigorous, accessible and inspiring content.`,
        },
        {
          title: '📚 Editorial Principles',
          content: `**Academic rigor**: Each article is based on reliable and verifiable sources. We systematically cite our references and favor the work of recognized historians, anthropologists and researchers.

**Balance and nuance**: We avoid hasty generalizations and simplistic narratives. African history is rich and complex; we strive to reflect this diversity.

**Accessibility**: We make academic knowledge accessible to the general public without sacrificing accuracy. Our writing is clear, engaging and educational.

**Independence**: Sagesse d'Afrique is not affiliated with any political party, religious organization or interest group. Our analyses are guided solely by the search for historical truth.`,
        },
        {
          title: '🔍 Methodology',
          content: `**Documentary research**: Our articles are based on archives, academic studies, reference works and interviews with experts.

**Fact-checking**: Each factual information is cross-checked with several independent sources before publication.

**Updates**: We update our articles when new research or discoveries provide relevant insights.

**Sources**: A "Sources & References" section accompanies each in-depth article, allowing readers to continue their research.`,
        },
        {
          title: '✍️ Contributors and Authors',
          content: `Our editorial team is made up of historians, researchers and enthusiasts of African history. Each author is identified and their qualifications are mentioned.

We welcome external contributions provided they respect our editorial line and quality standards. Article proposals can be sent to contact@sagessedafrique.blog.`,
        },
        {
          title: '🤝 Commitment to Readers',
          content: `**Transparency**: We clearly distinguish facts from opinions. When an article contains personal analysis, it is identified as such.

**Error correction**: If an error is brought to our attention, we commit to correcting it quickly and visibly.

**Dialogue**: We encourage feedback and discussions. Constructive comments help enrich our work.

**Respect**: We treat all subjects with respect and dignity, avoiding caricatures and degrading representations.`,
        },
        {
          title: '📖 Topics Covered',
          content: `• **Biographies**: Portraits of remarkable African personalities
• **History**: From ancient civilizations to contemporary movements
• **Philosophy**: Traditional and contemporary African thought
• **Sciences**: African contributions to science and technology
• **Arts & Culture**: Literature, music, visual arts
• **Society**: Analysis of contemporary issues on the continent`,
        },
        {
          title: '📧 Contact',
          content: `For any questions regarding our editorial policy or to report an error, contact us at: **contact@sagessedafrique.blog**

Last updated: December 2024`,
        },
      ],
    },
  };

  const c = content[lang];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{c.title}</h1>
            <p className="text-xl text-white/80">{c.subtitle}</p>
          </div>
        </section>

        {/* Content */}
        <article className="container mx-auto px-4 py-16 max-w-3xl">
          {/* Intro */}
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-accent">
            {c.intro}
          </p>

          {/* Sections */}
          <div className="space-y-12">
            {c.sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                  {section.title}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIdx) => (
                    <p 
                      key={pIdx} 
                      className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ 
                        __html: paragraph
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-slate-100">$1</strong>')
                          .replace(/^• /gm, '<span class="text-accent mr-2">•</span>')
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link 
              href="/about"
              className="inline-flex items-center gap-2 text-primary dark:text-accent hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {lang === 'fr' ? 'Retour à À propos' : 'Back to About'}
            </Link>
          </div>
        </article>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

