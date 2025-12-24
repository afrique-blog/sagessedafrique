import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
// Existing data from the original application
const categories = [
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
        description: { fr: "L'expression créative sous toutes ses formes.", en: 'Creative expression in all its forms.' }
    },
    {
        slug: 'leadership',
        name: { fr: 'Leadership', en: 'Leadership' },
        description: { fr: 'Figures de proue et visions politiques.', en: 'Leading figures and political visions.' }
    },
    {
        slug: 'medecine',
        name: { fr: 'Médecine', en: 'Medicine' },
        description: { fr: "L'art de la guérison à travers les âges.", en: 'The art of healing through the ages.' }
    }
];
const tags = [
    { slug: 'egypte', name: { fr: 'Égypte', en: 'Egypt' } },
    { slug: 'astronomie', name: { fr: 'Astronomie', en: 'Astronomy' } },
    { slug: 'physique', name: { fr: 'Physique', en: 'Physics' } },
    { slug: 'resistances', name: { fr: 'Résistances', en: 'Resistances' } },
    { slug: 'innovation', name: { fr: 'Innovation', en: 'Innovation' } },
    { slug: 'ethique', name: { fr: 'Éthique', en: 'Ethics' } },
    { slug: 'mathematiques', name: { fr: 'Mathématiques', en: 'Mathematics' } },
    { slug: 'anthropologie', name: { fr: 'Anthropologie', en: 'Anthropology' } },
    { slug: 'panafricanisme', name: { fr: 'Panafricanisme', en: 'Pan-Africanism' } },
    { slug: 'architecture', name: { fr: 'Architecture', en: 'Architecture' } },
    { slug: 'ecologie', name: { fr: 'Écologie', en: 'Ecology' } },
    { slug: 'femmes', name: { fr: 'Femmes pionnières', en: 'Pioneer Women' } }
];
const dossiers = [
    {
        slug: 'pionniers-du-savoir',
        title: { fr: 'Pionniers du Savoir', en: 'Pioneers of Knowledge' },
        description: { fr: 'Ceux qui ont jeté les bases de la science moderne.', en: 'Those who laid the foundations of modern science.' },
        heroImage: 'https://picsum.photos/id/101/800/400'
    },
    {
        slug: 'figures-de-la-liberte',
        title: { fr: 'Figures de la Liberté', en: 'Figures of Freedom' },
        description: { fr: "Les leaders qui ont changé le cours de l'histoire politique.", en: 'Leaders who changed the course of political history.' },
        heroImage: 'https://picsum.photos/id/102/800/400'
    },
    {
        slug: 'renaissance-culturelle',
        title: { fr: 'Renaissance Culturelle', en: 'Cultural Renaissance' },
        description: { fr: "L'Afrique au cœur des mouvements artistiques mondiaux.", en: 'Africa at the heart of global artistic movements.' },
        heroImage: 'https://picsum.photos/id/103/800/400'
    },
    {
        slug: 'sagesse-ancestraux',
        title: { fr: 'Sagesse Ancestrale', en: 'Ancestral Wisdom' },
        description: { fr: 'Les systèmes philosophiques oubliés.', en: 'Forgotten philosophical systems.' },
        heroImage: 'https://picsum.photos/id/104/800/400'
    },
    {
        slug: 'afrique-futur',
        title: { fr: 'Afrique Futur', en: 'Africa Future' },
        description: { fr: "L'innovation technologique contemporaine.", en: 'Contemporary technological innovation.' },
        heroImage: 'https://picsum.photos/id/105/800/400'
    }
];
const articles = [
    {
        slug: 'imhotep-premier-architecte',
        category: 'sciences',
        tags: ['architecture', 'egypte', 'innovation'],
        dossiers: ['pionniers-du-savoir'],
        readingMinutes: 10,
        heroImage: 'https://picsum.photos/id/10/1200/600',
        featured: true,
        views: 4500,
        publishedAt: new Date('2025-10-12'),
        translations: {
            fr: {
                title: "Imhotep : L'architecte de l'éternité",
                excerpt: 'Bien avant la Grèce classique, Imhotep concevait la pyramide à degrés de Saqqarah, révolutionnant l\'ingénierie mondiale.',
                takeaway: "Imhotep est considéré comme le premier ingénieur, architecte et médecin connu de l'histoire de l'humanité.",
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
        slug: 'cheikh-anta-diop-science',
        category: 'histoire',
        tags: ['physique', 'anthropologie', 'egypte'],
        dossiers: ['pionniers-du-savoir'],
        readingMinutes: 12,
        heroImage: 'https://picsum.photos/id/20/1200/600',
        featured: false,
        views: 3200,
        publishedAt: new Date('2025-11-05'),
        translations: {
            fr: {
                title: "Cheikh Anta Diop : Redonner à l'Afrique sa mémoire scientifique",
                excerpt: "Le physicien sénégalais a prouvé scientifiquement l'origine africaine de la civilisation égyptienne.",
                takeaway: "Ses travaux ont révolutionné l'historiographie africaine en alliant physique nucléaire et anthropologie.",
                contentHtml: `
          <h2>Un savant pluridisciplinaire</h2>
          <p>Cheikh Anta Diop n'était pas seulement un historien. Formé en physique nucléaire au laboratoire des Curie, il a utilisé la datation au carbone 14 pour ses recherches.</p>
          <p>Son œuvre majeure, <i>Nations nègres et culture</i>, a contesté les fondements de l'égyptologie occidentale de son époque.</p>
        `
            },
            en: {
                title: "Cheikh Anta Diop: Restoring Africa's Scientific Memory",
                excerpt: 'The Senegalese physicist scientifically proved the African origin of Egyptian civilization.',
                takeaway: 'His work revolutionized African historiography by combining nuclear physics and anthropology.',
                contentHtml: `
          <h2>A Multidisciplinary Scholar</h2>
          <p>Cheikh Anta Diop was not just a historian. Trained in nuclear physics at the Curie laboratory, he used carbon-14 dating for his research.</p>
        `
            }
        }
    },
    {
        slug: 'wangari-maathai-ecologie',
        category: 'leadership',
        tags: ['ecologie', 'femmes', 'innovation'],
        dossiers: ['figures-de-la-liberte'],
        readingMinutes: 8,
        heroImage: 'https://picsum.photos/id/30/1200/600',
        featured: false,
        views: 2800,
        publishedAt: new Date('2025-09-20'),
        translations: {
            fr: {
                title: 'Wangari Maathai : La force de la Terre',
                excerpt: 'Première femme africaine prix Nobel de la paix, elle a lié écologie et démocratie par le mouvement de la Ceinture Verte.',
                takeaway: "Elle a planté plus de 50 millions d'arbres pour lutter contre l'érosion et l'oppression politique.",
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
        slug: 'ahmed-baba-tombouctou',
        category: 'philosophie',
        tags: ['egypte', 'ethique', 'innovation'],
        dossiers: ['sagesse-ancestraux'],
        readingMinutes: 9,
        heroImage: 'https://picsum.photos/id/40/1200/600',
        featured: false,
        views: 1500,
        publishedAt: new Date('2025-08-15'),
        translations: {
            fr: {
                title: 'Ahmed Baba : Le bibliothécaire de Tombouctou',
                excerpt: "Au XVIe siècle, il a dirigé l'une des plus grandes universités du monde, l'Université de Sankoré.",
                takeaway: "Tombouctou était alors le phare intellectuel du monde musulman et africain.",
                contentHtml: `<p>Ahmed Baba possédait une collection de plus de 1600 ouvrages, traitant d'astronomie, de droit et de logique.</p>`
            },
            en: {
                title: 'Ahmed Baba: The Librarian of Timbuktu',
                excerpt: "In the 16th century, he headed one of the world's largest universities, the University of Sankore.",
                takeaway: 'Timbuktu was then the intellectual lighthouse of the Muslim and African world.',
                contentHtml: `<p>Ahmed Baba owned a collection of over 1,600 works, covering astronomy, law, and logic.</p>`
            }
        }
    }
];
async function main() {
    console.log('🌱 Starting database seed...');
    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@sagessedafrique.blog' },
        update: {},
        create: {
            email: 'admin@sagessedafrique.blog',
            passwordHash,
            name: 'Malick Diarra',
            role: 'admin',
        },
    });
    console.log('✅ Admin user created:', admin.email);
    // Create categories
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                slug: cat.slug,
                translations: {
                    create: [
                        { lang: 'fr', name: cat.name.fr, description: cat.description.fr },
                        { lang: 'en', name: cat.name.en, description: cat.description.en },
                    ],
                },
            },
        });
    }
    console.log('✅ Categories created:', categories.length);
    // Create tags
    for (const tag of tags) {
        await prisma.tag.upsert({
            where: { slug: tag.slug },
            update: {},
            create: {
                slug: tag.slug,
                translations: {
                    create: [
                        { lang: 'fr', name: tag.name.fr },
                        { lang: 'en', name: tag.name.en },
                    ],
                },
            },
        });
    }
    console.log('✅ Tags created:', tags.length);
    // Create dossiers
    for (const dossier of dossiers) {
        await prisma.dossier.upsert({
            where: { slug: dossier.slug },
            update: {},
            create: {
                slug: dossier.slug,
                heroImage: dossier.heroImage,
                translations: {
                    create: [
                        { lang: 'fr', title: dossier.title.fr, description: dossier.description.fr },
                        { lang: 'en', title: dossier.title.en, description: dossier.description.en },
                    ],
                },
            },
        });
    }
    console.log('✅ Dossiers created:', dossiers.length);
    // Create articles
    for (const article of articles) {
        const category = await prisma.category.findUnique({ where: { slug: article.category } });
        if (!category)
            continue;
        const existingArticle = await prisma.article.findUnique({ where: { slug: article.slug } });
        if (existingArticle) {
            console.log(`⏭️  Article already exists: ${article.slug}`);
            continue;
        }
        const createdArticle = await prisma.article.create({
            data: {
                slug: article.slug,
                categoryId: category.id,
                authorId: admin.id,
                heroImage: article.heroImage,
                featured: article.featured,
                views: article.views,
                readingMinutes: article.readingMinutes,
                publishedAt: article.publishedAt,
                translations: {
                    create: [
                        {
                            lang: 'fr',
                            title: article.translations.fr.title,
                            excerpt: article.translations.fr.excerpt,
                            contentHtml: article.translations.fr.contentHtml,
                            takeaway: article.translations.fr.takeaway,
                        },
                        {
                            lang: 'en',
                            title: article.translations.en.title,
                            excerpt: article.translations.en.excerpt,
                            contentHtml: article.translations.en.contentHtml,
                            takeaway: article.translations.en.takeaway,
                        },
                    ],
                },
            },
        });
        // Add tags
        for (const tagSlug of article.tags) {
            const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
            if (tag) {
                await prisma.articleTag.create({
                    data: { articleId: createdArticle.id, tagId: tag.id },
                });
            }
        }
        // Add dossiers
        for (const dossierSlug of article.dossiers) {
            const dossier = await prisma.dossier.findUnique({ where: { slug: dossierSlug } });
            if (dossier) {
                await prisma.articleDossier.create({
                    data: { articleId: createdArticle.id, dossierId: dossier.id },
                });
            }
        }
    }
    console.log('✅ Articles created:', articles.length);
    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📋 Admin credentials:');
    console.log('   Email: admin@sagessedafrique.blog');
    console.log('   Password: admin123');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map