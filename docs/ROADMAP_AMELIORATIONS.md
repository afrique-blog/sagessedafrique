# 🗺️ Roadmap Améliorations - Sagesse d'Afrique

> Document créé le : 8 janvier 2026  
> Dernière mise à jour : 8 janvier 2026

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

### 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router)
- **Backend** : Fastify + Prisma
- **Base de données** : MySQL
- **Hébergement** : Plesk / PM2
- **Analytics** : Google Analytics 4, GTM, Matomo

---

## 🐛 Bugs à Corriger

### Priorité Haute

- [ ] **Newsletter Homepage** : Le formulaire dans la sidebar ne soumet pas les données
  - Fichier : `frontend/app/page.tsx` (ligne 335-338)
  - Solution : Connecter au endpoint `/api/contacts/subscribe`

- [ ] **Bouton "Voir plus"** : Ne fait rien actuellement
  - Fichier : `frontend/app/page.tsx` (ligne 315)
  - Solution : Implémenter la pagination ou rediriger vers une page archive

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
| Boutons partage social | 🔴 Haute | 2h | ⬜ À faire |
| Corriger newsletter homepage | 🔴 Haute | 1h | ⬜ À faire |
| Skeleton loaders | 🟡 Moyenne | 2h | ⬜ À faire |
| Bouton "Voir plus" fonctionnel | 🟡 Moyenne | 1h | ⬜ À faire |
| Fil d'Ariane (breadcrumbs) | 🟡 Moyenne | 2h | ⬜ À faire |

### Phase 2 : Engagement Utilisateur (1 semaine) 📈

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| Articles liés | 🔴 Haute | 4h | ⬜ À faire |
| Barre de progression lecture | 🟡 Moyenne | 2h | ⬜ À faire |
| Table des matières | 🟡 Moyenne | 3h | ⬜ À faire |
| Réactions sur articles | 🟡 Moyenne | 4h | ⬜ À faire |
| Temps de lecture estimé | 🟢 Basse | 1h | ⬜ À faire |

### Phase 3 : Navigation & Contenu (2 semaines) 🧭

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| Page Archives | 🟡 Moyenne | 4h | ⬜ À faire |
| Recherche avancée | 🟡 Moyenne | 6h | ⬜ À faire |
| Articles populaires sidebar | 🟡 Moyenne | 3h | ⬜ À faire |
| Favoris/Bookmarks | 🟢 Basse | 4h | ⬜ À faire |
| Mode lecture | 🟢 Basse | 2h | ⬜ À faire |

### Phase 4 : Communauté (3-4 semaines) 👥

| Tâche | Priorité | Effort | Statut |
|-------|----------|--------|--------|
| Inscription utilisateurs | 🟡 Moyenne | 8h | ⬜ À faire |
| Profil utilisateur | 🟡 Moyenne | 6h | ⬜ À faire |
| Historique de lecture | 🟢 Basse | 4h | ⬜ À faire |
| Notifications email | 🟢 Basse | 6h | ⬜ À faire |

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

*Ce document est mis à jour régulièrement. Dernière révision : 8 janvier 2026*
