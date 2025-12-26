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
      <Header />
      <main className="flex-grow">
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {lang === 'fr' ? 'A Propos' : 'About'}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              {lang === 'fr' 
                ? "Decouvrez la vision et la mission de Sagesse d Afrique"
                : "Discover the vision and mission of Sagesse d Afrique"}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
              <div className="md:w-1/3">
                <div className="sticky top-24">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden relative mb-4">
                    <Image 
                      src="/malick-diarra.png" 
                      alt="Malick Diarra"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-center">Malick Diarra</h3>
                  <p className="text-center text-slate-500 text-sm">
                    {lang === 'fr' ? 'Fondateur et Redacteur en chef' : 'Founder and Editor-in-Chief'}
                  </p>
                </div>
              </div>
              <div className="md:w-2/3 space-y-6">
                <h2 className="text-3xl font-serif font-bold">
                  {lang === 'fr' ? 'Notre Mission' : 'Our Mission'}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'fr' 
                    ? "Sagesse d Afrique est ne d une conviction profonde : l histoire et les savoirs africains meritent d etre celebres, etudies et transmis avec la rigueur et le respect qu ils commandent."
                    : "Sagesse d Afrique was born from a deep conviction: African history and knowledge deserve to be celebrated, studied and transmitted with the rigor and respect they command."}
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'fr'
                    ? "A travers nos articles, dossiers et analyses, nous explorons le genie des civilisations africaines, des pyramides de l Egypte ancienne aux universites de Tombouctou."
                    : "Through our articles, reports and analyses, we explore the genius of African civilizations, from the pyramids of ancient Egypt to the universities of Timbuktu."}
                </p>
                <blockquote className="border-l-4 border-accent pl-6 py-2 italic text-xl">
                  {lang === 'fr'
                    ? "L humanite a un futur parce qu elle a un passe a partager."
                    : "Humanity has a future because it has a past to share."}
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

                {/* Notre Méthode */}
                <h2 className="text-3xl font-serif font-bold pt-8">
                  {lang === 'fr' ? 'Notre Méthode' : 'Our Method'}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'fr'
                    ? 'Chaque article publié sur Sagesse d\'Afrique suit un processus éditorial rigoureux :'
                    : 'Each article published on Sagesse d\'Afrique follows a rigorous editorial process:'}
                </p>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>{lang === 'fr' 
                      ? 'Recherche approfondie dans des sources académiques et archives historiques'
                      : 'In-depth research in academic sources and historical archives'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>{lang === 'fr'
                      ? 'Vérification croisée des informations avec plusieurs sources fiables'
                      : 'Cross-verification of information with multiple reliable sources'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>{lang === 'fr'
                      ? 'Relecture et validation par des spécialistes du domaine'
                      : 'Proofreading and validation by domain specialists'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>{lang === 'fr'
                      ? 'Citation systématique des œuvres et auteurs de référence'
                      : 'Systematic citation of reference works and authors'}</span>
                  </li>
                </ul>

                {/* Politique éditoriale */}
                <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <h3 className="font-bold mb-2">
                    {lang === 'fr' ? 'Notre engagement' : 'Our commitment'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {lang === 'fr'
                      ? 'Nous nous engageons à produire un contenu de qualité, respectueux des faits historiques et des cultures africaines. Pour toute question ou suggestion, n\'hésitez pas à nous contacter.'
                      : 'We are committed to producing quality content that respects historical facts and African cultures. For any questions or suggestions, feel free to contact us.'}
                  </p>
                  <a 
                    href="/contact" 
                    className="inline-block mt-3 text-primary dark:text-accent font-medium hover:underline"
                  >
                    {lang === 'fr' ? 'Nous contacter →' : 'Contact us →'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Newsletter */}
        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-3xl font-serif font-bold mb-4">
              {lang === 'fr' ? 'Restez informé' : 'Stay informed'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {lang === 'fr'
                ? 'Recevez chaque semaine une biographie et un dossier thématique directement dans votre boîte mail. Zéro spam, que du savoir.'
                : 'Receive a biography and a thematic report directly in your inbox every week. Zero spam, only knowledge.'}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder={lang === 'fr' ? 'Votre adresse email' : 'Your email address'}
                className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto sm:min-w-[300px]"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                {lang === 'fr' ? 'S\'abonner' : 'Subscribe'}
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-4">
              {lang === 'fr'
                ? 'En vous inscrivant, vous acceptez de recevoir nos newsletters. Désabonnement possible à tout moment.'
                : 'By signing up, you agree to receive our newsletters. Unsubscribe at any time.'}
            </p>
          </div>
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}
