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
// (flèches gauche/droite, Échap) et par les boutons prev/next. La photo principale
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
    const creditEl = document.getElementById('lightboxCredit');
    if (creditEl) creditEl.textContent = entry.credit ? '© ' + entry.credit : '';
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

function imageCreditOf(path) {
    return typeof getImageCredit === 'function' ? getImageCredit(path) : null;
}

// Crée une image cliquable (ouvre la lightbox) avec son crédit « © Auteur »,
// et l'ajoute à la liste navigable de la lightbox.
function buildProjectImage(src, alt, eager) {
    const fullSrc = PROJECT_DETAIL_BASE_PATH + src;
    const img = document.createElement('img');
    img.src = fullSrc;
    img.alt = alt;
    if (!eager) img.loading = 'lazy';
    const index = lightboxImages.length;
    lightboxImages.push({ src: fullSrc, alt: alt, credit: imageCreditOf(src) });
    img.addEventListener('click', function() { openLightbox(index); });
    return img;
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

    // Liste d'images navigables dans la lightbox : la photo principale puis
    // toutes les photos de la galerie, dans l'ordre de la page.
    lightboxImages = [];

    const coverEl = document.getElementById('projectCover');
    if (coverEl) {
        coverEl.innerHTML = '';
        if (project.image) {
            coverEl.appendChild(buildProjectImage(project.image, title || '', true));
            const credit = typeof createCreditElement === 'function' ? createCreditElement(project.image) : null;
            if (credit) coverEl.appendChild(credit);
        }
    }

    const titleEl = document.getElementById('projectTitle');
    if (titleEl) titleEl.textContent = title || '';

    const locationEl = document.getElementById('projectLocation');
    if (locationEl) locationEl.textContent = location || '';

    // "year_en" (optionnel) : pour une année non numérique, ex. "En cours" / "Ongoing"
    const yearEl = document.getElementById('projectYear');
    if (yearEl) yearEl.textContent = ((isEN && project.year_en) ? project.year_en : project.year) || '';

    const contentEl = document.getElementById('projectContent');
    if (contentEl) {
        contentEl.innerHTML = '';
        paragraphs.forEach(function(text) {
            const p = document.createElement('p');
            p.textContent = text;
            contentEl.appendChild(p);
        });
    }

    // Fiche technique : liste label / valeur (<dl>) dans la colonne de texte.
    const factsEl = document.getElementById('projectFacts');
    if (factsEl) {
        factsEl.innerHTML = '';
        const baseFacts = project.facts || null;
        if (baseFacts) {
            const overrides = (isEN && project.facts_en) ? project.facts_en : {};
            const labels = isEN
                ? { address: 'Address', client: 'Client', architect: 'Architect', surface: 'Area', cost: 'Cost' }
                : { address: 'Adresse', client: "Maître d'ouvrage", architect: 'Architecte', surface: 'Surface', cost: 'Coût' };
            const order = ['client', 'architect', 'address', 'surface', 'cost'];
            order.forEach(function(key) {
                const value = overrides[key] || baseFacts[key];
                if (!value) return;
                const item = document.createElement('div');
                item.className = 'project-fact';
                const label = document.createElement('dt');
                label.className = 'project-fact-label';
                label.textContent = labels[key];
                const val = document.createElement('dd');
                val.className = 'project-fact-value';
                val.textContent = value;
                item.appendChild(label);
                item.appendChild(val);
                factsEl.appendChild(item);
            });
        }
    }

    const galleryEl = document.getElementById('projectGallery');
    if (galleryEl) {
        galleryEl.innerHTML = '';
        (project.gallery || []).forEach(function(src, index) {
            // Chaque photo est dans un <figure> pour superposer son crédit.
            const figure = document.createElement('figure');
            figure.className = 'gallery-item';
            figure.appendChild(buildProjectImage(src, (title || '') + ' – photo ' + (index + 2), false));
            const credit = typeof createCreditElement === 'function' ? createCreditElement(src) : null;
            if (credit) figure.appendChild(credit);
            galleryEl.appendChild(figure);
        });
    }

    // Projet sans aucune photo (référence) : texte sur une seule colonne.
    const layoutEl = document.querySelector('.project-layout');
    if (layoutEl) {
        const noPhoto = !project.image && !(project.gallery || []).length;
        layoutEl.classList.toggle('project-layout--text-only', noPhoto);
    }

    renderProjectNavigation(project, isEN);
}

