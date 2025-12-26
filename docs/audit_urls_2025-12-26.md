# 📋 Audit des URLs — 26 décembre 2025

## Résumé

| Type | Total | ✅ OK | ⚠️ À migrer |
|------|-------|-------|-------------|
| Articles | 20 | 4 | 16 |
| Personnalités | 48 | 0 | 48 |
| Catégories | 7 | 7 | 0 |
| Cat. Personnalités | 12 | 12 | 0 |
| Dossiers | 5 | 5 | 0 |
| Tags | 32 | 12 | 20 |

---

## Articles à migrer

| ID | Ancien slug | Nouveau slug proposé |
|----|-------------|---------------------|
| 5 | `Achille Mbembe` | `achille-mbembe` |
| 6 | `Cheikh Anta Diop – Réhabiliter l'Afrique dans l'histoire universelle` | `cheikh-anta-diop-rehabiliter-afrique-histoire` |
| 7 | `Frantz Fanon – Penser la décolonisation et la libération des peuples` | `frantz-fanon-decolonisation-liberation-peuples` |
| 8 | `Ibn Khaldoun – Précurseur de la pensée historique et des sciences sociales` | `ibn-khaldoun-pensee-historique-sciences-sociales` |
| 9 | `Arthur Zang – Innover pour sauver des vies en Afrique` | `arthur-zang-innovation-sante-afrique` |
| 10 | `Imhotep – Le premier savant de l'histoire humaine` | `imhotep-premier-savant-histoire` |
| 11 | `William Kamkwamba – Quand l'ingéniosité africaine transforme le destin` | `william-kamkwamba-ingeniosite-africaine` |
| 12 | `L'Afrique, berceau ancien et moderne des sciences et de l'innovation` | `afrique-berceau-sciences-innovation` |
| 13 | `Julius Nyerere – Le penseur politique de l'indépendance et de la dignité africaine` | `julius-nyerere-penseur-politique-independance` |
| 14 | `Kwame Nkrumah – Le visionnaire du panafricanisme et de l'unité africaine` | `kwame-nkrumah-panafricanisme-unite-africaine` |
| 15 | `Léopold Sédar Senghor – Le poète-président et l'architecte de la Négritude` | `leopold-sedar-senghor-poete-president-negritude` |
| 16 | `Nelson Mandela – De la lutte à la réconciliation, le visage universel de la liberté` | `nelson-mandela-lutte-reconciliation-liberte` |
| 17 | `Patrice Lumumba – La voix brisée de la souveraineté africaine` | `patrice-lumumba-souverainete-africaine` |
| 18 | `Sékou Touré – L'indépendance sans compromis` | `sekou-toure-independance-sans-compromis` |
| 19 | `Thomas Sankara – La révolution par l'intégrité et la dignité` | `thomas-sankara-revolution-integrite-dignite` |

---

## Tags à migrer

| ID | Ancien slug | Nouveau slug proposé |
|----|-------------|---------------------|
| 13 | `Pensée africaine` | `pensee-africaine` |
| 14 | `Philosophie contemporaine` | `philosophie-contemporaine` |
| 15 | `Postcolonialisme` | `postcolonialisme` |
| 16 | `Intellectuels africains` | `intellectuels-africains` |
| 17 | `Histoire et pouvoir` | `histoire-et-pouvoir` |
| 18 | `Sciences africaines` | `sciences-africaines` |
| 19 | `Innovation technologique` | `innovation-technologique` |
| 20 | `Ingénieurs africains` | `ingenieurs-africains` |
| 21 | `Santé et technologies` | `sante-et-technologies` |
| 22 | `Génie africain` | `genie-africain` |
| 23 | `Leaders africains` | `leaders-africains` |
| 24 | `Indépendance africaine` | `independance-africaine` |
| 25 | `Pensée politique` | `pensee-politique` |
| 27 | `Gouvernance et pouvoir` | `gouvernance-et-pouvoir` |
| 28 | `Éthiopie impériale` | `ethiopie-imperiale` |
| 29 | `Haïlé Sélassié Ier` | `haile-selassie-ier` |
| 30 | `Dynastie salomonide` | `dynastie-salomonide` |
| 31 | `Invasion italienne 1935` | `invasion-italienne-1935` |
| 32 | `Organisation de l'unité africaine` | `organisation-unite-africaine` |

---

## Personnalités — Problème structurel

Les personnalités n'ont pas de champ `slug` dédié. Elles utilisent le `nom` comme identifiant.

### Options :
1. **Ajouter un champ `slug`** à la table `personnalites` ← Recommandé
2. Générer le slug dynamiquement côté API

### Proposition de slugs :

