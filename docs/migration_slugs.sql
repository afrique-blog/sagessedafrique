-- =============================================================================
-- MIGRATION DES SLUGS — Sagesse d'Afrique
-- Date: 26 décembre 2024
-- =============================================================================
-- ⚠️ NE PAS EXÉCUTER CE SCRIPT SANS BACKUP PRÉALABLE !
-- ⚠️ EXÉCUTER DANS L'ORDRE : 1. Backup, 2. Redirects, 3. Articles, 4. Tags
-- =============================================================================

-- =============================================================================
-- ÉTAPE 0 : BACKUP (exécuter sur le serveur)
-- =============================================================================
-- mysqldump -u lasagesse -p'FULvio2026/@' sagesse_db > backup_$(date +%Y%m%d_%H%M%S).sql

-- =============================================================================
-- ÉTAPE 1 : CRÉER LA TABLE REDIRECTS (si pas déjà fait via Prisma)
-- =============================================================================
CREATE TABLE IF NOT EXISTS redirects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  old_path VARCHAR(500) NOT NULL UNIQUE,
  new_path VARCHAR(500) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  hits INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ÉTAPE 2 : INSÉRER LES REDIRECTIONS POUR LES ARTICLES
-- =============================================================================
-- D'abord, on insère les anciennes URLs dans la table redirects

-- Article 5
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Achille%20Mbembe', '/article/achille-mbembe', 'article', 5);

-- Article 6
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Cheikh%20Anta%20Diop%20%E2%80%93%20R%C3%A9habiliter%20l%27Afrique%20dans%20l%27histoire%20universelle', '/article/cheikh-anta-diop-rehabiliter-afrique-histoire', 'article', 6);

-- Article 7
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Frantz%20Fanon%20%E2%80%93%20Penser%20la%20d%C3%A9colonisation%20et%20la%20lib%C3%A9ration%20des%20peuples', '/article/frantz-fanon-decolonisation-liberation-peuples', 'article', 7);

-- Article 8
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Ibn%20Khaldoun%20%E2%80%93%20Pr%C3%A9curseur%20de%20la%20pens%C3%A9e%20historique%20et%20des%20sciences%20sociales', '/article/ibn-khaldoun-pensee-historique-sciences-sociales', 'article', 8);

-- Article 9
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Arthur%20Zang%20%E2%80%93%20Innover%20pour%20sauver%20des%20vies%20en%20Afrique', '/article/arthur-zang-innovation-sante-afrique', 'article', 9);

-- Article 10
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Imhotep%20%E2%80%93%20Le%20premier%20savant%20de%20l%27histoire%20humaine', '/article/imhotep-premier-savant-histoire', 'article', 10);

-- Article 11
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/William%20Kamkwamba%20%E2%80%93%20Quand%20l%27ing%C3%A9niosit%C3%A9%20africaine%20transforme%20le%20destin', '/article/william-kamkwamba-ingeniosite-africaine', 'article', 11);

-- Article 12
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/L%27Afrique%2C%20berceau%20ancien%20et%20moderne%20des%20sciences%20et%20de%20l%27innovation', '/article/afrique-berceau-sciences-innovation', 'article', 12);

-- Article 13
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Julius%20Nyerere%20%E2%80%93%20Le%20penseur%20politique%20de%20l%27ind%C3%A9pendance%20et%20de%20la%20dignit%C3%A9%20africaine', '/article/julius-nyerere-penseur-politique-independance', 'article', 13);

-- Article 14
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Kwame%20Nkrumah%20%E2%80%93%20Le%20visionnaire%20du%20panafricanisme%20et%20de%20l%27unit%C3%A9%20africaine', '/article/kwame-nkrumah-panafricanisme-unite-africaine', 'article', 14);

-- Article 15
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/L%C3%A9opold%20S%C3%A9dar%20Senghor%20%E2%80%93%20Le%20po%C3%A8te-pr%C3%A9sident%20et%20l%27architecte%20de%20la%20N%C3%A9gritude', '/article/leopold-sedar-senghor-poete-president-negritude', 'article', 15);

