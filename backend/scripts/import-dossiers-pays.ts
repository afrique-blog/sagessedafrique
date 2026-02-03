/**
 * Script d'import automatique des Dossiers Pays
 * 
 * Usage:
 *   npx ts-node scripts/import-dossiers-pays.ts --source "C:/sagessedafrique/pays"
 * 
 * Options:
 *   --source   Chemin vers le dossier contenant les dossiers pays
 *   --dry-run  Simuler l'import sans créer de données
 *   --force    Forcer l'import même si le pays existe déjà
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { extractCountryName, getCountryInfo } from './country-mapping.js';

const prisma = new PrismaClient();

// Configuration
interface Config {
  sourcePath: string;
  dryRun: boolean;
  force: boolean;
}

// Structure d'une section parsée
interface ParsedSection {
  ordre: number;
  slug: string;
  titleFr: string;
  titleEn: string;
  contentHtmlFr: string;
  contentHtmlEn: string;
  readingMinutes: number;
}

// Mapping des sections vers les slugs
const SECTION_SLUGS: Record<number, string> = {
  0: 'introduction',
  1: 'ouverture',
  2: 'histoire-profonde',
  3: 'terres-et-peuples',
  4: 'geopolitique-economie',
  5: 'culture-art-vivre',
  6: 'carnet-pratique',
};

// Parse les arguments de ligne de commande
function parseArgs(): Config {
  const args = process.argv.slice(2);
  const config: Config = {
    sourcePath: '',
    dryRun: false,
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1]) {
      config.sourcePath = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      config.dryRun = true;
    } else if (args[i] === '--force') {
      config.force = true;
    }
  }

  if (!config.sourcePath) {
    console.error('❌ Erreur: --source est requis');
    console.log('Usage: npx ts-node scripts/import-dossiers-pays.ts --source "C:/sagessedafrique/pays"');
    process.exit(1);
  }

  return config;
}

// Extrait le contenu HTML du body (sans les balises html, head, style, body)
function extractBodyContent(html: string): string {
  // Trouver le contenu entre <body> et </body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    return html;
  }

  let content = bodyMatch[1];

  // Supprimer le h1 initial (titre de section)
  content = content.replace(/<h1[^>]*>.*?<\/h1>/gi, '');

  // Nettoyer les espaces excessifs
  content = content.trim();

  return content;
}

// Extrait le titre principal (h2) du contenu
function extractMainTitle(html: string): string {
  const h2Match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (h2Match) {
    // Supprimer les balises HTML du titre
    return h2Match[1].replace(/<[^>]+>/g, '').trim();
  }
  return '';
}

// Estime le temps de lecture en minutes
function estimateReadingTime(html: string): number {
  // Extraire le texte brut
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(' ').length;
  
  // Moyenne de 200 mots par minute
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(5, Math.min(minutes, 30)); // Entre 5 et 30 minutes
}

// Liste les dossiers pays dans le répertoire source
function listCountryFolders(sourcePath: string): string[] {
  const folders: string[] = [];
  
  try {
    const items = fs.readdirSync(sourcePath);
    
    for (const item of items) {
      const itemPath = path.join(sourcePath, item);
      if (fs.statSync(itemPath).isDirectory() && item.startsWith('Dossier_')) {
        folders.push(item);
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture du dossier: ${sourcePath}`);
    throw error;
  }
  
  return folders.sort();
}

// Parse les fichiers HTML d'un pays
function parseSections(countryPath: string): ParsedSection[] {
  const htmlWebPath = path.join(countryPath, 'HTML_WEB');
  
  if (!fs.existsSync(htmlWebPath)) {
    console.warn(`  ⚠️ Dossier HTML_WEB non trouvé: ${htmlWebPath}`);
    return [];
  }

  const files = fs.readdirSync(htmlWebPath);
  const sections: Map<number, Partial<ParsedSection>> = new Map();

  for (const file of files) {
    // Format: Section_X_LANG_Section_X__Title.html
    const match = file.match(/^Section_(\d+)_(FR|EN)_/i);
    if (!match) continue;

    const sectionNum = parseInt(match[1]);
    const lang = match[2].toUpperCase();
    const filePath = path.join(htmlWebPath, file);

    try {
      const htmlContent = fs.readFileSync(filePath, 'utf-8');
      const bodyContent = extractBodyContent(htmlContent);
      const mainTitle = extractMainTitle(bodyContent);

      if (!sections.has(sectionNum)) {
        sections.set(sectionNum, {
          ordre: sectionNum,
          slug: SECTION_SLUGS[sectionNum] || `section-${sectionNum}`,
        });
      }

      const section = sections.get(sectionNum)!;
      
      if (lang === 'FR') {
        section.titleFr = mainTitle;
        section.contentHtmlFr = bodyContent;
        section.readingMinutes = estimateReadingTime(bodyContent);
      } else if (lang === 'EN') {
        section.titleEn = mainTitle;
        section.contentHtmlEn = bodyContent;
      }
    } catch (error) {
      console.warn(`  ⚠️ Erreur lecture fichier ${file}:`, error);
    }
  }

  // Convertir et filtrer les sections complètes
  const result: ParsedSection[] = [];
  
  for (const [_, section] of sections) {
    if (section.titleFr && section.contentHtmlFr) {
      result.push({
        ordre: section.ordre!,
        slug: section.slug!,
        titleFr: section.titleFr,
        titleEn: section.titleEn || '',
        contentHtmlFr: section.contentHtmlFr,
        contentHtmlEn: section.contentHtmlEn || '',
        readingMinutes: section.readingMinutes || 10,
      });
    }
  }

  return result.sort((a, b) => a.ordre - b.ordre);
}

// Vérifie si un pays existe déjà dans la base de données
async function countryExists(slug: string): Promise<boolean> {
  const existing = await prisma.paysDossier.findUnique({
    where: { slug },
  });
  return !!existing;
}

// Crée un dossier pays et ses chapitres
async function createDossier(
  countryInfo: { code: string; slug: string; titleFr: string; titleEn: string },
  sections: ParsedSection[],
  dryRun: boolean
): Promise<number | null> {
  if (dryRun) {
    console.log(`  📝 [DRY-RUN] Créerait le dossier ${countryInfo.slug} avec ${sections.length} chapitres`);
    return null;
  }

  try {
    // Créer le dossier
    const dossier = await prisma.paysDossier.create({
      data: {
        slug: countryInfo.slug,
        countryCode: countryInfo.code,
        featured: false,
        publishedAt: null, // Non publié par défaut
        translations: {
          create: [
            {
              lang: 'fr',
              title: `${countryInfo.titleFr} : Dossier Complet`,
              subtitle: `Découvrez l'histoire, la culture et les richesses du ${countryInfo.titleFr}`,
            },
            {
              lang: 'en',
              title: `${countryInfo.titleEn}: Complete Report`,
              subtitle: `Discover the history, culture and riches of ${countryInfo.titleEn}`,
            },
          ],
        },
      },
    });

    // Créer les chapitres
    for (const section of sections) {
      await prisma.paysChapitre.create({
        data: {
          dossierId: dossier.id,
          slug: section.slug,
          ordre: section.ordre,
          readingMinutes: section.readingMinutes,
          translations: {
            create: [
              {
                lang: 'fr',
                title: section.titleFr,
                contentHtml: section.contentHtmlFr,
              },
              ...(section.titleEn && section.contentHtmlEn ? [{
                lang: 'en',
                title: section.titleEn,
                contentHtml: section.contentHtmlEn,
              }] : []),
            ],
          },
        },
      });
    }

    return dossier.id;
  } catch (error) {
    console.error(`  ❌ Erreur création dossier:`, error);
    throw error;
  }
}

// Fonction principale
async function main() {
  const config = parseArgs();
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('        IMPORT AUTOMATIQUE DES DOSSIERS PAYS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📁 Source: ${config.sourcePath}`);
  console.log(`🔧 Mode: ${config.dryRun ? 'DRY-RUN (simulation)' : 'RÉEL'}`);
  console.log(`🔄 Force: ${config.force ? 'OUI' : 'NON'}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Vérifier que le dossier source existe
  if (!fs.existsSync(config.sourcePath)) {
    console.error(`❌ Le dossier source n'existe pas: ${config.sourcePath}`);
    process.exit(1);
  }

  // Lister les dossiers pays
  const countryFolders = listCountryFolders(config.sourcePath);
  console.log(`🔍 ${countryFolders.length} dossier(s) pays trouvé(s)\n`);

  if (countryFolders.length === 0) {
    console.log('Aucun dossier à traiter.');
    return;
  }

  // Statistiques
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  // Traiter chaque pays
  for (let i = 0; i < countryFolders.length; i++) {
    const folder = countryFolders[i];
    const countryName = extractCountryName(folder);
    
    console.log(`[${i + 1}/${countryFolders.length}] ${folder}`);

    if (!countryName) {
      console.log(`  ⚠️ Impossible d'extraire le nom du pays - IGNORÉ\n`);
      errors++;
      continue;
    }

    const countryInfo = getCountryInfo(countryName);
    if (!countryInfo) {
      console.log(`  ⚠️ Pays non reconnu: "${countryName}" - IGNORÉ`);
      console.log(`     Ajoutez-le dans country-mapping.ts\n`);
      errors++;
      continue;
    }

    console.log(`  🌍 ${countryInfo.titleFr} (${countryInfo.code})`);

    // Vérifier si existe déjà
    const exists = await countryExists(countryInfo.slug);
    if (exists && !config.force) {
      console.log(`  ✅ Déjà importé - IGNORÉ\n`);
      skipped++;
      continue;
    }

    if (exists && config.force) {
      console.log(`  ⚠️ Existe déjà mais --force activé`);
      // Supprimer l'existant
      if (!config.dryRun) {
        await prisma.paysDossier.delete({
          where: { slug: countryInfo.slug },
        });
        console.log(`  🗑️ Ancien dossier supprimé`);
      }
    }

    // Parser les sections
    const countryPath = path.join(config.sourcePath, folder);
    const sections = parseSections(countryPath);

    if (sections.length === 0) {
      console.log(`  ⚠️ Aucune section trouvée - IGNORÉ\n`);
      errors++;
      continue;
    }

    console.log(`  📄 ${sections.length} section(s) trouvée(s)`);

    // Créer le dossier
    try {
      const dossierId = await createDossier(countryInfo, sections, config.dryRun);
      
      if (config.dryRun) {
        console.log(`  ✅ [DRY-RUN] Import simulé avec succès\n`);
      } else {
        console.log(`  ✅ Importé avec succès (ID: ${dossierId})\n`);
      }
      imported++;
    } catch (error) {
      console.log(`  ❌ Erreur lors de l'import\n`);
      errors++;
    }
  }

  // Résumé
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                        RÉSUMÉ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`✅ Importés: ${imported}`);
  console.log(`⏭️ Ignorés (déjà existants): ${skipped}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log('═══════════════════════════════════════════════════════════════');

  if (!config.dryRun && imported > 0) {
    console.log('\n💡 N\'oubliez pas de:');
    console.log('   1. Ajouter les images hero via l\'admin');
    console.log('   2. Publier les dossiers quand ils sont prêts');
    console.log('   3. Vérifier les contenus importés');
  }
}

// Exécution
main()
  .catch((error) => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
