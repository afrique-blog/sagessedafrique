-- ═══════════════════════════════════════════════════════════════════════════
-- INSERTION DES DONNÉES : DOSSIER ÉTHIOPIE
-- Date : 2026-01-24
-- À exécuter dans PhpMyAdmin APRÈS migration_dossiers_pays_v2.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Insérer le dossier principal
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_dossiers (slug, country_code, hero_image, featured, published_at)
VALUES (
  'ethiopie',
  'ET',
  '/images/pays/ethiopie-hero.jpg',
  1,
  NOW()
);

-- Récupérer l'ID du dossier
SET @dossier_id = LAST_INSERT_ID();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Traductions du dossier (FR)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_dossiers_translations (dossier_id, lang, title, subtitle, meta_title, meta_description)
VALUES (
  @dossier_id,
  'fr',
  'Éthiopie : Le Berceau des Origines',
  'Une nation de hauts plateaux, de mémoire longue et de foi vivante — fière d''Adwa (1896), marquée aussi par l''occupation italienne (1936–1941), et aujourd''hui au cœur des équilibres de la Corne de l''Afrique.',
  'Éthiopie : Dossier Pays complet | Sagesses d''Afrique',
  'Dossier pays complet sur l''Éthiopie : origines, empires, résistances, mosaïque culturelle, économie, géopolitique du Nil, arts et carnet pratique.'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Chapitre 0 : Introduction
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_chapitres (dossier_id, slug, ordre, reading_minutes)
VALUES (@dossier_id, 'introduction', 0, 5);

SET @chapitre_intro_id = LAST_INSERT_ID();

INSERT INTO pays_chapitres_translations (chapitre_id, lang, title, content_html)
VALUES (
  @chapitre_intro_id,
  'fr',
  'Introduction',
  '<section id="intro">
<p class="drop-cap">L''Éthiopie n''est pas un pays qu''on "fait". C''est un pays qui vous fait. À Addis-Abeba, la lumière du matin a ce grain particulier des villes en altitude : elle accroche les façades, blanchit les poussières, et vous rappelle que vous êtes sur un plateau, pas au bord de la mer. Dans un petit café de quartier, l''odeur du <em>buna</em> (café) fait office de boussole : sucrée, fumée, presque résineuse. Le premier sourire qu''on vous offre n''est pas un décor touristique — c''est une politesse sociale, un art du lien.</p>

<p>Au bout de quelques jours, vous comprenez que l''Éthiopie a une relation singulière au temps. Le calendrier éthiopien et l''heure "au lever du soleil" ne sont pas une coquetterie : c''est une manière de dire que la modernité n''a pas le monopole de la mesure. Dans le Nord, les églises rupestres de Lalibela semblent taillées dans une conviction : la pierre peut prier. À l''Est, Harar et ses ruelles racontent une urbanité ancienne, dense, faite de portes, de seuils, de paroles.</p>

<p>L''Éthiopie est souvent résumée en deux images contradictoires : la grandeur impériale et la famine des années 1980. Les deux existent dans la mémoire mondiale, mais aucune ne suffit. Ce dossier vise autre chose : une compréhension épaisse, "à hauteur d''humains", où la géographie, les peuples, les langues, la foi, la politique et l''économie s''éclairent mutuellement — sans misérabilisme, sans mythologie.</p>

<div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6 rounded">
  <h3 class="!mt-0">Carte d''identité essentielle</h3>
  <ul>
    <li><strong>Monnaie :</strong> Birr (ETB)</li>
    <li><strong>Capitale :</strong> Addis-Abeba (aussi siège de l''Union africaine)</li>
    <li><strong>Clé de lecture :</strong> une nation "continentale" à l''intérieur d''elle-même — par la diversité des paysages, des langues et des histoires.</li>
  </ul>
</div>

<p>Le fil rouge de ce dossier est simple : regarder l''Éthiopie par ses propres grammaires — sa mémoire, ses récits, ses rituels, ses compromis. Et poser une question très concrète : comment un pays si ancien, si peuplé, si stratégique, fabrique-t-il son avenir sans se trahir ?</p>
</section>'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Chapitre 1 : Géographie
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_chapitres (dossier_id, slug, ordre, reading_minutes)
VALUES (@dossier_id, 'geographie', 1, 8);

SET @chapitre_geo_id = LAST_INSERT_ID();

INSERT INTO pays_chapitres_translations (chapitre_id, lang, title, content_html)
VALUES (
  @chapitre_geo_id,
  'fr',
  'I. Géographie : Le Toit de l''Afrique',
  '<section id="geographie">
<p class="drop-cap">L''Éthiopie est une forteresse naturelle — et pas seulement parce qu''elle est enclavée. Elle l''est parce qu''elle s''élève. Les hauts plateaux abyssins imposent un rythme : celui de l''altitude, du souffle, des saisons qui ne se lisent pas seulement sur un calendrier, mais sur la couleur des collines et la densité de l''air. Ici, on ne traverse pas un pays : on change d''étage.</p>

<h3>1) La grande fracture : le Rift</h3>
<p>La Grande Vallée du Rift traverse l''Éthiopie comme une cicatrice géologique. Elle n''est pas une simple curiosité : elle explique des climats, des routes, des densités humaines, des frontières intérieures. Là où le terrain s''ouvre, les circulations changent — et avec elles les échanges, les langues, les alliances.</p>

<div class="grid md:grid-cols-2 gap-8 my-8">
  <div class="bg-gray-50 p-6 rounded-lg border border-gray-100">
    <h4 class="font-bold text-yellow-700 mb-2 uppercase text-sm tracking-wide">Les Hauts Plateaux</h4>
    <p class="text-sm text-gray-700">Cœur historique et démographique. L''altitude tempère la chaleur tropicale, favorise des agricultures de montagne, et a longtemps protégé des centres de pouvoir.</p>
  </div>
  <div class="bg-gray-50 p-6 rounded-lg border border-gray-100">
    <h4 class="font-bold text-yellow-700 mb-2 uppercase text-sm tracking-wide">La Dépression Danakil</h4>
    <p class="text-sm text-gray-700">L''un des paysages les plus extrêmes : sel, chaleur, volcans, lacs minéralisés. C''est une géographie de frontières, de routes anciennes, de caravanes.</p>
  </div>
</div>

<h3>2) Le "château d''eau" et la politique de l''eau</h3>
<p>Une partie majeure des eaux du bassin du Nil Bleu prend sa source en Éthiopie. Ce fait géographique devient un fait politique : l''eau est une ressource, un symbole de souveraineté, un outil de négociation régionale.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded">
  <h4 class="font-bold text-blue-900 mb-2">Ce que la géographie fabrique</h4>
  <ul class="text-blue-900">
    <li><strong>Des identités de relief :</strong> plateau / plaine n''est pas qu''une altitude, c''est une histoire de densités et de protections.</li>
    <li><strong>Des économies d''écosystèmes :</strong> café, teff, élevage, transhumance… chaque zone impose ses savoir-faire.</li>
    <li><strong>Des tensions "naturelles" :</strong> routes, accès, eau, frontières — la géographie distribue les cartes avant la politique.</li>
  </ul>
</div>

<h3>3) Biodiversité et symboles vivants</h3>
<p>Le Simien, le Bale, les forêts de nuages : la biodiversité éthiopienne n''est pas un décor "carte postale". Elle touche l''imaginaire national et elle pose des défis concrets : pression foncière, déforestation, conservation, tourisme.</p>