-- Article 16
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Nelson%20Mandela%20%E2%80%93%20De%20la%20lutte%20%C3%A0%20la%20r%C3%A9conciliation%2C%20le%20visage%20universel%20de%20la%20libert%C3%A9', '/article/nelson-mandela-lutte-reconciliation-liberte', 'article', 16);

-- Article 17
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Patrice%20Lumumba%20%E2%80%93%20La%20voix%20bris%C3%A9e%20de%20la%20souverainet%C3%A9%20africaine', '/article/patrice-lumumba-souverainete-africaine', 'article', 17);

-- Article 18
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/S%C3%A9kou%20Tour%C3%A9%20%E2%80%93%20L%27ind%C3%A9pendance%20sans%20compromis', '/article/sekou-toure-independance-sans-compromis', 'article', 18);

-- Article 19
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/article/Thomas%20Sankara%20%E2%80%93%20La%20r%C3%A9volution%20par%20l%27int%C3%A9grit%C3%A9%20et%20la%20dignit%C3%A9', '/article/thomas-sankara-revolution-integrite-dignite', 'article', 19);

-- =============================================================================
-- ÉTAPE 3 : METTRE À JOUR LES SLUGS DES ARTICLES
-- =============================================================================
UPDATE articles SET slug = 'achille-mbembe' WHERE id = 5;
UPDATE articles SET slug = 'cheikh-anta-diop-rehabiliter-afrique-histoire' WHERE id = 6;
UPDATE articles SET slug = 'frantz-fanon-decolonisation-liberation-peuples' WHERE id = 7;
UPDATE articles SET slug = 'ibn-khaldoun-pensee-historique-sciences-sociales' WHERE id = 8;
UPDATE articles SET slug = 'arthur-zang-innovation-sante-afrique' WHERE id = 9;
UPDATE articles SET slug = 'imhotep-premier-savant-histoire' WHERE id = 10;
UPDATE articles SET slug = 'william-kamkwamba-ingeniosite-africaine' WHERE id = 11;
UPDATE articles SET slug = 'afrique-berceau-sciences-innovation' WHERE id = 12;
UPDATE articles SET slug = 'julius-nyerere-penseur-politique-independance' WHERE id = 13;
UPDATE articles SET slug = 'kwame-nkrumah-panafricanisme-unite-africaine' WHERE id = 14;
UPDATE articles SET slug = 'leopold-sedar-senghor-poete-president-negritude' WHERE id = 15;
UPDATE articles SET slug = 'nelson-mandela-lutte-reconciliation-liberte' WHERE id = 16;
UPDATE articles SET slug = 'patrice-lumumba-souverainete-africaine' WHERE id = 17;
UPDATE articles SET slug = 'sekou-toure-independance-sans-compromis' WHERE id = 18;
UPDATE articles SET slug = 'thomas-sankara-revolution-integrite-dignite' WHERE id = 19;

-- =============================================================================
-- ÉTAPE 4 : INSÉRER LES REDIRECTIONS POUR LES TAGS
-- =============================================================================
INSERT INTO redirects (old_path, new_path, entity_type, entity_id) VALUES
('/tag/Pens%C3%A9e%20africaine', '/tag/pensee-africaine', 'tag', 13),
('/tag/Philosophie%20contemporaine', '/tag/philosophie-contemporaine', 'tag', 14),
('/tag/Postcolonialisme', '/tag/postcolonialisme', 'tag', 15),
('/tag/Intellectuels%20africains', '/tag/intellectuels-africains', 'tag', 16),
('/tag/Histoire%20et%20pouvoir', '/tag/histoire-et-pouvoir', 'tag', 17),
('/tag/Sciences%20africaines', '/tag/sciences-africaines', 'tag', 18),
('/tag/Innovation%20technologique', '/tag/innovation-technologique', 'tag', 19),
('/tag/Ing%C3%A9nieurs%20africains', '/tag/ingenieurs-africains', 'tag', 20),
('/tag/Sant%C3%A9%20et%20technologies', '/tag/sante-et-technologies', 'tag', 21),
('/tag/G%C3%A9nie%20africain', '/tag/genie-africain', 'tag', 22),
('/tag/Leaders%20africains', '/tag/leaders-africains', 'tag', 23),
('/tag/Ind%C3%A9pendance%20africaine', '/tag/independance-africaine', 'tag', 24),
('/tag/Pens%C3%A9e%20politique', '/tag/pensee-politique', 'tag', 25),
('/tag/Gouvernance%20et%20pouvoir', '/tag/gouvernance-et-pouvoir', 'tag', 27),
('/tag/%C3%89thiopie%20imp%C3%A9riale', '/tag/ethiopie-imperiale', 'tag', 28),
('/tag/Ha%C3%AFl%C3%A9%20S%C3%A9lassi%C3%A9%20Ier', '/tag/haile-selassie-ier', 'tag', 29),
('/tag/Dynastie%20salomonide', '/tag/dynastie-salomonide', 'tag', 30),
('/tag/Invasion%20italienne%201935', '/tag/invasion-italienne-1935', 'tag', 31),
('/tag/Organisation%20de%20l%27unit%C3%A9%20africaine', '/tag/organisation-unite-africaine', 'tag', 32);

