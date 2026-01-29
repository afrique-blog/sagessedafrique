-- Migration : Ajout support Dossiers Pays
-- Date : 2026-01-29
-- Description : Ajoute les champs nécessaires pour les dossiers pays (type, countryCode, requireAuth, freePreview, metadata)

-- Ajouter les nouvelles colonnes
ALTER TABLE `articles` 
  ADD COLUMN `type` VARCHAR(50) NOT NULL DEFAULT 'standard' AFTER `youtube_url`,
  ADD COLUMN `country_code` VARCHAR(2) NULL AFTER `type`,
  ADD COLUMN `require_auth` BOOLEAN NOT NULL DEFAULT FALSE AFTER `country_code`,
  ADD COLUMN `free_preview` INT NOT NULL DEFAULT 0 AFTER `require_auth`,
  ADD COLUMN `metadata` JSON NULL AFTER `free_preview`;

-- Ajouter un index sur le type pour optimiser les requêtes de filtrage
ALTER TABLE `articles` ADD INDEX `idx_articles_type` (`type`);

-- Ajouter un index sur country_code pour les regroupements par pays
ALTER TABLE `articles` ADD INDEX `idx_articles_country_code` (`country_code`);

-- Commentaires pour documentation
ALTER TABLE `articles` 
  MODIFY COLUMN `type` VARCHAR(50) NOT NULL DEFAULT 'standard' COMMENT 'Type d''article: standard, dossier-pays, dossier-thematique',
  MODIFY COLUMN `country_code` VARCHAR(2) NULL COMMENT 'Code pays ISO Alpha-2 (ex: ET pour Ethiopie)',
  MODIFY COLUMN `require_auth` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Nécessite une inscription pour lire l''article complet',
  MODIFY COLUMN `free_preview` INT NOT NULL DEFAULT 0 COMMENT 'Nombre de caractères visibles sans inscription (0 = tout gratuit)',
  MODIFY COLUMN `metadata` JSON NULL COMMENT 'Données structurées JSON (sections, practicalInfo, etc.)';