<blockquote class="quote-box">« Comprendre l''Éthiopie commence souvent par une évidence : ici, l''espace n''est pas neutre. Il commande. »</blockquote>
</section>'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Chapitre 2 : Histoire
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_chapitres (dossier_id, slug, ordre, reading_minutes)
VALUES (@dossier_id, 'histoire', 2, 15);

SET @chapitre_hist_id = LAST_INSERT_ID();

INSERT INTO pays_chapitres_translations (chapitre_id, lang, title, content_html)
VALUES (
  @chapitre_hist_id,
  'fr',
  'II. Histoire : Le Temps Long d''une Nation-Monde',
  '<section id="histoire">
<p class="drop-cap">Refuser de faire commencer l''histoire de l''Éthiopie à la colonisation n''est pas un geste militant : c''est un geste de précision. L''Éthiopie est un pays où la mémoire se tient sur plusieurs étages.</p>

<div class="my-8 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
  <h3 class="!mt-0">Repères chronologiques</h3>
  <ul>
    <li><strong>Préhistoire :</strong> régions de l''Omo et de l''Afar, cœur des recherches sur les origines humaines.</li>
    <li><strong>Antiquité :</strong> Aksum, puissance commerciale connectée à la mer Rouge.</li>
    <li><strong>Moyen Âge :</strong> dynasties, christianisme éthiopien, Lalibela.</li>
    <li><strong>1896 :</strong> Victoire d''Adwa contre l''Italie.</li>
    <li><strong>1936–1941 :</strong> Occupation italienne.</li>
    <li><strong>1974 :</strong> Chute de l''Empire, Derg.</li>
    <li><strong>1991 :</strong> Fin du Derg, fédéralisme.</li>
    <li><strong>2018 :</strong> Abiy Ahmed et réformes.</li>
  </ul>
</div>

<h3>1) Le temps des origines</h3>
<p>Dans les régions de l''Afar et de l''Omo, l''archéologie a mis au jour des traces majeures de l''histoire humaine. Ici, l''humanité n''est pas un concept abstrait, c''est un paysage.</p>

