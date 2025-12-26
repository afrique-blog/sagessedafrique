# 📋 Plan d'action — Sagesse d'Afrique

> **Dernière mise à jour** : 26 décembre 2024  
> **Progression globale** : 6/36 tâches (17%)

---

## 📁 Structure des fichiers de suivi

```
docs/
├── PLAN_ACTION.md          ← Ce fichier (plan global)
├── completed/              ← Tâches terminées
│   ├── 001_images_categories.md
│   ├── 002_descriptions_categories.md
│   └── ...
└── audit_sagessedafrique.md ← Audit original (à la racine)
```

---

## 🎯 Légende

| Symbole | Signification |
|---------|---------------|
| ⬜ | À faire |
| 🔄 | En cours |
| ✅ | Terminé |
| ⚠️ | Risque élevé |
| 🔗 | Dépendance |

---

## Phase 1 : Fondations (Semaine 1-2)

**Objectif** : Stabiliser l'existant sans rien casser

| ID | Tâche | Statut | Risque | Dépendance | Date |
|----|-------|--------|--------|------------|------|
| 1.1 | Ajouter images catégories manquantes (sciences.jpg, philosophie.jpg, medecine.jpg) | ✅ | Aucun | - | 26/12/2024 |
| 1.2 | Remplir descriptions FR/EN des catégories (SQL) | ✅ | Aucun | - | 26/12/2024 |
| 1.3 | Corriger bug sauvegarde image catégorie (Prisma sync) | ✅ | Faible | - | 26/12/2024 |
| 1.4 | Normaliser tous les chemins d'images en base | ✅ | Faible | 1.3 | 26/12/2024 |
| 1.5 | Créer/améliorer page "À propos" complète | ✅ | Aucun | - | 26/12/2024 |
| 1.6 | Vérifier affichage mobile (test pouce) | ✅ | Aucun | - | 26/12/2024 |

**Critère de validation Phase 1** :
- [x] Toutes les catégories ont une image ✅
- [x] Toutes les catégories ont une description FR et EN ✅
- [x] Les images se sauvegardent correctement via l'admin ✅
- [x] Le site s'affiche correctement sur mobile ✅

### ✅ PHASE 1 TERMINÉE — 26/12/2024

---

## Phase 2 : SEO Technique (Semaine 3-4)

**Objectif** : Améliorer le référencement sans perdre l'existant

### 2A. Préparation (OBLIGATOIRE avant migration)

| ID | Tâche | Statut | Risque | Dépendance | Date |
|----|-------|--------|--------|------------|------|
| 2.1 | Auditer toutes les URLs actuelles (export liste) | ✅ | Aucun | Phase 1 ✅ | 26/12/2024 |
| 2.2 | Créer table de mapping ancien → nouveau slug | ✅ | Aucun | 2.1 | 26/12/2024 |
| 2.3 | Implémenter système de redirections 301 | ✅ | Moyen | 2.2 | 26/12/2024 |
| 2.4 | Tester les redirections en staging | ✅ | Aucun | 2.3 | 26/12/2024 |

### 2B. Migration des slugs ⚠️ TERMINÉE

| ID | Tâche | Statut | Risque | Dépendance | Date |
|----|-------|--------|--------|------------|------|
| 2.5 | Backup complet base de données | ✅ | Aucun | 2.4 ✅ | 26/12/2024 |
| 2.6 | Migrer slugs articles (espaces → tirets) | ✅ | ⚠️ ÉLEVÉ | 2.5 | 26/12/2024 |
| 2.7 | Migrer slugs tags | ✅ | ⚠️ ÉLEVÉ | 2.6 | 26/12/2024 |
| 2.8 | Vérifier toutes les redirections en production | ✅ | Moyen | 2.7 | 26/12/2024 |

### ✅ PHASE 2A & 2B TERMINÉES — 26/12/2024

### 2C. Optimisations SEO

| ID | Tâche | Statut | Risque | Dépendance | Date |
|----|-------|--------|--------|------------|------|
| 2.9 | Meta titles dynamiques (format SEO) | ⬜ | Faible | - | - |
| 2.10 | Meta descriptions dynamiques | ⬜ | Faible | 2.9 | - |
| 2.11 | Balises Open Graph (og:title, og:image, etc.) | ⬜ | Faible | - | - |
| 2.12 | Twitter Cards | ⬜ | Faible | 2.11 | - |
| 2.13 | Schema.org Article | ⬜ | Moyen | - | - |
| 2.14 | Schema.org Organization | ⬜ | Faible | - | - |
| 2.15 | Schema.org Breadcrumb | ⬜ | Faible | - | - |
| 2.16 | Canonical URLs | ⬜ | Faible | 2.8 | - |

