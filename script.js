

// ============================================
// 🌍 LANGUAGE MANAGEMENT - Translation System
// ============================================

const translations = {
    fr: {
        // Titres de pages
        "LEF-T | Bureau d'Études Structure": "LEF-T | Bureau d'Études Structure",
        "Notre bureau": "Notre bureau",
        "Nos projets": "Nos projets",
        "Contactez-nous": "Contactez-nous",
        "Mentions légales": "Mentions légales",
        "Charte graphique": "Charte graphique",
        
        // Contenu Bureau
        "LEF-T est un bureau d'études structure": "LEF-T est un bureau d'études structure",
        "basé à Paris": "basé à Paris",
        "au cœur du quartier dynamique de Belleville": "au cœur du quartier dynamique de Belleville",
        "Fondé par un ingénieur allemand": "Fondé par un ingénieur allemand",
        "composé d'une équipe de jeunes talents": "composé d'une équipe de jeunes talents",
        "nous allions": "nous allions",
        "l'expertise technique": "l'expertise technique",
        "une approche agile et humaine": "une approche agile et humaine",
        "Spécialisés dans les": "Spécialisés dans les",
        "structures légères et les façades": "structures légères et les façades",
        "nous travaillons sur des projets innovants": "nous travaillons sur des projets innovants",
        "en France et en Allemagne": "en France et en Allemagne",
        "en collaboration avec notre partenaire": "en collaboration avec notre partenaire",
        "FTR à Rosenheim": "FTR à Rosenheim",
        "et un bureau tunisien": "et un bureau tunisien",
        "pour les tâches de dessin": "pour les tâches de dessin",
        "Notre force réside dans notre capacité": "Notre force réside dans notre capacité",
        "à concevoir des solutions sur-mesure": "à concevoir des solutions sur-mesure",
        "que ce soit pour des toiles tendues": "que ce soit pour des toiles tendues",
        "des charpentes bois": "des charpentes bois",
        "des structures pneumatiques": "des structures pneumatiques",
        "ou des projets de mobilité douce": "ou des projets de mobilité douce",
        "Nous croyons en l'innovation": "Nous croyons en l'innovation",
        "la durabilité": "la durabilité",
        "et la collaboration étroite": "et la collaboration étroite",
        "avec nos clients et partenaires": "avec nos clients et partenaires",
        
        // Contenu Projets
        "Nos projets": "Nos projets",
        "Filtrer par": "Filtrer par",
        
        // Contenu Contact
        "Contactez-nous": "Contactez-nous",
        "Envoyez-nous un message": "Envoyez-nous un message",
        "Nom": "Nom",
        "Email": "Email",
        "Message": "Message",
        "Envoyer": "Envoyer",
        
        // Footer
        "LEF-T &copy; 2026": "LEF-T &copy; 2026",
        "Privacy Policy": "Politique de confidentialité",
        
        // English translations
        "Home": "Accueil",
        "Projects": "Projets",
        "Office": "Bureau"
    },
    en: {
        // Titres de pages
        "LEF-T | Bureau d'Études Structure": "LEF-T | Structural Engineering Office",
        "Notre bureau": "Our Office",
        "Nos projets": "Our Projects",
        "Contactez-nous": "Contact Us",
        "Mentions légales": "Legal Notice",
        "Charte graphique": "Graphic Charter",
        
        // Contenu Bureau
        "LEF-T est un bureau d'études structure": "LEF-T is a structural engineering office",
        "basé à Paris": "based in Paris",
        "au cœur du quartier dynamique de Belleville": "in the heart of the dynamic Belleville district",
        "Fondé par un ingénieur allemand": "Founded by a German engineer",
        "composé d'une équipe de jeunes talents": "composed of a team of young talents",
        "nous allions": "we combine",
        "l'expertise technique": "technical expertise",
        "une approche agile et humaine": "an agile and human approach",
        "Spécialisés dans les": "Specializing in",
        "structures légères et les façades": "lightweight structures and facades",
        "nous travaillons sur des projets innovants": "we work on innovative projects",
        "en France et en Allemagne": "in France and Germany",
        "en collaboration avec notre partenaire": "in collaboration with our partner",
        "FTR à Rosenheim": "FTR in Rosenheim",
        "et un bureau tunisien": "and a Tunisian office",
        "pour les tâches de dessin": "for drafting tasks",
        "Notre force réside dans notre capacité": "Our strength lies in our ability",
        "à concevoir des solutions sur-mesure": "to design custom solutions",
        "que ce soit pour des toiles tendues": "whether for tensioned fabrics",
        "des charpentes bois": "timber frames",
        "des structures pneumatiques": "pneumatic structures",
        "ou des projets de mobilité douce": "or soft mobility projects",
        "Nous croyons en l'innovation": "We believe in innovation",
        "la durabilité": "sustainability",
        "et la collaboration étroite": "and close collaboration",
        "avec nos clients et partenaires": "with our clients and partners",
        
        // Contenu Projets
        "Nos projets": "Our Projects",
        "Filtrer par": "Filter by",
        
        // Contenu Contact
        "Contactez-nous": "Contact Us",
        "Envoyez-nous un message": "Send us a message",
        "Nom": "Name",
        "Email": "Email",
        "Message": "Message",
        "Envoyer": "Send",
        
        // Footer
        "LEF-T &copy; 2026": "LEF-T &copy; 2026",
        "Politique de confidentialité": "Privacy Policy",
        
        // French translations (reverse)
        "Accueil": "Home",
        "Projets": "Projects",
        "Bureau": "Office"
    }
};

/**
 * Change the language and apply translations
 * @param {string} lang - Language code ('fr' or 'en')
 */
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    document.getElementById('lang-current').textContent = lang.toUpperCase();
    applyTranslations(lang);
}

/**
 * Apply translations to all elements with data-translate attribute
 * @param {string} lang - Language code
 */
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Update page title
    const titleEl = document.querySelector('title');
    if (titleEl) {
        const titleKey = titleEl.textContent;
        if (translations[lang] && translations[lang][titleKey]) {
            titleEl.textContent = translations[lang][titleKey];
        }
    }
}

// Apply saved language on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'fr';
    if (document.getElementById('lang-current')) {
        document.getElementById('lang-current').textContent = savedLang.toUpperCase();
    }
    applyTranslations(savedLang);
});

// ============================================
