/**
 * Load Includes - Charge les includes et gère les blocs de langue
 */

// Cache des includes
const includesCache = new Map();

// Variable GLOBALE pour les traductions
window.translations = {};

// ===== 1. CHARGEMENT DES TRADUCTIONS =====
async function loadTranslations() {
    try {
        const [frResponse, enResponse] = await Promise.all([
            fetch('/data/translations/fr.json'),
            fetch('/data/translations/en.json')
        ]);
        if (frResponse.ok && enResponse.ok) {
            window.translations.FR = await frResponse.json();
            window.translations.EN = await enResponse.json();
        }
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// ===== 2. GESTION DE LA LANGUE =====
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
    
    // Appliquer les blocs de langue
    applyLanguageBlocks(lang);
    
    // Re-traduire header et footer
    translateHeader();
    translateFooter();
}

// ===== 3. APPLY LANGUAGE BLOCKS =====
function applyLanguageBlocks(lang) {
    document.querySelectorAll('.lang-block').forEach(block => {
        block.style.display = block.classList.contains('lang-' + lang.toLowerCase())
            ? ''
            : 'none';
    });
}

// ===== 4. SANITIZE HTML =====
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

// ===== 5. CHARGEMENT DES INCLUDES =====
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

// ===== 6. TRADUCTION =====
function translateElement(element, lang, keyPath) {
    const keys = keyPath.split('.');
    let value = window.translations[lang];
    for (const k of keys) {
        if (!value) break;
        value = value[k];
    }
    if (value && element) {
        element.textContent = value;
    }
}

function translateHeader() {
    const lang = getCurrentLanguage();
    if (!window.translations[lang]?.header?.nav) return;
    
    const navLinks = document.querySelectorAll('.nav-main a[data-i18n]');
    navLinks.forEach(link => {
        const key = link.getAttribute('data-i18n').split('.').pop();
        translateElement(link, lang, 'header.nav.' + key);
    });
}

function translateFooter() {
    const lang = getCurrentLanguage();
    if (!window.translations[lang]?.footer) return;
    
    const footerSpans = document.querySelectorAll('.footer-bottom span[data-i18n]');
    footerSpans.forEach(span => {
        const key = span.getAttribute('data-i18n').split('.').pop();
        translateElement(span, lang, 'footer.' + key);
    });
    
    const footerLinks = document.querySelectorAll('.footer-links a[data-i18n]');
    footerLinks.forEach(link => {
        const key = link.getAttribute('data-i18n').split('.').pop();
        translateElement(link, lang, 'footer.' + key);
    });
}

// ===== 7. INITIALISATION =====
async function initIncludes() {
    // 1. Charger les traductions
    await loadTranslations();

    // 2. Charger header et footer
    const headerEl = document.getElementById('header') || document.querySelector('header');
    if (headerEl) {
        headerEl.innerHTML = await loadIncludeFile('/includes/header.html');
    }

    const footerEl = document.getElementById('footer') || document.querySelector('footer');
    if (footerEl) {
        footerEl.innerHTML = await loadIncludeFile('/includes/footer.html');
    }

    // 3. Charger les autres includes
    const dataIncludeElements = document.querySelectorAll('[data-include]');
    for (const el of dataIncludeElements) {
        const path = el.getAttribute('data-include');
        if (path) el.innerHTML = await loadIncludeFile(path);
    }

    // 4. Traduire header et footer
    translateHeader();
    translateFooter();

    // 5. Appliquer les blocs de langue (APRÈS tout le reste)
    const currentLang = getCurrentLanguage();
    applyLanguageBlocks(currentLang);
}

// ===== 8. LANG DROPDOWN =====
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

// Démarrer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initIncludes().then(initLangDropdown);
    });
} else {
    initIncludes().then(initLangDropdown);
}