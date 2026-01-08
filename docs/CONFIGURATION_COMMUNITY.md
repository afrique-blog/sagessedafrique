# Configuration du Système Communauté

## Variables d'environnement Backend

Ajoutez ces variables dans `/backend/.env` :

```env
# JWT Secret (OBLIGATOIRE - changez cette valeur!)
JWT_SECRET="votre-clé-secrète-très-longue-au-moins-32-caractères"

# SMTP Configuration (pour l'envoi d'emails)
SMTP_HOST="mail.sagessedafrique.blog"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="noreply@sagessedafrique.blog"
SMTP_PASS="votre-mot-de-passe-smtp"
SMTP_FROM="noreply@sagessedafrique.blog"
SMTP_FROM_NAME="Sagesse d'Afrique"

# URL du site (pour les liens dans les emails)
SITE_URL="https://sagessedafrique.blog"
```

## Variables d'environnement Frontend

Ajoutez ces variables dans `/frontend/.env.local` :

```env
# API URL
NEXT_PUBLIC_API_URL="https://sagessedafrique.blog/api"

# Google OAuth (optionnel)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="votre-client-id-google"

# Facebook OAuth (optionnel)
NEXT_PUBLIC_FACEBOOK_APP_ID="votre-app-id-facebook"
```

## Configuration SMTP sur Plesk

1. Créer un compte email `noreply@sagessedafrique.blog` dans Plesk
2. Utiliser les paramètres SMTP du serveur :
   - Host: `mail.sagessedafrique.blog` ou `localhost`
   - Port: `587` (TLS) ou `465` (SSL)
   - User: `noreply@sagessedafrique.blog`
   - Pass: Le mot de passe créé

## Configuration OAuth Google

1. Aller sur https://console.cloud.google.com/
2. Créer un projet ou sélectionner existant
3. APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client IDs
4. Type: Web application
5. Authorized JavaScript origins: `https://sagessedafrique.blog`
6. Copier le Client ID dans `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Configuration OAuth Facebook

1. Aller sur https://developers.facebook.com/
2. My Apps > Create App
3. Type: Consumer
4. Ajouter Facebook Login
5. Settings > Basic > App ID
6. Copier dans `NEXT_PUBLIC_FACEBOOK_APP_ID`
7. Ajouter `https://sagessedafrique.blog` dans App Domains

## Migration de la base de données

Exécuter la migration SQL :

```bash
mysql -u lasagesse -p sagesse_db < backend/prisma/migration_community.sql
```

Puis régénérer Prisma :

```bash
cd backend
npx prisma generate
npm run build
```

## Sécurité

### Mot de passe
- Minimum 8 caractères
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre
- Hashé avec bcrypt (12 rounds)

### Sessions JWT
- Expire après 7 jours
- Stocké dans localStorage (côté client)
- Possibilité de déconnexion de tous les appareils

### Protection contre les attaques
- Rate limiting sur inscription (5/heure/IP)
- Rate limiting sur connexion (10/minute/IP)
- Rate limiting sur mot de passe oublié (3/heure/IP)
- Délai pour éviter les timing attacks
- Tokens de vérification email (24h)
- Tokens de réinitialisation mot de passe (1h)

### OAuth
- Vérification du token avec Google/Facebook
- Email vérifié automatiquement via OAuth
- Liaison de comptes existants par email

## Pages créées

- `/inscription` - Création de compte
- `/connexion` - Connexion
- `/profil` - Page profil membre
- `/mot-de-passe-oublie` - Demande de réinitialisation
- `/reinitialiser-mot-de-passe` - Formulaire de nouveau mot de passe
- `/verification-email` - Vérification du token email

## API Endpoints

### Publics
- `POST /api/members/register` - Inscription
- `POST /api/members/login` - Connexion
- `POST /api/members/oauth` - Connexion OAuth
- `POST /api/members/forgot-password` - Mot de passe oublié
- `POST /api/members/reset-password` - Réinitialiser mot de passe
- `POST /api/members/verify-email` - Vérifier email

### Authentifiés
- `GET /api/members/me` - Profil actuel
- `PUT /api/members/profile` - Modifier profil
- `GET /api/members/favorites` - Liste des favoris
- `POST /api/members/favorites/:articleId` - Ajouter favori
- `DELETE /api/members/favorites/:articleId` - Retirer favori
- `GET /api/members/reading-history` - Historique lecture
- `POST /api/members/reading-history` - Enregistrer lecture
- `POST /api/members/logout` - Déconnexion
- `POST /api/members/logout-all` - Déconnexion tous appareils
