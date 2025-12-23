
import React from 'react';
import { useApp } from '../App';

const Legal: React.FC = () => {
  const { lang } = useApp();

  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl prose prose-slate dark:prose-invert">
      <h1 className="font-serif">{lang === 'fr' ? 'Mentions Légales' : 'Legal Mentions'}</h1>
      <p>
        Ce site est un projet éditorial factice réalisé à des fins de démonstration.
      </p>
      <h2>Éditeur</h2>
      <p>
        Nom : Sagesse d'Afrique Blog<br />
        Directeur de publication : Malick Diarra (Personnage fictif)<br />
        Contact : contact@sagessedafrique.blog
      </p>
      <h2>Hébergement</h2>
      <p>
        Hébergé sur les serveurs de démonstration Cloud.
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus (textes, images, logos) présents sur le site sont la propriété de l'éditeur ou font l'objet d'une licence d'utilisation à but pédagogique. Toute reproduction sans autorisation est interdite.
      </p>
      <h2>Confidentialité</h2>
      <p>
        Nous ne collectons aucune donnée personnelle à votre insu. Le formulaire de contact est une simulation.
      </p>
    </div>
  );
};

export default Legal;
