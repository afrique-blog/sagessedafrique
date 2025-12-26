# Tâche 1.4 — Normaliser les chemins d'images en base

**Date** : 26/12/2024  
**Durée** : 10min  
**Statut** : ✅ Terminé

## Objectif

Vérifier et corriger les chemins d'images dans la base de données pour assurer la cohérence.

## Audit réalisé

### Catégories ✅
- Images stockées **sans préfixe** : `sciences.jpg`, `arts.jpg`...
- Backend normalise automatiquement avec `/images/categories/`
- **Aucune correction nécessaire**

### Personnalités ✅
- Images avec préfixe complet : `/images/personnalites/Nelson-Mandela.jpg`
- Cohérent sur toutes les entrées
- **Aucune correction nécessaire**

### Articles ⚠️ → ✅
- 2 articles utilisaient des URLs externes (picsum.photos)
- Corrigé avec des images locales

## SQL exécuté

```sql
-- Corriger les 2 articles avec URLs externes
UPDATE articles SET hero_image = '/images/personnalites/Sciences-Africa.jpg' WHERE id = 3;
UPDATE articles SET hero_image = '/images/personnalites/Sciences-Africa.jpg' WHERE id = 4;
```

## Convention établie

| Table | Format image | Exemple |
|-------|--------------|---------|
| categories | Nom fichier seul | `sciences.jpg` |
| articles | Chemin complet | `/images/personnalites/Imhotep.jpg` |
| personnalites | Chemin complet | `/images/personnalites/Nelson-Mandela.jpg` |

## Note technique

Le backend normalise automatiquement les chemins :
- `normalizeCategoryImage()` → ajoute `/images/categories/`
- `normalizeHeroImage()` → ajoute `/images/personnalites/` si besoin
- `normalizePersonnaliteImage()` → ajoute `/images/personnalites/` si besoin

Cela permet de stocker juste le nom du fichier et laisser le backend construire l'URL complète.