<h3>2) Aksum : puissance de la mer Rouge</h3>
<p>Avec Aksum, l''Éthiopie entre dans une histoire connectée. Le royaume aksoumite se comprend comme un acteur de circulation : marchandises, monnaies, langues, influences religieuses.</p>

<h3>3) Christianisme éthiopien : foi, texte, continuité</h3>
<p>Le christianisme éthiopien s''enracine, se traduit, se structure. Il produit une esthétique, un rapport au temps liturgique, une discipline sociale. Et surtout une bibliothèque.</p>

<h3>4) Adwa (1896) : un événement africain mondial</h3>
<p>Adwa est une victoire militaire, mais aussi une victoire de récit. Elle prouve qu''un État africain peut résister à une puissance européenne.</p>

<h3>5) 1936–1941 : occupation italienne</h3>
<p>L''Éthiopie a connu une occupation italienne de 1936 à 1941. L''honnêteté historique ne diminue pas la grandeur d''Adwa — au contraire.</p>

<blockquote class="quote-box">« La dignité ne vient pas d''un slogan. Elle vient de la capacité à regarder son histoire sans la maquiller. »</blockquote>

<h3>6) De l''Empire au Derg</h3>
<p>L''Empire et Haïlé Sélassié, puis 1974 : chute, Derg, militarisation, répression, guerres et catastrophes humanitaires.</p>

<h3>7) 1991–aujourd''hui : fédéralisme et tensions</h3>
<p>Le fédéralisme ethno-linguistique, la croissance des années 2000–2010, puis Abiy Ahmed en 2018, les réformes et le conflit au Tigré.</p>
</section>'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Chapitre 3 : Société (placeholder)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_chapitres (dossier_id, slug, ordre, reading_minutes)
VALUES (@dossier_id, 'societe', 3, 10);

SET @chapitre_soc_id = LAST_INSERT_ID();

INSERT INTO pays_chapitres_translations (chapitre_id, lang, title, content_html)
VALUES (
  @chapitre_soc_id,
  'fr',
  'III. Société : Terres & Peuples',
  '<section id="societe">
<p class="drop-cap">L''Éthiopie est une mosaïque de peuples, de langues et de traditions. Plus de 80 groupes ethniques cohabitent, chacun avec son histoire, ses coutumes et ses territoires.</p>

<h3>1) Les grandes familles linguistiques</h3>
<p>Amharique, tigrigna, oromo, somali... les langues éthiopiennes appartiennent à différentes familles (sémitique, couchitique, omotique) et structurent les identités régionales.</p>

<h3>2) Le fédéralisme ethnique</h3>
<p>Depuis 1995, l''Éthiopie est organisée en États régionaux sur base ethno-linguistique. Ce système vise à reconnaître la diversité, mais génère aussi des tensions.</p>

<h3>3) Religions et coexistence</h3>
<p>Christianisme orthodoxe, islam, protestantisme, religions traditionnelles : l''Éthiopie est un pays de foi plurielle où la coexistence est un art quotidien.</p>

<h3>4) La vie quotidienne</h3>
<p>La cérémonie du café, l''injera partagée, les fêtes religieuses, les marchés : autant de rituels qui tissent le lien social.</p>

<div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6 rounded">
  <h4 class="font-bold mb-2">À retenir</h4>
  <p>L''unité éthiopienne n''est pas une uniformité : c''est une négociation permanente entre diversités.</p>
</div>
</section>'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Chapitre 4 : Économie (placeholder)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_chapitres (dossier_id, slug, ordre, reading_minutes)
VALUES (@dossier_id, 'economie', 4, 10);

SET @chapitre_eco_id = LAST_INSERT_ID();

INSERT INTO pays_chapitres_translations (chapitre_id, lang, title, content_html)
VALUES (
  @chapitre_eco_id,
  'fr',
  'IV. Économie & Géopolitique',
  '<section id="economie">
<p class="drop-cap">L''Éthiopie est l''une des économies les plus dynamiques d''Afrique. Croissance à deux chiffres pendant des années, investissements massifs dans les infrastructures, émergence d''une classe moyenne urbaine.</p>

<h3>1) Agriculture et café</h3>
<p>L''agriculture emploie la majorité de la population. Le café, originaire d''Éthiopie, reste un produit d''exportation majeur et un symbole culturel.</p>

<h3>2) Industrialisation et zones économiques</h3>
<p>Le gouvernement a misé sur l''industrie légère (textile, cuir) avec des parcs industriels et des investissements étrangers, notamment chinois.</p>

