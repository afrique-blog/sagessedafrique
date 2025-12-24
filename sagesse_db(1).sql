-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 24 déc. 2025 à 16:23
-- Version du serveur : 10.5.29-MariaDB
-- Version de PHP : 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sagesse_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `category_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `hero_image` varchar(191) DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `views` int(11) NOT NULL DEFAULT 0,
  `reading_minutes` int(11) NOT NULL DEFAULT 5,
  `published_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `articles`
--

INSERT INTO `articles` (`id`, `slug`, `category_id`, `author_id`, `hero_image`, `featured`, `views`, `reading_minutes`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'imhotep-premier-architecte', 1, 2, 'https://picsum.photos/id/10/1200/600', 1, 4502, 10, '2025-10-12 00:00:00.000', '2025-12-24 04:55:32.646', '2025-12-24 05:02:11.810'),
(2, 'cheikh-anta-diop-science', 2, 2, 'https://picsum.photos/id/20/1200/600', 0, 3200, 12, '2025-11-05 00:00:00.000', '2025-12-24 04:55:32.656', '2025-12-24 04:55:32.656'),
(3, 'wangari-maathai-ecologie', 5, 2, 'https://picsum.photos/id/30/1200/600', 0, 2802, 8, '2025-09-20 00:00:00.000', '2025-12-24 04:55:32.664', '2025-12-24 05:03:32.535'),
(4, 'ahmed-baba-tombouctou', 3, 2, 'https://picsum.photos/id/40/1200/600', 0, 1500, 9, '2025-08-15 00:00:00.000', '2025-12-24 04:55:32.673', '2025-12-24 04:55:32.673');

-- --------------------------------------------------------

--
-- Structure de la table `article_dossiers`
--

