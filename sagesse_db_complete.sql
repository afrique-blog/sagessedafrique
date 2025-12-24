-- =====================================================
-- BASE DE DONNÉES COMPLÈTE SAGESSE D'AFRIQUE
-- Version avec traductions FR/EN
-- À importer via phpMyAdmin après suppression des tables
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- SUPPRESSION DES TABLES (dans l'ordre des dépendances)
-- =====================================================
DROP TABLE IF EXISTS `personnalites`;
DROP TABLE IF EXISTS `categories_personnalites_translations`;
DROP TABLE IF EXISTS `categories_personnalites`;
DROP TABLE IF EXISTS `article_dossiers`;
DROP TABLE IF EXISTS `article_tags`;
DROP TABLE IF EXISTS `article_translations`;
DROP TABLE IF EXISTS `dossier_translations`;
DROP TABLE IF EXISTS `category_translations`;
DROP TABLE IF EXISTS `tag_translations`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `dossiers`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `users`;

-- =====================================================
-- CRÉATION DES TABLES (toutes en InnoDB)
-- =====================================================

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'admin',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `category_translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_translations_category_id_lang_key` (`category_id`,`lang`),
  CONSTRAINT `category_translations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tags_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tag_translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `name` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_translations_tag_id_lang_key` (`tag_id`,`lang`),
  CONSTRAINT `tag_translations_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dossiers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) NOT NULL,
  `hero_image` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `dossiers_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dossier_translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dossier_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dossier_translations_dossier_id_lang_key` (`dossier_id`,`lang`),
  CONSTRAINT `dossier_translations_dossier_id_fkey` FOREIGN KEY (`dossier_id`) REFERENCES `dossiers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) NOT NULL,
  `category_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `hero_image` varchar(191) DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `views` int(11) NOT NULL DEFAULT 0,
  `reading_minutes` int(11) NOT NULL DEFAULT 5,
  `published_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_slug_key` (`slug`),
  KEY `articles_category_id_fkey` (`category_id`),
  KEY `articles_author_id_fkey` (`author_id`),
  CONSTRAINT `articles_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `article_translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `title` varchar(191) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content_html` longtext DEFAULT NULL,
  `takeaway` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `article_translations_article_id_lang_key` (`article_id`,`lang`),
  CONSTRAINT `article_translations_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `article_tags` (
  `article_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`article_id`,`tag_id`),
  KEY `article_tags_tag_id_fkey` (`tag_id`),
  CONSTRAINT `article_tags_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `article_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `article_dossiers` (
  `article_id` int(11) NOT NULL,
  `dossier_id` int(11) NOT NULL,
  PRIMARY KEY (`article_id`,`dossier_id`),
  KEY `article_dossiers_dossier_id_fkey` (`dossier_id`),
  CONSTRAINT `article_dossiers_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `article_dossiers_dossier_id_fkey` FOREIGN KEY (`dossier_id`) REFERENCES `dossiers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CATÉGORIES DE PERSONNALITÉS (avec traductions)
-- =====================================================

CREATE TABLE `categories_personnalites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_personnalites_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories_personnalites_translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categorie_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `nom` varchar(191) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cat_pers_trans_unique` (`categorie_id`, `lang`),
  CONSTRAINT `cat_pers_trans_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categories_personnalites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `personnalites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) NOT NULL,
  `nom` varchar(191) NOT NULL,
  `categorie_id` int(11) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `youtube_url` varchar(191) DEFAULT NULL,
  `article_id` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `personnalites_slug_key` (`slug`),
  KEY `personnalites_categorie_id_fkey` (`categorie_id`),
  KEY `personnalites_article_id_fkey` (`article_id`),
  CONSTRAINT `personnalites_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categories_personnalites` (`id`),
  CONSTRAINT `personnalites_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERTION DES DONNÉES
-- =====================================================

-- Users (mot de passe: admin123)
INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `role`) VALUES
(1, 'contact@sagessedafrique.blog', '$2a$10$rQXpKhvKH8QqZ5B6zy1N7uRVhZMGVzxRVxNJ5GvPZKc1XGZS5WPXS', 'Malick Diarra', 'admin');

-- Categories
INSERT INTO `categories` (`id`, `slug`) VALUES
(1, 'sciences'),
(2, 'histoire'),
(3, 'philosophie'),
(4, 'arts'),
(5, 'leadership'),
(6, 'medecine');

-- Category Translations
INSERT INTO `category_translations` (`category_id`, `lang`, `name`, `description`) VALUES
(1, 'fr', 'Sciences', 'Découvertes et avancées scientifiques majeures.'),
(1, 'en', 'Science', 'Major scientific discoveries and advances.'),
(2, 'fr', 'Histoire', 'Le récit des civilisations et des tournants historiques.'),
(2, 'en', 'History', 'The narrative of civilizations and historical turning points.'),
(3, 'fr', 'Philosophie', 'Sagesse, pensée critique et systèmes de valeurs.'),
(3, 'en', 'Philosophy', 'Wisdom, critical thinking, and value systems.'),
(4, 'fr', 'Arts & Culture', 'L''expression créative sous toutes ses formes.'),
(4, 'en', 'Arts & Culture', 'Creative expression in all its forms.'),
(5, 'fr', 'Leadership', 'Figures de proue et visions politiques.'),
(5, 'en', 'Leadership', 'Leading figures and political visions.'),
(6, 'fr', 'Médecine', 'L''art de la guérison à travers les âges.'),
(6, 'en', 'Medicine', 'The art of healing through the ages.');

-- Tags
INSERT INTO `tags` (`id`, `slug`) VALUES
(1, 'egypte'),
(2, 'astronomie'),
(3, 'physique'),
(4, 'resistances'),
(5, 'innovation'),
(6, 'ethique'),
(7, 'mathematiques'),
(8, 'anthropologie'),
(9, 'panafricanisme'),
(10, 'architecture'),
(11, 'ecologie'),
(12, 'femmes');

-- Tag Translations
INSERT INTO `tag_translations` (`tag_id`, `lang`, `name`) VALUES
(1, 'fr', 'Égypte'), (1, 'en', 'Egypt'),
(2, 'fr', 'Astronomie'), (2, 'en', 'Astronomy'),
(3, 'fr', 'Physique'), (3, 'en', 'Physics'),
(4, 'fr', 'Résistances'), (4, 'en', 'Resistances'),
(5, 'fr', 'Innovation'), (5, 'en', 'Innovation'),
(6, 'fr', 'Éthique'), (6, 'en', 'Ethics'),
(7, 'fr', 'Mathématiques'), (7, 'en', 'Mathematics'),
(8, 'fr', 'Anthropologie'), (8, 'en', 'Anthropology'),
(9, 'fr', 'Panafricanisme'), (9, 'en', 'Pan-Africanism'),
(10, 'fr', 'Architecture'), (10, 'en', 'Architecture'),
(11, 'fr', 'Écologie'), (11, 'en', 'Ecology'),
(12, 'fr', 'Femmes pionnières'), (12, 'en', 'Pioneer Women');

-- Dossiers
INSERT INTO `dossiers` (`id`, `slug`, `hero_image`) VALUES
(1, 'pionniers-du-savoir', 'https://picsum.photos/id/101/800/400'),
(2, 'figures-de-la-liberte', 'https://picsum.photos/id/102/800/400'),
(3, 'renaissance-culturelle', 'https://picsum.photos/id/103/800/400'),
(4, 'sagesse-ancestraux', 'https://picsum.photos/id/104/800/400'),
(5, 'afrique-futur', 'https://picsum.photos/id/105/800/400');

-- Dossier Translations
INSERT INTO `dossier_translations` (`dossier_id`, `lang`, `title`, `description`) VALUES
(1, 'fr', 'Pionniers du Savoir', 'Ceux qui ont jeté les bases de la science moderne.'),
(1, 'en', 'Pioneers of Knowledge', 'Those who laid the foundations of modern science.'),
(2, 'fr', 'Figures de la Liberté', 'Les leaders qui ont changé le cours de l''histoire politique.'),
(2, 'en', 'Figures of Freedom', 'Leaders who changed the course of political history.'),
(3, 'fr', 'Renaissance Culturelle', 'L''Afrique au cœur des mouvements artistiques mondiaux.'),
(3, 'en', 'Cultural Renaissance', 'Africa at the heart of global artistic movements.'),
(4, 'fr', 'Sagesse Ancestrale', 'Les systèmes philosophiques oubliés.'),
(4, 'en', 'Ancestral Wisdom', 'Forgotten philosophical systems.'),
(5, 'fr', 'Afrique Futur', 'L''innovation technologique contemporaine.'),
(5, 'en', 'Africa Future', 'Contemporary technological innovation.');

-- Articles
INSERT INTO `articles` (`id`, `slug`, `category_id`, `author_id`, `hero_image`, `featured`, `views`, `reading_minutes`, `published_at`) VALUES
(1, 'imhotep-premier-architecte', 1, 1, 'https://picsum.photos/id/10/1200/600', 1, 4502, 10, '2025-10-12 00:00:00.000'),
(2, 'cheikh-anta-diop-science', 2, 1, 'https://picsum.photos/id/20/1200/600', 0, 3200, 12, '2025-11-05 00:00:00.000'),
(3, 'wangari-maathai-ecologie', 5, 1, 'https://picsum.photos/id/30/1200/600', 0, 2802, 8, '2025-09-20 00:00:00.000'),
(4, 'ahmed-baba-tombouctou', 3, 1, 'https://picsum.photos/id/40/1200/600', 0, 1500, 9, '2025-08-15 00:00:00.000');

-- Article Translations
INSERT INTO `article_translations` (`article_id`, `lang`, `title`, `excerpt`, `content_html`, `takeaway`) VALUES
(1, 'fr', 'Imhotep : L''architecte de l''éternité', 'Bien avant la Grèce classique, Imhotep concevait la pyramide à degrés de Saqqarah, révolutionnant l''ingénierie mondiale.', '<h2>Le génie de Saqqarah</h2><p>Imhotep, dont le nom signifie \"Celui qui vient en paix\", a servi sous le règne du pharaon Djéser au XXVIIe siècle av. J.-C. Il a conçu un monument qui allait changer le monde : la pyramide à degrés.</p><h3>Une révolution technique</h3><p>Avant lui, les tombes étaient de simples mastabas en briques de boue. Imhotep a eu l''idée audacieuse d''empiler six mastabas les uns sur les autres en utilisant de la pierre de taille.</p><blockquote>\"Le passage du bois et de la boue à la pierre marque la naissance de l''architecture monumentale.\"</blockquote>', 'Imhotep est considéré comme le premier ingénieur, architecte et médecin connu de l''histoire de l''humanité.'),
(1, 'en', 'Imhotep: Architect of Eternity', 'Long before classical Greece, Imhotep designed the Step Pyramid of Saqqara, revolutionizing world engineering.', '<h2>The Genius of Saqqara</h2><p>Imhotep, whose name means \"He who comes in peace,\" served under Pharaoh Djoser in the 27th century BC. He designed a monument that would change the world: the Step Pyramid.</p><h3>A Technical Revolution</h3><p>Before him, tombs were simple mud-brick mastabas. Imhotep had the bold idea of stacking six mastabas on top of each other using dressed stone.</p>', 'Imhotep is considered the first known engineer, architect, and physician in human history.'),
(2, 'fr', 'Cheikh Anta Diop : Redonner à l''Afrique sa mémoire scientifique', 'Le physicien sénégalais a prouvé scientifiquement l''origine africaine de la civilisation égyptienne.', '<h2>Un savant pluridisciplinaire</h2><p>Cheikh Anta Diop n''était pas seulement un historien. Formé en physique nucléaire au laboratoire des Curie, il a utilisé la datation au carbone 14 pour ses recherches.</p><p>Son œuvre majeure, <i>Nations nègres et culture</i>, a contesté les fondements de l''égyptologie occidentale de son époque.</p>', 'Ses travaux ont révolutionné l''historiographie africaine en alliant physique nucléaire et anthropologie.'),
(2, 'en', 'Cheikh Anta Diop: Restoring Africa''s Scientific Memory', 'The Senegalese physicist scientifically proved the African origin of Egyptian civilization.', '<h2>A Multidisciplinary Scholar</h2><p>Cheikh Anta Diop was not just a historian. Trained in nuclear physics at the Curie laboratory, he used carbon-14 dating for his research.</p>', 'His work revolutionized African historiography by combining nuclear physics and anthropology.'),
(3, 'fr', 'Wangari Maathai : La force de la Terre', 'Première femme africaine prix Nobel de la paix, elle a lié écologie et démocratie par le mouvement de la Ceinture Verte.', '<p>Wangari Maathai a compris que la dégradation de l''environnement était directement liée à la mauvaise gouvernance. Elle a fondé le mouvement de la Ceinture Verte en 1977, qui a planté plus de 50 millions d''arbres au Kenya.</p>', 'Elle a planté plus de 50 millions d''arbres pour lutter contre l''érosion et l''oppression politique.'),
(3, 'en', 'Wangari Maathai: The Force of the Earth', 'First African woman Nobel Peace Prize winner, she linked ecology and democracy through the Green Belt Movement.', '<p>Wangari Maathai understood that environmental degradation was directly linked to poor governance. She founded the Green Belt Movement in 1977, which has planted over 50 million trees in Kenya.</p>', 'She planted over 50 million trees to fight erosion and political oppression.'),
(4, 'fr', 'Ahmed Baba : Le bibliothécaire de Tombouctou', 'Au XVIe siècle, il a dirigé l''une des plus grandes universités du monde, l''Université de Sankoré.', '<p>Ahmed Baba possédait une collection de plus de 1600 ouvrages, traitant d''astronomie, de droit et de logique. Il était considéré comme l''un des plus grands savants de son époque.</p>', 'Tombouctou était alors le phare intellectuel du monde musulman et africain.'),
(4, 'en', 'Ahmed Baba: The Librarian of Timbuktu', 'In the 16th century, he headed one of the world''s largest universities, the University of Sankore.', '<p>Ahmed Baba owned a collection of over 1,600 works, covering astronomy, law, and logic. He was considered one of the greatest scholars of his time.</p>', 'Timbuktu was then the intellectual lighthouse of the Muslim and African world.');

-- Article Tags
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES
(1, 1), (1, 5), (1, 10),
(2, 1), (2, 3), (2, 8),
(3, 5), (3, 11), (3, 12),
(4, 1), (4, 5), (4, 6);

-- Article Dossiers
INSERT INTO `article_dossiers` (`article_id`, `dossier_id`) VALUES
(1, 1), (2, 1), (3, 2), (4, 4);

-- =====================================================
-- CATÉGORIES DE PERSONNALITÉS (12 catégories)
-- =====================================================
INSERT INTO `categories_personnalites` (`id`, `slug`, `image`) VALUES
(1, 'leaders-politiques', '/images/categories/leaders-politiques.jpg'),
(2, 'resistants-anticoloniaux', '/images/categories/resistants.jpg'),
(3, 'monarques-historiques', '/images/categories/monarques.jpg'),
(4, 'intellectuels-penseurs', '/images/categories/intellectuels.jpg'),
(5, 'ecrivains', '/images/categories/ecrivains.jpg'),
(6, 'militants-droits-humains', '/images/categories/militants.jpg'),
(7, 'musiciens-artistes', '/images/categories/artistes.jpg'),
(8, 'sportifs', '/images/categories/sportifs.jpg'),
(9, 'scientifiques-inventeurs', '/images/categories/scientifiques.jpg'),
(10, 'figures-antiques', '/images/categories/antiques.jpg'),
(11, 'heros-diaspora', '/images/categories/diaspora.jpg'),
(12, 'femmes-leaders', '/images/categories/femmes-leaders.jpg');

-- =====================================================
-- TRADUCTIONS DES CATÉGORIES DE PERSONNALITÉS (FR/EN)
-- =====================================================
INSERT INTO `categories_personnalites_translations` (`categorie_id`, `lang`, `nom`, `description`) VALUES
-- Leaders Politiques
(1, 'fr', 'Leaders Politiques', 'Figures qui ont dirigé des États, conduit des mouvements d''indépendance ou de réforme, redessiné les frontières et les institutions, et influencé durablement la vie politique africaine et mondiale.'),
(1, 'en', 'Political Leaders', 'Figures who led nations, drove independence movements or reforms, reshaped borders and institutions, and lastingly influenced African and global political life.'),
-- Résistants Anticoloniaux
(2, 'fr', 'Résistants Anticoloniaux', 'Chefs, guerriers et stratèges qui ont combattu militairement ou symboliquement la conquête et la domination coloniale, défendu les terres, les cultures et la souveraineté des peuples africains.'),
(2, 'en', 'Anti-Colonial Resisters', 'Chiefs, warriors and strategists who fought militarily or symbolically against colonial conquest and domination, defending African lands, cultures and sovereignty.'),
-- Monarques Historiques
(3, 'fr', 'Monarques Historiques', 'Rois, reines et empereurs qui ont constitué de grands royaumes, contrôlé des routes commerciales, consolidé des identités politiques et religieuses, et marqué la mémoire collective.'),
(3, 'en', 'Historical Monarchs', 'Kings, queens and emperors who built great kingdoms, controlled trade routes, consolidated political and religious identities, and left lasting marks on collective memory.'),
-- Intellectuels et Penseurs
(4, 'fr', 'Intellectuels et Penseurs', 'Historiens, philosophes et théoriciens qui ont produit des savoirs critiques sur l''Afrique, repensé l''identité, la mémoire et le pouvoir, et influencé la compréhension mondiale du continent.'),
(4, 'en', 'Intellectuals and Thinkers', 'Historians, philosophers and theorists who produced critical knowledge about Africa, rethought identity, memory and power, and influenced global understanding of the continent.'),
-- Écrivains
(5, 'fr', 'Écrivains', 'Romanciers, poètes et dramaturges qui ont donné voix aux expériences africaines, dénoncé domination et injustices, renouvelé les langues et formes littéraires, et inscrit l''Afrique dans la littérature mondiale.'),
(5, 'en', 'Writers', 'Novelists, poets and playwrights who gave voice to African experiences, denounced domination and injustice, renewed literary languages and forms, and placed Africa in world literature.'),
-- Militants Droits Humains
(6, 'fr', 'Militants Droits Humains', 'Acteurs engagés pour la paix, la justice sociale, l''égalité raciale et de genre, l''écologie, qui ont mobilisé sociétés civiles et opinions publiques pour défendre la dignité humaine.'),
(6, 'en', 'Human Rights Activists', 'Advocates for peace, social justice, racial and gender equality, ecology, who mobilized civil societies and public opinion to defend human dignity.'),
-- Musiciens et Artistes
(7, 'fr', 'Musiciens et Artistes', 'Créateurs dont les œuvres musicales, cinématographiques ou plastiques racontent l''Afrique, contestent les pouvoirs, transmettent mémoires et luttes, et irriguent les cultures populaires mondiales.'),
(7, 'en', 'Musicians and Artists', 'Creators whose musical, cinematic or visual works tell Africa''s story, challenge power, transmit memories and struggles, and influence global popular cultures.'),
-- Sportifs
(8, 'fr', 'Sportifs', 'Athlètes et footballeurs devenus symboles de réussite, de discipline et de dépassement, qui ont porté haut les couleurs africaines sur les scènes internationales et inspiré des générations.'),
(8, 'en', 'Athletes', 'Athletes and footballers who became symbols of success, discipline and excellence, carrying African colors high on international stages and inspiring generations.'),
-- Scientifiques et Inventeurs
(9, 'fr', 'Scientifiques et Inventeurs', 'Chercheurs, ingénieurs et innovateurs ayant développé technologies, remèdes ou théories qui améliorent la santé, les communications, l''énergie ou l''industrie africaine.'),
(9, 'en', 'Scientists and Inventors', 'Researchers, engineers and innovators who developed technologies, remedies or theories improving African health, communications, energy or industry.'),
-- Figures Antiques
(10, 'fr', 'Figures Antiques', 'Personnalités de l''Égypte, de la Nubie ou d''empires anciens, dont le pouvoir, la diplomatie et les réalisations culturelles témoignent des racines très anciennes de la civilisation africaine.'),
(10, 'en', 'Ancient Figures', 'Personalities from Egypt, Nubia or ancient empires, whose power, diplomacy and cultural achievements testify to the very ancient roots of African civilization.'),
-- Héros de la Diaspora
(11, 'fr', 'Héros de la Diaspora', 'Dirigeants, révolutionnaires et penseurs afro-descendants qui, depuis les Amériques ou les Caraïbes, ont lutté contre l''esclavage, le racisme et la colonisation.'),
(11, 'en', 'Diaspora Heroes', 'Afro-descendant leaders, revolutionaries and thinkers who, from the Americas or Caribbean, fought against slavery, racism and colonization.'),
-- Femmes Leaders
(12, 'fr', 'Femmes Leaders', 'Reines, militantes, cheffes d''État et d''organisations qui ont brisé des barrières patriarcales, conduit des luttes politiques ou sociales, et ouvert des voies nouvelles pour les femmes africaines.'),
(12, 'en', 'Women Leaders', 'Queens, activists, heads of state and organizations who broke patriarchal barriers, led political or social struggles, and opened new paths for African women.');

-- =====================================================
-- PERSONNALITÉS (48 personnalités)
-- =====================================================
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`) VALUES
-- Leaders Politiques (1)
('nelson-mandela', 'Nelson Mandela', 1, NULL, NULL, NULL),
('kwame-nkrumah', 'Kwame Nkrumah', 1, NULL, NULL, NULL),
('thomas-sankara', 'Thomas Sankara', 1, NULL, NULL, NULL),
('patrice-lumumba', 'Patrice Lumumba', 1, NULL, NULL, NULL),
('julius-nyerere', 'Julius Nyerere', 1, NULL, NULL, NULL),
('leopold-sedar-senghor', 'Léopold Sédar Senghor', 1, NULL, NULL, NULL),
('sekou-toure', 'Sékou Touré', 1, NULL, NULL, NULL),
-- Résistants Anticoloniaux (2)
('samory-toure', 'Samory Touré', 2, NULL, NULL, NULL),
('el-hadj-omar-tall', 'El Hadj Omar Tall', 2, NULL, NULL, NULL),
('yaa-asantewaa', 'Yaa Asantewaa', 2, NULL, NULL, NULL),
('nzinga-mbandi', 'Nzinga Mbandi', 2, NULL, NULL, NULL),
('behanzin', 'Béhanzin', 2, NULL, NULL, NULL),
-- Monarques Historiques (3)
('haile-selassie', 'Haïlé Sélassié Ier', 3, NULL, NULL, NULL),
('mansa-moussa', 'Mansa Moussa', 3, NULL, NULL, NULL),
('shaka-zulu', 'Shaka Zulu', 3, NULL, NULL, NULL),
('sundiata-keita', 'Soundiata Keïta', 3, NULL, NULL, NULL),
-- Intellectuels et Penseurs (4) - Cheikh Anta Diop lié à l'article 2
('cheikh-anta-diop', 'Cheikh Anta Diop', 4, NULL, NULL, 2),
('achille-mbembe', 'Achille Mbembe', 4, NULL, NULL, NULL),
('ibn-khaldoun', 'Ibn Khaldoun', 4, NULL, NULL, NULL),
('frantz-fanon', 'Frantz Fanon', 4, NULL, NULL, NULL),
-- Écrivains (5)
('chinua-achebe', 'Chinua Achebe', 5, NULL, NULL, NULL),
('wole-soyinka', 'Wole Soyinka', 5, NULL, NULL, NULL),
('ousmane-sembene', 'Ousmane Sembène', 5, NULL, NULL, NULL),
('mariama-ba', 'Mariama Bâ', 5, NULL, NULL, NULL),
-- Militants Droits Humains (6) - Wangari Maathai liée à l'article 3
('desmond-tutu', 'Desmond Tutu', 6, NULL, NULL, NULL),
('wangari-maathai', 'Wangari Maathai', 6, NULL, NULL, 3),
('kofi-annan', 'Kofi Annan', 6, NULL, NULL, NULL),
('denis-mukwege', 'Denis Mukwege', 6, NULL, NULL, NULL),
-- Musiciens et Artistes (7)
('miriam-makeba', 'Miriam Makeba', 7, NULL, NULL, NULL),
('fela-kuti', 'Fela Anikulapo Kuti', 7, NULL, NULL, NULL),
('youssou-ndour', 'Youssou N''Dour', 7, NULL, NULL, NULL),
('ali-farka-toure', 'Ali Farka Touré', 7, NULL, NULL, NULL),
-- Sportifs (8)
('didier-drogba', 'Didier Drogba', 8, NULL, NULL, NULL),
('samuel-etoo', 'Samuel Eto''o', 8, NULL, NULL, NULL),
('george-weah', 'George Weah', 8, NULL, NULL, NULL),
('sadio-mane', 'Sadio Mané', 8, NULL, NULL, NULL),
-- Scientifiques et Inventeurs (9) - Imhotep lié à l'article 1
('imhotep', 'Imhotep', 9, NULL, NULL, 1),
('arthur-zang', 'Arthur Zang', 9, NULL, NULL, NULL),
('william-kamkwamba', 'William Kamkwamba', 9, NULL, NULL, NULL),
-- Figures Antiques (10)
('nefertiti', 'Néfertiti', 10, NULL, NULL, NULL),
('ramses-ii', 'Ramsès II', 10, NULL, NULL, NULL),
('hannibal-barca', 'Hannibal Barca', 10, NULL, NULL, NULL),
-- Héros de la Diaspora (11)
('toussaint-louverture', 'Toussaint Louverture', 11, NULL, NULL, NULL),
('marcus-garvey', 'Marcus Garvey', 11, NULL, NULL, NULL),
('malcolm-x', 'Malcolm X', 11, NULL, NULL, NULL),
-- Femmes Leaders (12)
('winnie-mandela', 'Winnie Mandela', 12, NULL, NULL, NULL),
('ellen-johnson-sirleaf', 'Ellen Johnson Sirleaf', 12, NULL, NULL, NULL),
('ngozi-okonjo-iweala', 'Ngozi Okonjo-Iweala', 12, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
