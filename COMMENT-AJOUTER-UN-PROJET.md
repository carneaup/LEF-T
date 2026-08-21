# Ajouter ou retirer un projet sur le site LEF-T

Depuis la nouvelle architecture, il n'y a plus qu'un seul endroit à modifier :
`data/projects.json`. Aucune page HTML à créer ou supprimer, aucune
traduction séparée à tenir à jour.

## Ajouter un projet

1. **Choisir un id court**, sans espace ni accent (ex. `r2-cfd`). Il sert de
   référence interne et apparaît dans l'URL de la fiche projet.

2. **Créer un dossier `assets/images/<id>/`** et y déposer les photos :
   - `cover.jpg` — la photo principale, utilisée à la fois dans la mosaïque
     de la page Projets et en haut de la fiche projet.
   - `01.jpg`, `02.jpg`, ... — les photos supplémentaires de la galerie
     (optionnel).

   Chaque projet a son propre dossier : plus de mélange entre les photos de
   projets différents.

3. **Ajouter une entrée dans `data/projects.json`**, dans le tableau
   `projects` :

   ```json
   {
     "id": "mon-projet",
     "title": "Titre en français",
     "title_en": "Title in English",
     "image": "assets/images/mon-projet/cover.jpg",
     "category": "r2",
     "featured": false,
     "year": "2026",
     "location": "Paris, France",
     "location_en": "Paris, France",
     "description": ["Premier paragraphe.", "Deuxième paragraphe (optionnel)."],
     "description_en": ["First paragraph.", "Second paragraph (optional)."],
     "gallery": [
       "assets/images/mon-projet/01.jpg",
       "assets/images/mon-projet/02.jpg"
     ]
   }
   ```

   - `category` doit correspondre à un `id` du tableau `categories` (en bas
     du fichier). Pour créer une nouvelle catégorie, ajouter une entrée
     `{ "id": "...", "name": "...", "name_en": "..." }` dans ce tableau.
   - `featured: true` fait apparaître ce projet dans le fond d'écran
     tournant de la page d'accueil (voir plus bas). Laisser `false` sinon.
   - `gallery` peut être un tableau vide `[]` s'il n'y a pas de photo
     supplémentaire.

4. C'est tout — le projet apparaît automatiquement dans la mosaïque, les
   filtres par catégorie et sur sa propre fiche (`projets/projet.html?id=mon-projet`).

## Retirer un projet

1. Supprimer son entrée dans `data/projects.json`.
2. Supprimer son dossier `assets/images/<id>/`.

Si un lien pointe encore vers ce projet par erreur (faute de frappe, oubli),
le site affiche une page « Projet introuvable » avec un lien de retour,
au lieu de planter.

## Choisir les photos du fond d'écran de la page d'accueil

Le carrousel de la page d'accueil pioche uniquement parmi les projets ayant
`"featured": true` dans `projects.json`. Pour changer la sélection, il
suffit de basculer ce champ à `true` ou `false` sur les projets voulus —
rien à modifier ailleurs.
