/**
 * Project Detail - Affiche une page projet unique (projets/projet.html?id=...)
 * à partir de data/projects.json. Une seule page HTML sert tous les projets :
 * ajouter ou retirer un projet ne demande plus de créer/supprimer de fichier,
 * juste d'éditer projects.json.
 *
 * Dépend de js/projects.js chargé avant ce fichier (loadProjects, getLang,
 * projectsData).
 */

// Calcule le préfixe relatif vers la racine du site à partir du <script src="...">
// utilisé pour charger CE fichier (mêmes principes que dans load-includes.js et
// js/projects.js : un nom de const dédié pour éviter tout conflit de déclaration
// entre scripts chargés sur la même page).
function getProjectDetailBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
        const src = s.getAttribute('src');
        if (src && src.indexOf('js/project-detail.js') !== -1) {
            return src.substring(0, src.indexOf('js/project-detail.js'));
        }
    }
    return '';
}
const PROJECT_DETAIL_BASE_PATH = getProjectDetailBasePath();

function getProjectIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Affiché si l'id dans l'URL ne correspond à aucun projet (lien cassé, faute de
// frappe dans un lien, projet supprimé de projects.json...). Le site continue de
// fonctionner normalement au lieu d'afficher une page blanche ou une erreur JS.
function showProjectNotFound() {
    const main = document.querySelector('.project-page');
    if (!main) return;
    const isEN = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'EN';
    main.innerHTML = '<div class="project-content">' +
        '<h1>' + (isEN ? 'Project not found' : 'Projet introuvable') + '</h1>' +
        '<p>' + (isEN
            ? 'This project does not exist or has been removed.'
            : "Ce projet n'existe pas ou a été retiré.") + '</p>' +
        '<p><a href="' + PROJECT_DETAIL_BASE_PATH + 'pages/projets.html" class="download-button">' +
        (isEN ? 'Back to projects' : 'Retour aux projets') + '</a></p>' +
        '</div>';
}

function renderProjectDetail(project) {
    const isEN = getLang() === 'EN';
    const title = (isEN && project.title_en) ? project.title_en : project.title;
    const location = (isEN && project.location_en) ? project.location_en : project.location;
    const paragraphs = (isEN && project.description_en && project.description_en.length)
        ? project.description_en
        : (project.description || []);

    document.title = title + ' - LEF-T';

    const headerImg = document.getElementById('projectHeaderImage');
    if (headerImg && project.image) {
        headerImg.style.backgroundImage = "url('" + PROJECT_DETAIL_BASE_PATH + project.image + "')";
    }

    const titleEl = document.getElementById('projectTitle');
    if (titleEl) titleEl.textContent = title || '';

    const locationEl = document.getElementById('projectLocation');
    if (locationEl) locationEl.textContent = location || '';

    const yearEl = document.getElementById('projectYear');
    if (yearEl) yearEl.textContent = project.year || '';

    const contentEl = document.getElementById('projectContent');
    if (contentEl) {
        contentEl.innerHTML = '';
        paragraphs.forEach(function(text) {
            const p = document.createElement('p');
            p.textContent = text;
            contentEl.appendChild(p);
        });
    }

    const galleryEl = document.getElementById('projectGallery');
    if (galleryEl) {
        galleryEl.innerHTML = '';
        const images = project.gallery || [];
        images.forEach(function(src, index) {
            const img = document.createElement('img');
            img.src = PROJECT_DETAIL_BASE_PATH + src;
            img.alt = (title || '') + ' – photo ' + (index + 1);
            img.loading = 'lazy';
            galleryEl.appendChild(img);
        });
    }
}

async function initProjectDetail() {
    // Ne rien faire si ce script est chargé sur une page qui n'est pas projet.html.
    if (!document.querySelector('.project-page')) return;

    try {
        const id = getProjectIdFromURL();
        await loadProjects(); // défini dans js/projects.js, remplit projectsData

        const project = (projectsData && projectsData.projects)
            ? projectsData.projects.find(function(p) { return p.id === id; })
            : null;

        if (!id || !project) {
            console.warn('LEF-T: no project found for id "' + id + '"');
            showProjectNotFound();
            return;
        }

        renderProjectDetail(project);

        // Se remettre à jour quand la langue change (déclenché par load-includes.js).
        window.addEventListener('lang-changed', function() {
            renderProjectDetail(project);
        });
    } catch (error) {
        console.error('Error rendering project detail:', error);
        showProjectNotFound();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectDetail);
} else {
    initProjectDetail();
}
