/**
 * Projects Manager - Gestion dynamique des projets
 */

let projectsData = null;
let currentCategory = 'all';

// Calcule le préfixe relatif vers la racine du site à partir du <script src="...">
// utilisé pour charger CE fichier (mêmes principes que dans load-includes.js).
function getBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
        const src = s.getAttribute('src');
        if (src && src.indexOf('js/projects.js') !== -1) {
            return src.substring(0, src.indexOf('js/projects.js'));
        }
    }
    return '';
}
const BASE_PATH = getBasePath();

// Langue courante : réutilise getCurrentLanguage() défini dans load-includes.js
// (chargé avant ce script). Filet de sécurité si jamais l'ordre change.
function getLang() {
    if (typeof getCurrentLanguage === 'function') return getCurrentLanguage();
    return 'FR';
}

async function loadProjects() {
    try {
        const response = await fetch(BASE_PATH + 'data/projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        projectsData = await response.json();
        return projectsData;
    } catch (error) {
        console.error('Error loading projects:', error);
        return null;
    }
}

function generateProjectCard(project) {
    const isEN = getLang() === 'EN';
    const image = BASE_PATH + project.image;
    const url = BASE_PATH + project.url;
    const title = (isEN && project.title_en) ? project.title_en : project.title;
    const location = (isEN && project.location_en) ? project.location_en : project.location;

    const html = '<img src="' + image + '" alt="' + title + '" loading="lazy">' +
        '<div class="project-tile-overlay">' +
        '<h3>' + title + '</h3>' +
        '<p>' + location + ' - ' + project.year + '</p>' +
        '</div>';
    const card = document.createElement('a');
    card.className = 'project-tile';
    card.href = url;
    card.innerHTML = html;
    return card.outerHTML;
}

function generateCategoryFilters() {
    if (!projectsData || !projectsData.categories) return '';
    const isEN = getLang() === 'EN';
    let html = '<button class="active" data-category="all">' + (isEN ? 'All' : 'Tous') + '</button>';
    projectsData.categories.forEach(function(cat) {
        const name = (isEN && cat.name_en) ? cat.name_en : cat.name;
        html += '<button data-category="' + cat.id + '">' + name + '</button>';
    });
    return html;
}

function displayProjects(category) {
    if (!projectsData || !projectsData.projects) return;
    // Il peut y avoir plusieurs conteneurs .projects-mosaic sur une même page
    // (un par bloc de langue .lang-fr / .lang-en) : on les met tous à jour.
    const containers = document.querySelectorAll('.projects-mosaic');
    if (!containers.length) return;
    let projects = projectsData.projects;
    if (category !== 'all') {
        projects = projects.filter(function(p) { return p.category === category; });
    }
    const cardsHTML = projects.map(generateProjectCard).join('');
    containers.forEach(function(container) {
        container.innerHTML = cardsHTML;
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
    await loadProjects();
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