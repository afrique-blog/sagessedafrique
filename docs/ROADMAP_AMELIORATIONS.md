# 🗺️ Roadmap Améliorations - Sagesse d'Afrique

> Document créé le : 8 janvier 2026  
> Dernière mise à jour : 21 janvier 2026

---

## 📊 État Actuel du Site

### ✅ Fonctionnalités Existantes

| Module | Description | Statut |
|--------|-------------|--------|
| **Articles** | CRUD complet, multilingue FR/EN | ✅ Opérationnel |
| **Catégories** | Hiérarchie, images, descriptions | ✅ Opérationnel |
| **Personnalités** | Fiches avec catégories multiples | ✅ Opérationnel |
| **Dossiers** | Regroupement thématique d'articles | ✅ Opérationnel |
| **Tags** | Système de tags multilingue | ✅ Opérationnel |
| **Commentaires** | Avec modération + reCAPTCHA | ✅ Opérationnel |
| **Newsletter** | Popup + gestion contacts unifiée | ✅ Opérationnel |
| **Admin Panel** | Interface complète | ✅ Opérationnel |
| **SEO** | Schema.org, meta tags, sitemap | ✅ Opérationnel |
| **Analytics** | GA4 + GTM + Matomo | ✅ Opérationnel |
| **Multilingue** | Français / English | ✅ Opérationnel |
| **Mode sombre** | Theme switcher | ✅ Opérationnel |
| **Responsive** | Mobile / Tablet / Desktop | ✅ Opérationnel |
| **Upload images** | Drag & drop pour articles | ✅ Opérationnel |
| **Semaine en Afrique** | 10 actualités hebdomadaires | ✅ Opérationnel |

### 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router)
- **Backend** : Fastify + Prisma
- **Base de données** : MySQL
- **Hébergement** : Plesk / PM2
- **Analytics** : Google Analytics 4, GTM, Matomo

---

## 🐛 Bugs à Corriger

### Priorité Haute

- [x] ~~**Newsletter Homepage** : Le formulaire dans la sidebar ne soumet pas les données~~ ✅ Corrigé le 08/01/2026

- [x] ~~**Bouton "Voir plus"** : Ne fait rien actuellement~~ ✅ Corrigé le 08/01/2026

### Priorité Moyenne

- [ ] **Model Subscriber deprecated** : À supprimer du schema Prisma
  - Fichier : `backend/prisma/schema.prisma` (lignes 232-241)
  - Solution : Supprimer après migration complète vers Contact

- [ ] **Images fallback** : Améliorer le rendu quand image manquante
  - Solution : Placeholder élégant avec le titre de l'article

---

## 🚀 Améliorations Planifiées

### Phase 1 : Quick Wins (1-2 jours) ⚡

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| Boutons partage social | 🔴 Haute | 2h | ✅ Fait |
| Corriger newsletter homepage | 🔴 Haute | 1h | ✅ Fait |
| Skeleton loaders | 🟡 Moyenne | 2h | ✅ Fait |
| Bouton "Voir plus" fonctionnel | 🟡 Moyenne | 1h | ✅ Fait |
| Fil d'Ariane (breadcrumbs) | 🟡 Moyenne | 2h | ✅ Fait (articles) |

### Phase 2 : Engagement Utilisateur (1 semaine) 📈

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| Articles liés | 🔴 Haute | 4h | ✅ Fait (déjà présent) |
| Barre de progression lecture | 🟡 Moyenne | 2h | ✅ Fait |
| Table des matières | 🟡 Moyenne | 3h | ✅ Fait (déjà présent) |
| Réactions sur articles | 🟡 Moyenne | 4h | ✅ Fait |
| Temps de lecture estimé | 🟢 Basse | 1h | ✅ Fait (déjà présent) |

### Phase 3 : Navigation & Contenu (2 semaines) 🧭

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| Page Archives | 🟡 Moyenne | 4h | ✅ Fait |
| Recherche avancée | 🟡 Moyenne | 6h | ✅ Fait |
| Articles populaires sidebar | 🟡 Moyenne | 3h | ✅ Fait |
| Favoris/Bookmarks | 🟢 Basse | 4h | ✅ Fait |
| Mode lecture | 🟢 Basse | 2h | ✅ Fait |

### Phase 4 : Communauté (3-4 semaines) 👥 ✅ COMPLÉTÉ

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| Inscription utilisateurs (email + OAuth) | 🟡 Moyenne | 8h | ✅ Fait |
| Connexion OAuth Google | 🟡 Moyenne | 4h | ✅ Fait |
| Connexion OAuth Facebook | 🟡 Moyenne | 4h | ✅ Fait |
| Profil utilisateur | 🟡 Moyenne | 6h | ✅ Fait |
| Historique de lecture | 🟢 Basse | 4h | ✅ Fait |
| Vérification email | 🟡 Moyenne | 4h | ✅ Fait |
| Réinitialisation mot de passe | 🟡 Moyenne | 3h | ✅ Fait |
| Favoris synchronisés | 🟡 Moyenne | 4h | ✅ Fait |

### Phase 5 : Monétisation (1-2 mois) 💰

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| Articles premium | 🟢 Basse | 12h | ⬜ À faire |
| Système de dons | 🟢 Basse | 8h | ⬜ À faire |
| Boutique | 🟢 Basse | 20h | ⬜ À faire |
| Cours en ligne | 🟢 Basse | 40h+ | ⬜ À faire |

