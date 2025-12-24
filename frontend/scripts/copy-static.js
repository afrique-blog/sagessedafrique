/**
 * Script de copie des fichiers statiques pour Next.js standalone
 * Ce script copie le dossier public et les fichiers static dans le dossier standalone
 */

const fs = require('fs');
const path = require('path');

const standaloneDir = path.join(__dirname, '..', '.next', 'standalone', 'frontend');
const publicSrc = path.join(__dirname, '..', 'public');
const publicDest = path.join(standaloneDir, 'public');
const staticSrc = path.join(__dirname, '..', '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');

// Fonction de copie récursive
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  Source n'existe pas: ${src}`);
    return;
  }

  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    for (const item of items) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    // Créer le dossier parent si nécessaire
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('📦 Copie des fichiers statiques pour standalone...');

// Vérifier que le dossier standalone existe
if (!fs.existsSync(standaloneDir)) {
  console.log('⚠️  Dossier standalone non trouvé. Skipping...');
  process.exit(0);
}

// Copier public
console.log(`   📁 public/ -> standalone/frontend/public/`);
copyRecursive(publicSrc, publicDest);

// Copier .next/static
console.log(`   📁 .next/static/ -> standalone/frontend/.next/static/`);
copyRecursive(staticSrc, staticDest);

console.log('✅ Fichiers statiques copiés avec succès!');