<h3>3) Le barrage GERD et la géopolitique de l''eau</h3>
<p>Le Grand Ethiopian Renaissance Dam (GERD) sur le Nil Bleu est un projet majeur qui cristallise les tensions avec l''Égypte et le Soudan.</p>

<h3>4) Défis structurels</h3>
<p>Inflation, dette, chômage des jeunes, accès limité aux devises : l''économie fait face à des vents contraires.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded">
  <h4 class="font-bold text-blue-900 mb-2">Position stratégique</h4>
  <p class="text-blue-900">Enclavée mais centrale : l''Éthiopie est un hub pour la Corne de l''Afrique et le siège de l''Union Africaine.</p>
</div>
</section>'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Chapitre 5 : Culture (placeholder)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_chapitres (dossier_id, slug, ordre, reading_minutes)
VALUES (@dossier_id, 'culture', 5, 10);

SET @chapitre_cult_id = LAST_INSERT_ID();

INSERT INTO pays_chapitres_translations (chapitre_id, lang, title, content_html)
VALUES (
  @chapitre_cult_id,
  'fr',
  'V. Culture & Arts',
  '<section id="culture">
<p class="drop-cap">La culture éthiopienne est un trésor vivant : musique unique, cuisine distinctive, art religieux millénaire, littérature en ge''ez et en amharique.</p>

<h3>1) La musique éthiopienne</h3>
<p>Des gammes pentatoniques uniques, des instruments traditionnels (krar, masinko), et l''Éthio-jazz qui a conquis le monde.</p>

<h3>2) La cuisine</h3>
<p>L''injera (galette de teff) et ses accompagnements (wot), la cérémonie du café : la cuisine est un art de la convivialité.</p>

<h3>3) L''art sacré</h3>
<p>Peintures murales des églises, manuscrits enluminés, croix processionnelles : un patrimoine artistique exceptionnel.</p>

<h3>4) Patrimoine UNESCO</h3>
<p>Lalibela, Aksum, Gondar, la vallée de l''Omo, Harar : l''Éthiopie compte 9 sites classés au patrimoine mondial.</p>

<blockquote class="quote-box">« En Éthiopie, l''art n''est jamais seulement décoratif : il est toujours porteur de sens. »</blockquote>
</section>'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Chapitre 6 : Carnet pratique (placeholder)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO pays_chapitres (dossier_id, slug, ordre, reading_minutes)
VALUES (@dossier_id, 'carnet-pratique', 6, 8);

SET @chapitre_carnet_id = LAST_INSERT_ID();

INSERT INTO pays_chapitres_translations (chapitre_id, lang, title, content_html)
VALUES (
  @chapitre_carnet_id,
  'fr',
  'VI. Carnet Pratique & Annexes',
  '<section id="pratique">
<p class="drop-cap">Informations pratiques pour préparer un voyage ou approfondir vos connaissances sur l''Éthiopie.</p>

<h3>1) Formalités et visa</h3>
<p>E-visa disponible pour la plupart des nationalités. Passeport valide 6 mois après la date d''entrée.</p>

<h3>2) Santé et vaccins</h3>
<p>Fièvre jaune recommandée. Traitement antipaludéen selon les régions. Altitude à prendre en compte.</p>

<h3>3) Monnaie et budget</h3>
<p>Birr éthiopien (ETB). Prévoir du cash, les cartes sont peu acceptées en dehors des grands hôtels.</p>

<h3>4) Itinéraires suggérés</h3>
<ul>
  <li><strong>Circuit historique Nord :</strong> Addis → Bahir Dar → Gondar → Lalibela → Aksum</li>
  <li><strong>Route du Sud :</strong> Vallée de l''Omo, lacs du Rift</li>
  <li><strong>Aventure Est :</strong> Harar, Dépression Danakil</li>
</ul>

<h3>5) Ressources</h3>
<div class="bg-gray-50 p-6 rounded-lg border border-gray-100 my-6">
  <h4 class="font-bold mb-3">Lectures recommandées</h4>
  <ul class="text-sm">
    <li>« Notes from the Hyena''s Belly » - Nega Mezlekia</li>
    <li>« Beneath the Lion''s Gaze » - Maaza Mengiste</li>
    <li>« A History of Ethiopia » - Harold Marcus</li>
  </ul>
</div>

<div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6 rounded">
  <h4 class="font-bold mb-2">Conseil</h4>
  <p>Prenez le temps. L''Éthiopie ne se consomme pas, elle se savoure.</p>
</div>
</section>'
);

-- ═══════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION
-- ═══════════════════════════════════════════════════════════════════════════
SELECT 'Dossier créé avec ID:' AS message, @dossier_id AS dossier_id;
SELECT COUNT(*) AS nombre_chapitres FROM pays_chapitres WHERE dossier_id = @dossier_id;
