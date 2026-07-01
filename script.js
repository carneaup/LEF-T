// ===== SCRIPT POUR LE SITE LEF-T =====

// Liste des images de fond pour la page d'accueil avec leurs liens correspondants
const bgImages = [
    { src: 'assets/images/Couverture-ETFE_Villejuif.jpg', link: 'projet-villejuif.html' },
    { src: 'assets/images/Urwaldhaus_Muncih.jpg', link: 'projet-munich.html' },
    { src: 'assets/images/aquascope_Poitiers.jpg', link: 'projet-poitiers.html' },
    { src: 'assets/images/newton_garching_coussins-ETFE.jpg', link: 'projet-garching.html' },
];

// Sélection aléatoire d'une image pour la page d'accueil
function setRandomBgImage() {
    const bgElement = document.getElementById('bgImage');
    const bgLink = document.getElementById('bgLink');
    
    if (bgElement) {
        const randomIndex = Math.floor(Math.random() * bgImages.length);
        const randomImage = bgImages[randomIndex];
        
        bgElement.style.backgroundImage = `url(${randomImage.src}?${Date.now()})`;
        
        // Mettre à jour le lien en fonction de l'image
        if (bgLink) {
            bgLink.href = randomImage.link;
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    setRandomBgImage();

    if (!document.body.classList.contains('home-page')) {
        initPageFeatures();
    }
});

// Fonctionnalités pour les pages standard
function initPageFeatures() {
    // Filtres de projets
    const filterButtons = document.querySelectorAll('.projects-filters button');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Carte OpenStreetMap (Belleville, Paris)
    initMap();

    // Formulaire de contact
    handleContactForm();

    // Switcher de langue
    initLangSwitcher();
}

// Initialisation de la carte
function initMap() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=2.386474609375,48.86415795898437,2.406474609375,48.88415795898437&layer=mapnik&marker=48.87415795898437,2.396474609375';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        mapContainer.innerHTML = '';
        mapContainer.appendChild(iframe);
    }
}

// Formulaire de contact
function handleContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Merci pour votre message ! Nous vous répondrons rapidement.');
            form.reset();
        });
    }
}

// Switcher de langue
function initLangSwitcher() {
    const langLinks = document.querySelectorAll('.lang-switcher a');
    langLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            langLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Changer la langue du contenu
            const lang = this.textContent.trim();
            translatePage(lang);
        });
    });
}

