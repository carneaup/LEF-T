// Charge et injecte le header et footer externalisés
document.addEventListener('DOMContentLoaded', function() {
    // Charger le header
    fetch('includes/header.html')
        .then(response => response.text())
        .then(html => {
            const headerPlaceholder = document.getElementById('header');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = html;
            }
        })
        .catch(error => console.error('Erreur chargement header:', error));

    // Charger le footer
    fetch('includes/footer.html')
        .then(response => response.text())
        .then(html => {
            const footerPlaceholder = document.getElementById('footer');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = html;
            }
        })
        .catch(error => console.error('Erreur chargement footer:', error));
});