-- =============================================================================
-- ÉTAPE 5 : METTRE À JOUR LES SLUGS DES TAGS
-- =============================================================================
UPDATE tags SET slug = 'pensee-africaine' WHERE id = 13;
UPDATE tags SET slug = 'philosophie-contemporaine' WHERE id = 14;
UPDATE tags SET slug = 'postcolonialisme' WHERE id = 15;
UPDATE tags SET slug = 'intellectuels-africains' WHERE id = 16;
UPDATE tags SET slug = 'histoire-et-pouvoir' WHERE id = 17;
UPDATE tags SET slug = 'sciences-africaines' WHERE id = 18;
UPDATE tags SET slug = 'innovation-technologique' WHERE id = 19;
UPDATE tags SET slug = 'ingenieurs-africains' WHERE id = 20;
UPDATE tags SET slug = 'sante-et-technologies' WHERE id = 21;
UPDATE tags SET slug = 'genie-africain' WHERE id = 22;
UPDATE tags SET slug = 'leaders-africains' WHERE id = 23;
UPDATE tags SET slug = 'independance-africaine' WHERE id = 24;
UPDATE tags SET slug = 'pensee-politique' WHERE id = 25;
UPDATE tags SET slug = 'gouvernance-et-pouvoir' WHERE id = 27;
UPDATE tags SET slug = 'ethiopie-imperiale' WHERE id = 28;
UPDATE tags SET slug = 'haile-selassie-ier' WHERE id = 29;
UPDATE tags SET slug = 'dynastie-salomonide' WHERE id = 30;
UPDATE tags SET slug = 'invasion-italienne-1935' WHERE id = 31;
UPDATE tags SET slug = 'organisation-unite-africaine' WHERE id = 32;

-- =============================================================================
-- ÉTAPE 6 : VÉRIFIER LES SLUGS DES PERSONNALITÉS
-- =============================================================================
-- Vérifier si le champ slug est rempli
SELECT id, nom, slug FROM personnalites WHERE slug IS NULL OR slug = '' LIMIT 5;

