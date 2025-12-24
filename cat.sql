-- =====================================================
-- Tables des categories et personnalites africaines
-- Compatible avec le schema Prisma
-- =====================================================

-- Insertion des categories de personnalites
INSERT INTO categories_personnalites (slug, nom, description, image) VALUES
('leaders-politiques', 'Leaders Politiques', 'Figures qui ont dirige des Etats, conduit des mouvements d independance ou de reforme, redessine les frontieres et les institutions, et influence durablement la vie politique africaine et mondiale.', '/images/categories/leaders-politiques.jpg'),
('resistants-anticoloniaux', 'Resistants Anticoloniaux', 'Chefs, guerriers et strateges qui ont combattu militairement ou symboliquement la conquete et la domination coloniale, defendu les terres, les cultures et la souverainete des peuples africains.', '/images/categories/resistants.jpg'),
('monarques-historiques', 'Monarques Historiques', 'Rois, reines et empereurs qui ont constitue de grands royaumes, controle des routes commerciales, consolide des identites politiques et religieuses, et marque la memoire collective par leur pouvoir et leur prestige.', '/images/categories/monarques.jpg'),
('intellectuels-penseurs', 'Intellectuels et Penseurs', 'Historiens, philosophes et theoriciens qui ont produit des savoirs critiques sur l Afrique, repense l identite, la memoire et le pouvoir, et influence la maniere dont le monde comprend le continent.', '/images/categories/intellectuels.jpg'),
('ecrivains', 'Ecrivains', 'Romanciers, poetes et dramaturges qui ont donne voix aux experiences africaines, denonce domination et injustices, renouvele les langues et formes litteraires, et inscrit l Afrique dans la litterature mondiale.', '/images/categories/ecrivains.jpg'),
('militants-droits-humains', 'Militants Droits Humains', 'Acteurs engages pour la paix, la justice sociale, l egalite raciale et de genre, l ecologie, qui ont mobilise societes civiles, institutions internationales et opinions publiques pour defendre la dignite humaine.', '/images/categories/militants.jpg'),
('musiciens-artistes', 'Musiciens et Artistes', 'Createurs dont les oeuvres musicales, cinematographiques ou plastiques racontent l Afrique, contestent les pouvoirs, transmettent memoires et luttes, et irriguent les cultures populaires mondiales.', '/images/categories/artistes.jpg'),
('sportifs', 'Sportifs', 'Athletes et footballeurs devenus symboles de reussite, de discipline et de depassement, qui ont porte haut les couleurs africaines sur les scenes internationales et inspire des generations de jeunes.', '/images/categories/sportifs.jpg'),
('scientifiques-inventeurs', 'Scientifiques et Inventeurs', 'Chercheurs, ingenieurs et innovateurs ayant developpe technologies, remedes ou theories qui ameliorent la sante, les communications, l energie ou l industrie, montrant la capacite de l Afrique a produire de la haute expertise.', '/images/categories/scientifiques.jpg'),
('figures-antiques', 'Figures Antiques', 'Personnalites de l Egypte, de la Nubie ou d empires anciens, dont le pouvoir, la diplomatie et les realisations culturelles temoignent des racines tres anciennes de la civilisation africaine.', '/images/categories/antiques.jpg'),
('heros-diaspora', 'Heros de la Diaspora', 'Dirigeants, revolutionnaires et penseurs afro-descendants qui, depuis Ameriques ou Caraibes, ont lutte contre esclavage, racisme et colonisation, prolongeant les combats de l Afrique au-dela du continent.', '/images/categories/diaspora.jpg'),
('femmes-leaders', 'Femmes Leaders', 'Reines, militantes, cheffes d Etat et d organisations qui ont brise des barrieres patriarcales, conduit des luttes politiques ou sociales, et ouvert des voies nouvelles pour les femmes africaines.', '/images/categories/femmes-leaders.jpg');

-- Insertion des personnalites
-- Note: categorie_id correspond a l ordre d insertion ci-dessus (1-12)
-- article_id et youtube_url peuvent etre mis a jour plus tard

INSERT INTO personnalites (slug, nom, categorie_id, image, youtube_url, article_id) VALUES
-- Leaders Politiques (categorie_id = 1)
('nelson-mandela', 'Nelson Mandela', 1, NULL, NULL, NULL),
('kwame-nkrumah', 'Kwame Nkrumah', 1, NULL, NULL, NULL),
('thomas-sankara', 'Thomas Sankara', 1, NULL, NULL, NULL),
('patrice-lumumba', 'Patrice Lumumba', 1, NULL, NULL, NULL),
('julius-nyerere', 'Julius Nyerere', 1, NULL, NULL, NULL),
('leopold-sedar-senghor', 'Leopold Sedar Senghor', 1, NULL, NULL, NULL),
('sekou-toure', 'Sekou Toure', 1, NULL, NULL, NULL),

