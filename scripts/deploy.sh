#!/bin/bash
# Script de déploiement pour Hostinger/Plesk
# À exécuter sur le serveur après un git pull

set -e

echo "========================================"
echo "  Déploiement Sagesse d'Afrique"
echo "========================================"

# Variables - À adapter selon votre configuration
SITE_DIR="/var/www/vhosts/sagessedafrique.blog"
BACKEND_DIR="$SITE_DIR/api"
FRONTEND_DIR="$SITE_DIR/httpdocs"

# Aller dans le répertoire du site
cd $SITE_DIR

echo ""
echo "[1/6] Récupération du code..."
git pull origin main

echo ""
echo "[2/6] Installation des dépendances Backend..."
cd backend
npm install --production
npm run build

echo ""
echo "[3/6] Migration de la base de données..."
npx prisma generate
npx prisma db push

echo ""
echo "[4/6] Installation des dépendances Frontend..."
cd ../frontend
npm install
npm run build

echo ""
echo "[5/6] Copie des fichiers..."
# Copier le backend
rm -rf $BACKEND_DIR/dist
cp -r ../backend/dist $BACKEND_DIR/
cp -r ../backend/prisma $BACKEND_DIR/
cp ../backend/package.json $BACKEND_DIR/
cp ../backend/ecosystem.config.js $BACKEND_DIR/

# Copier le frontend
rm -rf $FRONTEND_DIR/.next
cp -r .next $FRONTEND_DIR/
cp -r public $FRONTEND_DIR/
cp package.json $FRONTEND_DIR/
cp next.config.js $FRONTEND_DIR/
cp ecosystem.config.js $FRONTEND_DIR/

echo ""
echo "[6/6] Redémarrage des applications..."
cd $BACKEND_DIR
pm2 restart sagesse-api || pm2 start ecosystem.config.js

cd $FRONTEND_DIR
pm2 restart sagesse-frontend || pm2 start ecosystem.config.js

echo ""
echo "========================================"
echo "  Déploiement terminé avec succès !"
echo "========================================"
echo ""
echo "Vérifiez le site : https://sagessedafrique.blog"

