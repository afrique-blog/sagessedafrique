-- ============================================
-- MIGRATION: Ajouter les réponses aux commentaires
-- Exécuter ce script sur le serveur de production
-- ============================================

-- 1. Ajouter la colonne parent_id pour les réponses
ALTER TABLE comments 
ADD COLUMN parent_id INT DEFAULT NULL AFTER contact_id;

-- 2. Ajouter la contrainte de clé étrangère
ALTER TABLE comments
ADD CONSTRAINT comments_parent_id_fkey 
FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;

-- 3. Créer un index pour les performances
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Vérification
SELECT 'Migration réponses aux commentaires terminée!' AS status;
DESCRIBE comments;
