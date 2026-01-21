-- =====================================================
-- Migration: Une semaine en Afrique (Version simplifiée)
-- Stockage HTML direct du contenu GPT
-- =====================================================

-- Supprimer les anciennes tables si elles existent
DROP TABLE IF EXISTS weekly_news_translations;
DROP TABLE IF EXISTS weekly_news;
DROP TABLE IF EXISTS weekly_edition_translations;
DROP TABLE IF EXISTS weekly_editions;

-- Table des éditions hebdomadaires (simplifiée)
CREATE TABLE IF NOT EXISTS weekly_editions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  week_number INT NOT NULL,
  year INT NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255),
  content_html LONGTEXT,
  published_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_week_year (year, week_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