// Traduction de la page
function translatePage(lang) {
    const translations = {
        'bureau': {
            'FR': {
                title: 'Notre bureau',
                about1: '<strong>LEF-T</strong> est un bureau d\'études structure basé à Paris, au cœur du quartier dynamique de Belleville. Fondé par un ingénieur allemand et composé d\'une équipe de jeunes talents, nous allions <strong>l\'expertise technique</strong> à une <strong>approche agile et humaine</strong>.',
                about2: 'Spécialisés dans les <strong>structures légères et les façades</strong>, nous travaillons sur des projets innovants en France et en Allemagne, en collaboration avec notre partenaire <strong>FTR à Rosenheim</strong> et un bureau tunisien pour les tâches de dessin.',
                about3: 'Notre force réside dans notre capacité à <strong>concevoir des solutions sur-mesure</strong>, que ce soit pour des toiles tendues, des charpentes bois, des structures pneumatiques ou des projets de mobilité douce. Nous croyons en l\'innovation, la durabilité et la collaboration étroite avec nos clients et partenaires.',
                about4: 'Bien que petite structure, notre équipe est <strong>réactive, flexible et engagée</strong> dans chaque projet, du concept initial à la réalisation finale.',
                team: 'L\'équipe',
                partners: 'Partenaires',
                partners1: 'Nous travaillons en étroite collaboration avec <strong>FTR</strong>, un bureau d\'études basé à Rosenheim en Allemagne, ainsi qu\'avec un bureau tunisien spécialisé dans les tâches de dessin technique.',
                partners2: 'Cette synergie nous permet d\'offrir à nos clients une <strong>expertise transfrontalière</strong> et une <strong>capacité de production optimisée</strong>.'
            },
            'EN': {
                title: 'Our Office',
                about1: '<strong>LEF-T</strong> is a structural engineering office based in Paris, in the heart of the dynamic Belleville district. Founded by a German engineer and composed of a team of young talents, we combine <strong>technical expertise</strong> with an <strong>agile and human approach</strong>.',
                about2: 'Specializing in <strong>lightweight structures and facades</strong>, we work on innovative projects in France and Germany, in collaboration with our partner <strong>FTR in Rosenheim</strong> and a Tunisian office for drafting tasks.',
                about3: 'Our strength lies in our ability to <strong>design tailor-made solutions</strong>, whether for tensile fabrics, timber frames, pneumatic structures or soft mobility projects. We believe in innovation, sustainability and close collaboration with our clients and partners.',
                about4: 'Although a small structure, our team is <strong>responsive, flexible and committed</strong> to each project, from initial concept to final realization.',
                team: 'The Team',
                partners: 'Partners',
                partners1: 'We work in close collaboration with <strong>FTR</strong>, an engineering office based in Rosenheim, Germany, as well as with a Tunisian office specializing in technical drafting tasks.',
                partners2: 'This synergy allows us to offer our clients <strong>cross-border expertise</strong> and <strong>optimized production capacity</strong>.'
            }
        },
        'projet-villejuif': {
            'FR': {
                title: 'Couverture ETFE - Villejuif',
                meta: 'Villejuif, France | 2024',
                desc1: 'Ce projet emblématique situé à Villejuif représente une avancée majeure dans l\'utilisation des technologies de toiture légère. La couverture ETFE (Éthylène TétraFluoroÉthylène) offre une solution innovante pour les grands espaces commerciaux, combinant transparence, légèreté et résistance exceptionnelle.',
                desc2: 'Notre bureau a conçu une structure capable de couvrir de grandes portées sans support intermédiaire, créant ainsi un espace ouvert et lumineux pour les visiteurs. L\'utilisation de l\'ETFE permet également une excellente isolation thermique tout en laissant passer la lumière naturelle.',
                challenges: 'Défis techniques',
                challenges1: 'Le principal défi de ce projet était de créer une toiture capable de résister aux conditions météorologiques variées de la région parisienne, tout en maintenant une esthétique minimaliste et élégante. Notre équipe a travaillé en étroite collaboration avec les architectes pour intégrer parfaitement la structure au design global du centre commercial.',
                challenges2: 'La solution que nous avons développée utilise un système de coussins ETFE à trois couches, offrant une isolation thermique optimale tout en permettant un contrôle précis de la transparence et de l\'ombrage.',
                results: 'Résultats',
                results1: 'Le projet a été livré dans les délais et le budget prévus, avec une satisfaction complète du client. La couverture ETFE est devenue un point de repère architectural dans la région, démontrant les possibilités offertes par les structures légères dans l\'architecture moderne.'
            },
            'EN': {
                title: 'ETFE Cover - Villejuif',
                meta: 'Villejuif, France | 2024',
                desc1: 'This iconic project located in Villejuif represents a major advancement in the use of lightweight roofing technologies. The ETFE (Ethylene TetraFluoroEthylene) cover offers an innovative solution for large commercial spaces, combining transparency, lightness and exceptional resistance.',
                desc2: 'Our office designed a structure capable of covering large spans without intermediate supports, thus creating an open and bright space for visitors. The use of ETFE also provides excellent thermal insulation while allowing natural light to pass through.',
                challenges: 'Technical Challenges',
                challenges1: 'The main challenge of this project was to create a roof capable of withstanding the varied weather conditions of the Paris region, while maintaining a minimalist and elegant aesthetic. Our team worked in close collaboration with the architects to perfectly integrate the structure into the overall design of the shopping center.',
                challenges2: 'The solution we developed uses a three-layer ETFE cushion system, offering optimal thermal insulation while allowing precise control of transparency and shading.',
                results: 'Results',
                results1: 'The project was delivered on time and within budget, with complete client satisfaction. The ETFE cover has become an architectural landmark in the region, demonstrating the possibilities offered by lightweight structures in modern architecture.'
            }
        },
        'projet-munich': {
            'FR': {
                title: 'Urwaldhaus - Munich',
                meta: 'Munich, Allemagne | 2023',
                desc1: 'L\'Urwaldhaus de Munich est un projet unique qui combine harmonieusement structure bois et éléments en membrane pour créer un espace architectural impressionnant. Ce bâtiment, conçu comme un hommage à la nature, intègre des éléments organiques dans un environnement urbain moderne.',
                desc2: 'Notre bureau a été responsable de la conception structurelle complète, en collaboration avec des architectes renommés. Le défi était de créer une structure qui évoque la forêt tout en répondant aux exigences techniques d\'un bâtiment public moderne.',
                innovations: 'Innovations structurelles',
                innovations1: 'Le projet utilise un système innovant de poutres en bois lamellé-collé combinées avec des membranes tendues. Cette combinaison permet de créer de grandes portées tout en maintenant une apparence légère et organique.',
                innovations2: 'Les membranes, tendues entre les éléments en bois, créent des surfaces courbes qui rappellent les formes naturelles. Cette approche a permis de réduire considérablement le poids total de la structure tout en maintenant une grande rigidité.',
                integration: 'Intégration environnementale',
                integration1: 'L\'Urwaldhaus est conçu pour s\'intégrer parfaitement à son environnement. Les matériaux utilisés sont principalement naturels et recyclables, et la conception permet une excellente efficacité énergétique.',
                integration2: 'Le bâtiment a reçu plusieurs prix d\'architecture pour son design innovant et son intégration réussie dans le paysage urbain de Munich.'
            },
            'EN': {
                title: 'Urwaldhaus - Munich',
                meta: 'Munich, Germany | 2023',
                desc1: 'The Urwaldhaus in Munich is a unique project that harmoniously combines timber structure and membrane elements to create an impressive architectural space. This building, designed as a tribute to nature, integrates organic elements into a modern urban environment.',
                desc2: 'Our office was responsible for the complete structural design, in collaboration with renowned architects. The challenge was to create a structure that evokes the forest while meeting the technical requirements of a modern public building.',
                innovations: 'Structural Innovations',
                innovations1: 'The project uses an innovative system of glulam beams combined with tensioned membranes. This combination allows for the creation of large spans while maintaining a light and organic appearance.',
                innovations2: 'The membranes, stretched between the timber elements, create curved surfaces that recall natural forms. This approach significantly reduced the total weight of the structure while maintaining high rigidity.',
                integration: 'Environmental Integration',
                integration1: 'The Urwaldhaus is designed to integrate perfectly with its surroundings. The materials used are primarily natural and recyclable, and the design allows for excellent energy efficiency.',
                integration2: 'The building has received several architecture awards for its innovative design and successful integration into Munich\'s urban landscape.'
            }
        },
        'projet-poitiers': {
            'FR': {
                title: 'Aquascope - Poitiers',
                meta: 'Poitiers, France | 2022',
                desc1: 'L\'Aquascope de Poitiers est un projet fascinant qui allie fonctionnalité et esthétique pour créer un espace aquatique unique. Ce bassin couvert, conçu pour abriter une grande variété de vie marine, nécessite une structure capable de résister à l\'humidité constante et aux charges importantes.',
                desc2: 'Notre bureau a conçu une toiture légère en membrane tendue qui permet de couvrir le bassin tout en laissant passer une lumière naturelle diffuse, idéale pour l\'écosystème aquatique. La structure est conçue pour minimiser les ombres portées et créer un environnement optimal pour les plantes et les animaux.',
                solutions: 'Solutions techniques',
                solutions1: 'La principale innovation de ce projet réside dans l\'utilisation d\'une membrane spécialement traitée pour résister à l\'humidité constante et aux produits chimiques utilisés dans l\'entretien des bassins. Le système de tension a été conçu pour maintenir la membrane parfaitement tendue malgré les variations de température et d\'humidité.',
                solutions2: 'De plus, la structure intègre un système de drainage innovant qui permet d\'évacuer efficacement l\'eau de condensation, empêchant ainsi toute accumulation d\'eau sur la membrane.',
                impact: 'Impact environnemental',
                impact1: 'L\'Aquascope de Poitiers est un exemple parfait de la manière dont les structures légères peuvent contribuer à la durabilité environnementale. La toiture en membrane réduit considérablement la consommation d\'énergie nécessaire pour le chauffage et l\'éclairage du bassin.',
                impact2: 'De plus, les matériaux utilisés sont recyclables et la conception permet une longue durée de vie avec un entretien minimal, ce qui en fait une solution économique et écologique.'
            },
            'EN': {
                title: 'Aquascope - Poitiers',
                meta: 'Poitiers, France | 2022',
                desc1: 'The Aquascope in Poitiers is a fascinating project that combines functionality and aesthetics to create a unique aquatic space. This covered basin, designed to house a wide variety of marine life, requires a structure capable of withstanding constant humidity and heavy loads.',
                desc2: 'Our office designed a lightweight tensioned membrane roof that covers the basin while allowing diffused natural light to pass through, ideal for the aquatic ecosystem. The structure is designed to minimize cast shadows and create an optimal environment for plants and animals.',
                solutions: 'Technical Solutions',
                solutions1: 'The main innovation of this project lies in the use of a specially treated membrane to resist constant humidity and the chemical products used in basin maintenance. The tensioning system was designed to keep the membrane perfectly taut despite temperature and humidity variations.',
                solutions2: 'In addition, the structure integrates an innovative drainage system that efficiently evacuates condensation water, thus preventing any water accumulation on the membrane.',
                impact: 'Environmental Impact',
                impact1: 'The Aquascope in Poitiers is a perfect example of how lightweight structures can contribute to environmental sustainability. The membrane roof significantly reduces the energy consumption required for heating and lighting the basin.',
                impact2: 'Moreover, the materials used are recyclable and the design allows for a long lifespan with minimal maintenance, making it an economical and ecological solution.'
            }
        },
        'projet-garching': {
            'FR': {
                title: 'Newton - Garching',
                meta: 'Garching, Allemagne | 2025',
                desc1: 'Le projet Newton à Garching représente une avancée significative dans l\'utilisation des coussins ETFE pour les bâtiments scientifiques. Ce centre de recherche de pointe nécessite des espaces flexibles et adaptables pour accueillir diverses activités scientifiques.',
                desc2: 'Notre bureau a conçu une façade et une toiture utilisant la technologie des coussins ETFE, offrant une solution légère, transparente et énergetiquement efficace. Les coussins, composés de plusieurs couches d\'ETFE, permettent un contrôle précis de l\'isolation thermique et de la transmission lumineuse.',
                tech: 'Technologie des coussins ETFE',
                tech1: 'Les coussins ETFE utilisés pour ce projet sont composés de trois couches de film ETFE, créant des poches d\'air qui offrent une excellente isolation thermique. Contrairement au verre, l\'ETFE est extrêmement léger (environ 1% du poids du verre) tout en offrant des performances thermiques comparables.',
                tech2: 'Un système de ventilation intégré permet de contrôler la température à l\'intérieur des coussins, empêchant ainsi la surchauffe en été. De plus, des systèmes d\'ombrage intégrés peuvent être déployés pour réguler l\'apport de lumière naturelle.',
                advantages: 'Avantages pour la recherche',
                advantages1: 'L\'utilisation des coussins ETFE offre plusieurs avantages pour un bâtiment de recherche :',
                advantages_list: '<li><strong>Flexibilité</strong> : Les coussins peuvent être facilement modifiés ou remplacés pour s\'adapter aux besoins changeants des espaces de recherche.</li><li><strong>Économie d\'énergie</strong> : L\'excellente isolation thermique réduit considérablement les coûts de chauffage et de climatisation.</li><li><strong>Lumière naturelle</strong> : La transparence des coussins permet une utilisation maximale de la lumière naturelle, créant un environnement de travail agréable.</li><li><strong>Durabilité</strong> : L\'ETFE a une durée de vie de 25 à 35 ans et nécessite peu d\'entretien.</li>',
                conclusion: 'Le projet Newton est devenu un modèle pour les futurs bâtiments scientifiques, démontrant comment les technologies de structures légères peuvent répondre aux exigences les plus strictes en matière de performance et de flexibilité.'
            },
            'EN': {
                title: 'Newton - Garching',
                meta: 'Garching, Germany | 2025',
                desc1: 'The Newton project in Garching represents a significant advancement in the use of ETFE cushions for scientific buildings. This state-of-the-art research center requires flexible and adaptable spaces to accommodate various scientific activities.',
                desc2: 'Our office designed a facade and roof using ETFE cushion technology, offering a lightweight, transparent and energy-efficient solution. The cushions, made of multiple layers of ETFE, allow precise control of thermal insulation and light transmission.',
                tech: 'ETFE Cushion Technology',
                tech1: 'The ETFE cushions used for this project consist of three layers of ETFE film, creating air pockets that offer excellent thermal insulation. Unlike glass, ETFE is extremely lightweight (about 1% of the weight of glass) while offering comparable thermal performance.',
                tech2: 'An integrated ventilation system allows temperature control inside the cushions, thus preventing overheating in summer. In addition, integrated shading systems can be deployed to regulate natural light input.',
                advantages: 'Advantages for Research',
                advantages1: 'The use of ETFE cushions offers several advantages for a research building:',
                advantages_list: '<li><strong>Flexibility</strong> : Cushions can be easily modified or replaced to adapt to changing research space needs.</li><li><strong>Energy Savings</strong> : Excellent thermal insulation significantly reduces heating and air conditioning costs.</li><li><strong>Natural Light</strong> : The transparency of the cushions allows maximum use of natural light, creating a pleasant working environment.</li><li><strong>Durability</strong> : ETFE has a lifespan of 25 to 35 years and requires little maintenance.</li>',
                conclusion: 'The Newton project has become a model for future scientific buildings, demonstrating how lightweight structure technologies can meet the most stringent requirements in terms of performance and flexibility.'
            }
        }
    };

    // Appliquer les traductions
    if (translations[getCurrentPage()]) {
        const pageTranslations = translations[getCurrentPage()][lang];
        if (pageTranslations) {
            applyTranslations(pageTranslations);
        }
    }
}

