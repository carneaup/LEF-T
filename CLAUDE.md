# LEF-T — Contexte projet pour Claude

Ce fichier résume tout ce qu'une nouvelle session Claude (ou un·e collègue) doit savoir
pour reprendre ce projet sans repartir de zéro. Il est volontairement tenu à jour au fil
des évolutions du site — si tu es un Claude qui vient de le lire, regarde aussi
`COMMENT-AJOUTER-UN-PROJET.md` pour la procédure détaillée d'ajout/retrait de projet.

## C'est quoi, LEF-T ?

LEF-T est un bureau d'études structure / façade, qui est aussi la continuation officielle
de l'ancien bureau **LEICHT France** (le lien entre les deux peut et doit être assumé
ouvertement, y compris sur le site — ce n'était pas le cas historiquement, mais c'est
tranché). LEF-T travaille aussi sur l'ingénierie vélo avec un partenaire, **Leicht-bikes**.

## Hébergement et déploiement

- Site statique, **aucun build step** (pas de framework, pas de bundler) : HTML/CSS/JS
  servis tels quels.
- Hébergé sur **GitHub Pages**, dépôt `carneaup/LEF-T`.
- Domaine personnalisé **https://lef-t.eu/**, HTTPS fonctionnel.
- Le propriétaire (Paul) travaille sous **VSCode**, sur Windows, et commite/pousse
  **lui-même** — voir règle de collaboration plus bas.
- Branche de travail : **`develop`** exclusivement.

## Où vit le code (sur la machine de Paul)

`C:\Users\carne\Nextcloud\Dedalis\02_Projets\2026\2026-007-Site_LEF-T\_source\LEF-T`
(synchronisé via Nextcloud). Quand une session Claude (Cowork) est liée à l'ordinateur de
Paul, c'est ce dossier qui est connecté.

## Architecture du site

- Système d'includes maison : `includes/header.html`, `includes/footer.html`, chargés par
  `includes/load-includes.js`. Un `BASE_PATH` est calculé à l'exécution pour gérer les
  chemins préfixés par `/`.
- **Architecture « single-source » pour les projets** : tout le contenu vit dans
  `data/projects.json`. Il n'y a **qu'une seule page HTML de détail projet**,
  `projets/projet.html?id=...`, rendue dynamiquement par `js/project-detail.js` (qui
  dépend de `js/projects.js` pour `loadProjects()`, `getLang()`, `projectsData`). On ne
  crée **jamais** de fichier HTML par projet.
