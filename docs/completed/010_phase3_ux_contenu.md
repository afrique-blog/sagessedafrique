# Phase 3 : UX & Contenu

**Date** : 26/12/2024  
**Statut** : ✅ Complète

## Objectif

Améliorer l'expérience utilisateur et la qualité du contenu.

## Tâches réalisées

### 3.1 Section "Commencer ici" sur homepage

- Ajout d'une section guide avec 3 boutons interactifs :
  - **Personnalités** : Lien vers `/personnalites`
  - **Catégories** : Lien vers `/categories`
  - **Dossiers** : Lien ancré vers `#dossiers`
- Design avec gradients colorés et animations hover
- Traductions FR/EN ajoutées

### 3.2 Table des matières (TOC) auto-générée

- Extraction automatique des titres H2/H3 du contenu HTML
- Génération d'IDs uniques pour chaque heading
- TOC collapsible avec animation
- Navigation smooth scroll vers les sections
- Affichée seulement si >= 3 headings

### 3.3 Articles liés améliorés

- Design repensé avec gradient de fond
- Texte d'introduction dynamique basé sur la catégorie
- Bouton CTA "Tous les articles [Catégorie]"
- Icône et badge "Continuez votre lecture"

### 3.4 Chapeau structuré

- L'excerpt est affiché dans le hero de l'article
- Le takeaway est bien mis en avant avec un design distinctif

### 3.5 Sources & Références

**Modifications base de données :**
```sql
ALTER TABLE article_translations ADD COLUMN sources TEXT;
```

**Backend :**
- Schéma Prisma mis à jour
- Validation Zod pour `sources`
- API GET/POST/PUT gère le champ sources

**Frontend Admin :**
- Nouveau champ textarea "📚 Sources & Références" 
- Placeholder avec format suggéré
- Support FR/EN

**Frontend Public :**
- Affichage en liste à puces
- Design sobre avec fond gris
- Icône 📚 et titre traduit

### 3.6 Breadcrumb navigation

- Fil d'Ariane visuel : Accueil > Catégorie > Article
- Design discret avec chevrons
- Liens cliquables vers la catégorie et l'accueil
- Truncation du titre sur mobile

### 3.7 Boutons de partage social (déjà fait en Phase 2)

- Boutons flottants Facebook, Twitter, LinkedIn, WhatsApp
- Position fixe sur le côté gauche (desktop)
- Cachés sur mobile

### 3.8 Optimisation images

- Next.js Image gère automatiquement :
  - Conversion WebP/AVIF
  - Lazy loading natif
  - Responsive srcset
  - Placeholder blur

## Fichiers modifiés

- `frontend/lib/i18n.ts` (nouvelles traductions)
- `frontend/app/page.tsx` (section Commencer ici)
- `frontend/app/article/[slug]/ArticleClient.tsx` (TOC, breadcrumb, sources, articles liés)
- `frontend/app/admin/articles/new/page.tsx` (champ sources)
- `frontend/app/admin/articles/[id]/page.tsx` (champ sources)
- `frontend/lib/api.ts` (interface Article avec sources)
- `backend/prisma/schema.prisma` (champ sources)
- `backend/src/routes/articles.ts` (API sources)

## Déploiement

```bash
cd /var/www/vhosts/sagessedafrique.blog/httpdocs
git pull origin main
cd backend && npx prisma db push && npm run build
cd ../frontend && npm run build
cd .. && pkill -f "node" && sleep 2 && nohup /opt/plesk/node/25/bin/node app.js > app.log 2>&1 & disown
```

## Validation

- [x] Homepage guide le visiteur avec 3 chemins clairs
- [x] Articles longs ont une TOC fonctionnelle et collapsible
- [x] Sources affichées en bas des articles si renseignées
- [x] Breadcrumb visible sur toutes les pages articles
- [x] Images optimisées automatiquement par Next.js

