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

const bgImages = [
    { src: 'assets/images/Couverture-ETFE_Villejuif.jpg', link: 'projets/projet-villejuif.html' },
    { src: 'assets/images/Urwaldhaus_Muncih.jpg', link: 'projets/projet-munich.html' },
    { src: 'assets/images/aquascope_Poitiers.jpg', link: 'projets/projet-poitiers.html' },
    { src: 'assets/images/newton_garching_coussins-ETFE.jpg', link: 'projets/projet-garching.html' },
];

function setRandomBgImage() {
    const bgElement = document.getElementById('bgImage');
    const bgLink = document.getElementById('bgLink');
    if (bgElement) {
        const randomIndex = Math.floor(Math.random() * bgImages.length);
        const chosen = bgImages[randomIndex];
        bgElement.style.backgroundImage = `url(${SCRIPT_BASE_PATH}${chosen.src}?${Date.now()})`;
        if (bgLink) bgLink.href = SCRIPT_BASE_PATH + chosen.link;
    }
}

function initMap() {
    // Il peut y avoir plusieurs conteneurs .map-container sur une même page
    // (un par bloc de langue .lang-fr / .lang-en) : on les remplit tous,
    // sinon celui du bloc caché au chargement (souvent l'anglais) reste vide.
    const mapContainers = document.querySelectorAll('.map-container');
    mapContainers.forEach(function(mapContainer) {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=2.386474609375,48.86415795898437,2.406474609375,48.88415795898437&layer=mapnik&marker=48.87415795898437,2.396474609375';
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