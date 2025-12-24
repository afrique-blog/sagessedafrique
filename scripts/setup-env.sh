#!/bin/bash
# Script pour créer les fichiers .env sur le serveur
# Usage: ./setup-env.sh VOTRE_MOT_DE_PASSE_DB

if [ -z "$1" ]; then
    echo "Usage: ./setup-env.sh VOTRE_MOT_DE_PASSE_DB"
    exit 1
fi

DB_PASSWORD=$1

# Créer backend/.env
cat > backend/.env << EOF
DATABASE_URL="mysql://sagesse_user:${DB_PASSWORD}@localhost:3306/sagesse_db"
JWT_SECRET="SagesseDAfrique2024SecretKeyForJWT"
PORT=3001
FRONTEND_URL="https://sagessedafrique.blog"
NODE_ENV=production
EOF

# Créer frontend/.env.local
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=https://sagessedafrique.blog/api
EOF

echo "Fichiers .env créés avec succès !"
echo ""
echo "Vérification:"
echo "--- backend/.env ---"
cat backend/.env
echo ""
echo "--- frontend/.env.local ---"
cat frontend/.env.local

