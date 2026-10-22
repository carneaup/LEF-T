/**
 * Credits - Affiche l'auteur de chaque image du site (« © Auteur »).
 *
 * Source unique : data/credits.json, une entrée par fichier image (chemin
 * depuis la racine du site). Ce fichier est chargé AVANT js/projects.js et
 * fournit :
 *   - loadCredits()        : charge le registre (une seule fois)
 *   - getImageCredit(path) : renvoie l'auteur, ou null si l'image n'est pas créditée
 *   - createCreditElement(path) : <span class="image-credit">© Auteur</span>, ou null
 *   - creditHTML(path)     : même chose sous forme de chaîne HTML ('' si pas de crédit)
 *
 * Une image sans entrée dans credits.json n'affiche AUCUN crédit (on ne devine
 * jamais un auteur) et un avertissement apparaît dans la console du navigateur.
 * Pour la liste complète des images non créditées : python tools/check-credits.py
 */

function getCreditsBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
        const src = s.getAttribute('src');
        if (src && src.indexOf('js/credits.js') !== -1) {
            return src.substring(0, src.indexOf('js/credits.js'));
        }
    }
    return '';
}
const CREDITS_BASE_PATH = getCreditsBasePath();

let creditsData = null;
let creditsPromise = null;

function loadCredits() {
    if (creditsPromise) return creditsPromise;
    creditsPromise = fetch(CREDITS_BASE_PATH + 'data/credits.json')
        .then(function(response) {
            if (!response.ok) throw new Error('Failed to load credits');
            return response.json();
        })
        .then(function(data) {
            creditsData = (data && data.images) ? data.images : {};
            return creditsData;
        })
        .catch(function(error) {
            console.error('Error loading credits:', error);
            creditsData = {};
            return creditsData;
        });
    return creditsPromise;
}

// Ramène un chemin d'image à sa forme « depuis la racine du site »
// (retire le préfixe relatif ../, un éventuel / initial et un ?query).
function normalizeImagePath(path) {
    if (!path) return '';
    return String(path).split('?')[0].replace(/^(\.\.\/|\.\/)+/, '').replace(/^\/+/, '');
}

const creditWarned = {};
function getImageCredit(path) {
    const key = normalizeImagePath(path);
    const entry = creditsData ? creditsData[key] : null;
    if (entry && entry.author) return entry.author;
    if (creditsData && key && !creditWarned[key]) {
        creditWarned[key] = true;
        console.warn('LEF-T: image sans crédit dans data/credits.json : ' + key);
    }
    return null;
}

function createCreditElement(path) {
    const author = getImageCredit(path);
    if (!author) return null;
    const span = document.createElement('span');
    span.className = 'image-credit';
    span.textContent = '© ' + author;
    return span;
}

function creditHTML(path) {
    const el = createCreditElement(path);
    return el ? el.outerHTML : '';
}

// ===== Section « Crédits photographiques » des mentions légales =====
// Remplit chaque élément [data-credits-list] : un projet par ligne avec ses
// auteurs, puis les images hors projet qui ont un "label" dans credits.json.
async function renderCreditsList() {
    const containers = document.querySelectorAll('[data-credits-list]');
    if (!containers.length) return;

    await loadCredits();
    let projects = [];
    try {
        const response = await fetch(CREDITS_BASE_PATH + 'data/projects.json');
        if (response.ok) projects = (await response.json()).projects || [];
    } catch (e) { /* on affiche au moins les images hors projet */ }

    const used = {};
    function authorsOf(paths) {
        const list = [];
        paths.forEach(function(p) {
            const key = normalizeImagePath(p);
            used[key] = true;
            const entry = creditsData[key];
            if (entry && entry.author && list.indexOf(entry.author) === -1) list.push(entry.author);
        });
        return list;
    }

    containers.forEach(function(container) {
        const isEN = container.getAttribute('data-credits-list') === 'EN';
        const ul = document.createElement('ul');
        ul.className = 'credits-list';

        projects.forEach(function(project) {
            if (project.draft) return;
            const paths = [project.image].concat(project.gallery || []).filter(Boolean);
            const authors = authorsOf(paths);
            if (!authors.length) return;
            const title = (isEN && project.title_en) ? project.title_en : project.title;
            const li = document.createElement('li');
            li.textContent = title + (isEN ? ': © ' : ' : © ') + authors.join(', © ');
            ul.appendChild(li);
        });

        Object.keys(creditsData).forEach(function(key) {
            const entry = creditsData[key];
            if (used[key] || !entry || !entry.author || !entry.label) return;
            const label = (isEN && entry.label_en) ? entry.label_en : entry.label;
            const li = document.createElement('li');
            li.textContent = label + (isEN ? ': © ' : ' : © ') + entry.author;
            ul.appendChild(li);
        });

        container.innerHTML = '';
        container.appendChild(ul);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCreditsList);
} else {
    renderCreditsList();
}