-- Si les slugs sont vides, les générer :
UPDATE personnalites SET slug = 'nelson-mandela' WHERE id = 1;
UPDATE personnalites SET slug = 'kwame-nkrumah' WHERE id = 2;
UPDATE personnalites SET slug = 'thomas-sankara' WHERE id = 3;
UPDATE personnalites SET slug = 'patrice-lumumba' WHERE id = 4;
UPDATE personnalites SET slug = 'julius-nyerere' WHERE id = 5;
UPDATE personnalites SET slug = 'leopold-sedar-senghor' WHERE id = 6;
UPDATE personnalites SET slug = 'sekou-toure' WHERE id = 7;
UPDATE personnalites SET slug = 'samory-toure' WHERE id = 8;
UPDATE personnalites SET slug = 'el-hadj-omar-tall' WHERE id = 9;
UPDATE personnalites SET slug = 'yaa-asantewaa' WHERE id = 10;
UPDATE personnalites SET slug = 'nzinga-mbandi' WHERE id = 11;
UPDATE personnalites SET slug = 'behanzin' WHERE id = 12;
UPDATE personnalites SET slug = 'haile-selassie-ier' WHERE id = 13;
UPDATE personnalites SET slug = 'mansa-moussa' WHERE id = 14;
UPDATE personnalites SET slug = 'shaka-zulu' WHERE id = 15;
UPDATE personnalites SET slug = 'soundiata-keita' WHERE id = 16;
UPDATE personnalites SET slug = 'cheikh-anta-diop' WHERE id = 17;
UPDATE personnalites SET slug = 'achille-mbembe' WHERE id = 18;
UPDATE personnalites SET slug = 'ibn-khaldoun' WHERE id = 19;
UPDATE personnalites SET slug = 'frantz-fanon' WHERE id = 20;
UPDATE personnalites SET slug = 'chinua-achebe' WHERE id = 21;
UPDATE personnalites SET slug = 'wole-soyinka' WHERE id = 22;
UPDATE personnalites SET slug = 'ousmane-sembene' WHERE id = 23;
UPDATE personnalites SET slug = 'mariama-ba' WHERE id = 24;
UPDATE personnalites SET slug = 'desmond-tutu' WHERE id = 25;
UPDATE personnalites SET slug = 'wangari-maathai' WHERE id = 26;
UPDATE personnalites SET slug = 'kofi-annan' WHERE id = 27;
UPDATE personnalites SET slug = 'denis-mukwege' WHERE id = 28;
UPDATE personnalites SET slug = 'miriam-makeba' WHERE id = 29;
UPDATE personnalites SET slug = 'fela-kuti' WHERE id = 30;
UPDATE personnalites SET slug = 'youssou-ndour' WHERE id = 31;
UPDATE personnalites SET slug = 'ali-farka-toure' WHERE id = 32;
UPDATE personnalites SET slug = 'didier-drogba' WHERE id = 33;
UPDATE personnalites SET slug = 'samuel-etoo' WHERE id = 34;
UPDATE personnalites SET slug = 'george-weah' WHERE id = 35;
UPDATE personnalites SET slug = 'sadio-mane' WHERE id = 36;
UPDATE personnalites SET slug = 'imhotep' WHERE id = 37;
UPDATE personnalites SET slug = 'arthur-zang' WHERE id = 38;
UPDATE personnalites SET slug = 'william-kamkwamba' WHERE id = 39;
UPDATE personnalites SET slug = 'nefertiti' WHERE id = 40;
UPDATE personnalites SET slug = 'ramses-ii' WHERE id = 41;
UPDATE personnalites SET slug = 'hannibal-barca' WHERE id = 42;
UPDATE personnalites SET slug = 'toussaint-louverture' WHERE id = 43;
UPDATE personnalites SET slug = 'marcus-garvey' WHERE id = 44;
UPDATE personnalites SET slug = 'malcolm-x' WHERE id = 45;
UPDATE personnalites SET slug = 'winnie-mandela' WHERE id = 46;
UPDATE personnalites SET slug = 'ellen-johnson-sirleaf' WHERE id = 47;
UPDATE personnalites SET slug = 'ngozi-okonjo-iweala' WHERE id = 48;

-- =============================================================================
-- ÉTAPE 7 : VÉRIFICATION FINALE
-- =============================================================================
SELECT 'Articles' as type, COUNT(*) as total, 
       SUM(CASE WHEN slug NOT LIKE '% %' THEN 1 ELSE 0 END) as ok
FROM articles
UNION ALL
SELECT 'Tags', COUNT(*), SUM(CASE WHEN slug NOT LIKE '% %' THEN 1 ELSE 0 END)
FROM tags
UNION ALL
SELECT 'Personnalites', COUNT(*), SUM(CASE WHEN slug NOT LIKE '% %' THEN 1 ELSE 0 END)
FROM personnalites;

-- Vérifier les redirects
SELECT COUNT(*) as total_redirects FROM redirects;

