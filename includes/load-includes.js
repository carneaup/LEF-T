/**
 * Load Includes - Système de chargement des includes HTML
 * Version corrigée: utilise DOMParser pour la sécurité
 */

// Cache des includes déjà chargés
const includesCache = new Map();

// Mapping des IDs vers les chemins de fichiers
const idToPathMap = {
    'header': '/includes/header.html',
    'footer': '/includes/footer.html'
};

/**
 * Sanitize HTML content to prevent XSS
 */
function sanitizeHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove all script tags
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove event handlers from all elements
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
        ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'onsubmit'].forEach(attr => {
            el.removeAttribute(attr);
        });
    });
    
    return doc.body.innerHTML;
}

/**
 * Load an include file
 */
async function loadIncludeFile(path) {
    if (includesCache.has(path)) {
        return includesCache.get(path);
    }

    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Failed to load: ' + response.status);
        }
        let html = await response.text();
        html = sanitizeHTML(html);
        includesCache.set(path, html);
        return html;
    } catch (error) {
        console.error('Error loading ' + path + ':', error);
        return '<div style="padding: 10px; background: #fee; border: 1px solid #fcc; color: #c33;">Error loading include</div>';
    }
}

/**
 * Initialize all includes
 */
async function initIncludes() {
    // 1. Gère les éléments avec data-include
    const dataIncludeElements = document.querySelectorAll('[data-include]');
    
    for (let i = 0; i < dataIncludeElements.length; i++) {
        const el = dataIncludeElements[i];
        const path = el.getAttribute('data-include');
        if (path) {
            const html = await loadIncludeFile(path);
            el.innerHTML = html;
        }
    }
    
    // 2. Gère les éléments avec ID spécifique (header, footer)
    const headerEl = document.getElementById('header');
    const footerEl = document.getElementById('footer');
    
    if (headerEl) {
        const html = await loadIncludeFile('/includes/header.html');
        headerEl.innerHTML = html;
    }
    
    if (footerEl) {
        const html = await loadIncludeFile('/includes/footer.html');
        footerEl.innerHTML = html;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIncludes);
} else {
    initIncludes();
}