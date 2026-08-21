// ===== SCRIPT POUR LE SITE LEF-T =====

// Calcule le préfixe relatif vers la racine du site à partir du <script src="...">
// utilisé pour charger CE fichier (mêmes principes que dans load-includes.js).
function getScriptBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
        const src = s.getAttribute('src');
        if (src && /(^|\/)script\.js$/.test(src)) {
            return src.substring(0, src.length - 'script.js'.length);
        }
    }
    return '';
}
const SCRIPT_BASE_PATH = getScriptBasePath();

// Le fond tournant de la page d'accueil est piloté depuis data/projects.json :
// seuls les projets avec "featured": true y apparaissent. Pour changer la
// sélection, il suffit de modifier ce champ dans projects.json (pas besoin de
// toucher à ce fichier). Dépend de js/projects.js chargé avant ce script
// (loadProjects, projectsData).
async function setRandomBgImage() {
    const bgElement = document.getElementById('bgImage');
    const bgLink = document.getElementById('bgLink');
    if (!bgElement) return; // pas sur la page d'accueil

    await loadProjects();
    const featured = (projectsData && projectsData.projects)
        ? projectsData.projects.filter(function(p) { return p.featured; })
        : [];

    if (!featured.length) return; // aucun projet marqué "featured" : on garde le fond par défaut du HTML

    const chosen = featured[Math.floor(Math.random() * featured.length)];
    const src = chosen.heroImage || chosen.image;
    bgElement.style.backgroundImage = `url(${SCRIPT_BASE_PATH}${src}?${Date.now()})`;
    if (bgLink) bgLink.href = SCRIPT_BASE_PATH + 'projets/projet.html?id=' + encodeURIComponent(chosen.id);
}

function initMap() {
    // Il peut y avoir plusieurs conteneurs .map-container sur une même page
    // (un par bloc de langue .lang-fr / .lang-en) : on les remplit tous,
    // sinon celui du bloc caché au chargement (souvent l'anglais) reste vide.
    const mapContainers = document.querySelectorAll('.map-container');
    mapContainers.forEach(function(mapContainer) {
        const iframe = document.createElement('iframe');
        // Centré sur le 64 rue de Saintonge, 75003 Paris (adresse du bureau).
        iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=2.355124,48.853938,2.375124,48.873938&layer=mapnik&marker=48.863938,2.365124';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        mapContainer.innerHTML = '';
        mapContainer.appendChild(iframe);
    });
}

function handleContactForm() {
    // Idem : un formulaire par bloc de langue.
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const isEN = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'EN';
            alert(isEN
                ? 'Thank you for your message! We will reply shortly.'
                : 'Merci pour votre message ! Nous vous répondrons rapidement.');
            form.reset();
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setRandomBgImage();
    if (!document.body.classList.contains('home-page')) {
        initMap();
        handleContactForm();
    }
});