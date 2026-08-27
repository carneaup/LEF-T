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

// ===== Lightbox : ouvre les images de la page projet en grand, à leur taille
// réelle (pas d'agrandissement au-delà de la taille naturelle de l'image,
// juste une réduction si besoin pour tenir dans l'écran). Navigable au clavier
// (flèches gauche/droite, Échap) et par les boutons prev/next. L'image d'en-tête
// et toutes les photos de la galerie partagent une seule liste navigable, dans
// l'ordre où elles apparaissent sur la page.
let lightboxImages = [];
let lightboxIndex = 0;

function showLightboxImage(index) {
    if (!lightboxImages.length) return;
    lightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
    const entry = lightboxImages[lightboxIndex];
    const imgEl = document.getElementById('lightboxImage');
    if (imgEl) {
        imgEl.src = entry.src;
        imgEl.alt = entry.alt;
    }
    const multi = lightboxImages.length > 1;
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    if (prevBtn) prevBtn.style.display = multi ? '' : 'none';
    if (nextBtn) nextBtn.style.display = multi ? '' : 'none';
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    showLightboxImage(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function() { showLightboxImage(lightboxIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { showLightboxImage(lightboxIndex + 1); });

    // Clic sur le fond sombre (en dehors de l'image et des boutons) : ferme.
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showLightboxImage(lightboxIndex - 1);
        else if (e.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1);
    });
}

function renderProjectDetail(project) {
    const isEN = getLang() === 'EN';
    const title = (isEN && project.title_en) ? project.title_en : project.title;
    const location = (isEN && project.location_en) ? project.location_en : project.location;
    const paragraphs = (isEN && project.description_en && project.description_en.length)
        ? project.description_en
        : (project.description || []);

    document.title = title + ' - LEF-T';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && paragraphs.length) {
        const firstParagraph = paragraphs[0];
        const summary = firstParagraph.length > 155 ? firstParagraph.slice(0, 152) + '…' : firstParagraph;
        metaDesc.setAttribute('content', summary);
    }

    // Reconstruit la liste d'images navigables dans la lightbox : l'en-tête
    // (si présente) puis toutes les photos de la galerie, dans l'ordre.
    lightboxImages = [];

    const headerImg = document.getElementById('projectHeaderImage');
    if (headerImg && project.image) {
        const headerSrc = PROJECT_DETAIL_BASE_PATH + project.image;
        headerImg.style.backgroundImage = "url('" + headerSrc + "')";
        headerImg.classList.add('is-clickable');
        const headerImageIndex = lightboxImages.length;
        lightboxImages.push({ src: headerSrc, alt: title || '' });
        headerImg.onclick = function() { openLightbox(headerImageIndex); };
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
            const fullSrc = PROJECT_DETAIL_BASE_PATH + src;
            const alt = (title || '') + ' – photo ' + (index + 1);
            const img = document.createElement('img');
            img.src = fullSrc;
            img.alt = alt;
            img.loading = 'lazy';
            const galleryImageIndex = lightboxImages.length;
            lightboxImages.push({ src: fullSrc, alt: alt });
            img.addEventListener('click', function() { openLightbox(galleryImageIndex); });
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
        initLightbox();

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