// Obtenir la page actuelle
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page;
}

// Appliquer les traductions
function applyTranslations(translations) {
    // Traduire le titre de la page
    if (translations.title) {
        const titleEl = document.querySelector('.page-title');
        if (titleEl) titleEl.textContent = translations.title;
    }

    // Traduire les sections du bureau
    if (translations.about1) {
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            const paragraphs = aboutText.querySelectorAll('p');
            if (paragraphs.length >= 4) {
                paragraphs[0].innerHTML = translations.about1;
                paragraphs[1].innerHTML = translations.about2;
                paragraphs[2].innerHTML = translations.about3;
                paragraphs[3].innerHTML = translations.about4;
            }
        }
    }

    // Traduire les sections des projets
    if (translations.desc1) {
        const projectContent = document.querySelector('.project-content');
        if (projectContent) {
            const h2s = projectContent.querySelectorAll('h2');
            const ps = projectContent.querySelectorAll('p');
            
            if (h2s.length > 0 && translations.desc1) h2s[0].textContent = translations.desc1.split('|')[0] || translations.desc1;
            if (ps.length > 0 && translations.desc1) ps[0].innerHTML = translations.desc1;
            if (ps.length > 1 && translations.desc2) ps[1].innerHTML = translations.desc2;
            
            if (h2s.length > 1 && translations.challenges) h2s[1].textContent = translations.challenges;
            if (ps.length > 2 && translations.challenges1) ps[2].innerHTML = translations.challenges1;
            if (ps.length > 3 && translations.challenges2) ps[3].innerHTML = translations.challenges2;
            
            if (h2s.length > 2 && translations.results) h2s[2].textContent = translations.results;
            if (ps.length > 4 && translations.results1) ps[4].innerHTML = translations.results1;
        }
    }

    // Traduire les métadonnées
    if (translations.meta) {
        const metaEl = document.querySelector('.project-meta');
        if (metaEl) {
            const spans = metaEl.querySelectorAll('span');
            if (spans.length >= 2) {
                spans[0].textContent = translations.meta.split('|')[0].trim();
                spans[1].textContent = translations.meta.split('|')[1].trim();
            }
        }
    }

    // Traduire les sections supplémentaires
    if (translations.team) {
        const teamTitle = document.querySelector('h2');
        if (teamTitle && teamTitle.textContent.includes('équipe') || teamTitle.textContent.includes('Team')) {
            teamTitle.textContent = translations.team;
        }
    }

    if (translations.partners) {
        const partnersTitle = document.querySelectorAll('h2')[1];
        if (partnersTitle) partnersTitle.textContent = translations.partners;
    }
}
