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
- - **Reste à faire, si Paul le demande** : 14 autres projets de ce même pptx n'ont pas
  encore été sélectionnés/ajoutés. Ne pas les ajouter sans qu'il les ait explicitement
  choisis.

## Pour une nouvelle session Claude qui découvre ce projet

1. Lire ce fichier + `COMMENT-AJOUTER-UN-PROJET.md`.
2. Si des fichiers sources (pptx, images...) sont fournis pour de nouveaux projets,
   suivre le même schéma que les 4 projets patrimoniaux ci-dessus (texte poli, pas de
   copier-coller brut ; images converties en JPEG web ~2400px max, qualité 85).
3. Toujours tester en local (mosaïque + fiches FR/EN) avant de livrer.
4. Ne jamais commit/push à la place de Paul.
