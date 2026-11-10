/**
 * Projects Manager - Gestion dynamique des projets
 */

let projectsData = null;
let currentCategory = 'all';

// Calcule le préfixe relatif vers la racine du site à partir du <script src="...">
// utilisé pour charger CE fichier (mêmes principes que dans load-includes.js).
// IMPORTANT : nom différent de celui utilisé dans load-includes.js (BASE_PATH) car
// deux "const" de même nom déclarés dans deux <script> distincts sur la même page
// provoquent une SyntaxError globale ("Identifier has already been declared"), ce qui
// empêchait TOUT ce fichier de s'exécuter (mosaïque + filtres invisibles, FR et EN).
function getProjectsBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
        const src = s.getAttribute('src');
        if (src && src.indexOf('js/projects.js') !== -1) {
            return src.substring(0, src.indexOf('js/projects.js'));
        }
    }
    return '';
}
const PROJECTS_BASE_PATH = getProjectsBasePath();

// Langue courante : réutilise getCurrentLanguage() défini dans load-includes.js
// (chargé avant ce script). Filet de sécurité si jamais l'ordre change.
function getLang() {
    if (typeof getCurrentLanguage === 'function') return getCurrentLanguage();
    return 'FR';
}

async function loadProjects() {
    try {
        const response = await fetch(PROJECTS_BASE_PATH + 'data/projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        projectsData = await response.json();
        return projectsData;
    } catch (error) {
        console.error('Error loading projects:', error);
        return null;
    }
}

// size : 'small' (défaut), 'large-left' ou 'large-right' (voir arrangeMosaic).
// Hors mosaïque (vignettes « Autres projets »), toutes les tuiles sont petites.
// Entité ayant réalisé le projet ("firm" dans projects.json → tableau "firms" :
// LEF-T, LEICHT France, LEICHT (Allemagne), FTR). Renvoie le nom affiché, ou ''
// si le projet n'a pas (encore) d'entité renseignée.
function firmName(project) {
    if (!project || !project.firm || !projectsData || !projectsData.firms) return '';
    const firm = projectsData.firms.find(function(f) { return f.id === project.firm; });
    if (!firm) return '';
    return (getLang() === 'EN' && firm.name_en) ? firm.name_en : firm.name;
}

function generateProjectCard(project, size) {
    const isEN = getLang() === 'EN';
    const image = PROJECTS_BASE_PATH + project.image;
    // L'URL est calculée depuis l'id : une seule page projet.html sert tous les
    // projets, son contenu dépend de "?id=...". Ainsi ajouter/retirer un projet
    // ne demande jamais de créer ou supprimer de fichier HTML, juste d'éditer
    // data/projects.json.
    const url = PROJECTS_BASE_PATH + 'projets/projet.html?id=' + encodeURIComponent(project.id);
    const title = (isEN && project.title_en) ? project.title_en : project.title;
    const location = (isEN && project.location_en) ? project.location_en : project.location;
    const year = (isEN && project.year_en) ? project.year_en : project.year;

    const html = '<img src="' + image + '" alt="' + title + '" loading="lazy">' +
        '<div class="project-tile-overlay">' +
        '<h3>' + title + '</h3>' +
        // L'année est facultative ; "year_en" permet une traduction (ex. "En cours" / "Ongoing")
        '<p>' + location + (year ? ' - ' + year : '') + '</p>' +
        // Entité (LEICHT France, LEICHT, FTR, LEF-T) sous le lieu et l'année
        (firmName(project) ? '<p class="project-tile-firm">' + firmName(project) + '</p>' : '') +
        '</div>' +
        // Crédit de l'image (« © Auteur »), voir js/credits.js et data/credits.json
        (typeof creditHTML === 'function' ? creditHTML(project.image) : '');
    const card = document.createElement('a');
    // Tuile double (2 × 2) dans la mosaïque, à gauche ou à droite de son bloc.
    card.className = 'project-tile' + (size === 'large-left' ? ' project-tile--large project-tile--left'
        : size === 'large-right' ? ' project-tile--large project-tile--right'
        : (typeof size === 'string' && size.indexOf('fill-') === 0) ? ' project-tile--' + size : '');
    card.href = url;
    card.innerHTML = html;
    return card.outerHTML;
}

// Un projet marqué "draft": true dans projects.json est mis en pause : il
// reste dans le fichier (texte, photos, catégorie conservés) mais disparaît
// de la mosaïque, des filtres et du fond d'écran d'accueil. Utile pour un
// projet à publier plus tard sans avoir à ressaisir son contenu. Sa fiche
// individuelle (projet.html?id=...) reste consultable si on a le lien direct.
function publishedProjects() {
    if (!projectsData || !projectsData.projects) return [];
    return projectsData.projects.filter(function(p) { return !p.draft; });
}

function generateCategoryFilters() {
    if (!projectsData || !projectsData.categories) return '';
    const isEN = getLang() === 'EN';
    // On ne propose que les catégories qui ont au moins un projet publié,
    // sinon on se retrouve avec un filtre qui n'affiche jamais rien.
    const usedCategoryIds = {};
    publishedProjects().forEach(function(p) { usedCategoryIds[p.category] = true; });

    let html = '<button class="active" data-category="all">' + (isEN ? 'All' : 'Tous') + '</button>';
    projectsData.categories.forEach(function(cat) {
        if (!usedCategoryIds[cat.id]) return;
        const name = (isEN && cat.name_en) ? cat.name_en : cat.name;
        html += '<button data-category="' + cat.id + '">' + name + '</button>';
    });
    return html;
}

// Un projet publié SANS photo ("image" absent ou vide) n'apparaît pas dans la
// mosaïque mais dans la liste « Autres références » sous celle-ci : on peut
// ainsi citer une référence sans avoir de visuel.
function hasImage(project) {
    return !!project.image;
}

// Rythme de la mosaïque : blocs de 5 tuiles = 1 grande (2 × 2) + 4 petites,
// la grande alternant à gauche puis à droite (zigzag). Les grandes tuiles sont
// prises parmi les projets "tile": "large" (dans l'ordre de projects.json), les
// petites parmi les autres. Une grande tuile n'est placée que s'il reste au
// moins 4 petites pour compléter son bloc (sinon elle s'affiche en petit), ce
// qui évite les trous, y compris quand on filtre par catégorie.
function arrangeMosaic(projects) {
    const large = projects.filter(function(p) { return p.tile === 'large'; });
    const small = projects.filter(function(p) { return p.tile !== 'large'; });
    const out = [];
    let side = 'left';
    while (large.length && small.length >= 4) {
        out.push({ project: large.shift(), size: 'large-' + side });
        small.splice(0, 4).forEach(function(p) { out.push({ project: p, size: 'small' }); });
        side = (side === 'left') ? 'right' : 'left';
    }
    // Reste : grandes tuiles sans bloc complet + petites restantes, en petit.
    const rest = large.concat(small);
    rest.forEach(function(p) { out.push({ project: p, size: 'small' }); });
    // Dernière rangée incomplète (1 à 3 tuiles sur 4) : les tuiles s'élargissent
    // pour remplir la rangée plutôt que de laisser une tuile isolée.
    const tail = rest.length % 4;
    if (tail) {
        out.slice(out.length - tail).forEach(function(item, i) {
            item.size = 'fill-' + tail + '-' + (i + 1);
        });
    }
    return out;
}

function displayProjects(category) {
    let projects = publishedProjects();
    if (category !== 'all') {
        projects = projects.filter(function(p) { return p.category === category; });
    }

    // Il peut y avoir plusieurs conteneurs .projects-mosaic sur une même page
    // (un par bloc de langue .lang-fr / .lang-en) : on les met tous à jour.
    const cardsHTML = arrangeMosaic(projects.filter(hasImage)).map(function(item) {
        return generateProjectCard(item.project, item.size);
    }).join('');
    document.querySelectorAll('.projects-mosaic').forEach(function(container) {
        container.innerHTML = cardsHTML;
    });

    displayReferences(projects.filter(function(p) { return !hasImage(p); }));
}

// Liste « Autres références » : année, projet, lieu, mission. Le titre mène à
// la fiche du projet si elle a un texte de présentation.
function displayReferences(projects) {
    const sections = document.querySelectorAll('.projects-references');
    if (!sections.length) return;
    const isEN = getLang() === 'EN';
    sections.forEach(function(section) {
        const list = section.querySelector('.references-list');
        if (!list) return;
        list.innerHTML = '';
        section.style.display = projects.length ? '' : 'none';
        projects.forEach(function(project) {
            const pick = function(fr, en) { return (isEN && project[en]) ? project[en] : (project[fr] || ''); };
            const row = document.createElement('li');
            row.className = 'reference-row';

            const year = document.createElement('span');
            year.className = 'reference-year';
            year.textContent = pick('year', 'year_en');

            const titleText = pick('title', 'title_en');
            let title;
            if ((project.description || []).length) {
                title = document.createElement('a');
                title.href = PROJECTS_BASE_PATH + 'projets/projet.html?id=' + encodeURIComponent(project.id);
            } else {
                title = document.createElement('span');
            }
            title.className = 'reference-title';
            title.textContent = titleText;

            const location = document.createElement('span');
            location.className = 'reference-location';
            location.textContent = pick('location', 'location_en');

            const mission = document.createElement('span');
            mission.className = 'reference-mission';
            mission.textContent = pick('mission', 'mission_en');

            [year, title, location, mission].forEach(function(el) { row.appendChild(el); });
            list.appendChild(row);
        });
    });
}

function refreshFilters() {
    const filterBars = document.querySelectorAll('.projects-filters');
    if (!filterBars.length) return;
    const filtersHTML = generateCategoryFilters();
    filterBars.forEach(function(bar) {
        bar.innerHTML = filtersHTML;
    });
    initFilters();
}

function initFilters() {
    // Il peut y avoir plusieurs barres .projects-filters (une par langue)
    const filterBars = document.querySelectorAll('.projects-filters');
    filterBars.forEach(function(bar) {
        const filterButtons = bar.querySelectorAll('button');
        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                filterButtons.forEach(function(btn) { btn.classList.remove('active'); });
                button.classList.add('active');
                currentCategory = button.getAttribute('data-category');
                displayProjects(currentCategory);
            });
        });
    });
}

async function initProjects() {
    // Les crédits images (js/credits.js) doivent être chargés avant le rendu.
    await Promise.all([
        loadProjects(),
        typeof loadCredits === 'function' ? loadCredits() : Promise.resolve()
    ]);
    if (projectsData) {
        refreshFilters();
        displayProjects('all');
    }
}

// Se remettre à jour automatiquement quand la langue change (voir load-includes.js,
// qui déclenche cet événement dans saveLanguage()).
window.addEventListener('lang-changed', function() {
    if (!projectsData) return;
    refreshFilters();
    displayProjects(currentCategory);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
} else {
    initProjects();
}