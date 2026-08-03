// ===== SCRIPT POUR LE SITE LEF-T =====

// Liste des images de fond pour la page d'accueil avec leurs liens correspondants
const bgImages = [
    { src: 'assets/images/Couverture-ETFE_Villejuif.jpg', link: 'projets/projet-villejuif.html' },
    { src: 'assets/images/Urwaldhaus_Muncih.jpg', link: 'projets/projet-munich.html' },
    { src: 'assets/images/aquascope_Poitiers.jpg', link: 'projets/projet-poitiers.html' },
    { src: 'assets/images/newton_garching_coussins-ETFE.jpg', link: 'projets/projet-garching.html' },
];

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

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    setRandomBgImage();

    if (!document.body.classList.contains('home-page')) {
        initPageFeatures();
    }
    
    initLangDropdown();
});

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

// ===== MENU DÉROULANT DE LANGUE =====
function initLangDropdown() {
    const langDropdown = document.querySelector('.lang-dropdown');
    if (!langDropdown) return;
    
    const currentLang = getSavedLang() || 'FR';
    const currentLangEl = langDropdown.querySelector('.lang-current');
    
    if (currentLangEl) {
        currentLangEl.textContent = currentLang;
        currentLangEl.setAttribute('data-lang', currentLang);
    }
    
    const langOptions = langDropdown.querySelectorAll('.lang-menu a');
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const newLang = this.textContent.trim();
            saveLang(newLang);
            if (currentLangEl) {
                currentLangEl.textContent = newLang;
                currentLangEl.setAttribute('data-lang', newLang);
            }
            translatePage(newLang);
        });
    });
    
    translatePage(currentLang);
}

function saveLang(lang) {
    try {
        localStorage.setItem('lef-t-lang', lang);
    } catch (e) {
        console.log('Impossible de sauvegarder la langue:', e);
    }
}

function getSavedLang() {
    try {
        return localStorage.getItem('lef-t-lang');
    } catch (e) {
        console.log('Impossible de récupérer la langue:', e);
        return null;
    }
}

function translatePage(lang) {
    const translations = {
        'index': {
            'FR': { title: "LEF-T | Bureau d'Études Structure" },
            'EN': { title: "LEF-T | Structural Engineering Office" }
        },
        'bureau': {
            'FR': {
                title: "Notre bureau",
                about1: "<strong>LEF-T</strong> est un bureau d'études structure basé à Paris, au cœur du quartier dynamique de Belleville.",
                about2: "Spécialisés dans les <strong>structures légères et les façades</strong>, nous travaillons sur des projets innovants en France et en Allemagne.",
                about3: "Notre force réside dans notre capacité à <strong>concevoir des solutions sur-mesure</strong>.",
                about4: "Bien que petite structure, notre équipe est <strong>réactive, flexible et engagée</strong>.",
                team: "L'équipe",
                partners: "Partenaires"
            },
            'EN': {
                title: "Our Office",
                about1: "<strong>LEF-T</strong> is a structural engineering office based in Paris, in the heart of the dynamic Belleville district.",
                about2: "Specializing in <strong>lightweight structures and facades</strong>, we work on innovative projects in France and Germany.",
                about3: "Our strength lies in our ability to <strong>design tailor-made solutions</strong>.",
                about4: "Although a small structure, our team is <strong>responsive, flexible and committed</strong>.",
                team: "The Team",
                partners: "Partners"
            }
        },
        'projets': {
            'FR': { title: "Nos projets" },
            'EN': { title: "Our Projects" }
        },
        'contact': {
            'FR': { title: "Contact" },
            'EN': { title: "Contact" }
        },
        'legal': {
            'FR': { title: "Mentions légales" },
            'EN': { title: "Legal Notice" }
        },
        'charte-graphique': {
            'FR': { title: "Charte graphique et Logo" },
            'EN': { title: "Graphic Charter and Logo" }
        },
        'projet-villejuif': {
            'FR': { title: "Couverture ETFE - Villejuif", meta: "Villejuif, France | 2024" },
            'EN': { title: "ETFE Cover - Villejuif", meta: "Villejuif, France | 2024" }
        },
        'projet-munich': {
            'FR': { title: "Urwaldhaus - Munich", meta: "Munich, Allemagne | 2023" },
            'EN': { title: "Urwaldhaus - Munich", meta: "Munich, Germany | 2023" }
        },
        'projet-poitiers': {
            'FR': { title: "Aquascope - Poitiers", meta: "Poitiers, France | 2022" },
            'EN': { title: "Aquascope - Poitiers", meta: "Poitiers, France | 2022" }
        },
        'projet-garching': {
            'FR': { title: "Newton - Garching", meta: "Garching, Allemagne | 2025" },
            'EN': { title: "Newton - Garching", meta: "Garching, Germany | 2025" }
        },
        'projet-g1-rigidite': {
            'FR': { title: "G1 Proto LEICHT - Rigidité et stabilité" },
            'EN': { title: "G1 Proto LEICHT - Rigidity and Stability" }
        },
        'projet-g1-analyse-modale': {
            'FR': { title: "G1 Proto LEICHT - Analyse modale" },
            'EN': { title: "G1 Proto LEICHT - Modal Analysis" }
        },
        'projet-cargo-schwehhr': {
            'FR': { title: "Vélo cargo proto SCHWEHHR" },
            'EN': { title: "Cargo bike proto SCHWEHHR" }
        }
    };

    if (translations[getCurrentPage()]) {
        const pageTranslations = translations[getCurrentPage()][lang];
        if (pageTranslations) {
            applyTranslations(pageTranslations);
        }
    }
    
    updateLangClasses(lang);
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
        const partnersTitle = document.querySelectorAll('h2')[1];
        if (partnersTitle) partnersTitle.textContent = translations.partners;
    }
}