**Critère de validation Phase 2** :
- [ ] Aucune URL ne retourne 404
- [ ] Anciennes URLs redirigent vers nouvelles
- [ ] Meta titles visibles dans les onglets navigateur
- [ ] Partage Facebook/Twitter affiche preview correct
- [ ] Test Google Rich Results OK

---

## Phase 3 : UX & Contenu (Semaine 5-6)

**Objectif** : Améliorer l'expérience utilisateur

| ID | Tâche | Statut | Risque | Dépendance | Date |
|----|-------|--------|--------|------------|------|
| 3.1 | Section "Commencer ici" sur homepage (3 boutons) | ⬜ | Aucun | - | - |
| 3.2 | Table des matières (TOC) auto-générée dans articles | ⬜ | Faible | - | - |
| 3.3 | Améliorer bloc "Articles liés" fin d'article | ⬜ | Aucun | - | - |
| 3.4 | Template article : chapeau structuré | ⬜ | Aucun | - | - |
| 3.5 | Ajouter champ "Sources & références" aux articles | ⬜ | Faible | - | - |
| 3.6 | Breadcrumb navigation visuel | ⬜ | Faible | 2.15 | - |
| 3.7 | Boutons de partage social (flottants ou fixes) | ⬜ | Aucun | - | - |
| 3.8 | Optimisation images (WebP, lazy-load) | ⬜ | Moyen | - | - |

**Critère de validation Phase 3** :
- [ ] Homepage guide le visiteur (chemin clair)
- [ ] Articles longs ont une TOC fonctionnelle
- [ ] Temps de chargement < 3s sur mobile 4G

---

## Phase 4 : Conversion & Growth (Semaine 7-8)

**Objectif** : Transformer les visiteurs en abonnés

| ID | Tâche | Statut | Risque | Dépendance | Date |
|----|-------|--------|--------|------------|------|
| 4.1 | Créer lead magnet PDF "10 penseurs africains" | ⬜ | Aucun | - | - |
| 4.2 | CTA newsletter amélioré (promesse claire) | ⬜ | Aucun | - | - |
| 4.3 | Pop-up newsletter (après 45-60s, discret) | ⬜ | Faible | - | - |
| 4.4 | Séquence email bienvenue (3 emails) | ⬜ | Aucun | Service email | - |
| 4.5 | Pages auteur enrichies (bio, photo, articles) | ⬜ | Aucun | - | - |
| 4.6 | Page "Politique éditoriale" | ⬜ | Aucun | - | - |

**Critère de validation Phase 4** :
- [ ] Lead magnet téléchargeable
- [ ] Taux de conversion newsletter > 2%
- [ ] Séquence email automatisée fonctionnelle

---

## 📊 Tableau de bord

### Progression par phase

| Phase | Tâches | Terminées | % |
|-------|--------|-----------|---|
| Phase 1 - Fondations | 6 | 6 | 100% ✅ |
| Phase 2 - SEO | 16 | 8 | 50% |
| Phase 3 - UX | 8 | 0 | 0% |
| Phase 4 - Conversion | 6 | 0 | 0% |
| **TOTAL** | **36** | **14** | **39%** |

### Historique des déploiements

| Date | Tâches déployées | Commit | Statut |
|------|------------------|--------|--------|
| 26/12/2024 | 1.1, 1.2, 1.3 — Images + descriptions catégories + fix Prisma | Via SQL + serveur | ✅ OK |

---

## 🔧 Commandes utiles

### Backup base de données
```bash
mysqldump -u lasagesse -p'FULvio2026/@' sagesse_db > backup_$(date +%Y%m%d).sql
```

### Déploiement standard
```bash
cd /var/www/vhosts/sagessedafrique.blog/httpdocs
git pull origin main
cd backend && npx prisma generate && npm run build
cd ../frontend && npm run build
cd .. && pkill -f "node" && nohup /opt/plesk/node/25/bin/node app.js > app.log 2>&1 & disown
```

### Vérifier les logs
```bash
tail -f /var/www/vhosts/sagessedafrique.blog/httpdocs/app.log
```

---

## 📝 Notes et décisions

### 26/12/2024
- Création du plan d'action
- Audit initial analysé
- Priorité : Phase 1 d'abord (risque minimal)

---

## 🚨 Points de vigilance

1. **Migration des slugs (2.6-2.7)** : Ne JAMAIS faire sans redirections 301 en place
2. **Prisma** : Toujours régénérer le client après modification schéma
3. **Images** : Supprimer les fichiers untracked avant `git pull`
4. **Cache** : Vider le cache navigateur après déploiement CSS/JS

---

## 📚 Fichiers de référence

- `audit_sagessedafrique.md` — Audit original avec recommandations détaillées
- `docs/completed/` — Documentation des tâches terminées

