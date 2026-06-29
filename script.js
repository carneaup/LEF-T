// ===== SCRIPT POUR LE SITE LEF-T =====

// Liste des images de fond pour la page d'accueil
const bgImages = [
    'assets/images/Couverture-ETFE_Villejuif.jpg',
    'assets/images/projets/Urwaldhaus_Muncih.jpg',
    'assets/images/projets/aquascope_Poitiers.jpg',
    'assets/images/projets/newton_garching_coussins-ETFE.jpg',
];

// Sélection aléatoire d'une image pour la page d'accueil
function setRandomBgImage() {
    const bgElement = document.getElementById('bgImage');
    if (bgElement) {
        const randomIndex = Math.floor(Math.random() * bgImages.length);
        const randomImage = bgImages[randomIndex];
        bgElement.style.backgroundImage = `url(${randomImage}?${Date.now()})`;
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    setRandomBgImage();

    if (!document.body.classList.contains('home-page')) {
        initPageFeatures();
    }
});

// Fonctionnalités pour les pages standard
function initPageFeatures() {
    // Filtres de projets
    const filterButtons = document.querySelectorAll('.projects-filters button');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Carte OpenStreetMap (Belleville, Paris)
    initMap();

    // Formulaire de contact
    handleContactForm();

    // Switcher de langue
    initLangSwitcher();
}

// Initialisation de la carte
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

// Formulaire de contact
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

// Switcher de langue
function initLangSwitcher() {
    const langLinks = document.querySelectorAll('.lang-switcher a');
    langLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            langLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}