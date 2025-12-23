
import { Article } from '../types';
// Import categories, tags, and dossiers from their respective files in the same directory
import { categories } from './categories';
import { tags } from './tags';
import { dossiers } from './dossiers';

export const articles: Article[] = [
  {
    id: 1,
    slug: 'imhotep-premier-architecte',
    category: 'sciences',
    tags: ['architecture', 'egypte', 'innovation'],
    dossiers: ['pionniers-du-savoir'],
    author: 'Malick Diarra',
    date: '2025-10-12',
    readingMinutes: 10,
    heroImage: 'https://picsum.photos/id/10/1200/600',
    featured: true,
    viewsMock: 4500,
    lang: {
      fr: {
        title: 'Imhotep : L\'architecte de l\'éternité',
        excerpt: 'Bien avant la Grèce classique, Imhotep concevait la pyramide à degrés de Saqqarah, révolutionnant l\'ingénierie mondiale.',
        takeaway: 'Imhotep est considéré comme le premier ingénieur, architecte et médecin connu de l\'histoire de l\'humanité.',
        contentHtml: `
          <h2>Le génie de Saqqarah</h2>
          <p>Imhotep, dont le nom signifie "Celui qui vient en paix", a servi sous le règne du pharaon Djéser au XXVIIe siècle av. J.-C. Il a conçu un monument qui allait changer le monde : la pyramide à degrés.</p>
          <h3>Une révolution technique</h3>
          <p>Avant lui, les tombes étaient de simples mastabas en briques de boue. Imhotep a eu l'idée audacieuse d'empiler six mastabas les uns sur les autres en utilisant de la pierre de taille.</p>
          <blockquote>"Le passage du bois et de la boue à la pierre marque la naissance de l'architecture monumentale."</blockquote>
          <h3>Le père de la médecine ?</h3>
          <p>Bien que connu comme architecte, les textes égyptiens le célèbrent également comme un guérisseur hors pair. Certains historiens voient en lui l'inspiration réelle derrière le serment d'Hippocrate.</p>
        `
      },
      en: {
        title: 'Imhotep: Architect of Eternity',
        excerpt: 'Long before classical Greece, Imhotep designed the Step Pyramid of Saqqara, revolutionizing world engineering.',
        takeaway: 'Imhotep is considered the first known engineer, architect, and physician in human history.',
        contentHtml: `
          <h2>The Genius of Saqqara</h2>
          <p>Imhotep, whose name means "He who comes in peace," served under Pharaoh Djoser in the 27th century BC. He designed a monument that would change the world: the Step Pyramid.</p>
          <h3>A Technical Revolution</h3>
          <p>Before him, tombs were simple mud-brick mastabas. Imhotep had the bold idea of stacking six mastabas on top of each other using dressed stone.</p>
          <h3>Father of Medicine?</h3>
          <p>Though known as an architect, Egyptian texts also celebrate him as an outstanding healer. Some historians see in him the real inspiration behind the Hippocratic Oath.</p>
        `
      }
    }
  },
  {
    id: 2,
    slug: 'cheikh-anta-diop-science',
    category: 'histoire',
    tags: ['physique', 'anthropologie', 'egypte'],
    dossiers: ['pionniers-du-savoir'],
    author: 'Malick Diarra',
    date: '2025-11-05',
    readingMinutes: 12,
    heroImage: 'https://picsum.photos/id/20/1200/600',
    featured: false,
    viewsMock: 3200,
    lang: {
      fr: {
        title: 'Cheikh Anta Diop : Redonner à l\'Afrique sa mémoire scientifique',
        excerpt: 'Le physicien sénégalais a prouvé scientifiquement l\'origine africaine de la civilisation égyptienne.',
        takeaway: 'Ses travaux ont révolutionné l\'historiographie africaine en alliant physique nucléaire et anthropologie.',
        contentHtml: `
          <h2>Un savant pluridisciplinaire</h2>
          <p>Cheikh Anta Diop n'était pas seulement un historien. Formé en physique nucléaire au laboratoire des Curie, he used carbon-14 dating for his research.</p>
          <p>Son œuvre majeure, <i>Nations nègres et culture</i>, a contesté les fondements de l'égyptologie occidentale de son époque.</p>
        `
      },
      en: {
        title: 'Cheikh Anta Diop: Restoring Africa\'s Scientific Memory',
        excerpt: 'The Senegalese physicist scientifically proved the African origin of Egyptian civilization.',
        takeaway: 'His work revolutionized African historiography by combining nuclear physics and anthropology.',
        contentHtml: `
          <h2>A Multidisciplinary Scholar</h2>
          <p>Cheikh Anta Diop was not just an historian. Trained in nuclear physics at the Curie laboratory, he used carbon-14 dating for his research.</p>
        `
      }
    }
  },
  {
    id: 3,
    slug: 'wangari-maathai-ecologie',
    category: 'leadership',
    tags: ['ecologie', 'femmes', 'innovation'],
    dossiers: ['figures-de-la-liberte'],
    author: 'Malick Diarra',
    date: '2025-09-20',
    readingMinutes: 8,
    heroImage: 'https://picsum.photos/id/30/1200/600',
    viewsMock: 2800,
    lang: {
      fr: {
        title: 'Wangari Maathai : La force de la Terre',
        excerpt: 'Première femme africaine prix Nobel de la paix, elle a lié écologie et démocratie par le mouvement de la Ceinture Verte.',
        takeaway: 'Elle a planté plus de 50 millions d\'arbres pour lutter contre l\'érosion et l\'oppression politique.',
        contentHtml: `<p>Wangari Maathai a compris que la dégradation de l'environnement était directement liée à la mauvaise gouvernance.</p>`
      },
      en: {
        title: 'Wangari Maathai: The Force of the Earth',
        excerpt: 'First African woman Nobel Peace Prize winner, she linked ecology and democracy through the Green Belt Movement.',
        takeaway: 'She planted over 50 million trees to fight erosion and political oppression.',
        contentHtml: `<p>Wangari Maathai understood that environmental degradation was directly linked to poor governance.</p>`
      }
    }
  },
  {
    id: 4,
    slug: 'ahmed-baba-tombouctou',
    category: 'philosophie',
    tags: ['egypte', 'ethique', 'innovation'],
    dossiers: ['sagesse-ancestraux'],
    author: 'Malick Diarra',
    date: '2025-08-15',
    readingMinutes: 9,
    heroImage: 'https://picsum.photos/id/40/1200/600',
    viewsMock: 1500,
    lang: {
      fr: {
        title: 'Ahmed Baba : Le bibliothécaire de Tombouctou',
        excerpt: 'Au XVIe siècle, il a dirigé l\'une des plus grandes universités du monde, l\'Université de Sankoré.',
        takeaway: 'Tombouctou était alors le phare intellectuel du monde musulman et africain.',
        contentHtml: `<p>Ahmed Baba possédait une collection de plus de 1600 ouvrages, traitant d'astronomie, de droit et de logique.</p>`
      },
      en: {
        title: 'Ahmed Baba: The Librarian of Timbuktu',
        excerpt: 'In the 16th century, he headed one of the world\'s largest universities, the University of Sankore.',
        takeaway: 'Timbuktu was then the intellectual lighthouse of the Muslim and African world.',
        contentHtml: `<p>Ahmed Baba owned a collection of over 1,600 works, covering astronomy, law, and logic.</p>`
      }
    }
  },
  // Adding more articles for variety
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: 5 + i,
    slug: `article-mock-${i}`,
    category: categories[i % categories.length].slug,
    tags: [tags[i % tags.length].slug],
    dossiers: [dossiers[i % dossiers.length].slug],
    author: 'Malick Diarra',
    date: `2025-07-${10 + i}`,
    readingMinutes: 5 + i,
    heroImage: `https://picsum.photos/id/${50 + i}/800/600`,
    viewsMock: 500 + (i * 100),
    lang: {
      fr: {
        title: `Figure Historique n°${i + 1}`,
        excerpt: `Une exploration fascinante de l'impact de cette figure sur l'humanité.`,
        takeaway: 'Un héritage qui perdure encore aujourd\'hui.',
        contentHtml: '<p>Contenu détaillé à venir.</p>'
      },
      en: {
        title: `Historical Figure #${i + 1}`,
        excerpt: `A fascinating exploration of this figure's impact on humanity.`,
        takeaway: 'A legacy that endures today.',
        contentHtml: '<p>Detailed content coming soon.</p>'
      }
    }
  }))
];
