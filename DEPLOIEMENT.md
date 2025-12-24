# Guide de Déploiement - Sagesse d'Afrique

## Prérequis sur Hostinger/Plesk

- Node.js 18+ activé
- MySQL disponible
- Accès SSH ou File Manager

---

## Étape 1 : Créer la base de données MySQL

1. Dans Plesk, allez dans **Bases de données**
2. Cliquez **Ajouter une base de données**
3. Configurez :
   - Nom de la base : `sagesse_db`
   - Utilisateur : `sagesse_user`
   - Mot de passe : (choisissez un mot de passe fort)
4. Notez ces informations

---

## Étape 2 : Préparer les fichiers localement

### Build du Backend

```bash
cd backend
npm install
npm run build
```

### Build du Frontend

```bash
cd frontend
npm install
npm run build
```

---

## Étape 3 : Uploader les fichiers

### Structure sur le serveur

```
/var/www/vhosts/sagessedafrique.blog/
├── api/                    # Backend
│   ├── dist/               # Code compilé
│   ├── node_modules/
│   ├── prisma/
│   ├── package.json
│   └── .env
│
└── httpdocs/               # Frontend (dossier web principal)
    ├── .next/
    ├── public/
    ├── node_modules/
    ├── package.json
    └── .env.local
```

### Fichiers à uploader pour le Backend (`api/`)

- Dossier `dist/` (après build)
- Dossier `prisma/`
- Fichier `package.json`
- Fichier `package-lock.json`
- Fichier `ecosystem.config.js`

### Fichiers à uploader pour le Frontend (`httpdocs/`)

- Dossier `.next/` (après build)
- Dossier `public/`
- Fichier `package.json`
- Fichier `package-lock.json`
- Fichier `next.config.js`
- Fichier `ecosystem.config.js`

---

## Étape 4 : Configurer les variables d'environnement

### Backend (`api/.env`)

```env
DATABASE_URL="mysql://sagesse_user:VOTRE_MOT_DE_PASSE@localhost:3306/sagesse_db"
JWT_SECRET="une-cle-secrete-tres-longue-generez-la-aleatoirement"
PORT=3001
FRONTEND_URL="https://sagessedafrique.blog"
NODE_ENV=production
```

### Frontend (`httpdocs/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://sagessedafrique.blog/api
```

---

## Étape 5 : Installer les dépendances sur le serveur

Via SSH ou Terminal Plesk :

```bash
# Backend
cd /var/www/vhosts/sagessedafrique.blog/api
npm install --production

# Frontend
cd /var/www/vhosts/sagessedafrique.blog/httpdocs
npm install --production
```

---

## Étape 6 : Initialiser la base de données

```bash
cd /var/www/vhosts/sagessedafrique.blog/api
npx prisma generate
npx prisma db push
npx prisma db seed
```

---

## Étape 7 : Configurer Node.js dans Plesk

### Pour le Backend (API)

1. Dans Plesk, allez dans **Node.js**
2. Créez une nouvelle application :
   - **Chemin** : `/api`
   - **Document root** : `api`
   - **Application startup file** : `dist/index.js`
   - **Node.js version** : 18+
3. Activez l'application

### Pour le Frontend

1. Créez une autre application Node.js :
   - **Chemin** : `/`
   - **Document root** : `httpdocs`
   - **Application startup file** : `node_modules/next/dist/bin/next`
   - **Arguments** : `start`
3. Activez l'application

---

## Étape 8 : Configurer le reverse proxy (si nécessaire)

Si Plesk ne gère pas automatiquement le routage, ajoutez dans **Apache & nginx Settings** :

```nginx
location /api {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## Étape 9 : Activer HTTPS

Dans Plesk :
1. Allez dans **SSL/TLS Certificates**
2. Installez un certificat **Let's Encrypt** (gratuit)
3. Activez **Redirect HTTP to HTTPS**

---

## Commandes utiles

### Redémarrer les applications

```bash
# Via PM2 (si installé)
pm2 restart sagesse-api
pm2 restart sagesse-frontend

# Via Plesk
# Utilisez le bouton "Restart" dans l'interface Node.js
```

### Voir les logs

```bash
# Backend
pm2 logs sagesse-api

# Frontend
pm2 logs sagesse-frontend
```

### Mettre à jour la base de données

```bash
cd /var/www/vhosts/sagessedafrique.blog/api
npx prisma db push
```

---

## Identifiants Admin

Après le seed :
- **URL** : https://sagessedafrique.blog/admin
- **Email** : admin@sagessedafrique.blog
- **Mot de passe** : admin123

⚠️ **Changez ce mot de passe en production !**

---

## Dépannage

### Erreur 502 Bad Gateway
- Vérifiez que les applications Node.js sont démarrées
- Vérifiez les logs dans Plesk

### Erreur de base de données
- Vérifiez que MySQL est démarré
- Vérifiez le DATABASE_URL dans .env

### Images ne s'affichent pas
- Vérifiez que le dossier `public/` est bien uploadé
- Vérifiez les permissions des fichiers

