-- =====================================================
-- Migration: Une semaine en Afrique
-- Fonctionnalité d'actualités hebdomadaires
-- =====================================================

-- Table des éditions hebdomadaires
CREATE TABLE IF NOT EXISTS weekly_editions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  week_number INT NOT NULL,
  year INT NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  published_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_week_year (year, week_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Traductions des éditions
CREATE TABLE IF NOT EXISTS weekly_edition_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  edition_id INT NOT NULL,
  lang VARCHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  UNIQUE KEY unique_edition_lang (edition_id, lang),
  FOREIGN KEY (edition_id) REFERENCES weekly_editions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des actualités (10 par semaine)
CREATE TABLE IF NOT EXISTS weekly_news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  edition_id INT NOT NULL,
  position INT DEFAULT 1,
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(2) NOT NULL,
  source_url VARCHAR(500),
  source_name VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (edition_id) REFERENCES weekly_editions(id) ON DELETE CASCADE,
  INDEX idx_edition_position (edition_id, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Traductions des actualités
CREATE TABLE IF NOT EXISTS weekly_news_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  news_id INT NOT NULL,
  lang VARCHAR(2) NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  UNIQUE KEY unique_news_lang (news_id, lang),
  FOREIGN KEY (news_id) REFERENCES weekly_news(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la recherche fulltext
ALTER TABLE weekly_news_translations ADD FULLTEXT INDEX idx_weekly_search (title, excerpt);
