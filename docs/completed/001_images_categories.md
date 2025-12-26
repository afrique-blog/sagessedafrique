# Tâche 1.1 — Ajouter images catégories manquantes

**Date** : 26/12/2024  
**Durée** : 15min  
**Statut** : ✅ Terminé

## Objectif

Ajouter les images d'illustration pour toutes les catégories d'articles.

## Ce qui a été fait

### Images ajoutées/corrigées
- `sciences.jpg` — Catégorie Sciences (nom corrigé de science.jpg → sciences.jpg)
- `histoire.jpg` — Catégorie Histoire
- `philosophie.jpg` — Catégorie Philosophie
- `arts.jpg` — Catégorie Arts & Culture
- `leadership.jpg` — Catégorie Leadership
- `medecine.jpg` — Catégorie Médecine
- `biographies.jpg` — Catégorie Biographies

### SQL exécuté
```sql
UPDATE categories SET image = 'sciences.jpg' WHERE slug = 'sciences';
UPDATE categories SET image = 'histoire.jpg' WHERE slug = 'histoire';
UPDATE categories SET image = 'philosophie.jpg' WHERE slug = 'philosophie';
UPDATE categories SET image = 'arts.jpg' WHERE slug = 'arts';
UPDATE categories SET image = 'leadership.jpg' WHERE slug = 'leadership';
UPDATE categories SET image = 'medecine.jpg' WHERE slug = 'medecine';
UPDATE categories SET image = 'biographies.jpg' WHERE slug = 'biographies';
```

## Emplacement des fichiers

```
frontend/public/images/categories/
├── sciences.jpg
├── histoire.jpg
├── philosophie.jpg
├── arts.jpg
├── leadership.jpg
├── medecine.jpg
└── biographies.jpg
```

## Résultat

Les images s'affichent maintenant sur :
- La page `/categories` (liste de toutes les catégories)
- Les pages `/category/[slug]` (hero de chaque catégorie)

