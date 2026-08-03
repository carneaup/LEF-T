// ===== SCRIPT POUR LE SITE LEF-T =====

// Liste des images de fond pour la page d'accueil avec leurs liens correspondants
const bgImages = [
    { src: '/assets/images/Couverture-ETFE_Villejuif.jpg', link: 'projets/projet-villejuif.html' },
    { src: '/assets/images/Urwaldhaus_Muncih.jpg', link: 'projets/projet-munich.html' },
    { src: '/assets/images/aquascope_Poitiers.jpg', link: 'projets/projet-poitiers.html' },
    { src: '/assets/images/newton_garching_coussins-ETFE.jpg', link: 'projets/projet-garching.html' },
];

// Variable globale pour stocker les traductions
let translations = {};

// Sélection aléatoire d'une image pour la page d'accueil
function setRandomBgImage() {
    const bgElement = document.getElementById('bgImage');
    const bgLink = document.getElementById('bgLink');

    if (bgElement) {
        const randomIndex = Math.floor(Math.random() * bgImages.length);
        const randomImage = bgImages[randomIndex];

        bgElement.style.backgroundImage = `url(${randomImage.src}?${Date.now()})`;

        if (bgLink) {
            bgLink.href = randomImage.link;
        }
    }
}

// Charger les traductions depuis les fichiers JSON
async function loadTranslations() {
    try {
        const [frResponse, enResponse] = await Promise.all([
            fetch('/data/translations/fr.json'),
            fetch('/data/translations/en.json')
        ]);

        if (frResponse.ok && enResponse.ok) {
            translations.FR = await frResponse.json();
            translations.EN = await enResponse.json();
        }
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Obtenir la langue actuelle
function getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && ['FR', 'EN'].includes(urlLang)) {
        return urlLang;
    }

    const savedLang = localStorage.getItem('lef-t-lang');
    if (savedLang && ['FR', 'EN'].includes(savedLang)) {
        return savedLang;
    }

    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (browserLang === 'fr') return 'FR';
    if (browserLang === 'en') return 'EN';

    return 'FR';
}

// Sauvegarder la langue
function saveLanguage(lang) {
    localStorage.setItem('lef-t-lang', lang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
}

function updateLangClasses(lang) {
    document.body.classList.remove('lang-fr', 'lang-en');
    document.body.classList.add('lang-' + lang.toLowerCase());
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'index';
}

// Appliquer les traductions
function applyTranslations(translations) {
    if (translations.title) {
        const titleEl = document.querySelector('.page-title');
        if (titleEl) titleEl.textContent = translations.title;
        document.title = translations.title + ' | LEF-T';
    }

    if (translations.about1) {
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            const paragraphs = aboutText.querySelectorAll('p');
            if (paragraphs.length >= 4) {
                paragraphs[0].innerHTML = translations.about1;
                paragraphs[1].innerHTML = translations.about2;
                paragraphs[2].innerHTML = translations.about3;
                paragraphs[3].innerHTML = translations.about4;
            }
        }
    }

    if (translations.meta) {
        const metaEl = document.querySelector('.project-meta');
        if (metaEl) {
            const spans = metaEl.querySelectorAll('span');
            if (spans.length >= 2) {
                spans[0].textContent = translations.meta.split('|')[0].trim();
                spans[1].textContent = translations.meta.split('|')[1].trim();
            }
        }
    }

    if (translations.team) {
        const teamTitle = document.querySelector('h2');
        if (teamTitle && (teamTitle.textContent.includes('équipe') || teamTitle.textContent.includes('Team'))) {
            teamTitle.textContent = translations.team;
        }
    }

    if (translations.partners) {
        const allH2 = document.querySelectorAll('h2');
        if (allH2.length >= 2) {
            allH2[1].textContent = translations.partners;
        }
    }

    // Header
    if (translations.header?.nav) {
        const navLinks = document.querySelectorAll('.nav-main a');
        navLinks.forEach(link => {
            const key = link.getAttribute('data-i18n');
            if (key && translations.header.nav[key]) {
                link.textContent = translations.header.nav[key];
            }
        });
    }

    // Footer
    if (translations.footer) {
        const footerSpans = document.querySelectorAll('.footer-bottom span');
        if (footerSpans.length >= 2) {
            if (translations.footer.copyright) footerSpans[0].textContent = translations.footer.copyright;
            if (translations.footer.address) footerSpans[1].textContent = translations.footer.address;
        }

        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            const key = link.getAttribute('data-i18n');
            if (key && translations.footer[key]) {
                link.textContent = translations.footer[key];
            }
        });
    }

    // Tags
    if (translations.tags) {
        const tagButtons = document.querySelectorAll('.projects-filters button');
        tagButtons.forEach(button => {
            const tagKey = button.getAttribute('data-i18n') || button.textContent.trim().toLowerCase();
            if (translations.tags[tagKey]) {
                button.textContent = translations.tags[tagKey];
            }
        });
    }
}

function translatePage(lang) {
    const currentPage = getCurrentPage();
    const pageTranslations = translations[lang]?.[currentPage];

    if (pageTranslations) {
        applyTranslations(pageTranslations);
    }

    if (translations[lang]?.header) {
        applyTranslations({ header: translations[lang].header });
    }
    if (translations[lang]?.footer) {
        applyTranslations({ footer: translations[lang].footer });
    }
    if (translations[lang]?.tags) {
        applyTranslations({ tags: translations[lang].tags });
    }

    updateLangClasses(lang);
}

// Menu déroulant de langue
function initLangDropdown() {
    const langDropdown = document.querySelector('.lang-dropdown');
    if (!langDropdown) return;

    const currentLang = getCurrentLanguage();
    const currentLangEl = langDropdown.querySelector('.lang-current');

    if (currentLangEl) {
        currentLangEl.textContent = currentLang;
        currentLangEl.setAttribute('data-lang', currentLang);
    }

    const langOptions = langDropdown.querySelectorAll('.lang-menu a');
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const newLang = this.getAttribute('data-lang') || this.textContent.trim().toUpperCase();
            saveLanguage(newLang);
            if (currentLangEl) {
                currentLangEl.textContent = newLang;
                currentLangEl.setAttribute('data-lang', newLang);
            }
            translatePage(newLang);
        });
    });

    translatePage(currentLang);
}

// Fonctionnalités pour les pages standard
function initPageFeatures() {
    const filterButtons = document.querySelectorAll('.projects-filters button');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    initMap();
    handleContactForm();
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

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Charger les traductions
    loadTranslations().then(() => {
        setRandomBgImage();

        if (!document.body.classList.contains('home-page')) {
            initPageFeatures();
        }

        initLangDropdown();
    }).catch(error => {
        console.error('Error loading translations:', error);
        // Fallback: initialiser sans traductions
        setRandomBgImage();
        if (!document.body.classList.contains('home-page')) {
            initPageFeatures();
        }
        initLangDropdown();
    });
});