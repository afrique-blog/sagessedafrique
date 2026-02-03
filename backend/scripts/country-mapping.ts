// Mapping des noms de pays vers les codes ISO Alpha-2
// Utilisé pour l'import automatique des dossiers pays

export const COUNTRY_MAPPING: Record<string, { code: string; slug: string; titleFr: string; titleEn: string }> = {
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

// Fonction pour extraire le nom du pays depuis le nom du dossier
export function extractCountryName(folderName: string): string | null {
  // Format attendu: "Dossier_Bénin" ou "Dossier_Côte d'Ivoire"
  const match = folderName.match(/^Dossier_(.+)$/i);
  if (match) {
    return match[1].trim();
  }
  return null;
}

// Fonction pour obtenir les infos du pays
export function getCountryInfo(countryName: string): { code: string; slug: string; titleFr: string; titleEn: string } | null {
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
