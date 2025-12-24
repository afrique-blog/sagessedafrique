-- =====================================================
-- Insertion des personnalites africaines
-- A executer via phpMyAdmin
-- =====================================================

-- Leaders Politiques (categorie_id = 1)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('nelson-mandela', 'Nelson Mandela', 1, NULL, NULL, NULL, NOW(), NOW()),
('kwame-nkrumah', 'Kwame Nkrumah', 1, NULL, NULL, NULL, NOW(), NOW()),
('thomas-sankara', 'Thomas Sankara', 1, NULL, NULL, NULL, NOW(), NOW()),
('patrice-lumumba', 'Patrice Lumumba', 1, NULL, NULL, NULL, NOW(), NOW()),
('julius-nyerere', 'Julius Nyerere', 1, NULL, NULL, NULL, NOW(), NOW()),
('leopold-sedar-senghor', 'Leopold Sedar Senghor', 1, NULL, NULL, NULL, NOW(), NOW()),
('sekou-toure', 'Sekou Toure', 1, NULL, NULL, NULL, NOW(), NOW());

-- Resistants Anticoloniaux (categorie_id = 2)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('samory-toure', 'Samory Toure', 2, NULL, NULL, NULL, NOW(), NOW()),
('el-hadj-omar-tall', 'El Hadj Omar Tall', 2, NULL, NULL, NULL, NOW(), NOW()),
('yaa-asantewaa', 'Yaa Asantewaa', 2, NULL, NULL, NULL, NOW(), NOW()),
('nzinga-mbandi', 'Nzinga Mbandi', 2, NULL, NULL, NULL, NOW(), NOW()),
('ranavalona-iii', 'Ranavalona III', 2, NULL, NULL, NULL, NOW(), NOW()),
('behanzin', 'Behanzin', 2, NULL, NULL, NULL, NOW(), NOW());

-- Monarques Historiques (categorie_id = 3)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('haile-selassie', 'Haile Selassie Ier', 3, NULL, NULL, NULL, NOW(), NOW()),
('mansa-moussa', 'Mansa Moussa', 3, NULL, NULL, NULL, NOW(), NOW()),
('shaka-zulu', 'Shaka Zulu', 3, NULL, NULL, NULL, NOW(), NOW()),
('sundiata-keita', 'Sundiata Keita', 3, NULL, NULL, NULL, NOW(), NOW()),
('askia-mohammed', 'Askia Mohammed', 3, NULL, NULL, NULL, NOW(), NOW());

-- Intellectuels et Penseurs (categorie_id = 4)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('cheikh-anta-diop', 'Cheikh Anta Diop', 4, NULL, NULL, 2, NOW(), NOW()),
('achille-mbembe', 'Achille Mbembe', 4, NULL, NULL, NULL, NOW(), NOW()),
('ibn-khaldoun', 'Ibn Khaldoun', 4, NULL, NULL, NULL, NOW(), NOW()),
('ibn-battuta', 'Ibn Battuta', 4, NULL, NULL, NULL, NOW(), NOW()),
('frantz-fanon', 'Frantz Fanon', 4, NULL, NULL, NULL, NOW(), NOW());

-- Ecrivains (categorie_id = 5)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('chinua-achebe', 'Chinua Achebe', 5, NULL, NULL, NULL, NOW(), NOW()),
('wole-soyinka', 'Wole Soyinka', 5, NULL, NULL, NULL, NOW(), NOW()),
('naguib-mahfouz', 'Naguib Mahfouz', 5, NULL, NULL, NULL, NOW(), NOW()),
('ousmane-sembene', 'Ousmane Sembene', 5, NULL, NULL, NULL, NOW(), NOW()),
('ngugi-wa-thiongo', 'Ngugi wa Thiongo', 5, NULL, NULL, NULL, NOW(), NOW()),
('mariama-ba', 'Mariama Ba', 5, NULL, NULL, NULL, NOW(), NOW());

-- Militants Droits Humains (categorie_id = 6)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('desmond-tutu', 'Desmond Tutu', 6, NULL, NULL, NULL, NOW(), NOW()),
('wangari-maathai', 'Wangari Maathai', 6, NULL, NULL, 3, NOW(), NOW()),
('kofi-annan', 'Kofi Annan', 6, NULL, NULL, NULL, NOW(), NOW()),
('denis-mukwege', 'Denis Mukwege', 6, NULL, NULL, NULL, NOW(), NOW()),
('steve-biko', 'Steve Biko', 6, NULL, NULL, NULL, NOW(), NOW());

