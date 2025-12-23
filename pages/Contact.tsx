
import React, { useState } from 'react';
import { useApp } from '../App';

const Contact: React.FC = () => {
  const { lang } = useApp();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold mb-6">{lang === 'fr' ? 'Parlons Ensemble' : 'Let\'s Talk'}</h1>
        <p className="text-slate-500 text-lg">{lang === 'fr' ? 'Une suggestion, une question ou une proposition de collaboration ?' : 'A suggestion, a question, or a collaboration proposal?'}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="space-y-8">
           <div>
             <h4 className="text-xs uppercase tracking-widest font-bold mb-2 text-primary">{lang === 'fr' ? 'Écrivez-nous' : 'Write to us'}</h4>
             <p className="font-medium">contact@sagessedafrique.blog</p>
           </div>
           <div>
             <h4 className="text-xs uppercase tracking-widest font-bold mb-2 text-primary">{lang === 'fr' ? 'Suivez Malick' : 'Follow Malick'}</h4>
             <p className="font-medium">@DiarraHistory</p>
           </div>
        </div>

        <div className="md:col-span-2">
           {sent ? (
             <div className="bg-green-50 text-green-700 p-8 rounded-2xl border border-green-200 animate-in fade-in zoom-in duration-500">
               <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
               <p>Merci pour votre message. Malick Diarra vous répondra dans les plus brefs délais.</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-tighter text-slate-400">Nom</label>
                   <input required type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-tighter text-slate-400">Email</label>
                   <input required type="email" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20" />
                 </div>
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-tighter text-slate-400">Sujet</label>
                   <input required type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20" />
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-tighter text-slate-400">Message</label>
                   <textarea required rows={6} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20"></textarea>
               </div>
               <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                  {lang === 'fr' ? 'Envoyer le message' : 'Send Message'}
               </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
