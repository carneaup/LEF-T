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
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=2.386474609375,48.86415795898437,2.406474609375,48.88415795898437&layer=mapnik&marker=48.87415795898437,2.396474609375';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        mapContainer.innerHTML = '';
        mapContainer.appendChild(iframe);
    }
}

function handleContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Merci pour votre message ! Nous vous répondrons rapidement.');
            form.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setRandomBgImage();
    if (!document.body.classList.contains('home-page')) {
        initMap();
        handleContactForm();
    }
});