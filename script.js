/**
 * LEF-T - Scripts principaux
 * Gestion du défilement aléatoire des images, carte OSM, formulaire de contact
 */

// ============================================
// Défilement aléatoire des images sur l'accueil
// ============================================

// Images pour le défilement aléatoire
const randomImages = [
    'https://via.placeholder.com/400x300/0056A3/FFFFFF?text=Projet+1',
    'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Projet+2',
    'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=Projet+3',
    'https://via.placeholder.com/400x300/0056A3/FFFFFF?text=Projet+4',
    'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Projet+5',
    'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=Projet+6',
    'https://via.placeholder.com/400x300/0056A3/FFFFFF?text=Membrane',
    'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Bois',
    'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=Façade',
    'https://via.placeholder.com/400x300/0056A3/FFFFFF?text=Mobilité'
];

const projectNames = [
    'Centre culturel de Belleville',
    'Passarelle piétonne',
    'Toiture membrane',
    'Structure bois',
    'Façade innovante',
    'Piste cyclable',
    'Canopée urbaine',
    'Pont suspendu',
    'Amphithéâtre',
    'Gare multimodale'
];

// Fonction pour créer une carte projet aléatoire
function createRandomProjectCard() {
    const randomIndex = Math.floor(Math.random() * randomImages.length);
    const imageUrl = randomImages[randomIndex];
    const projectName = projectNames[randomIndex];
    
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    card.innerHTML = `
        <img src="${imageUrl}" alt="${projectName}" loading="lazy">
        <h3>${projectName}</h3>
    `;
    return card;
}

// Initialisation du défilement aléatoire
function initRandomImages() {
    const container = document.getElementById('random-images-container');
    if (!container) return;

    // Vider le conteneur
    container.innerHTML = '';
    
    // Ajouter 3 cartes aléatoires
    for (let i = 0; i < 3; i++) {
        container.appendChild(createRandomProjectCard());
    }
    
    // Changer les images toutes les 5 secondes
    setInterval(() => {
        container.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            container.appendChild(createRandomProjectCard());
        }
    }, 5000);
}

// ============================================
// Carte OpenStreetMap
// ============================================

let map;
let marker;

// Coordonnées de Belleville, Paris
const bellevilleCoords = [48.8667, 2.3789];

// Initialisation de la carte
function initMap() {
    // Vérifier si l'élément map existe
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Charger OpenStreetMap via Leaflet
    if (typeof L !== 'undefined') {
        // Si Leaflet est déjà chargé
        createMap();
    } else {
        // Charger Leaflet dynamiquement
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = createMap;
        document.head.appendChild(script);
    }
}

function createMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Initialiser la carte
    map = L.map('map').setView(bellevilleCoords, 15);
    
    // Ajouter le layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Ajouter un marqueur pour LEF-T
    marker = L.marker(bellevilleCoords).addTo(map)
        .bindPopup('LEF-T Ingénierie<br>123 Rue de Belleville<br>75020 Paris')
        .openPopup();
    
    // Ajuster la taille de la carte
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// ============================================
// Formulaire de contact
// ============================================

// Validation du formulaire
function validateContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les champs
        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const phone = form.querySelector('input[name="phone"]');
        const subject = form.querySelector('select[name="subject"]');
        const message = form.querySelector('textarea[name="message"]');
        
        // Validation
        let isValid = true;
        
        if (!name.value.trim()) {
            showError(name, 'Veuillez entrer votre nom');
            isValid = false;
        } else {
            clearError(name);
        }
        
        if (!email.value.trim()) {
            showError(email, 'Veuillez entrer votre email');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showError(email, 'Veuillez entrer un email valide');
            isValid = false;
        } else {
            clearError(email);
        }
        
        if (!subject.value) {
            showError(subject, 'Veuillez sélectionner un sujet');
            isValid = false;
        } else {
            clearError(subject);
        }
        
        if (!message.value.trim()) {
            showError(message, 'Veuillez entrer votre message');
            isValid = false;
        } else {
            clearError(message);
        }
        
        if (isValid) {
            // Soumettre le formulaire
            submitForm(form);
        }
    });
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.style.cssText = 'color: #ff4444; font-size: 0.85rem; margin-top: 0.25rem; display: block;';
        formGroup.appendChild(error);
    }
    
    const error = formGroup.querySelector('.error-message');
    error.textContent = message;
    field.style.borderColor = '#ff4444';
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        formGroup.removeChild(errorElement);
    }
    field.style.borderColor = '#ddd';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function submitForm(form) {
    // Simuler l'envoi du formulaire
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simulation de l'envoi
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Afficher un message de succès
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.style.cssText = 'padding: 1rem; background-color: #d4edda; color: #155724; border-radius: 4px; margin-top: 1rem; text-align: center;';
        successMessage.textContent = 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
        
        form.appendChild(successMessage);
        form.reset();
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            form.removeChild(successMessage);
        }, 5000);
    }, 1500);
}

// ============================================
// Filtres de projets
// ============================================

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-full');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    // Ajouter des catégories aux cartes de projets (si ce n'est pas déjà fait)
    projectCards.forEach((card, index) => {
        const categories = ['Tous', 'Membranes', 'Bois', 'Façades', 'Mobilités douces'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        card.dataset.category = randomCategory.toLowerCase().replace(' ', '-');
    });
    
    // Gestion des clics sur les filtres
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // Filtrer les projets
            projectCards.forEach(card => {
                if (filter === 'tous' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// Animations au défilement
// ============================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .project-card-full, .team-member, .partner-card, .fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Pour les éléments qui ont déjà la classe fade-in, on ajoute une classe supplémentaire
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        // Initialiser l'état
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// Menu mobile (si nécessaire)
// ============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
}

// ============================================
// Initialisation au chargement de la page
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les fonctionnalités
    initRandomImages();
    initMap();
    validateContactForm();
    initProjectFilters();
    initScrollAnimations();
    initMobileMenu();
    
    // Ajouter un délai pour les animations initiales
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ============================================
// Gestion du chargement différé des images
// ============================================

// Lazy loading pour les images
if ('loading' in HTMLImageElement.prototype) {
    // Le lazy loading natif est supporté
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
} else {
    // Fallback pour les navigateurs qui ne supportent pas le lazy loading natif
    const lazyLoadScript = document.createElement('script');
    lazyLoadScript.src = 'https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.3.1/dist/lazyload.min.js';
    document.body.appendChild(lazyLoadScript);
    
    lazyLoadScript.onload = () => {
        const lazyLoadInstance = new LazyLoad({
            elements_selector: 'img[loading="lazy"]'
        });
    };
}

// ============================================
// Fonctions utilitaires
// ============================================

// Debounce function pour les événements de défilement
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// Export pour les modules (si nécessaire)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initRandomImages,
        initMap,
        validateContactForm,
        initProjectFilters,
        initScrollAnimations,
        initMobileMenu
    };
}