CREATE TABLE `article_dossiers` (
  `article_id` int(11) NOT NULL,
  `dossier_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `article_dossiers`
--

INSERT INTO `article_dossiers` (`article_id`, `dossier_id`) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 4);

-- --------------------------------------------------------

--
-- Structure de la table `article_tags`
--

CREATE TABLE `article_tags` (
  `article_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `article_tags`
--

INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES
(1, 1),
(1, 5),
(1, 10),
(2, 1),
(2, 3),
(2, 8),
(3, 5),
(3, 11),
(3, 12),
(4, 1),
(4, 5),
(4, 6);

-- --------------------------------------------------------

--
-- Structure de la table `article_translations`
--

CREATE TABLE `article_translations` (
  `id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `title` varchar(191) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content_html` longtext DEFAULT NULL,
  `takeaway` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `article_translations`
--

INSERT INTO `article_translations` (`id`, `article_id`, `lang`, `title`, `excerpt`, `content_html`, `takeaway`) VALUES
(1, 1, 'fr', 'Imhotep : L\'architecte de l\'éternité', 'Bien avant la Grèce classique, Imhotep concevait la pyramide à degrés de Saqqarah, révolutionnant l\'ingénierie mondiale.', '\n          <h2>Le génie de Saqqarah</h2>\n          <p>Imhotep, dont le nom signifie \"Celui qui vient en paix\", a servi sous le règne du pharaon Djéser au XXVIIe siècle av. J.-C. Il a conçu un monument qui allait changer le monde : la pyramide à degrés.</p>\n          <h3>Une révolution technique</h3>\n          <p>Avant lui, les tombes étaient de simples mastabas en briques de boue. Imhotep a eu l\'idée audacieuse d\'empiler six mastabas les uns sur les autres en utilisant de la pierre de taille.</p>\n          <blockquote>\"Le passage du bois et de la boue à la pierre marque la naissance de l\'architecture monumentale.\"</blockquote>\n          <h3>Le père de la médecine ?</h3>\n          <p>Bien que connu comme architecte, les textes égyptiens le célèbrent également comme un guérisseur hors pair. Certains historiens voient en lui l\'inspiration réelle derrière le serment d\'Hippocrate.</p>\n        ', 'Imhotep est considéré comme le premier ingénieur, architecte et médecin connu de l\'histoire de l\'humanité.'),
(2, 1, 'en', 'Imhotep: Architect of Eternity', 'Long before classical Greece, Imhotep designed the Step Pyramid of Saqqara, revolutionizing world engineering.', '\n          <h2>The Genius of Saqqara</h2>\n          <p>Imhotep, whose name means \"He who comes in peace,\" served under Pharaoh Djoser in the 27th century BC. He designed a monument that would change the world: the Step Pyramid.</p>\n          <h3>A Technical Revolution</h3>\n          <p>Before him, tombs were simple mud-brick mastabas. Imhotep had the bold idea of stacking six mastabas on top of each other using dressed stone.</p>\n          <h3>Father of Medicine?</h3>\n          <p>Though known as an architect, Egyptian texts also celebrate him as an outstanding healer. Some historians see in him the real inspiration behind the Hippocratic Oath.</p>\n        ', 'Imhotep is considered the first known engineer, architect, and physician in human history.'),
(3, 2, 'fr', 'Cheikh Anta Diop : Redonner à l\'Afrique sa mémoire scientifique', 'Le physicien sénégalais a prouvé scientifiquement l\'origine africaine de la civilisation égyptienne.', '\n          <h2>Un savant pluridisciplinaire</h2>\n          <p>Cheikh Anta Diop n\'était pas seulement un historien. Formé en physique nucléaire au laboratoire des Curie, il a utilisé la datation au carbone 14 pour ses recherches.</p>\n          <p>Son œuvre majeure, <i>Nations nègres et culture</i>, a contesté les fondements de l\'égyptologie occidentale de son époque.</p>\n        ', 'Ses travaux ont révolutionné l\'historiographie africaine en alliant physique nucléaire et anthropologie.'),
(4, 2, 'en', 'Cheikh Anta Diop: Restoring Africa\'s Scientific Memory', 'The Senegalese physicist scientifically proved the African origin of Egyptian civilization.', '\n          <h2>A Multidisciplinary Scholar</h2>\n          <p>Cheikh Anta Diop was not just a historian. Trained in nuclear physics at the Curie laboratory, he used carbon-14 dating for his research.</p>\n        ', 'His work revolutionized African historiography by combining nuclear physics and anthropology.'),
(5, 3, 'fr', 'Wangari Maathai : La force de la Terre', 'Première femme africaine prix Nobel de la paix, elle a lié écologie et démocratie par le mouvement de la Ceinture Verte.', '<p>Wangari Maathai a compris que la dégradation de l\'environnement était directement liée à la mauvaise gouvernance.</p>', 'Elle a planté plus de 50 millions d\'arbres pour lutter contre l\'érosion et l\'oppression politique.'),
(6, 3, 'en', 'Wangari Maathai: The Force of the Earth', 'First African woman Nobel Peace Prize winner, she linked ecology and democracy through the Green Belt Movement.', '<p>Wangari Maathai understood that environmental degradation was directly linked to poor governance.</p>', 'She planted over 50 million trees to fight erosion and political oppression.'),
(7, 4, 'fr', 'Ahmed Baba : Le bibliothécaire de Tombouctou', 'Au XVIe siècle, il a dirigé l\'une des plus grandes universités du monde, l\'Université de Sankoré.', '<p>Ahmed Baba possédait une collection de plus de 1600 ouvrages, traitant d\'astronomie, de droit et de logique.</p>', 'Tombouctou était alors le phare intellectuel du monde musulman et africain.'),
(8, 4, 'en', 'Ahmed Baba: The Librarian of Timbuktu', 'In the 16th century, he headed one of the world\'s largest universities, the University of Sankore.', '<p>Ahmed Baba owned a collection of over 1,600 works, covering astronomy, law, and logic.</p>', 'Timbuktu was then the intellectual lighthouse of the Muslim and African world.');

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'sciences', '2025-12-24 04:55:32.604', '2025-12-24 04:55:32.604'),
(2, 'histoire', '2025-12-24 04:55:32.608', '2025-12-24 04:55:32.608'),
(3, 'philosophie', '2025-12-24 04:55:32.609', '2025-12-24 04:55:32.609'),
(4, 'arts', '2025-12-24 04:55:32.611', '2025-12-24 04:55:32.611'),
(5, 'leadership', '2025-12-24 04:55:32.612', '2025-12-24 04:55:32.612'),
(6, 'medecine', '2025-12-24 04:55:32.613', '2025-12-24 04:55:32.613');

-- --------------------------------------------------------

--
-- Structure de la table `categories_personnalites`
--

CREATE TABLE `categories_personnalites` (
  `id` int(11) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `nom` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories_personnalites`
--

INSERT INTO `categories_personnalites` (`id`, `slug`, `nom`, `description`, `image`, `created_at`, `updated_at`) VALUES
(1, 'leaders-politiques', 'Leaders Politiques', 'Figures qui ont dirige des Etats, conduit des mouvements d independance ou de reforme, redessine les frontieres et les institutions, et influence durablement la vie politique africaine et mondiale.', '/images/categories/leaders-politiques.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(2, 'resistants-anticoloniaux', 'Resistants Anticoloniaux', 'Chefs, guerriers et strateges qui ont combattu militairement ou symboliquement la conquete et la domination coloniale, defendu les terres, les cultures et la souverainete des peuples africains.', '/images/categories/resistants.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(3, 'monarques-historiques', 'Monarques Historiques', 'Rois, reines et empereurs qui ont constitue de grands royaumes, controle des routes commerciales, consolide des identites politiques et religieuses, et marque la memoire collective par leur pouvoir et leur prestige.', '/images/categories/monarques.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(4, 'intellectuels-penseurs', 'Intellectuels et Penseurs', 'Historiens, philosophes et theoriciens qui ont produit des savoirs critiques sur l Afrique, repense l identite, la memoire et le pouvoir, et influence la maniere dont le monde comprend le continent.', '/images/categories/intellectuels.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(5, 'ecrivains', 'Ecrivains', 'Romanciers, poetes et dramaturges qui ont donne voix aux experiences africaines, denonce domination et injustices, renouvele les langues et formes litteraires, et inscrit l Afrique dans la litterature mondiale.', '/images/categories/ecrivains.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(6, 'militants-droits-humains', 'Militants Droits Humains', 'Acteurs engages pour la paix, la justice sociale, l egalite raciale et de genre, l ecologie, qui ont mobilise societes civiles, institutions internationales et opinions publiques pour defendre la dignite humaine.', '/images/categories/militants.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(7, 'musiciens-artistes', 'Musiciens et Artistes', 'Createurs dont les oeuvres musicales, cinematographiques ou plastiques racontent l Afrique, contestent les pouvoirs, transmettent memoires et luttes, et irriguent les cultures populaires mondiales.', '/images/categories/artistes.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(8, 'sportifs', 'Sportifs', 'Athletes et footballeurs devenus symboles de reussite, de discipline et de depassement, qui ont porte haut les couleurs africaines sur les scenes internationales et inspire des generations de jeunes.', '/images/categories/sportifs.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(9, 'scientifiques-inventeurs', 'Scientifiques et Inventeurs', 'Chercheurs, ingenieurs et innovateurs ayant developpe technologies, remedes ou theories qui ameliorent la sante, les communications, l energie ou l industrie, montrant la capacite de l Afrique a produire de la haute expertise.', '/images/categories/scientifiques.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(10, 'figures-antiques', 'Figures Antiques', 'Personnalites de l Egypte, de la Nubie ou d empires anciens, dont le pouvoir, la diplomatie et les realisations culturelles temoignent des racines tres anciennes de la civilisation africaine.', '/images/categories/antiques.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(11, 'heros-diaspora', 'Heros de la Diaspora', 'Dirigeants, revolutionnaires et penseurs afro-descendants qui, depuis Ameriques ou Caraibes, ont lutte contre esclavage, racisme et colonisation, prolongeant les combats de l Afrique au-dela du continent.', '/images/categories/diaspora.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000'),
(12, 'femmes-leaders', 'Femmes Leaders', 'Reines, militantes, cheffes d Etat et d organisations qui ont brise des barrieres patriarcales, conduit des luttes politiques ou sociales, et ouvert des voies nouvelles pour les femmes africaines.', '/images/categories/femmes-leaders.jpg', '2025-12-24 16:16:49.246', '0000-00-00 00:00:00.000');

-- --------------------------------------------------------

--
-- Structure de la table `category_translations`
--

CREATE TABLE `category_translations` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `category_translations`
--

INSERT INTO `category_translations` (`id`, `category_id`, `lang`, `name`, `description`) VALUES
(1, 1, 'fr', 'Sciences', 'Découvertes et avancées scientifiques majeures.'),
(2, 1, 'en', 'Science', 'Major scientific discoveries and advances.'),
(3, 2, 'fr', 'Histoire', 'Le récit des civilisations et des tournants historiques.'),
(4, 2, 'en', 'History', 'The narrative of civilizations and historical turning points.'),
(5, 3, 'fr', 'Philosophie', 'Sagesse, pensée critique et systèmes de valeurs.'),
(6, 3, 'en', 'Philosophy', 'Wisdom, critical thinking, and value systems.'),
(7, 4, 'fr', 'Arts & Culture', 'L\'expression créative sous toutes ses formes.'),
(8, 4, 'en', 'Arts & Culture', 'Creative expression in all its forms.'),
(9, 5, 'fr', 'Leadership', 'Figures de proue et visions politiques.'),
(10, 5, 'en', 'Leadership', 'Leading figures and political visions.'),
(11, 6, 'fr', 'Médecine', 'L\'art de la guérison à travers les âges.'),
(12, 6, 'en', 'Medicine', 'The art of healing through the ages.');

-- --------------------------------------------------------

--
-- Structure de la table `dossiers`
--

CREATE TABLE `dossiers` (
  `id` int(11) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `hero_image` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `dossiers`
--

INSERT INTO `dossiers` (`id`, `slug`, `hero_image`, `created_at`, `updated_at`) VALUES
(1, 'pionniers-du-savoir', 'https://picsum.photos/id/101/800/400', '2025-12-24 04:55:32.634', '2025-12-24 04:55:32.634'),
(2, 'figures-de-la-liberte', 'https://picsum.photos/id/102/800/400', '2025-12-24 04:55:32.636', '2025-12-24 04:55:32.636'),
(3, 'renaissance-culturelle', 'https://picsum.photos/id/103/800/400', '2025-12-24 04:55:32.638', '2025-12-24 04:55:32.638'),
(4, 'sagesse-ancestraux', 'https://picsum.photos/id/104/800/400', '2025-12-24 04:55:32.640', '2025-12-24 04:55:32.640'),
(5, 'afrique-futur', 'https://picsum.photos/id/105/800/400', '2025-12-24 04:55:32.642', '2025-12-24 04:55:32.642');

-- --------------------------------------------------------

--
-- Structure de la table `dossier_translations`
--

CREATE TABLE `dossier_translations` (
  `id` int(11) NOT NULL,
  `dossier_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `dossier_translations`
--

INSERT INTO `dossier_translations` (`id`, `dossier_id`, `lang`, `title`, `description`) VALUES
(1, 1, 'fr', 'Pionniers du Savoir', 'Ceux qui ont jeté les bases de la science moderne.'),
(2, 1, 'en', 'Pioneers of Knowledge', 'Those who laid the foundations of modern science.'),
(3, 2, 'fr', 'Figures de la Liberté', 'Les leaders qui ont changé le cours de l\'histoire politique.'),
(4, 2, 'en', 'Figures of Freedom', 'Leaders who changed the course of political history.'),
(5, 3, 'fr', 'Renaissance Culturelle', 'L\'Afrique au cœur des mouvements artistiques mondiaux.'),
(6, 3, 'en', 'Cultural Renaissance', 'Africa at the heart of global artistic movements.'),
(7, 4, 'fr', 'Sagesse Ancestrale', 'Les systèmes philosophiques oubliés.'),
(8, 4, 'en', 'Ancestral Wisdom', 'Forgotten philosophical systems.'),
(9, 5, 'fr', 'Afrique Futur', 'L\'innovation technologique contemporaine.'),
(10, 5, 'en', 'Africa Future', 'Contemporary technological innovation.');

-- --------------------------------------------------------

--
-- Structure de la table `personnalites`
--

CREATE TABLE `personnalites` (
  `id` int(11) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `nom` varchar(191) NOT NULL,
  `categorie_id` int(11) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `youtube_url` varchar(191) DEFAULT NULL,
  `article_id` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tags`
--

INSERT INTO `tags` (`id`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'egypte', '2025-12-24 04:55:32.616', '2025-12-24 04:55:32.616'),
(2, 'astronomie', '2025-12-24 04:55:32.620', '2025-12-24 04:55:32.620'),
(3, 'physique', '2025-12-24 04:55:32.621', '2025-12-24 04:55:32.621'),
(4, 'resistances', '2025-12-24 04:55:32.622', '2025-12-24 04:55:32.622'),
(5, 'innovation', '2025-12-24 04:55:32.623', '2025-12-24 04:55:32.623'),
(6, 'ethique', '2025-12-24 04:55:32.625', '2025-12-24 04:55:32.625'),
(7, 'mathematiques', '2025-12-24 04:55:32.626', '2025-12-24 04:55:32.626'),
(8, 'anthropologie', '2025-12-24 04:55:32.627', '2025-12-24 04:55:32.627'),
(9, 'panafricanisme', '2025-12-24 04:55:32.628', '2025-12-24 04:55:32.628'),
(10, 'architecture', '2025-12-24 04:55:32.630', '2025-12-24 04:55:32.630'),
(11, 'ecologie', '2025-12-24 04:55:32.632', '2025-12-24 04:55:32.632'),
(12, 'femmes', '2025-12-24 04:55:32.633', '2025-12-24 04:55:32.633');

-- --------------------------------------------------------

--
-- Structure de la table `tag_translations`
--

CREATE TABLE `tag_translations` (
  `id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tag_translations`
--

INSERT INTO `tag_translations` (`id`, `tag_id`, `lang`, `name`) VALUES
(1, 1, 'fr', 'Égypte'),
(2, 1, 'en', 'Egypt'),
(3, 2, 'fr', 'Astronomie'),
(4, 2, 'en', 'Astronomy'),
(5, 3, 'fr', 'Physique'),
(6, 3, 'en', 'Physics'),
(7, 4, 'fr', 'Résistances'),
(8, 4, 'en', 'Resistances'),
(9, 5, 'fr', 'Innovation'),
(10, 5, 'en', 'Innovation'),
(11, 6, 'fr', 'Éthique'),
(12, 6, 'en', 'Ethics'),
(13, 7, 'fr', 'Mathématiques'),
(14, 7, 'en', 'Mathematics'),
(15, 8, 'fr', 'Anthropologie'),
(16, 8, 'en', 'Anthropology'),
(17, 9, 'fr', 'Panafricanisme'),
(18, 9, 'en', 'Pan-Africanism'),
(19, 10, 'fr', 'Architecture'),
(20, 10, 'en', 'Architecture'),
(21, 11, 'fr', 'Écologie'),
(22, 11, 'en', 'Ecology'),
(23, 12, 'fr', 'Femmes pionnières'),
(24, 12, 'en', 'Pioneer Women');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'admin',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `role`, `created_at`, `updated_at`) VALUES
(2, 'contact@sagessedafrique.blog', '$2a$10$1f.MAaSytG87kmu6GMvB8.AInkn8Ef/nlsYoTZHdrutNXDGSptmJC', 'Malick Diarra', 'admin', '2025-12-24 07:46:45.000', '2025-12-24 04:53:54.825'),
(3, 'admin@sagessedafrique.blog', '$2a$10$rQXpKhvKH8QqZ5B6zy1N7uRVhZMGVzxRVxNJ5GvPZKc1XGZS5WPXS', 'Malick Diarra', 'admin', '2025-12-24 06:41:56.525', '0000-00-00 00:00:00.000');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `articles_slug_key` (`slug`),
  ADD KEY `articles_category_id_fkey` (`category_id`),
  ADD KEY `articles_author_id_fkey` (`author_id`);

--
-- Index pour la table `article_dossiers`
--
ALTER TABLE `article_dossiers`
  ADD PRIMARY KEY (`article_id`,`dossier_id`),
  ADD KEY `article_dossiers_dossier_id_fkey` (`dossier_id`);

--
-- Index pour la table `article_tags`
--
ALTER TABLE `article_tags`
  ADD PRIMARY KEY (`article_id`,`tag_id`),
  ADD KEY `article_tags_tag_id_fkey` (`tag_id`);

--
-- Index pour la table `article_translations`
--
ALTER TABLE `article_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `article_translations_article_id_lang_key` (`article_id`,`lang`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_key` (`slug`);

--
-- Index pour la table `categories_personnalites`
--
ALTER TABLE `categories_personnalites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_personnalites_slug_key` (`slug`);

--
-- Index pour la table `category_translations`
--
ALTER TABLE `category_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_translations_category_id_lang_key` (`category_id`,`lang`);

--
-- Index pour la table `dossiers`
--
ALTER TABLE `dossiers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dossiers_slug_key` (`slug`);

--
-- Index pour la table `dossier_translations`
--
ALTER TABLE `dossier_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dossier_translations_dossier_id_lang_key` (`dossier_id`,`lang`);

--
-- Index pour la table `personnalites`
--
ALTER TABLE `personnalites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personnalites_slug_key` (`slug`),
  ADD KEY `personnalites_categorie_id_fkey` (`categorie_id`);

--
-- Index pour la table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tags_slug_key` (`slug`);

--
-- Index pour la table `tag_translations`
--
ALTER TABLE `tag_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tag_translations_tag_id_lang_key` (`tag_id`,`lang`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `article_translations`
--
ALTER TABLE `article_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `categories_personnalites`
--
ALTER TABLE `categories_personnalites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT pour la table `category_translations`
--
ALTER TABLE `category_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `dossiers`
--
ALTER TABLE `dossiers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `dossier_translations`
--
ALTER TABLE `dossier_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `personnalites`
--
ALTER TABLE `personnalites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `tag_translations`
--
ALTER TABLE `tag_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `personnalites`
--
ALTER TABLE `personnalites`
  ADD CONSTRAINT `personnalites_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categories_personnalites` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
