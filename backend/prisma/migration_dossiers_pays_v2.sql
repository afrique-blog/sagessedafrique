-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION : DOSSIERS PAYS v2
-- Date : 2026-01-24
-- Description : Tables pour le système de Dossiers Pays (sous-domaine dédié)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Table principale des dossiers pays
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pays_dossiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  country_code VARCHAR(2) NOT NULL,
  hero_image VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_pays_dossiers_slug (slug),
  INDEX idx_pays_dossiers_country (country_code),
  INDEX idx_pays_dossiers_published (published_at),
  INDEX idx_pays_dossiers_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Traductions des dossiers (FR, EN)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pays_dossiers_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dossier_id INT NOT NULL,
  lang VARCHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  UNIQUE KEY unique_dossier_lang (dossier_id, lang),
  FOREIGN KEY (dossier_id) REFERENCES pays_dossiers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Chapitres des dossiers
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pays_chapitres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dossier_id INT NOT NULL,
  slug VARCHAR(100) NOT NULL,
  ordre INT NOT NULL,
  hero_image VARCHAR(500),
  reading_minutes INT DEFAULT 5,
  
  UNIQUE KEY unique_dossier_slug (dossier_id, slug),
  UNIQUE KEY unique_dossier_ordre (dossier_id, ordre),
  INDEX idx_pays_chapitres_ordre (dossier_id, ordre),
  FOREIGN KEY (dossier_id) REFERENCES pays_dossiers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Traductions des chapitres (contenu HTML)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pays_chapitres_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chapitre_id INT NOT NULL,
  lang VARCHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content_html LONGTEXT NOT NULL,
  
  UNIQUE KEY unique_chapitre_lang (chapitre_id, lang),
  FOREIGN KEY (chapitre_id) REFERENCES pays_chapitres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Progression utilisateur (optionnel - pour membres connectés)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pays_user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  chapitre_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_member_chapitre (member_id, chapitre_id),
  INDEX idx_pays_progress_member (member_id),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (chapitre_id) REFERENCES pays_chapitres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN DE LA MIGRATION
-- ═══════════════════════════════════════════════════════════════════════════
