# Sagesse d'Afrique

Magazine éditorial explorant l'héritage intellectuel et culturel de l'Afrique.

## Architecture

```
sagessedafrique/
├── frontend/          # Next.js 14 (App Router)
├── backend/           # Fastify + Prisma
└── docker-compose.yml # MySQL
```

## Prérequis

- Node.js 18+
- Docker & Docker Compose
- npm ou yarn

## Installation

### 1. Cloner et installer les dépendances

```bash
git clone https://github.com/afrique-blog/sagessedafrique.git
cd sagessedafrique
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
DATABASE_URL="mysql://sagesse_user:sagesse_password@localhost:3306/sagesse_db"
JWT_SECRET="votre-cle-secrete-jwt"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

Créez un fichier `.env.local` dans le dossier `frontend/` :

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### 3. Démarrer la base de données MySQL

```bash
docker-compose up -d
```

### 4. Initialiser la base de données

```bash
cd backend
npm run db:generate   # Génère le client Prisma
npm run db:push       # Crée les tables
npm run db:seed       # Insère les données initiales
```

### 5. Démarrer les serveurs de développement

```bash
# Depuis la racine du projet
npm run dev:backend   # Terminal 1 - API sur http://localhost:3001
npm run dev:frontend  # Terminal 2 - Frontend sur http://localhost:3000
```

## Identifiants Admin

Après le seed, utilisez ces identifiants pour accéder au panel admin :

- **URL** : http://localhost:3000/admin
- **Email** : admin@sagessedafrique.blog
- **Mot de passe** : admin123

## Scripts disponibles

### Racine (monorepo)

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance frontend + backend |
| `npm run dev:frontend` | Lance seulement le frontend |
| `npm run dev:backend` | Lance seulement le backend |
| `npm run build` | Build de production |
| `npm run db:studio` | Ouvre Prisma Studio |

### Backend

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run db:generate` | Génère le client Prisma |
| `npm run db:migrate` | Applique les migrations |
| `npm run db:push` | Sync schema sans migration |
| `npm run db:seed` | Seed de la base de données |
| `npm run db:studio` | Interface Prisma Studio |

### Frontend

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur Next.js dev |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |

## API REST

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/articles` | Liste des articles |
| GET | `/api/articles/:slug` | Détail d'un article |
| POST | `/api/articles` | Créer un article (auth) |
| PUT | `/api/articles/:id` | Modifier un article (auth) |
| DELETE | `/api/articles/:id` | Supprimer un article (auth) |
| GET | `/api/categories` | Liste des catégories |
| GET | `/api/categories/:slug` | Détail catégorie + articles |
| GET | `/api/tags` | Liste des tags |
| GET | `/api/dossiers` | Liste des dossiers |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Utilisateur courant (auth) |

## Technologies

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Query

### Backend
- Fastify 4
- Prisma ORM
- MySQL 8
- JWT Authentication
- Zod validation

## Structure des données

Le magazine supporte :
- **Articles** multilingues (FR/EN)
- **Catégories** : Sciences, Histoire, Philosophie, Arts, Leadership, Médecine
- **Tags** pour le classement thématique
- **Dossiers** spéciaux regroupant des articles

## Licence

Tous droits réservés © 2025 Sagesse d'Afrique
