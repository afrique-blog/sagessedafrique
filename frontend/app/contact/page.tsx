'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';
import { api, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const { lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getCategories(lang).then(setCategories).catch(console.error);
  }, [lang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {lang === 'fr' ? 'Contact' : 'Contact'}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              {lang === 'fr' 
                ? 'Une question, une suggestion, une collaboration ?'
                : 'A question, a suggestion, a collaboration?'}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">✉️</div>
                <h2 className="text-2xl font-serif font-bold mb-4">
                  {lang === 'fr' ? 'Message envoyé !' : 'Message sent!'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {lang === 'fr' 
                    ? 'Nous vous répondrons dans les plus brefs délais.'
                    : 'We will respond to you as soon as possible.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {lang === 'fr' ? 'Nom' : 'Name'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {lang === 'fr' ? 'Sujet' : 'Subject'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {lang === 'fr' ? 'Message' : 'Message'}
                  </label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                  {lang === 'fr' ? 'Envoyer' : 'Send'}
                </button>
              </form>
            )}

            <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-serif font-bold mb-6 text-center">
                {lang === 'fr' ? 'Autres moyens de nous contacter' : 'Other ways to contact us'}
              </h3>
              <div className="grid md:grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-3xl mb-3">📧</div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <a href="mailto:contact@sagessedafrique.blog" className="text-primary dark:text-accent hover:underline">
                    contact@sagessedafrique.blog
                  </a>
                </div>
                <div>
                  <div className="text-3xl mb-3">🌍</div>
                  <h4 className="font-bold mb-1">{lang === 'fr' ? 'Réseaux sociaux' : 'Social Media'}</h4>
                  <p className="text-slate-500">@sagessedafrique</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

