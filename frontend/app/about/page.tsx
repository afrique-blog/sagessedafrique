'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { api, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
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
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {lang === 'fr' ? 'À Propos' : 'About'}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              {lang === 'fr' 
                ? "Découvrez la vision et la mission de Sagesse d'Afrique"
                : "Discover the vision and mission of Sagesse d'Afrique"}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
              <div className="md:w-1/3">
                <div className="sticky top-24">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden relative mb-4">
                    <Image 
                      src="https://picsum.photos/id/64/400/400" 
                      alt="Malick Diarra"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-center">Malick Diarra</h3>
                  <p className="text-center text-slate-500 text-sm">
                    {lang === 'fr' ? 'Fondateur & Rédacteur en chef' : 'Founder & Editor-in-Chief'}
                  </p>
                </div>
              </div>
              <div className="md:w-2/3 space-y-6">
                <h2 className="text-3xl font-serif font-bold">
                  {lang === 'fr' ? 'Notre Mission' : 'Our Mission'}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'fr' 
                    ? "Sagesse d'Afrique est né d'une conviction profonde : l'histoire et les savoirs africains méritent d'être célébrés, étudiés et transmis avec la rigueur et le respect qu'ils commandent."
                    : "Sagesse d'Afrique was born from a deep conviction: African history and knowledge deserve to be celebrated, studied and transmitted with the rigor and respect they command."}
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'fr'
                    ? "À travers nos articles, dossiers et analyses, nous explorons le génie des civilisations africaines, des pyramides de l'Égypte ancienne aux universités de Tombouctou, des traditions orales aux innovations contemporaines."
                    : "Through our articles, reports and analyses, we explore the genius of African civilizations, from the pyramids of ancient Egypt to the universities of Timbuktu, from oral traditions to contemporary innovations."}
                </p>
                <blockquote className="border-l-4 border-accent pl-6 py-2 italic text-xl">
                  {lang === 'fr'
                    ? "« L'humanité a un futur parce qu'elle a un passé à partager. »"
                    : ""Humanity has a future because it has a past to share.""}
                </blockquote>
                <h2 className="text-3xl font-serif font-bold pt-8">
                  {lang === 'fr' ? 'Notre Approche' : 'Our Approach'}
                </h2>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="text-accent font-bold text-xl">01</span>
                    <div>
                      <h4 className="font-bold mb-1">{lang === 'fr' ? 'Rigueur Historique' : 'Historical Rigor'}</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {lang === 'fr'
                          ? 'Chaque article est basé sur des sources vérifiées et des recherches approfondies.'
                          : 'Each article is based on verified sources and in-depth research.'}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-accent font-bold text-xl">02</span>
                    <div>
                      <h4 className="font-bold mb-1">{lang === 'fr' ? 'Accessibilité' : 'Accessibility'}</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {lang === 'fr'
                          ? 'Nous rendons l\'histoire africaine accessible à tous, experts comme néophytes.'
                          : 'We make African history accessible to everyone, experts and novices alike.'}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-accent font-bold text-xl">03</span>
                    <div>
                      <h4 className="font-bold mb-1">{lang === 'fr' ? 'Perspective Contemporaine' : 'Contemporary Perspective'}</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {lang === 'fr'
                          ? 'Nous établissons des liens entre le passé et les défis actuels.'
                          : 'We establish links between the past and current challenges.'}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