| ID | Nom | Slug proposé |
|----|-----|--------------|
| 1 | Nelson Mandela | `nelson-mandela` |
| 2 | Kwame Nkrumah | `kwame-nkrumah` |
| 3 | Thomas Sankara | `thomas-sankara` |
| 4 | Patrice Lumumba | `patrice-lumumba` |
| 5 | Julius Nyerere | `julius-nyerere` |
| 6 | Léopold Sédar Senghor | `leopold-sedar-senghor` |
| 7 | Sékou Touré | `sekou-toure` |
| 8 | Samory Touré | `samory-toure` |
| 9 | El Hadj Omar Tall | `el-hadj-omar-tall` |
| 10 | Yaa Asantewaa | `yaa-asantewaa` |
| 11 | Nzinga Mbandi | `nzinga-mbandi` |
| 12 | Béhanzin | `behanzin` |
| 13 | Haïlé Sélassié Ier | `haile-selassie-ier` |
| 14 | Mansa Moussa | `mansa-moussa` |
| 15 | Shaka Zulu | `shaka-zulu` |
| 16 | Soundiata Keïta | `soundiata-keita` |
| 17 | Cheikh Anta Diop | `cheikh-anta-diop` |
| 18 | Achille Mbembe | `achille-mbembe` |
| 19 | Ibn Khaldoun | `ibn-khaldoun` |
| 20 | Frantz Fanon | `frantz-fanon` |
| 21 | Chinua Achebe | `chinua-achebe` |
| 22 | Wole Soyinka | `wole-soyinka` |
| 23 | Ousmane Sembène | `ousmane-sembene` |
| 24 | Mariama Bâ | `mariama-ba` |
| 25 | Desmond Tutu | `desmond-tutu` |
| 26 | Wangari Maathai | `wangari-maathai` |
| 27 | Kofi Annan | `kofi-annan` |
| 28 | Denis Mukwege | `denis-mukwege` |
| 29 | Miriam Makeba | `miriam-makeba` |
| 30 | Fela Anikulapo Kuti | `fela-kuti` |
| 31 | Youssou N'Dour | `youssou-ndour` |
| 32 | Ali Farka Touré | `ali-farka-toure` |
| 33 | Didier Drogba | `didier-drogba` |
| 34 | Samuel Eto'o | `samuel-etoo` |
| 35 | George Weah | `george-weah` |
| 36 | Sadio Mané | `sadio-mane` |
| 37 | Imhotep | `imhotep` |
| 38 | Arthur Zang | `arthur-zang` |
| 39 | William Kamkwamba | `william-kamkwamba` |
| 40 | Néfertiti | `nefertiti` |
| 41 | Ramsès II | `ramses-ii` |
| 42 | Hannibal Barca | `hannibal-barca` |
| 43 | Toussaint Louverture | `toussaint-louverture` |
| 44 | Marcus Garvey | `marcus-garvey` |
| 45 | Malcolm X | `malcolm-x` |
| 46 | Winnie Mandela | `winnie-mandela` |
| 47 | Ellen Johnson Sirleaf | `ellen-johnson-sirleaf` |
| 48 | Ngozi Okonjo-Iweala | `ngozi-okonjo-iweala` |

---

## Entités OK (pas de migration nécessaire)

### Catégories (articles)
- sciences, histoire, philosophie, arts, leadership, medecine, biographies

### Catégories personnalités
- leaders-politiques, resistants-anticoloniaux, monarques-historiques, etc.

### Dossiers
- pionniers-du-savoir, figures-de-la-liberte, etc.

### Tags (1-12)
- egypte, astronomie, physique, resistances, innovation, ethique, etc.

---

## Plan de migration

### Étape 1 : Ajouter champ `slug` aux personnalités
```sql
ALTER TABLE personnalites ADD COLUMN slug VARCHAR(255) UNIQUE AFTER nom;
```

### Étape 2 : Créer table de redirections
```sql
CREATE TABLE redirects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  old_path VARCHAR(500) NOT NULL,
  new_path VARCHAR(500) NOT NULL,
  entity_type ENUM('article', 'personnalite', 'tag') NOT NULL,
  entity_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_old_path (old_path(255))
);
```

### Étape 3 : Implémenter middleware de redirection 301
- Vérifier dans la table `redirects` avant de retourner 404
- Rediriger avec code 301 (permanent)

### Étape 4 : Migrer les slugs
- Backup complet
- Insérer les anciennes URLs dans `redirects`
- Mettre à jour les slugs

---

## Risques identifiés

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Perte SEO si 404 | Élevé | Redirections 301 obligatoires |
| Liens internes cassés | Moyen | Vérifier tous les liens dans le contenu HTML |
| Cache navigateur | Faible | Headers cache appropriés |
| Bookmarks utilisateurs | Faible | Redirections 301 |

---

## Validation

- [ ] Toutes les anciennes URLs redirigent vers les nouvelles
- [ ] Aucune erreur 404 sur les URLs existantes
- [ ] Sitemap.xml mis à jour avec nouvelles URLs
- [ ] Google Search Console : soumettre nouveau sitemap

