
import { Category } from '../types';

export const categories: Category[] = [
  { 
    slug: 'sciences', 
    name: { fr: 'Sciences', en: 'Science' },
    description: { fr: 'Découvertes et avancées scientifiques majeures.', en: 'Major scientific discoveries and advances.' }
  },
  { 
    slug: 'histoire', 
    name: { fr: 'Histoire', en: 'History' },
    description: { fr: 'Le récit des civilisations et des tournants historiques.', en: 'The narrative of civilizations and historical turning points.' }
  },
  { 
    slug: 'philosophie', 
    name: { fr: 'Philosophie', en: 'Philosophy' },
    description: { fr: 'Sagesse, pensée critique et systèmes de valeurs.', en: 'Wisdom, critical thinking, and value systems.' }
  },
  { 
    slug: 'arts', 
    name: { fr: 'Arts & Culture', en: 'Arts & Culture' },
    description: { fr: 'L\'expression créative sous toutes ses formes.', en: 'Creative expression in all its forms.' }
  },
  { 
    slug: 'leadership', 
    name: { fr: 'Leadership', en: 'Leadership' },
    description: { fr: 'Figures de proue et visions politiques.', en: 'Leading figures and political visions.' }
  },
  { 
    slug: 'medecine', 
    name: { fr: 'Médecine', en: 'Medicine' },
    description: { fr: 'L\'art de la guérison à travers les âges.', en: 'The art of healing through the ages.' }
  }
];
