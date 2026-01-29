# 📚 Implémentation des Dossiers Pays

## 🎯 Vue d'ensemble

Système complet de "Dossiers Pays" pour Sagesses d'Afrique permettant de publier des articles longs et immersifs (15 000+ mots) avec des fonctionnalités IA avancées.

**Date d'implémentation** : 29 janvier 2026  
**Version** : Phase 1 - Base de données & Structure + Fonctionnalités IA

---

## ✅ Fonctionnalités Implémentées

### 1. **Base de Données**

#### Nouveaux Champs dans `Article`
- `type` : Type d'article ('standard' | 'dossier-pays' | 'dossier-thematique')
- `countryCode` : Code pays ISO Alpha-2 (ET, SN, MA, etc.)
- `requireAuth` : Indique si l'article nécessite une inscription
- `freePreview` : Nombre de caractères visibles sans inscription (0 = gratuit complet)
- `metadata` : Données JSON structurées (sections, practicalInfo, etc.)

#### Migration SQL
Fichier créé : `backend/prisma/migration_dossiers_pays.sql`

**À exécuter sur le serveur** :
```bash
cd backend
mysql -u root -p sagesse_db < prisma/migration_dossiers_pays.sql
npx prisma generate
```

---

### 2. **Backend API**

#### Routes Articles Enrichies
- **POST** `/api/articles` : Supporte les nouveaux champs (type, countryCode, etc.)
- **PUT** `/api/articles/:id` : Mise à jour avec nouveaux champs
- **GET** `/api/articles/:slug` : Gestion automatique de la restriction de contenu
  - Si `requireAuth = true` et utilisateur non connecté
  - Tronque le contenu à `freePreview` caractères
  - Ajoute `restricted: true` dans la réponse

#### Nouvelles Routes IA (`/api/ai`)
- **POST** `/api/ai/chat` : Chatbot contextuel sur l'article
  - Rate limiting: 20 messages/minute par IP
  - Context article injecté automatiquement
  - Historique de conversation maintenu
  - Système prompt spécifique au pays

- **POST** `/api/ai/tts` : Text-to-Speech (audio)
  - Rate limiting: 20 requêtes/minute par IP
  - Limite de texte: 1000 caractères
  - Voix configurables (Charon par défaut)

**Configuration requise** :
```env
GEMINI_API_KEY=votre_cle_api_gemini
```

---

### 3. **Frontend Components**

#### Composants Créés

**`DossierPaysHero.tsx`**
- Hero immersif avec image plein écran
- Badge pays avec emoji
- Titre stylisé et sous-titre
- Animation scroll indicator

**`StickyTOC.tsx`**
- Table des matières sticky (desktop)
- Détection de section active (Intersection Observer)
- Affichage du temps de lecture
- Support H2 et H3 avec indentation

**`SignupCTA.tsx`**
- Call-to-action d'inscription
- Gradient blur overlay
- Emoji pays dynamique
- Boutons "S'inscrire" et "Se connecter"
- Multilingue (FR/EN)

**`AIChatWidget.tsx`**
- Chatbot flottant avec animation pulse
- Interface conversationnelle
- Gestion de l'historique
- Loading states
- Messages user vs AI stylisés
- Expansion au hover du bouton

#### Page Template
**`app/dossier-pays/[slug]/page.tsx`**
- Détection automatique du type d'article
- Layout spécial avec sidebar TOC
- Gestion freemium (contenu restreint)
- TOC mobile collapsible
- Prose styling enrichi (Tailwind Typography)
- Intégration AI Chat Widget

#### Utilitaires
**`lib/dossier-pays-utils.ts`**
- `extractSections()` : Parse HTML pour générer TOC
- `getCountryName()` : Mapping code pays → nom
- `addHeadingIds()` : Ajoute IDs aux headings

---

### 4. **TypeScript Interfaces**

#### `Article` Interface Enrichie
```typescript
interface Article {
  // ... champs existants
  type: string;
  countryCode: string | null;
  requireAuth: boolean;
  freePreview: number;
  metadata: any | null;
  restricted?: boolean;
}
```

#### API Client Methods
```typescript
api.sendAIMessage(articleId, message, conversationHistory)
api.generateTTS(text, voiceName)
```

---

## 🎨 Styling & UX