-- Resistants Anticoloniaux (categorie_id = 2)
('samory-toure', 'Samory Toure', 2, NULL, NULL, NULL),
('el-hadj-omar-tall', 'El Hadj Omar Tall', 2, NULL, NULL, NULL),
('yaa-asantewaa', 'Yaa Asantewaa', 2, NULL, NULL, NULL),
('nzinga-mbandi', 'Nzinga Mbandi', 2, NULL, NULL, NULL),
('ranavalona-iii', 'Ranavalona III', 2, NULL, NULL, NULL),

-- Monarques Historiques (categorie_id = 3)
('haile-selassie', 'Haile Selassie Ier', 3, NULL, NULL, NULL),
('mansa-moussa', 'Mansa Moussa', 3, NULL, NULL, NULL),
('shaka-zulu', 'Shaka Zulu', 3, NULL, NULL, NULL),
('mehemed-ali', 'Mehemet Ali', 3, NULL, NULL, NULL),
('cleopatre-vii', 'Cleopatre VII', 3, NULL, NULL, NULL),

-- Intellectuels et Penseurs (categorie_id = 4)
('cheikh-anta-diop', 'Cheikh Anta Diop', 4, NULL, NULL, NULL),
('achille-mbembe', 'Achille Mbembe', 4, NULL, NULL, NULL),
('ibn-khaldoun', 'Ibn Khaldoun', 4, NULL, NULL, NULL),
('ibn-battuta', 'Ibn Battuta', 4, NULL, NULL, NULL),

-- Ecrivains (categorie_id = 5)
('chinua-achebe', 'Chinua Achebe', 5, NULL, NULL, NULL),
('wole-soyinka', 'Wole Soyinka', 5, NULL, NULL, NULL),
('naguib-mahfouz', 'Naguib Mahfouz', 5, NULL, NULL, NULL),
('ousmane-sembene', 'Ousmane Sembene', 5, NULL, NULL, NULL),

-- Militants Droits Humains (categorie_id = 6)
('desmond-tutu', 'Desmond Tutu', 6, NULL, NULL, NULL),
('wangari-maathai', 'Wangari Maathai', 6, NULL, NULL, NULL),
('kofi-annan', 'Kofi Annan', 6, NULL, NULL, NULL),
('mohamed-elbaradei', 'Mohamed ElBaradei', 6, NULL, NULL, NULL),
('steve-biko', 'Steve Biko', 6, NULL, NULL, NULL),

-- Musiciens et Artistes (categorie_id = 7)
('miriam-makeba', 'Miriam Makeba', 7, NULL, NULL, NULL),
('fela-kuti', 'Fela Anikulapo Kuti', 7, NULL, NULL, NULL),
('salif-keita', 'Salif Keita', 7, NULL, NULL, NULL),
('angelique-kidjo', 'Angelique Kidjo', 7, NULL, NULL, NULL),

-- Sportifs (categorie_id = 8)
('haile-gebreselassie', 'Haile Gebreselassie', 8, NULL, NULL, NULL),
('eusebio', 'Eusebio da Silva Ferreira', 8, NULL, NULL, NULL),
('mohamed-salah', 'Mohamed Salah', 8, NULL, NULL, NULL),
('didier-drogba', 'Didier Drogba', 8, NULL, NULL, NULL),
('samuel-etoo', 'Samuel Eto o', 8, NULL, NULL, NULL),
('george-weah', 'George Weah', 8, NULL, NULL, NULL),
('roger-milla', 'Roger Milla', 8, NULL, NULL, NULL),

-- Scientifiques et Inventeurs (categorie_id = 9)
('arthur-zang', 'Arthur Zang', 9, NULL, NULL, NULL),
('trevor-wadley', 'Trevor Lloyd Wadley', 9, NULL, NULL, NULL),
('allan-cormack', 'Allan McLeod Cormack', 9, NULL, NULL, NULL),
('rachid-yazami', 'Rachid Yazami', 9, NULL, NULL, NULL),
('william-kamkwamba', 'William Kamkwamba', 9, NULL, NULL, NULL),
('philip-emeagwali', 'Philip Emeagwali', 9, NULL, NULL, NULL),

-- Figures Antiques (categorie_id = 10)
('nefertiti', 'Nefertiti', 10, NULL, NULL, NULL),
('ramses-ii', 'Ramses II', 10, NULL, NULL, NULL),
('hannibal-barca', 'Hannibal Barca', 10, NULL, NULL, NULL),

-- Heros de la Diaspora (categorie_id = 11)
('toussaint-louverture', 'Toussaint Louverture', 11, NULL, NULL, NULL),
('marcus-garvey', 'Marcus Garvey', 11, NULL, NULL, NULL),
('malcolm-x', 'Malcolm X', 11, NULL, NULL, NULL),

-- Femmes Leaders (categorie_id = 12)
('winnie-mandela', 'Winnie Mandela', 12, NULL, NULL, NULL),
('ellen-johnson-sirleaf', 'Ellen Johnson Sirleaf', 12, NULL, NULL, NULL),
('leymah-gbowee', 'Leymah Gbowee', 12, NULL, NULL, NULL),
('graça-machel', 'Graca Machel', 12, NULL, NULL, NULL),
('ngozi-okonjo-iweala', 'Ngozi Okonjo-Iweala', 12, NULL, NULL, NULL);