// ===== Suite de navigation en bas de page =====
// - Projet précédent / suivant parmi les projets publiés (ordre de
//   projects.json, en boucle) ;
// - « Autres projets » : 3 vignettes, en priorité de la même catégorie,
//   complétées par d'autres projets si besoin.
function renderProjectNavigation(project, isEN) {
    // Seuls les projets qui ont une fiche à montrer (photo ou texte) : une
    // simple ligne de référence sans description n'a pas de page à ouvrir.
    const published = ((typeof publishedProjects === 'function') ? publishedProjects() : [])
        .filter(function(p) { return p.image || (p.description || []).length; });
    // Les autres projets, en commençant par ceux qui suivent le projet courant :
    // les suggestions varient ainsi d'une page à l'autre.
    const start = published.findIndex(function(p) { return p.id === project.id; }) + 1;
    const others = published.slice(start).concat(published.slice(0, start))
        .filter(function(p) { return p.id !== project.id; });

    const pagerEl = document.getElementById('projectPager');
    if (pagerEl) {
        pagerEl.innerHTML = '';
        if (others.length) {
            // Pour un brouillon (absent de la liste publiée), on part du début.
            const index = published.findIndex(function(p) { return p.id === project.id; });
            const prev = index === -1 ? published[published.length - 1] : published[(index - 1 + published.length) % published.length];
            const next = index === -1 ? published[0] : published[(index + 1) % published.length];
            [
                { p: prev, cls: 'project-pager-prev', label: isEN ? 'Previous project' : 'Projet précédent' },
                { p: next, cls: 'project-pager-next', label: isEN ? 'Next project' : 'Projet suivant' }
            ].forEach(function(entry) {
                const a = document.createElement('a');
                a.className = entry.cls;
                a.href = PROJECT_DETAIL_BASE_PATH + 'projets/projet.html?id=' + encodeURIComponent(entry.p.id);
                const small = document.createElement('span');
                small.className = 'project-pager-label';
                small.textContent = entry.label;
                const name = document.createElement('span');
                name.className = 'project-pager-title';
                name.textContent = (isEN && entry.p.title_en) ? entry.p.title_en : entry.p.title;
                a.appendChild(small);
                a.appendChild(name);
                pagerEl.appendChild(a);
            });
        }
    }

    const relatedEl = document.getElementById('projectRelated');
    const gridEl = document.getElementById('projectRelatedGrid');
    const relTitleEl = document.getElementById('projectRelatedTitle');
    if (relatedEl && gridEl) {
        // Vignettes : uniquement des projets avec photo.
        const withImage = others.filter(function(p) { return !!p.image; });
        const sameCat = withImage.filter(function(p) { return p.category === project.category; });
        const rest = withImage.filter(function(p) { return p.category !== project.category; });
        const picks = sameCat.concat(rest).slice(0, 3);
        relatedEl.style.display = picks.length ? '' : 'none';
        if (relTitleEl) relTitleEl.textContent = isEN ? 'Other projects' : 'Autres projets';
        gridEl.innerHTML = (typeof generateProjectCard === 'function')
            ? picks.map(generateProjectCard).join('')
            : '';
    }
}

async function initProjectDetail() {
    // Ne rien faire si ce script est chargé sur une page qui n'est pas projet.html.
    if (!document.querySelector('.project-page')) return;

    try {
        const id = getProjectIdFromURL();
        await loadProjects(); // défini dans js/projects.js, remplit projectsData
        if (typeof loadCredits === 'function') await loadCredits(); // js/credits.js

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