### Design System
- **Police Titre** : Merriweather Serif
- **Police Corps** : Inter Sans-serif
- **Couleur Accent** : Yellow-600 (#D97706)
- **Layout** : Responsive avec breakpoints Tailwind
- **Dark Mode** : Support complet

### Responsive
- **Mobile** : TOC collapsible, full-width content
- **Tablet** : Layout adaptatif
- **Desktop** : Sidebar sticky + content principal

---

## 🔐 Système Freemium

### Fonctionnement
1. Admin crée un article avec `requireAuth = true` et `freePreview = 2000`
2. Utilisateur non connecté voit :
   - Les premiers 2000 caractères
   - Gradient blur progressif
   - CTA d'inscription stylisé
3. Utilisateur connecté voit tout le contenu

### Configuration Admin
```json
{
  "type": "dossier-pays",
  "countryCode": "ET",
  "requireAuth": true,
  "freePreview": 2000
}
```

---

## 🤖 Fonctionnalités IA

### Chatbot Contextuel
- **Contexte** : Contenu article (3000 premiers chars)
- **Données** : practicalInfo depuis metadata
- **Personnalisation** : Nom du pays injecté
- **Modèle** : Gemini 2.0 Flash Exp
- **Sécurité** : Clé API côté serveur uniquement

### Text-to-Speech
- **Modèle** : Gemini 2.0 Flash TTS
- **Voix** : Charon (masculine, profonde)
- **Format** : Base64 audio/wav
- **Limitation** : 1000 caractères max

---

## 📝 Prochaines Étapes (Phase 2-6)

### Phase 2 : Admin Interface
- [ ] Dropdown "Type d'article" dans formulaire admin
- [ ] Champ "Code Pays" avec sélection
- [ ] Toggle "Nécessite inscription"
- [ ] Input "Aperçu gratuit (caractères)"
- [ ] Éditeur JSON pour `metadata`

### Phase 3 : TinyMCE Plugins
- [ ] Plugin "Encadré Dates Clés"
- [ ] Plugin "Citation Box"
- [ ] Plugin "Grille d'Images"
- [ ] Plugin "Carnet Pratique"

### Phase 4 : Homepage Integration
- [ ] Logique alternance 15 jours (Dossier Pays / Dossier Thématique)
- [ ] Bloc "Dossier Pays en Vedette"
- [ ] Badge emoji drapeau dynamique

### Phase 5 : Liste Dossiers Pays
- [ ] Page `/dossiers-pays` avec filtres
- [ ] Carte interactive d'Afrique
- [ ] Stats par pays

### Phase 6 : Analytics & SEO
- [ ] Événements scroll depth
- [ ] Tracking sections lues
- [ ] Schema.org enrichi
- [ ] Sitemap dossiers pays

---

## 🚀 Déploiement

### Checklist Backend
```bash
# 1. SSH sur le serveur
ssh root@sagessedafrique.blog

# 2. Navigation
cd /var/www/vhosts/sagessedafrique.blog/httpdocs

# 3. Pull du code
git pull origin main

# 4. Migration base de données
cd backend
mysql -u root -p sagesse_db < prisma/migration_dossiers_pays.sql

# 5. Régénérer Prisma
npx prisma generate

# 6. Ajouter variable d'environnement
nano .env
# Ajouter : GEMINI_API_KEY=votre_cle

# 7. Rebuild
npm run build

# 8. Redémarrer
npx pm2 restart backend
```

### Checklist Frontend
```bash
cd ../frontend
npm run build
npx pm2 restart frontend
```

---

## 🧪 Tests

### Test Complet Dossier Pays

1. **Créer un article de test via admin** :
   ```json
   {
     "slug": "ethiopie-test",
     "type": "dossier-pays",
     "countryCode": "ET",
     "requireAuth": true,
     "freePreview": 500,
     "translations": [
       {
         "lang": "fr",
         "title": "Éthiopie : Le Berceau des Origines",
         "excerpt": "Voyage au cœur de l'Abyssinie...",
         "contentHtml": "<h2>Introduction</h2><p>Contenu long...</p>"
       }
     ]
   }
   ```

2. **Tester l'accès** :
   - Non connecté : `/dossier-pays/ethiopie-test` (contenu tronqué)
   - Connecté : Contenu complet

3. **Tester AI Chat** :
   - Poser une question sur l'Éthiopie
   - Vérifier la réponse contextuelle

4. **Tester TTS** :
   - (À implémenter : bouton "Écouter" sur sections)

---

## 📊 Données de Test - Pays Initiaux

### 4 Pays Planifiés
1. **Éthiopie** 🇪🇹 (Code: ET)
2. **Sénégal** 🇸🇳 (Code: SN)
3. **Maroc** 🇲🇦 (Code: MA)
4. **Kenya** 🇰🇪 (Code: KE)

### Rythme de Publication
- **Initial** : 4 dossiers pays en draft
- **Ensuite** : 1 dossier pays / mois
- **Alternance** : 
  - 1-15 du mois : Dossier Pays en vedette
  - 16-fin : Dossier Thématique en vedette

---

## 🐛 Debug & Logs

### Logs Backend
```bash
npx pm2 logs backend
```

### Erreurs Communes
- **Gemini API 401** : Vérifier `GEMINI_API_KEY` dans `.env`
- **CORS Error** : Vérifier `FRONTEND_URL` correspond
- **Rate Limit 429** : Attendre 1 minute ou augmenter `RATE_LIMIT` dans `ai.ts`

---

## 📚 Documentation Externe

- **Gemini API** : https://ai.google.dev/docs
- **Prisma** : https://www.prisma.io/docs
- **Tailwind Typography** : https://tailwindcss.com/docs/typography-plugin
- **Intersection Observer** : https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

---

## 👥 Contributeurs

- **Développement Phase 1** : Claude Sonnet 4.5 (Assistant IA)
- **Product Owner** : Marco (Sagesses d'Afrique)

---

**Statut** : ✅ Phase 1 Complète - Prêt pour tests et déploiement
**Prochaine Phase** : Admin Interface (Phase 2)
