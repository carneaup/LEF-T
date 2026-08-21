// ===== SCRIPT POUR LE SITE LEF-T =====

// Calcule le préfixe relatif vers la racine du site à partir du <script src="...">
// utilisé pour charger CE fichier (mêmes principes que dans load-includes.js).
function getScriptBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
        const src = s.getAttribute('src');
        if (src && /(^|\/)script\.js$/.test(src)) {
            return src.substring(0, src.length - 'script.js'.length);
        }
    }
    return '';
}
const SCRIPT_BASE_PATH = getScriptBasePath();

// Le fond tournant de la page d'accueil est piloté depuis data/projects.json :
// seuls les projets avec "featured": true y apparaissent. Pour changer la
// sélection, il suffit de modifier ce champ dans projects.json (pas besoin de
// toucher à ce fichier). Dépend de js/projects.js chargé avant ce script
// (loadProjects, projectsData).
async function setRandomBgImage() {
    const bgElement = document.getElementById('bgImage');
    const bgLink = document.getElementById('bgLink');
    if (!bgElement) return; // pas sur la page d'accueil

    await loadProjects();
    const featured = (projectsData && projectsData.projects)
        ? projectsData.projects.filter(function(p) { return p.featured; })
        : [];

    if (!featured.length) return; // aucun projet marqué "featured" : on garde le fond par défaut du HTML

    const chosen = featured[Math.floor(Math.random() * featured.length)];
    const src = chosen.heroImage || chosen.image;
    bgElement.style.backgroundImage = `url(${SCRIPT_BASE_PATH}${src}?${Date.now()})`;
    if (bgLink) bgLink.href = SCRIPT_BASE_PATH + 'projets/projet.html?id=' + encodeURIComponent(chosen.id);
}

function initMap() {
    // Il peut y avoir plusieurs conteneurs .map-container sur une même page
    // (un par bloc de langue .lang-fr / .lang-en) : on les remplit tous,
    // sinon celui du bloc caché au chargement (souvent l'anglais) reste vide.
    const mapContainers = document.querySelectorAll('.map-container');
    mapContainers.forEach(function(mapContainer) {
        const iframe = document.createElement('iframe');
        // Centré sur le 17 rue Ramponeau, 75020 Paris (le bureau, adresse où l'on
        // reçoit les visiteurs — à ne pas confondre avec le siège social).
        iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=2.3695301,48.86145565,2.3895301,48.88145565&layer=mapnik&marker=48.87145565,2.3795301';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        mapContainer.innerHTML = '';
        mapContainer.appendChild(iframe);
    });
}

function handleContactForm() {
    // Idem : un formulaire par bloc de langue. Envoi réel via Formspree
    // (formspree.io) — remplacer YOUR_FORM_ID dans contact.html par l'ID
    // du formulaire créé sur le compte Formspree du client. La soumission
    // se fait en AJAX pour rester sur la page (pas de redirection).
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(function(form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const isEN = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'EN';
            const statusEl = form.querySelector('.form-status');
            const submitBtn = form.querySelector('button[type="submit"]');
            const data = new FormData(form);

            if (submitBtn) submitBtn.disabled = true;
            if (statusEl) {
                statusEl.textContent = '';
                statusEl.className = 'form-status';
            }

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (!response.ok) throw new Error('Submission failed');
                if (statusEl) {
                    statusEl.textContent = isEN
                        ? 'Thank you for your message! We will reply shortly.'
                        : 'Merci pour votre message ! Nous vous répondrons rapidement.';
                    statusEl.classList.add('form-status--success');
                }
                form.reset();
            } catch (err) {
                if (statusEl) {
                    statusEl.textContent = isEN
                        ? 'Something went wrong. Please email us directly at info@lef-t.eu.'
                        : "Une erreur s'est produite. Vous pouvez nous écrire directement à info@lef-t.eu.";
                    statusEl.classList.add('form-status--error');
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setRandomBgImage();
    if (!document.body.classList.contains('home-page')) {
        initMap();
        handleContactForm();
    }
});