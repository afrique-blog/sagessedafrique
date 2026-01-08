-- Migration: Système Communauté
-- Date: 2026-01-08
-- Description: Ajoute les tables pour les membres, OAuth, vérification email, etc.

-- Table des membres de la communauté
CREATE TABLE IF NOT EXISTS `members` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `name` VARCHAR(100) NOT NULL,
  `avatar` VARCHAR(500) NULL,
  `bio` TEXT NULL,
  `preferred_lang` VARCHAR(2) NOT NULL DEFAULT 'fr',
  `is_email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_subscriber` BOOLEAN NOT NULL DEFAULT FALSE,
  `last_login_at` DATETIME(3) NULL,
  `login_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_members_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions des membres
CREATE TABLE IF NOT EXISTS `member_sessions` (
  `id` VARCHAR(36) NOT NULL,
  `member_id` INT NOT NULL,
  `token` VARCHAR(500) NOT NULL UNIQUE,
  `user_agent` VARCHAR(500) NULL,
  `ip_address` VARCHAR(45) NULL,
  `expires_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_member_sessions_member` (`member_id`),
  INDEX `idx_member_sessions_token` (`token`(255)),
  INDEX `idx_member_sessions_expires` (`expires_at`),
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comptes OAuth (Google, Facebook)
CREATE TABLE IF NOT EXISTS `oauth_accounts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NOT NULL,
  `provider` VARCHAR(20) NOT NULL,
  `provider_id` VARCHAR(255) NOT NULL,
  `access_token` TEXT NULL,
  `refresh_token` TEXT NULL,
  `expires_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_oauth_provider` (`provider`, `provider_id`),
  INDEX `idx_oauth_member` (`member_id`),
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vérification email
CREATE TABLE IF NOT EXISTS `email_verifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NOT NULL,
  `token` VARCHAR(100) NOT NULL UNIQUE,
  `expires_at` DATETIME(3) NOT NULL,
  `used_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_email_verif_member` (`member_id`),
  INDEX `idx_email_verif_token` (`token`),
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Réinitialisation mot de passe
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NOT NULL,
  `token` VARCHAR(100) NOT NULL UNIQUE,
  `expires_at` DATETIME(3) NOT NULL,
  `used_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_password_reset_member` (`member_id`),
  INDEX `idx_password_reset_token` (`token`),
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Favoris des membres
CREATE TABLE IF NOT EXISTS `member_favorites` (
  `member_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`member_id`, `article_id`),
  INDEX `idx_favorites_member` (`member_id`),
  INDEX `idx_favorites_article` (`article_id`),
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Historique de lecture
CREATE TABLE IF NOT EXISTS `reading_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  `progress` INT NOT NULL DEFAULT 0,
  `read_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reading_member_article` (`member_id`, `article_id`),
  INDEX `idx_reading_member` (`member_id`),
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajouter member_id aux commentaires
ALTER TABLE `comments` ADD COLUMN IF NOT EXISTS `member_id` INT NULL;
ALTER TABLE `comments` ADD INDEX IF NOT EXISTS `idx_comments_member` (`member_id`);

-- Afficher le résultat
SELECT 'Migration communauté terminée!' AS status;
SELECT COUNT(*) AS tables_created FROM information_schema.tables 
WHERE table_schema = DATABASE() AND table_name IN ('members', 'member_sessions', 'oauth_accounts', 'email_verifications', 'password_resets', 'member_favorites', 'reading_history');
