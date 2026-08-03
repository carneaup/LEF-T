/**
 * Load Includes + Traduction + Sélecteur de langue
 * Version finale - Tout en un seul fichier
 */

// Cache et traductions
const includesCache = new Map();
let translations = {};

// ===== TRADUCTION =====
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

function getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && ['FR', 'EN'].includes(urlLang)) return urlLang;

    const savedLang = localStorage.getItem('lef-t-lang');
    if (savedLang && ['FR', 'EN'].includes(savedLang)) return savedLang;

    const browserLang = navigator.language.split('-')[0].toLowerCase();
    return browserLang === 'fr' ? 'FR' : browserLang === 'en' ? 'EN' : 'FR';
}

function saveLanguage(lang) {
    localStorage.setItem('lef-t-lang', lang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
    window.location.reload(); // Recharge pour appliquer
}

// Traduire un élément
function translateElement(element, lang, keyPath) {
    const keys = keyPath.split('.');
    let value = translations[lang];
    for (const k of keys) {
        if (!value) break;
        value = value[k];
    }
    if (value && element) {
        element.textContent = value;
    }
}

// ===== SÉLECTEUR DE LANGUE =====
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
        });
    });
}

// ===== CHARGEMENT DES INCLUDES =====
function sanitizeHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('script').forEach(script => script.remove());
    doc.querySelectorAll('*').forEach(el => {
        ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'onsubmit']
            .forEach(attr => el.removeAttribute(attr));
    });
    return doc.body.innerHTML;
}

async function loadIncludeFile(path) {
    if (includesCache.has(path)) return includesCache.get(path);
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Failed to load: ' + response.status);
        let html = await response.text();
        includesCache.set(path, sanitizeHTML(html));
        return includesCache.get(path);
    } catch (error) {
        console.error('Error loading ' + path + ':', error);
        return '<div style="padding:10px;background:#fee;border:1px solid #fcc;color:#c33;">Error loading include</div>';
    }
}

// ===== INITIALISATION =====
async function initIncludes() {
    // Charger traductions
    await loadTranslations();

    // Charger includes
    const dataIncludeElements = document.querySelectorAll('[data-include]');
    for (const el of dataIncludeElements) {
        const path = el.getAttribute('data-include');
        if (path) el.innerHTML = await loadIncludeFile(path);
    }

    // Header
    const headerEl = document.getElementById('header');
    if (headerEl) {
        headerEl.innerHTML = await loadIncludeFile('/includes/header.html');
        // Traduire header
        const lang = getCurrentLanguage();
        document.querySelectorAll('.nav-main a[data-i18n]').forEach(link => {
            const key = link.getAttribute('data-i18n').split('.').pop();
            translateElement(link, lang, `header.nav.${key}`);
        });
        // Initialiser sélecteur de langue
        initLangDropdown();
    }

    // Footer
    const footerEl = document.getElementById('footer');
    if (footerEl) {
        footerEl.innerHTML = await loadIncludeFile('/includes/footer.html');
        // Traduire footer
        const lang = getCurrentLanguage();
        document.querySelectorAll('.footer-bottom span[data-i18n], .footer-links a[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n').split('.').pop();
            const type = el.tagName === 'A' ? 'footer' : 'footer';
            translateElement(el, lang, `${type}.${key}`);
        });
    }
}

// Démarrer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIncludes);
} else {
    initIncludes();
}