/**
 * Projects Manager - Gestion dynamique des projets
 */

let projectsData = null;
let currentCategory = 'all';

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        projectsData = await response.json();
        return projectsData;
    } catch (error) {
        console.error('Error loading projects:', error);
        return null;
    }
}

function generateProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-tile';
    card.innerHTML = '
        <img src="' + project.image + '" alt="' + project.title + '" loading="lazy">
        <div class="project-tile-overlay">
            <h3>' + project.title + '</h3>
            <p>' + project.location + ' - ' + project.year + '</p>
        </div>
    ';
    return card.outerHTML;
}

function generateCategoryFilters() {
    if (!projectsData || !projectsData.categories) return '';
    
    let html = '<button class="active" data-category="all">Tous</button>';
    projectsData.categories.forEach(function(cat) {
        html += '<button data-category="' + cat.id + '">' + cat.name + '</button>';
    });
    return html;
}

function displayProjects(category) {
    if (!projectsData || !projectsData.projects) return;
    
    const container = document.querySelector('.projects-mosaic');
    if (!container) return;
    
    let projects = projectsData.projects;
    if (category !== 'all') {
        projects = projects.filter(function(p) { return p.category === category; });
    }
    
    container.innerHTML = projects.map(generateProjectCard).join('');
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.projects-filters button');
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            filterButtons.forEach(function(btn) { btn.classList.remove('active'); });
            button.classList.add('active');
            currentCategory = button.getAttribute('data-category');
            displayProjects(currentCategory);
        });
    });
}

async function initProjects() {
    await loadProjects();
    if (projectsData) {
        const filtersContainer = document.querySelector('.projects-filters');
        if (filtersContainer) {
            filtersContainer.innerHTML = generateCategoryFilters();
        }
        displayProjects('all');
        initFilters();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
} else {
    initProjects();
}