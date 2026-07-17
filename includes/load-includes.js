/**
 * Load Includes - Système de chargement des includes HTML
 * Version corrigée: gère [data-include] ET les IDs spécifiques
 */

// Cache des includes déjà chargés
const includesCache = new Map();

// Mapping des IDs vers les chemins de fichiers
const idToPathMap = {
    'header': 'includes/header.html',
    'footer': 'includes/footer.html'
};

/**
 * Sanitize HTML content to prevent XSS
 */
function sanitizeHTML(html) {
    // Basic XSS protection
    let sanitized = html.replace(/<script[^<]*(?:(?!</script>)<[^<]*)*</script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/onw+="[^"]*"/g, '');
    return sanitized;
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
    const idElements = document.querySelectorAll('#header, #footer');
    
    for (let i = 0; i < idElements.length; i++) {
        const el = idElements[i];
        const id = el.id;
        const path = idToPathMap[id];
        
        if (path) {
            const html = await loadIncludeFile(path);
            el.innerHTML = html;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIncludes);
} else {
    initIncludes();
}