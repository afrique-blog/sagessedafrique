# Déploiement via Git sur Hostinger/Plesk

## Vue d'ensemble

```
GitHub (repo) ──git pull──> Serveur Hostinger ──> Site en ligne
```

---

## Étape 1 : Créer la base de données MySQL

1. Connectez-vous à **Plesk**
2. Allez dans **Bases de données** > **Ajouter une base de données**
3. Configurez :
   - **Nom** : `sagesse_db`
   - **Utilisateur** : `sagesse_user`
   - **Mot de passe** : (notez-le !)
4. Cliquez **OK**

---

## Étape 2 : Activer l'accès SSH

1. Dans Plesk, allez dans **Accès au serveur Web**
2. Activez **Accès SSH** (choisissez `/bin/bash`)
3. Notez vos identifiants SSH

---

## Étape 3 : Cloner le repo via SSH

Connectez-vous en SSH à votre serveur :

```bash
ssh votre_utilisateur@sagessedafrique.blog
```

Puis clonez le repo :

```bash
cd /var/www/vhosts/sagessedafrique.blog
git clone https://github.com/afrique-blog/sagessedafrique.git repo
```

---

## Étape 4 : Configurer les variables d'environnement

### Backend (.env)

```bash
cd /var/www/vhosts/sagessedafrique.blog/repo/backend
nano .env
```

Contenu :
```env
DATABASE_URL="mysql://sagesse_user:VOTRE_MOT_DE_PASSE@localhost:3306/sagesse_db"
JWT_SECRET="generez-une-cle-secrete-aleatoire-de-32-caracteres-minimum"
PORT=3001
FRONTEND_URL="https://sagessedafrique.blog"
NODE_ENV=production
```

### Frontend (.env.local)

```bash
cd /var/www/vhosts/sagessedafrique.blog/repo/frontend
nano .env.local
```

Contenu :
```env
NEXT_PUBLIC_API_URL=https://sagessedafrique.blog/api
```

---

## Étape 5 : Installer Node.js et PM2

Si Node.js n'est pas déjà disponible :

```bash
# Vérifier la version de Node
node -v

# Si non installé, utiliser nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Installer PM2 globalement
npm install -g pm2
```

---

## Étape 6 : Build et déploiement initial

```bash
cd /var/www/vhosts/sagessedafrique.blog/repo

# Backend
cd backend
npm install
npm run build
npx prisma generate
npx prisma db push
npx prisma db seed  # Pour les données de démo

# Frontend
cd ../frontend
npm install
npm run build
```

---

## Étape 7 : Démarrer les applications avec PM2

```bash
# Démarrer le backend
cd /var/www/vhosts/sagessedafrique.blog/repo/backend
pm2 start ecosystem.config.js

# Démarrer le frontend
cd ../frontend
pm2 start ecosystem.config.js

# Sauvegarder la config PM2
pm2 save
pm2 startup
```

---

## Étape 8 : Configurer le reverse proxy dans Plesk

### Option A : Via Plesk (recommandé)

1. Allez dans **Domaines** > **sagessedafrique.blog**
2. Cliquez sur **Apache & nginx Settings**
3. Dans **Additional nginx directives**, ajoutez :

```nginx
# Frontend Next.js
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Backend API
location /api {
    rewrite ^/api(.*)$ $1 break;
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

4. Cliquez **OK**

---

## Étape 9 : Activer HTTPS

1. Dans Plesk, allez dans **SSL/TLS Certificates**
2. Cliquez sur **Let's Encrypt**
3. Entrez votre email et cochez les options
4. Cliquez **Installer**
5. Activez **Redirect HTTP to HTTPS**

---

## Mises à jour futures

Pour mettre à jour le site après des modifications :

```bash
cd /var/www/vhosts/sagessedafrique.blog/repo

# Récupérer les changements
git pull origin main

# Rebuild si nécessaire
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build

# Redémarrer
pm2 restart all
```

Ou utilisez le script de déploiement :

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `pm2 status` | Voir l'état des apps |
| `pm2 logs` | Voir les logs en temps réel |
| `pm2 restart all` | Redémarrer toutes les apps |
| `pm2 stop all` | Arrêter toutes les apps |

---

## Accès Admin

- **URL** : https://sagessedafrique.blog/admin
- **Email** : admin@sagessedafrique.blog
- **Mot de passe** : admin123

⚠️ **Changez ce mot de passe immédiatement après le premier login !**

---

## Dépannage

### Le site affiche une erreur 502
```bash
pm2 status  # Vérifier si les apps tournent
pm2 logs    # Voir les erreurs
```

### Erreur de base de données
```bash
cd backend
npx prisma db push  # Synchroniser le schéma
```

### Problème de permissions
```bash
chmod -R 755 /var/www/vhosts/sagessedafrique.blog/repo
```

