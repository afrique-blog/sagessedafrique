
import React from 'react';
import { useApp } from '../App';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const { lang } = useApp();

  return (
    <div className="pb-24">
      <div className="bg-primary text-white py-24 mb-16 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="100" cy="0" r="100" fill="currentColor" /></svg>
         </div>
         <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-8">{lang === 'fr' ? 'Notre Vision' : 'Our Vision'}</h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto italic">
              {lang === 'fr' 
                ? "Restituer la profondeur de l'histoire africaine pour éclairer les défis contemporains."
                : "Restoring the depth of African history to illuminate contemporary challenges."}
            </p>
         </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-20">
          <section className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <img src="https://picsum.photos/id/64/600/600" alt="Malick Diarra" className="rounded-2xl shadow-2xl" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-serif font-bold mb-6">Malick Diarra</h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  {lang === 'fr' 
                    ? "Historien de formation et passionné par les archives oubliées, je consacre ma vie à la transmission de la mémoire. Mon parcours m'a mené des bibliothèques de Tombouctou aux archives de Dakar."
                    : "An historian by training with a passion for forgotten archives, I devote my life to the transmission of memory. My journey has taken me from the libraries of Timbuktu to the archives of Dakar."}
                </p>
                <p>
                  {lang === 'fr'
                    ? "Sagesse d'Afrique n'est pas qu'un blog ; c'est un magazine engagé dans la pédagogie et la déconstruction des clichés."
                    : "Sagesse d'Afrique is not just a blog; it is a magazine committed to education and the deconstruction of clichés."}
                </p>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-12">
             <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-2xl">
               <h3 className="text-xl font-bold mb-4 font-serif">{lang === 'fr' ? 'Rigueur Éditoriale' : 'Editorial Rigor'}</h3>
               <p className="text-sm text-slate-500">
                 {lang === 'fr'
                   ? "Chaque article est sourcé et vérifié. Nous croisons les traditions orales et les preuves archéologiques."
                   : "Every article is sourced and verified. We cross-reference oral traditions and archaeological evidence."}
               </p>
             </div>
             <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-2xl">
               <h3 className="text-xl font-bold mb-4 font-serif">{lang === 'fr' ? 'Ouverture Globale' : 'Global Perspective'}</h3>
               <p className="text-sm text-slate-500">
                 {lang === 'fr'
                   ? "L'histoire de l'Afrique est l'histoire de l'humanité. Nous soulignons les connexions universelles."
                   : "Africa's history is humanity's history. We emphasize universal connections."}
               </p>
             </div>
          </section>

          <div className="text-center pt-12">
            <Link to="/contact" className="px-12 py-4 bg-primary text-white rounded-lg font-bold hover:scale-105 transition-transform inline-block">
               {lang === 'fr' ? 'Me Contacter' : 'Contact Me'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
