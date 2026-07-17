/**
 * Load Includes - Système de chargement des includes HTML
 * Version optimisée avec cache, gestion d'erreurs et sécurité
 */

// Cache des includes déjà chargés
const includesCache = new Map();

/**
 * Load an include file and return its content
 * @param {string} path - Path to the include file
 * @returns {Promise<string>} HTML content
 */
async function loadIncludeFile(path) {
    // Check cache first
    if (includesCache.has(path)) {
        return includesCache.get(path);
    }

    try {
        const response = await fetch(path);
        
        if (!response.ok) {
            throw new Error('Failed to load include: ' + response.status + ' ' + response.statusText);
        }
        
        let html = await response.text();
        
        // Basic XSS protection: remove script tags
        html = html.replace(/<script[^<]*(?:(?!</script>)<[^<]*)*</script>/gi, '');
        html = html.replace(/javascript:/gi, '');
        html = html.replace(/onw+="[^"]*"/g, '');
        
        // Cache the sanitized content
        includesCache.set(path, html);
        
        return html;
    } catch (error) {
        console.error('Error loading include ' + path + ':', error);
        
        // Return a fallback message
        return '<div class="include-error" style="padding: 10px; background: #fee; border: 1px solid #fcc; color: #c33; font-size: 0.9rem;">Include not found: ' + path + '</div>';
    }
}

/**
 * Initialize all includes on the page
 */
async function initIncludes() {
    const includeElements = document.querySelectorAll('[data-include]');
    
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const path = element.getAttribute('data-include');
        
        if (!path) {
            console.warn('Element has data-include attribute but no path specified');
            continue;
        }
        
        try {
            const html = await loadIncludeFile(path);
            element.innerHTML = html;
        } catch (error) {
            console.error('Failed to load include ' + path + ':', error);
            element.innerHTML = '<div class="include-error" style="padding: 10px; background: #fee; border: 1px solid #fcc; color: #c33; font-size: 0.9rem;">Error loading: ' + path + '</div>';
        }
    }
}

// Initialize includes when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIncludes);
} else {
    initIncludes();
}