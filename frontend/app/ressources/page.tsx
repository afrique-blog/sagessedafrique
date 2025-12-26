'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, Category } from '@/lib/api';
import { useEffect } from 'react';

export default function RessourcesPage() {
  const { lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCategories(lang).then(setCategories).catch(console.error);
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await api.subscribe(email, 'ressources');
      setSubmitted(true);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const leadMagnets = [
    {
      id: 'penseurs',
      title: lang === 'fr' ? '10 Penseurs Africains Qui Ont Changé le Monde' : '10 African Thinkers Who Changed the World',
      description: lang === 'fr' 
        ? 'Un guide illustré présentant les philosophes, scientifiques et intellectuels africains les plus influents de l\'histoire.'
        : 'An illustrated guide featuring the most influential African philosophers, scientists and intellectuals in history.',
      image: '/images/lead-magnets/penseurs.jpg',
      pages: 24,
      format: 'PDF',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'empires',
      title: lang === 'fr' ? 'Les Grands Empires Africains' : 'The Great African Empires',
      description: lang === 'fr'
        ? 'Découvrez les civilisations oubliées qui ont façonné l\'histoire du continent : Ghana, Mali, Songhaï, Monomotapa...'
        : 'Discover the forgotten civilizations that shaped the continent\'s history: Ghana, Mali, Songhai, Monomotapa...',
      image: '/images/lead-magnets/empires.jpg',
      pages: 32,
      format: 'PDF',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'proverbes',
      title: lang === 'fr' ? '50 Proverbes de Sagesse Africaine' : '50 Proverbs of African Wisdom',
      description: lang === 'fr'
        ? 'Une collection de proverbes ancestraux avec leur signification profonde et leurs applications modernes.'
        : 'A collection of ancestral proverbs with their deep meaning and modern applications.',
      image: '/images/lead-magnets/proverbes.jpg',
      pages: 18,
      format: 'PDF',
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold uppercase tracking-widest mb-6">
              📚 {lang === 'fr' ? 'Ressources Gratuites' : 'Free Resources'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              {lang === 'fr' 
                ? 'Téléchargez Nos Guides Exclusifs' 
                : 'Download Our Exclusive Guides'}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {lang === 'fr'
                ? 'Des ressources soigneusement préparées pour approfondir votre connaissance de l\'histoire et de la sagesse africaines.'
                : 'Carefully prepared resources to deepen your knowledge of African history and wisdom.'}
            </p>
          </div>
        </section>

        {/* Lead Magnets Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadMagnets.map((magnet) => (
              <div 
                key={magnet.id}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
              >
                {/* Image placeholder */}
                <div className={`relative h-48 bg-gradient-to-br ${magnet.color}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-50">📖</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                    {magnet.format} • {magnet.pages} pages
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-serif font-bold text-xl mb-3 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {magnet.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                    {magnet.description}
                  </p>
                  
                  {submitted ? (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg text-center">
                      <span className="text-2xl mb-2 block">✅</span>
                      {lang === 'fr' 
                        ? 'Lien envoyé par email !' 
                        : 'Link sent to your email!'}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={lang === 'fr' ? 'Votre email' : 'Your email'}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <>
                            <span>📥</span>
                            {lang === 'fr' ? 'Télécharger gratuitement' : 'Download for free'}
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-slate-100 dark:bg-slate-900/50 py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <span className="text-4xl mb-4 block">💌</span>
            <h2 className="text-3xl font-serif font-bold mb-4">
              {lang === 'fr' 
                ? 'Restez Connecté à la Sagesse Africaine' 
                : 'Stay Connected to African Wisdom'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {lang === 'fr'
                ? 'Recevez chaque semaine un article inédit, des découvertes historiques et des réflexions inspirantes directement dans votre boîte mail.'
                : 'Receive an exclusive article, historical discoveries and inspiring reflections directly in your inbox every week.'}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={lang === 'fr' ? 'votre@email.com' : 'your@email.com'}
                className="flex-grow px-5 py-3 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-accent text-slate-900 rounded-full font-bold hover:bg-accent/90 transition-colors whitespace-nowrap"
              >
                {lang === 'fr' ? "S'abonner" : 'Subscribe'}
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-4">
              {lang === 'fr'
                ? '🔒 Nous respectons votre vie privée. Désabonnement en un clic.'
                : '🔒 We respect your privacy. Unsubscribe in one click.'}
            </p>
          </div>
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