### Phase 6 : Mobile & Performance (Ongoing) 📱

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| PWA | 🟡 Moyenne | 6h | ⬜ À faire |
| Notifications push | 🟡 Moyenne | 8h | ⬜ À faire |
| Mode hors-ligne | 🟢 Basse | 8h | ⬜ À faire |
| Optimisation images | 🟡 Moyenne | 4h | ⬜ À faire |
| Cache API (SWR/React Query) | 🟡 Moyenne | 4h | ⬜ À faire |

---

## 🎯 Fonctionnalités Innovantes (Long Terme)

### 🎧 Audio & Podcast
- [ ] Lecteur audio intégré
- [ ] Synthèse vocale (Text-to-Speech)
- [ ] Podcast officiel

### 🧠 Quiz & Gamification
- [ ] Quiz sur l'histoire africaine
- [ ] Badges et achievements
- [ ] Classement des lecteurs

### 🗺️ Carte Interactive
- [ ] Personnalités par pays d'origine
- [ ] Timeline historique interactive
- [ ] Événements géolocalisés

### 🤖 IA & Personnalisation
- [ ] Recommandations personnalisées
- [ ] Résumés automatiques d'articles
- [ ] Chatbot assistant

---

## 📝 Journal des Modifications

### 2026

#### Janvier 2026

| Date | Modification | Fichiers |
|------|--------------|----------|
| 21/01 | **"Une semaine en Afrique"** - Workflow GPT → HTML direct | `backend/src/routes/weekly.ts`, `frontend/app/semaine-en-afrique/` |
| 21/01 | Admin copier/coller HTML GPT (FR+EN) | `frontend/app/admin/semaine-en-afrique/` |
| 21/01 | Sélection langue via CSS (.weekly-africa-fr/.en) | `frontend/app/semaine-en-afrique/page.tsx` |
| 09/01 | Mode lecture zen pour articles | `frontend/app/article/[slug]/ArticleClient.tsx`, `frontend/app/globals.css` |
| 09/01 | Recherche avancée (filtres, tri) | `frontend/app/recherche/page.tsx`, `backend/src/routes/articles.ts` |
| 09/01 | Tags triés par date (plus récent) | `backend/src/routes/tags.ts` |
| 09/01 | Skeleton loaders (UX chargement) | `frontend/components/Skeleton.tsx`, pages principales |
| 09/01 | **Système communautaire complet** | `backend/src/routes/members.ts`, `frontend/lib/memberAuth.tsx` |
| 09/01 | Inscription/Connexion membres | `frontend/app/inscription/page.tsx`, `frontend/app/connexion/page.tsx` |
| 09/01 | OAuth Google & Facebook | `backend/src/routes/members.ts` |
| 09/01 | Page profil membre | `frontend/app/profil/page.tsx` |
| 09/01 | Vérification email + Reset password | `backend/src/services/email.ts` |
| 09/01 | Favoris & historique synchronisés | `backend/prisma/schema.prisma` |
| 08/01 | Page Archives (articles par année/mois) | `frontend/app/archives/page.tsx` |
| 08/01 | Articles populaires dans la sidebar | `frontend/app/page.tsx` |
| 08/01 | Système de favoris/bookmarks | `frontend/app/favoris/page.tsx`, `frontend/components/ArticleCard.tsx` |
| 08/01 | Liens Archives + Favoris dans Header | `frontend/components/Header.tsx` |
| 08/01 | Barre de progression de lecture | `frontend/app/article/[slug]/ArticleClient.tsx` |
| 08/01 | Réactions sur articles (👍 ❤️ 🔥) | `frontend/app/article/[slug]/ArticleClient.tsx` |
| 08/01 | Boutons partage social (déjà présents) | `frontend/app/article/[slug]/ArticleClient.tsx` |
| 08/01 | Newsletter homepage fonctionnelle | `frontend/app/page.tsx` |
| 08/01 | Bouton "Voir plus" → lien catégories | `frontend/app/page.tsx` |
| 08/01 | Installation Matomo Analytics | `frontend/app/layout.tsx`, config Nginx |
| 08/01 | Système d'upload d'images pour articles | `backend/src/routes/uploads.ts`, `frontend/components/ImageUpload.tsx` |
| 08/01 | Page admin contacts | `frontend/app/admin/contacts/page.tsx` |
| 08/01 | Réponses aux commentaires (nested) | `backend/src/routes/comments.ts`, `frontend/components/Comments.tsx` |
| 07/01 | Système de commentaires avec reCAPTCHA | `backend/src/routes/comments.ts`, `frontend/components/Comments.tsx` |
| 07/01 | Table contacts unifiée | `backend/prisma/schema.prisma`, migration SQL |
| 07/01 | Champ Sources & Références (TinyMCE) | Articles admin, schema Prisma |

---

## 🔗 Liens Utiles

- **Site production** : https://sagessedafrique.blog
- **Admin** : https://sagessedafrique.blog/admin
- **Matomo** : https://sagessedafrique.blog/stats/
- **GitHub** : https://github.com/afrique-blog/sagessedafrique

---

## 📌 Notes de Développement

### Conventions
- Toujours tester sur mobile avant déploiement
- Garder le temps de chargement < 3 secondes
- Respecter la charte graphique (couleurs, typographie)
- Penser accessibilité (WCAG 2.1)

### Couleurs principales
```css
--primary: #1e3a5f;     /* Bleu foncé */
--accent: #d4a574;      /* Or/Ambre */
--background: #f8fafc;  /* Gris clair */
```

### Déploiement
```bash
# Sur le serveur
cd /var/www/vhosts/sagessedafrique.blog/httpdocs
git pull origin main
cd backend && npm run build && npx pm2 restart backend
cd ../frontend && npm run build && npx pm2 restart frontend
```

---

*Ce document est mis à jour régulièrement. Dernière révision : 9 janvier 2026*