- Schéma d'une entrée dans `data/projects.json` (tableau `projects`) :
  `id`, `title` / `title_en`, `image` (cover), `category` (**une seule chaîne**, doit
  correspondre à un `id` du tableau `categories`), `featured` (bool, carrousel accueil),
  `year` (+ `year_en` optionnel, ex. "En cours"/"Ongoing"), `location` / `location_en`, `description` / `description_en` (tableaux de
  paragraphes), `gallery` (tableau de chemins d'images), et en option :
  - `draft: true` → masque le projet de la mosaïque/filtres/carrousel sans le supprimer
    (fiche restant accessible par lien direct) ;
  - `facts` / `facts_en` → objet optionnel `{ address, client, architect, surface, cost }`
    affiché dans un encart "fiche technique" sur la page projet (`facts_en` ne sert que
    pour les valeurs qui diffèrent vraiment en anglais — sinon `facts` suffit pour les
    deux langues).
- **Fiche projet (oct. 2026)** : mise en page deux colonnes façon fiches PDF — texte +
  fiche technique (`<dl>`) à gauche (sticky), photos à droite en taille réelle (jamais
  agrandies). Mobile : photo principale, texte, autres photos. En bas : projet
  précédent/suivant + 3 vignettes « Autres projets » (même catégorie d'abord). Un projet
  sans aucune photo s'affiche sur une seule colonne.
- **Mosaïque (nov. 2026, « zigzag »)** : `arrangeMosaic()` (js/projects.js) compose des blocs
  de 2 rangées × 4 colonnes = 1 grande tuile (2 × 2) + 4 petites, la grande alternant
  gauche / droite. Grandes tuiles = projets `"tile": "large"` (dans l'ordre du fichier),
  petites = les autres (dans l'ordre du fichier, toujours alterner visuels vélo blancs et
  photos). Une grande tuile n'est posée que s'il reste ≥ 4 petites pour son bloc (sinon
  affichée en petit) → pas de trou, même filtré. Dernière rangée incomplète (1 à 3
  tuiles) : les tuiles s'élargissent pour la remplir (classes `project-tile--fill-N-i`). Idéal : 1 grande tuile pour 4 petites
  (actuellement Grassau, Mémorial, Wurtzbourg + 12 petites = 3 blocs). Réserver les grandes
  tuiles aux photos ≥ 1200 px. 4 colonnes sur ordinateur/tablette, 2 sur mobile (grande
  tuile pleine largeur). Largeur alignée sur l'en-tête (1400 px max ; classe `page-projets`
  sur le `<body>` de projets.html pour aligner titre et filtres). Paul a trouvé la version
  8/6 colonnes « moche » : ne pas y revenir sans lui demander.
- **Entité** : champ `firm` dans chaque projet → id du tableau `firms` de projects.json
  (`lef-t`, `leicht-france`, `leicht` = LEICHT Allemagne, `ftr` = Fassade Tragwerk
  Rosenheim). Affiché « Réalisé par » / « Carried out by » en tête de la fiche technique et
  en petites capitales jaunes sous le lieu/année au survol des vignettes. Règle de Paul :
  tout projet LEICHT France / LEICHT / FTR doit être mentionné comme tel ; ne jamais
  deviner l'entité, la demander à Paul. Renseignés (nov. 2026) : `lef-t` pour Condorcet,
  Pinard et les projets vélo ; `leicht-france` pour Swatch, Canary Wharf, Arboretum,
  Augustenstraße, Omega (le pptx de Paul « 2026-07-10 Fiches de projet bois » le dit
  explicitement). Les autres attendent la réponse de Paul.
- Nov. 2026 : Arboretum — 6 photos LS (projet livré, © LEF-T, dossier Nextcloud2
  « LF Communication/Photos site web LEF-T/ARBORETUM/261107 LS ») en couverture et
  galerie, les 2 photos de chantier © Mathis passées en fin de galerie (06, 07).
  Ajout de `pinard` (Super-équipement Pinard, Paris 14e, LEF-T, études EXE : notes de
  calcul et plans de détail) depuis le pptx ; photos de chantier ~1400 px © LEF-T.
- Nov. 2026 : `villejuif` (ancien brouillon fictif) remplacé par la vraie fiche Gare
  Villejuif – Gustave Roussy (LEICHT France, EXE pour Taiyo : dimensionnement, plans
  d'assemblage et de fab, dossier d'ATEx de l'ETFE simple peau + accastillage). Publiée,
  `featured` (couverture paysage pour le fond d'accueil), 6 photos WhatsApp © LEF-T.
- Nov. 2026 : brouillon fictif `poitiers` remplacé par `aquascope` (Aquascope, Futuroscope,
  LEICHT France, EXE pour Taiyo : coussins ETFE triple peau + ventilation, ATEx, accastillage ;
  texte et fiche technique depuis « 2025-01-16- Nouveau modéle fiche de projet.pptx », slide 1).
  Architecte retenu par Paul : ART'UR Architectes. MOA « Futur Resort » (d'après le pptx, non
  confirmé en ligne). Photos : auteur inconnu, « probablement Taiyo Europe » selon Paul
  (LEICHT France n'est pas allé sur le chantier) → créditées Taiyo Europe, à confirmer.
- **Références sans photo** : un projet publié sans `image` n'est pas dans la mosaïque
  mais dans la liste « Autres références » sous celle-ci (page Projets) : année, titre,
  lieu, `mission` / `mission_en` (champ court optionnel, ex. « Études d'exécution
  charpente bois »). Le titre mène à la fiche seulement s'il y a une `description`.
  Filtrée par catégorie comme la mosaïque ; exclue du fond d'accueil et des vignettes.
- `generateCategoryFilters()` (dans `js/projects.js`) n'affiche un bouton de filtre que
  pour les catégories ayant au moins un projet publié (non-`draft`).
- Langue stockée dans `localStorage` sous la clé `lef-t-lang`, valeurs **`'FR'` ou `'EN'`
  en majuscules strictement** (un bug de casse a déjà été corrigé — à ne pas réintroduire).

## Crédits images (règle de rigueur demandée par Paul)

**Chaque image/photo/dessin affiché sur le site doit montrer son auteur.**
- Registre unique : `data/credits.json` → `images["<chemin depuis la racine>"] = { "author": "..." }`
  (option `label` / `label_en` pour une image hors projet, ex. photo d'équipe).
- `js/credits.js` (chargé avant `js/projects.js`) affiche « © Auteur » en bas à droite
  de chaque image : fond d'accueil, vignettes de la mosaïque (en haut à droite),
  en-tête + galerie des pages projet, lightbox ; et génère la section
  « Crédits photographiques » des mentions légales (`[data-credits-list]`).
- Image sans entrée = **aucun crédit affiché** (on ne devine jamais un auteur) +
  avertissement console. Contrôle : `python tools/check-credits.py` — à lancer avant
  toute livraison ; ne pas livrer de nouvelle image sans crédit.
- Format retenu : « © Auteur » (identique FR/EN). Logos (LEF-T, partenaires) non crédités.
- État : images des projets vélo (G1, R2, Cargo) créditées « LEF-T ». Projets
  bâtiment (patrimoniaux + brouillons garching/munich/poitiers/villejuif) en attente
  des fiches projets mises à jour avec les auteurs.

## Taxonomie des catégories

Catégories historiques (vélo/bureau) : `g1`, `r2`, `cargo`, `bureau`, `urbanisme`.

Catégories ajoutées pour les projets patrimoniaux LEICHT France (bâtiment) : `structure`,
`facade`, `mobilite-douce`, `bois`, `membrane`. Préférence explicite de Paul : **peu de
tags mais clairs** — ne pas en ajouter d'autres sans son accord. Les 3 dernières
(bois / membrane) existent déjà dans `projects.json` mais ne sont pour l'instant utilisées
par aucun projet publié. Les projets vélo G1 et Cargo sont regroupés sous `mobilite-douce`
(demande de Paul) ; les catégories `g1` / `cargo` restent définies mais inutilisées
(donc sans bouton de filtre). `r2-cfd` (brouillon) est encore en `r2`.

## Règle de collaboration (IMPORTANT)

**Claude ne lance jamais de commande git lui-même** (ni commit, ni push). Le
fonctionnement établi est :
1. Claude modifie les fichiers, teste localement (serveur HTTP + Playwright avant
   livraison), puis livre les fichiers à Paul (via le pont vers son ordinateur).
2. Claude **propose un message de commit**.
3. Paul relit, commite et pousse lui-même depuis VSCode, quand il est satisfait.

## Historique récent / état actuel

- Le site est en ligne depuis un moment, HTTPS + domaine personnalisé finalisés.
- Accroche « Simple comme LEF-T. » retirée de l'accueil à la demande de Paul (oct. 2026).
- Projet `r2-cfd` (simulation CFD vélo) passé en `draft: true` à la demande de Paul.
- Corrigé : le fond d'accueil excluait mal les projets `draft` (filtre `featured && !draft`
  dans `script.js`).
- 4 projets patrimoniaux LEICHT France ajoutés depuis une liste de 18 slides pptx
  fournie par Paul (`2025-01-16-fiche de projet Bois.pptx`) : Mémorial Alsace-Moselle,
  Siège social Swatch Group, Arboretum de Nanterre, Gymnase de Grassau — catégories
  `structure` / `facade`, avec encart "fiche technique" (`facts`).
- Oct. 2026 : depuis `projets bois _ site web.pdf` (fiches mises à jour avec auteurs
  des photos) : ajout de `cnam-intechmer` (© Valentin Leflamand) et `ilot-condorcet`
  (projet LEF-T, © LEF-T, chantier en cours → `year: "En cours"` / `year_en: "Ongoing"`,
  coût omis tant qu'il n'est pas définitif), remplacement des photos
  d'`arboretum-nanterre` (© Mathis, l'entreprise bois). Images extraites du PDF
  (~1000 px). Ajout ensuite de `halle-villeneuve-la-garenne` (photo intérieure seule,
  © Mathis — l'image de rendu de la fiche est volontairement écartée à la demande de Paul).
  Maison Ste Germaine (aussi dans le PDF) non ajoutée.
- Nov. 2026 : import des 32 projets de leichtfrance.com (site WordPress appelé à disparaître),
  récupérés via le navigateur intégré (le site est bloqué pour le cloud et le shell local).
  Textes réécrits à la 1re personne LEF-T (« nous ») + traduction EN ; photos converties en
  JPEG ≤ 2400 px q85 (beaucoup ne font que ~1100 px sur l'ancien site) ; crédits = champ
  « Images » de chaque fiche LEICHT France. Tous en `draft: true` sauf `swatch-group-bienne`
  (déjà publié, texte et photos remplacés, adresse/surface conservées). `garching` remplacé
  (bâtiment Newton, toit ETFE) — pas de crédit photo sur l'ancien site. `augustenstrasse-munich`
  sans description sur l'ancien site. `bastide-niel-bordeaux` encore « En cours » (date 2020).
  Catégories utilisées : membrane, bois, structure, facade.
  Publiés ensuite à la demande de Paul : gare-de-rennes, fachhochschule-rosenheim,
  tour-saint-gobain, step-wurtzbourg (tuile large), garching — intercalés dans la mosaïque
  (15 projets + 3 grandes tuiles = 24 cases, grille pleine).
- **Reste à faire, si Paul le demande** : 14 autres projets de ce même pptx n'ont pas
  encore été sélectionnés/ajoutés. Ne pas les ajouter sans qu'il les ait explicitement
  choisis.

## Pour une nouvelle session Claude qui découvre ce projet

1. Lire ce fichier + `COMMENT-AJOUTER-UN-PROJET.md`.
2. Si des fichiers sources (pptx, images...) sont fournis pour de nouveaux projets,
   suivre le même schéma que les 4 projets patrimoniaux ci-dessus (texte poli, pas de
   copier-coller brut ; images converties en JPEG web ~2400px max, qualité 85).
3. Toujours tester en local (mosaïque + fiches FR/EN) avant de livrer.
4. Ne jamais commit/push à la place de Paul.