-- Musiciens et Artistes (categorie_id = 7)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('miriam-makeba', 'Miriam Makeba', 7, NULL, NULL, NULL, NOW(), NOW()),
('fela-kuti', 'Fela Anikulapo Kuti', 7, NULL, NULL, NULL, NOW(), NOW()),
('salif-keita', 'Salif Keita', 7, NULL, NULL, NULL, NOW(), NOW()),
('angelique-kidjo', 'Angelique Kidjo', 7, NULL, NULL, NULL, NOW(), NOW()),
('youssou-ndour', 'Youssou N Dour', 7, NULL, NULL, NULL, NOW(), NOW()),
('ali-farka-toure', 'Ali Farka Toure', 7, NULL, NULL, NULL, NOW(), NOW());

-- Sportifs (categorie_id = 8)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('haile-gebreselassie', 'Haile Gebreselassie', 8, NULL, NULL, NULL, NOW(), NOW()),
('eusebio', 'Eusebio da Silva Ferreira', 8, NULL, NULL, NULL, NOW(), NOW()),
('mohamed-salah', 'Mohamed Salah', 8, NULL, NULL, NULL, NOW(), NOW()),
('didier-drogba', 'Didier Drogba', 8, NULL, NULL, NULL, NOW(), NOW()),
('samuel-etoo', 'Samuel Eto o', 8, NULL, NULL, NULL, NOW(), NOW()),
('george-weah', 'George Weah', 8, NULL, NULL, NULL, NOW(), NOW()),
('roger-milla', 'Roger Milla', 8, NULL, NULL, NULL, NOW(), NOW()),
('sadio-mane', 'Sadio Mane', 8, NULL, NULL, NULL, NOW(), NOW());

-- Scientifiques et Inventeurs (categorie_id = 9)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('imhotep', 'Imhotep', 9, NULL, NULL, 1, NOW(), NOW()),
('arthur-zang', 'Arthur Zang', 9, NULL, NULL, NULL, NOW(), NOW()),
('rachid-yazami', 'Rachid Yazami', 9, NULL, NULL, NULL, NOW(), NOW()),
('william-kamkwamba', 'William Kamkwamba', 9, NULL, NULL, NULL, NOW(), NOW()),
('philip-emeagwali', 'Philip Emeagwali', 9, NULL, NULL, NULL, NOW(), NOW());

-- Figures Antiques (categorie_id = 10)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('nefertiti', 'Nefertiti', 10, NULL, NULL, NULL, NOW(), NOW()),
('ramses-ii', 'Ramses II', 10, NULL, NULL, NULL, NOW(), NOW()),
('hannibal-barca', 'Hannibal Barca', 10, NULL, NULL, NULL, NOW(), NOW()),
('cleopatre-vii', 'Cleopatre VII', 10, NULL, NULL, NULL, NOW(), NOW()),
('thoutmosis-iii', 'Thoutmosis III', 10, NULL, NULL, NULL, NOW(), NOW());

-- Heros de la Diaspora (categorie_id = 11)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('toussaint-louverture', 'Toussaint Louverture', 11, NULL, NULL, NULL, NOW(), NOW()),
('marcus-garvey', 'Marcus Garvey', 11, NULL, NULL, NULL, NOW(), NOW()),
('malcolm-x', 'Malcolm X', 11, NULL, NULL, NULL, NOW(), NOW()),
('martin-luther-king', 'Martin Luther King Jr.', 11, NULL, NULL, NULL, NOW(), NOW()),
('rosa-parks', 'Rosa Parks', 11, NULL, NULL, NULL, NOW(), NOW());

-- Femmes Leaders (categorie_id = 12)
INSERT INTO `personnalites` (`slug`, `nom`, `categorie_id`, `image`, `youtube_url`, `article_id`, `created_at`, `updated_at`) VALUES
('winnie-mandela', 'Winnie Mandela', 12, NULL, NULL, NULL, NOW(), NOW()),
('ellen-johnson-sirleaf', 'Ellen Johnson Sirleaf', 12, NULL, NULL, NULL, NOW(), NOW()),
('leymah-gbowee', 'Leymah Gbowee', 12, NULL, NULL, NULL, NOW(), NOW()),
('graca-machel', 'Graca Machel', 12, NULL, NULL, NULL, NOW(), NOW()),
('ngozi-okonjo-iweala', 'Ngozi Okonjo-Iweala', 12, NULL, NULL, NULL, NOW(), NOW()),
('dlamini-zuma', 'Nkosazana Dlamini-Zuma', 12, NULL, NULL, NULL, NOW(), NOW());

