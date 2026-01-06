-- ============================================
-- MIGRATION: Unification des emails dans contacts
-- Exécuter ce script sur le serveur de production
-- ============================================

-- 1. Créer la table contacts
CREATE TABLE IF NOT EXISTS contacts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) DEFAULT NULL,
  is_subscriber BOOLEAN DEFAULT FALSE,
  subscribed_at DATETIME(3) DEFAULT NULL,
  subscription_source VARCHAR(50) DEFAULT NULL,
  subscription_status VARCHAR(20) DEFAULT 'pending',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Migrer les subscribers existants vers contacts
INSERT INTO contacts (email, is_subscriber, subscribed_at, subscription_source, subscription_status, created_at)
SELECT 
  email, 
  status != 'unsubscribed',
  created_at,
  source,
  status,
  created_at
FROM subscribers
ON DUPLICATE KEY UPDATE 
  is_subscriber = IF(VALUES(is_subscriber), TRUE, is_subscriber),
  subscribed_at = COALESCE(contacts.subscribed_at, VALUES(subscribed_at)),
  subscription_source = COALESCE(contacts.subscription_source, VALUES(subscription_source)),
  subscription_status = VALUES(subscription_status);

-- 3. Migrer les emails des commentaires qui ne sont pas encore dans contacts
INSERT INTO contacts (email, name, created_at)
SELECT 
  c.author_email, 
  c.author_name, 
  MIN(c.created_at)
FROM comments c
WHERE c.author_email NOT IN (SELECT email FROM contacts)
GROUP BY c.author_email, c.author_name
ON DUPLICATE KEY UPDATE name = COALESCE(contacts.name, VALUES(name));

-- 4. Ajouter contact_id à la table comments (si pas déjà présent)
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'comments' 
  AND COLUMN_NAME = 'contact_id'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE comments ADD COLUMN contact_id INT DEFAULT NULL AFTER article_id',
  'SELECT "Column contact_id already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Remplir contact_id dans comments
UPDATE comments c
SET contact_id = (SELECT id FROM contacts WHERE email = c.author_email LIMIT 1)
WHERE contact_id IS NULL;

-- 6. Ajouter la contrainte de clé étrangère (si pas déjà présente)
SET @fk_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'comments' 
  AND CONSTRAINT_NAME = 'comments_contact_id_fkey'
);

SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE comments ADD CONSTRAINT comments_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL',
  'SELECT "FK comments_contact_id_fkey already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 7. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_contacts_is_subscriber ON contacts(is_subscriber);

-- Vérification
SELECT 'Migration terminée avec succès!' AS status;
SELECT COUNT(*) AS total_contacts FROM contacts;
SELECT COUNT(*) AS subscribers FROM contacts WHERE is_subscriber = TRUE;
SELECT COUNT(*) AS comments_linked FROM comments WHERE contact_id IS NOT NULL;
