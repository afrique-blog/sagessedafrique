/**
 * Script d'import automatique des Dossiers Pays depuis fichiers JSON
 * 
 * Usage:
 *   npx ts-node scripts/import-dossiers-pays.ts --source "C:/sagessedafrique/pays"
 * 
 * Options:
 *   --source   Chemin vers le dossier contenant les fichiers JSON
 *   --dry-run  Simuler l'import sans créer de données
 *   --force    Forcer l'import même si le pays existe déjà
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

// ============================================================================
// COUNTRY MAPPING (inline pour éviter les problèmes d'import ES modules)
// ============================================================================
const COUNTRY_MAPPING: Record<string, { code: string; slug: string; titleFr: string; titleEn: string }> = {
  // Afrique de l'Ouest
  'Bénin': { code: 'BJ', slug: 'benin', titleFr: 'Bénin', titleEn: 'Benin' },
  'Burkina Faso': { code: 'BF', slug: 'burkina-faso', titleFr: 'Burkina Faso', titleEn: 'Burkina Faso' },
  'Cap-Vert': { code: 'CV', slug: 'cap-vert', titleFr: 'Cap-Vert', titleEn: 'Cape Verde' },
  'Côte d\'Ivoire': { code: 'CI', slug: 'cote-divoire', titleFr: 'Côte d\'Ivoire', titleEn: 'Ivory Coast' },
  'Gambie': { code: 'GM', slug: 'gambie', titleFr: 'Gambie', titleEn: 'Gambia' },
  'Ghana': { code: 'GH', slug: 'ghana', titleFr: 'Ghana', titleEn: 'Ghana' },
  'Guinée': { code: 'GN', slug: 'guinee', titleFr: 'Guinée', titleEn: 'Guinea' },
  'Guinée-Bissau': { code: 'GW', slug: 'guinee-bissau', titleFr: 'Guinée-Bissau', titleEn: 'Guinea-Bissau' },
  'Liberia': { code: 'LR', slug: 'liberia', titleFr: 'Liberia', titleEn: 'Liberia' },
  'Mali': { code: 'ML', slug: 'mali', titleFr: 'Mali', titleEn: 'Mali' },
  'Mauritanie': { code: 'MR', slug: 'mauritanie', titleFr: 'Mauritanie', titleEn: 'Mauritania' },
  'Niger': { code: 'NE', slug: 'niger', titleFr: 'Niger', titleEn: 'Niger' },
  'Nigeria': { code: 'NG', slug: 'nigeria', titleFr: 'Nigeria', titleEn: 'Nigeria' },
  'Sénégal': { code: 'SN', slug: 'senegal', titleFr: 'Sénégal', titleEn: 'Senegal' },
  'Sierra Leone': { code: 'SL', slug: 'sierra-leone', titleFr: 'Sierra Leone', titleEn: 'Sierra Leone' },
  'Togo': { code: 'TG', slug: 'togo', titleFr: 'Togo', titleEn: 'Togo' },
  // Afrique de l'Est
  'Burundi': { code: 'BI', slug: 'burundi', titleFr: 'Burundi', titleEn: 'Burundi' },
  'Comores': { code: 'KM', slug: 'comores', titleFr: 'Comores', titleEn: 'Comoros' },
  'Djibouti': { code: 'DJ', slug: 'djibouti', titleFr: 'Djibouti', titleEn: 'Djibouti' },
  'Érythrée': { code: 'ER', slug: 'erythree', titleFr: 'Érythrée', titleEn: 'Eritrea' },
  'Éthiopie': { code: 'ET', slug: 'ethiopie', titleFr: 'Éthiopie', titleEn: 'Ethiopia' },
  'Kenya': { code: 'KE', slug: 'kenya', titleFr: 'Kenya', titleEn: 'Kenya' },
  'Madagascar': { code: 'MG', slug: 'madagascar', titleFr: 'Madagascar', titleEn: 'Madagascar' },
  'Malawi': { code: 'MW', slug: 'malawi', titleFr: 'Malawi', titleEn: 'Malawi' },
  'Maurice': { code: 'MU', slug: 'maurice', titleFr: 'Maurice', titleEn: 'Mauritius' },
  'Mozambique': { code: 'MZ', slug: 'mozambique', titleFr: 'Mozambique', titleEn: 'Mozambique' },
  'Ouganda': { code: 'UG', slug: 'ouganda', titleFr: 'Ouganda', titleEn: 'Uganda' },
  'Rwanda': { code: 'RW', slug: 'rwanda', titleFr: 'Rwanda', titleEn: 'Rwanda' },
  'Seychelles': { code: 'SC', slug: 'seychelles', titleFr: 'Seychelles', titleEn: 'Seychelles' },
  'Somalie': { code: 'SO', slug: 'somalie', titleFr: 'Somalie', titleEn: 'Somalia' },
  'Soudan du Sud': { code: 'SS', slug: 'soudan-du-sud', titleFr: 'Soudan du Sud', titleEn: 'South Sudan' },
  'Tanzanie': { code: 'TZ', slug: 'tanzanie', titleFr: 'Tanzanie', titleEn: 'Tanzania' },
  'Zambie': { code: 'ZM', slug: 'zambie', titleFr: 'Zambie', titleEn: 'Zambia' },
  'Zimbabwe': { code: 'ZW', slug: 'zimbabwe', titleFr: 'Zimbabwe', titleEn: 'Zimbabwe' },
  // Afrique Centrale
  'Angola': { code: 'AO', slug: 'angola', titleFr: 'Angola', titleEn: 'Angola' },
  'Cameroun': { code: 'CM', slug: 'cameroun', titleFr: 'Cameroun', titleEn: 'Cameroon' },
  'Centrafrique': { code: 'CF', slug: 'centrafrique', titleFr: 'Centrafrique', titleEn: 'Central African Republic' },
  'Congo': { code: 'CG', slug: 'congo', titleFr: 'Congo', titleEn: 'Congo' },
  'RDC': { code: 'CD', slug: 'rdc', titleFr: 'RD Congo', titleEn: 'DR Congo' },
  'République Démocratique du Congo': { code: 'CD', slug: 'rdc', titleFr: 'RD Congo', titleEn: 'DR Congo' },
  'Gabon': { code: 'GA', slug: 'gabon', titleFr: 'Gabon', titleEn: 'Gabon' },
  'Guinée Équatoriale': { code: 'GQ', slug: 'guinee-equatoriale', titleFr: 'Guinée Équatoriale', titleEn: 'Equatorial Guinea' },
  'São Tomé-et-Príncipe': { code: 'ST', slug: 'sao-tome-et-principe', titleFr: 'São Tomé-et-Príncipe', titleEn: 'São Tomé and Príncipe' },
  'Tchad': { code: 'TD', slug: 'tchad', titleFr: 'Tchad', titleEn: 'Chad' },
  // Afrique du Nord
  'Algérie': { code: 'DZ', slug: 'algerie', titleFr: 'Algérie', titleEn: 'Algeria' },
  'Égypte': { code: 'EG', slug: 'egypte', titleFr: 'Égypte', titleEn: 'Egypt' },
  'Libye': { code: 'LY', slug: 'libye', titleFr: 'Libye', titleEn: 'Libya' },
  'Maroc': { code: 'MA', slug: 'maroc', titleFr: 'Maroc', titleEn: 'Morocco' },
  'Soudan': { code: 'SD', slug: 'soudan', titleFr: 'Soudan', titleEn: 'Sudan' },
  'Tunisie': { code: 'TN', slug: 'tunisie', titleFr: 'Tunisie', titleEn: 'Tunisia' },
  // Afrique Australe
  'Afrique du Sud': { code: 'ZA', slug: 'afrique-du-sud', titleFr: 'Afrique du Sud', titleEn: 'South Africa' },
  'Botswana': { code: 'BW', slug: 'botswana', titleFr: 'Botswana', titleEn: 'Botswana' },
  'Eswatini': { code: 'SZ', slug: 'eswatini', titleFr: 'Eswatini', titleEn: 'Eswatini' },
  'Lesotho': { code: 'LS', slug: 'lesotho', titleFr: 'Lesotho', titleEn: 'Lesotho' },
  'Namibie': { code: 'NA', slug: 'namibie', titleFr: 'Namibie', titleEn: 'Namibia' },
};

function getCountryInfo(countryName: string): { code: string; slug: string; titleFr: string; titleEn: string } | null {
  // Recherche exacte
  if (COUNTRY_MAPPING[countryName]) {
    return COUNTRY_MAPPING[countryName];
  }
  // Recherche insensible à la casse et aux accents
  const normalizedName = countryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [name, info] of Object.entries(COUNTRY_MAPPING)) {
    const normalizedKey = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedKey === normalizedName) {
      return info;
    }
  }
  return null;
}

const prisma = new PrismaClient();

// Configuration
interface Config {
  sourcePath: string;
  dryRun: boolean;
  force: boolean;
}

// Structure d'une section JSON (format nouveau - Comores)
interface JsonSectionNew {
  title_fr: string;
  title_en?: string;
  id?: string;
  type?: string;
  html_fr: string;
  html_en?: string;
  image_prompts?: string[];
  references?: string[];
}

// Structure d'une section JSON (format ancien - Cameroun)
interface JsonSectionOld {
  title: string;
  titleEn?: string;
  markdown?: string;
  htmlFr?: string;
  htmlEn?: string;
  imagePrompts?: string[];
  references?: string[];
}

// Structure JSON d'un pays
interface CountryJson {
  country: string;
  generated_at?: string;
  sections: (JsonSectionNew | JsonSectionOld)[];
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

// Estime le temps de lecture en minutes
function estimateReadingTime(html: string): number {
  // Extraire le texte brut
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(' ').length;
  
  // Moyenne de 200 mots par minute
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(5, Math.min(minutes, 45)); // Entre 5 et 45 minutes
}

// Détecte si c'est le nouveau format (Comores) ou l'ancien (Cameroun)
function isNewFormat(section: JsonSectionNew | JsonSectionOld): section is JsonSectionNew {
  return 'html_fr' in section || 'title_fr' in section;
}

// Extrait le titre depuis une section (avec fallbacks)
function extractTitle(section: JsonSectionNew | JsonSectionOld, lang: 'fr' | 'en'): string {
  if (isNewFormat(section)) {
    // Nouveau format: title_fr, title_en
    if (lang === 'fr') {
      return section.title_fr || '';
    } else {
      return section.title_en || section.title_fr || ''; // Fallback FR si pas d'EN
    }
  } else {
    // Ancien format: title, titleEn
    if (lang === 'fr') {
      return section.title || '';
    } else {
      return section.titleEn || section.title || ''; // Fallback FR si pas d'EN
    }
  }
}

// Extrait le HTML depuis une section (avec fallbacks)
function extractHtml(section: JsonSectionNew | JsonSectionOld, lang: 'fr' | 'en'): string {
  if (isNewFormat(section)) {
    // Nouveau format: html_fr, html_en
    if (lang === 'fr') {
      return section.html_fr || '';
    } else {
      return section.html_en || '';
    }
  } else {
    // Ancien format: htmlFr, htmlEn
    if (lang === 'fr') {
      return section.htmlFr || '';
    } else {
      return section.htmlEn || '';
    }
  }
}

// Liste les fichiers JSON dans le répertoire source
function listJsonFiles(sourcePath: string): string[] {
  const files: string[] = [];
  
  try {
    const items = fs.readdirSync(sourcePath);
    
    for (const item of items) {
      if (item.startsWith('dossier_sagessedafrique_') && item.endsWith('.json')) {
        files.push(item);
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture du dossier: ${sourcePath}`);
    throw error;
  }
  
  return files.sort();
}

// Extrait le nom du pays depuis le nom du fichier JSON
function extractCountryFromFilename(filename: string): string | null {
  // Format: dossier_sagessedafrique_cameroun.json
  const match = filename.match(/^dossier_sagessedafrique_(.+)\.json$/i);
  if (match) {
    // Remplacer les underscores par des espaces et capitaliser
    const rawName = match[1].replace(/_/g, ' ');
    // Capitaliser la première lettre de chaque mot
    return rawName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  return null;
}

// Parse un fichier JSON et retourne les sections
function parseJsonFile(filePath: string): { country: string; sections: ParsedSection[] } | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data: CountryJson = JSON.parse(content);
    
    if (!data.country || !data.sections || !Array.isArray(data.sections)) {
      console.warn(`  ⚠️ Format JSON invalide`);
      return null;
    }

    const sections: ParsedSection[] = [];

    for (let i = 0; i < data.sections.length; i++) {
      const jsonSection = data.sections[i];
      
      const titleFr = extractTitle(jsonSection, 'fr');
      const titleEn = extractTitle(jsonSection, 'en');
      const htmlFr = extractHtml(jsonSection, 'fr');
      const htmlEn = extractHtml(jsonSection, 'en');

      // Vérifier qu'on a au moins le contenu français
      if (!htmlFr) {
        console.warn(`    ⚠️ Section ${i} sans contenu HTML français - ignorée`);
        continue;
      }

      sections.push({
        ordre: i,
        slug: SECTION_SLUGS[i] || `section-${i}`,
        titleFr: titleFr || `Section ${i}`,
        titleEn: titleEn || titleFr || `Section ${i}`, // Fallback FR → titre générique
        contentHtmlFr: htmlFr,
        contentHtmlEn: htmlEn || '',
        readingMinutes: estimateReadingTime(htmlFr),
      });
    }

    return { country: data.country, sections };
  } catch (error) {
    console.error(`  ❌ Erreur lecture/parsing JSON:`, error);
    return null;
  }
}

// Vérifie si un pays existe déjà dans la base de données
async function countryExists(slug: string, dryRun: boolean): Promise<boolean> {
  if (dryRun) {
    // En dry-run, on simule que le pays n'existe pas
    return false;
  }
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
    for (const section of sections) {
      const hasEn = section.contentHtmlEn ? '🇬🇧' : '';
      console.log(`      - ${section.slug}: "${section.titleFr}" ${hasEn} (~${section.readingMinutes} min)`);
    }
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
      const translations = [
        {
          lang: 'fr',
          title: section.titleFr,
          contentHtml: section.contentHtmlFr,
        },
      ];

      // Ajouter la traduction anglaise seulement si on a du contenu
      if (section.contentHtmlEn) {
        translations.push({
          lang: 'en',
          title: section.titleEn,
          contentHtml: section.contentHtmlEn,
        });
      }

      await prisma.paysChapitre.create({
        data: {
          dossierId: dossier.id,
          slug: section.slug,
          ordre: section.ordre,
          readingMinutes: section.readingMinutes,
          translations: {
            create: translations,
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
  console.log('        IMPORT AUTOMATIQUE DES DOSSIERS PAYS (JSON)');
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

  // Lister les fichiers JSON
  const jsonFiles = listJsonFiles(config.sourcePath);
  console.log(`🔍 ${jsonFiles.length} fichier(s) JSON trouvé(s)\n`);

  if (jsonFiles.length === 0) {
    console.log('Aucun fichier JSON à traiter.');
    console.log('Format attendu: dossier_sagessedafrique_[pays].json');
    return;
  }

  // Statistiques
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  // Traiter chaque fichier JSON
  for (let i = 0; i < jsonFiles.length; i++) {
    const jsonFile = jsonFiles[i];
    const filePath = path.join(config.sourcePath, jsonFile);
    
    console.log(`[${i + 1}/${jsonFiles.length}] ${jsonFile}`);

    // Parser le JSON
    const parsed = parseJsonFile(filePath);
    if (!parsed) {
      console.log(`  ⚠️ Impossible de parser le fichier - IGNORÉ\n`);
      errors++;
      continue;
    }

    // Trouver les infos du pays
    const countryInfo = getCountryInfo(parsed.country);
    if (!countryInfo) {
      // Essayer avec le nom extrait du fichier
      const fileCountryName = extractCountryFromFilename(jsonFile);
      const altCountryInfo = fileCountryName ? getCountryInfo(fileCountryName) : null;
      
      if (!altCountryInfo) {
        console.log(`  ⚠️ Pays non reconnu: "${parsed.country}" - IGNORÉ`);
        console.log(`     Ajoutez-le dans country-mapping.ts\n`);
        errors++;
        continue;
      }
      
      // Utiliser les infos alternatives
      console.log(`  🌍 ${altCountryInfo.titleFr} (${altCountryInfo.code})`);
      
      // Vérifier si existe déjà
      const exists = await countryExists(altCountryInfo.slug, config.dryRun);
      if (exists && !config.force) {
        console.log(`  ✅ Déjà importé - IGNORÉ\n`);
        skipped++;
        continue;
      }

      if (exists && config.force) {
        console.log(`  ⚠️ Existe déjà mais --force activé`);
        if (!config.dryRun) {
          await prisma.paysDossier.delete({
            where: { slug: altCountryInfo.slug },
          });
          console.log(`  🗑️ Ancien dossier supprimé`);
        }
      }

      if (parsed.sections.length === 0) {
        console.log(`  ⚠️ Aucune section trouvée - IGNORÉ\n`);
        errors++;
        continue;
      }

      const sectionsWithEn = parsed.sections.filter(s => s.contentHtmlEn).length;
      console.log(`  📄 ${parsed.sections.length} section(s) (${sectionsWithEn} avec EN)`);

      try {
        const dossierId = await createDossier(altCountryInfo, parsed.sections, config.dryRun);
        
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
      continue;
    }

    console.log(`  🌍 ${countryInfo.titleFr} (${countryInfo.code})`);

    // Vérifier si existe déjà
    const exists = await countryExists(countryInfo.slug, config.dryRun);
    if (exists && !config.force) {
      console.log(`  ✅ Déjà importé - IGNORÉ\n`);
      skipped++;
      continue;
    }

    if (exists && config.force) {
      console.log(`  ⚠️ Existe déjà mais --force activé`);
      if (!config.dryRun) {
        await prisma.paysDossier.delete({
          where: { slug: countryInfo.slug },
        });
        console.log(`  🗑️ Ancien dossier supprimé`);
      }
    }

    if (parsed.sections.length === 0) {
      console.log(`  ⚠️ Aucune section trouvée - IGNORÉ\n`);
      errors++;
      continue;
    }

    const sectionsWithEn = parsed.sections.filter(s => s.contentHtmlEn).length;
    console.log(`  📄 ${parsed.sections.length} section(s) (${sectionsWithEn} avec EN)`);

    // Créer le dossier
    try {
      const dossierId = await createDossier(countryInfo, parsed.sections, config.dryRun);
      
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
