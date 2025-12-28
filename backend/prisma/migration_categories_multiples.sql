-- Migration: Catégories multiples pour les personnalités
-- Ce script transfère les données de la colonne categorie_id vers la nouvelle table de jointure

-- 1. Créer la table de jointure si elle n'existe pas
CREATE TABLE IF NOT EXISTS personnalite_categories (
  personnalite_id INT NOT NULL,
  categorie_id INT NOT NULL,
  PRIMARY KEY (personnalite_id, categorie_id),
  FOREIGN KEY (personnalite_id) REFERENCES personnalites(id) ON DELETE CASCADE,
  FOREIGN KEY (categorie_id) REFERENCES categories_personnalites(id) ON DELETE CASCADE
);

-- 2. Migrer les données existantes (de categorie_id vers la table de jointure)
-- Seulement pour les personnalités qui ont un categorie_id et qui ne sont pas déjà dans la table de jointure
INSERT IGNORE INTO personnalite_categories (personnalite_id, categorie_id)
SELECT id, categorie_id
FROM personnalites
WHERE categorie_id IS NOT NULL;

-- 3. Optionnel: Supprimer la colonne categorie_id après vérification
-- (Ne pas exécuter automatiquement - vérifier d'abord que la migration a fonctionné)
-- ALTER TABLE personnalites DROP COLUMN categorie_id;

-- 4. Vérification
SELECT 
  p.id,
  p.nom,
  GROUP_CONCAT(cp.id) AS categories_ids,
  GROUP_CONCAT(cpt.nom) AS categories_noms
FROM personnalites p
LEFT JOIN personnalite_categories pc ON p.id = pc.personnalite_id
LEFT JOIN categories_personnalites cp ON pc.categorie_id = cp.id
LEFT JOIN categories_personnalites_translations cpt ON cp.id = cpt.categorie_id AND cpt.lang = 'fr'
GROUP BY p.id, p.nom
ORDER BY p.nom;

