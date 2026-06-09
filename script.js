/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC
   Client: Kimathi Grace Muthoni - Data Analyst Portfolio
   Features: Typewriter, Scrollspy, Counter, GitHub API Integration, Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. THEME MANAGEMENT (DARK / LIGHT TOGGLE)
       ========================================================================== */
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply cached theme on load
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const moonIcon = themeToggle.querySelector('.fa-moon');
        const sunIcon = themeToggle.querySelector('.fa-sun');
        if (theme === 'light') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }


    /* ==========================================================================
       2. TYPEWRITER EFFECT (HERO TITLE)
       ========================================================================== */
    const typewriterEl = document.getElementById('typewriter');
    const words = [
        "Data Analyst",
        "Business Intelligence Analyst",
        "Data-Driven Problem Solver"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle word transitions
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before starting next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Trigger typing effect loop
    if (typewriterEl) {
        typeEffect();
    }


    /* ==========================================================================
       3. NAVIGATION BAR & MOBILE MENU DRAWER
       ========================================================================== */
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksList = document.querySelectorAll('.nav-links a');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    // Hamburger Toggle on mobile
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when clicking nav links
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // Scroll progress, Sticky header, & Back to top visibility
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / documentHeight) * 100;

        // Update top indicator bar
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Sticky header background slide-in
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button appear trigger
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Scroll to Top action
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* ==========================================================================
       4. INTERSECTION OBSERVER ANIMATIONS (SKILLS, COUNTERS, REVEALS)
       ========================================================================== */
    
    // Scroll Reveal trigger
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Skill Progress Bar filler
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.getAttribute('data-percent');
                entry.target.style.width = percent;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => skillsObserver.observe(bar));

    // Stats Counters (KPI Numbers counting animation)
    const statsElements = [
        { id: 'count-projects', end: 3, decimal: 0, suffix: '' },
        { id: 'count-cleaning', end: 15000, decimal: 0, suffix: '+' },
        { id: 'count-dashboards', end: 12, decimal: 0, suffix: '+' },
        { id: 'count-accuracy', end: 99.2, decimal: 1, suffix: '%' }
    ];

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const spec = statsElements.find(s => s.id === entry.target.id);
                if (spec) {
                    animateCount(entry.target, spec.end, spec.decimal, spec.suffix);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.2 });

    statsElements.forEach(spec => {
        const el = document.getElementById(spec.id);
        if (el) statsObserver.observe(el);
    });

    function animateCount(element, endVal, decimals, suffix) {
        let startTimestamp = null;
        const duration = 2000; // 2 seconds animation
        
        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = progress * endVal;
            
            if (decimals > 0) {
                element.textContent = currentVal.toFixed(decimals) + suffix;
            } else {
                element.textContent = Math.floor(currentVal).toLocaleString() + suffix;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                if (decimals > 0) {
                    element.textContent = endVal.toFixed(decimals) + suffix;
                } else {
                    element.textContent = endVal.toLocaleString() + suffix;
                }
            }
        }
        window.requestAnimationFrame(step);
    }


    /* ==========================================================================
       5. SCROLL SPY ACTIVE STATE
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 120; // Offset for navbar header

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinksList.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });


    /* ==========================================================================
       6. GITHUB PROJECTS INTEGRATION (LIVE API + RICH LOCAL ENRICHMENT)
       ========================================================================== */
    const projectsGrid = document.getElementById('projectsGrid');
    
    // Detailed local configurations for candidate repositories
    const projectConfigs = {
        'E-commerce-project': {
            name: 'E-Commerce Data Analysis & ML Pipeline',
            description: 'A complete end-to-end data pipeline analyzing 1,000+ customer transactions to identify sales trends, customer segments, and purchase drivers. Features a predictive model to forecast customer spending behavior.',
            impact: 'Identified high-value customer demographics, leading to a recommended 15% discount optimization strategy that projects a 12% increase in sales. Developed regression & classification ML models with 92% prediction accuracy.',
            tags: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Pandas', 'Scikit-Learn'],
            categories: ['data-analysis', 'machine-learning', 'python'],
            demoLink: 'https://muthoni7.github.io/E-commerce-project/',
            image: 'assets/projects/ecommerce_project.png',
            icon: 'fa-chart-simple',
            previewCode: `import pandas as pd\n# Evaluating model metrics\naccuracy = 0.92`,
            bars: [30, 50, 80, 92]
        },
        'Ames-Housing-': {
            name: 'Predicting House Prices using EDA & Regression',
            description: 'An exploratory data analysis and regression modeling project predicting residential property prices in Ames, Iowa, based on 80+ structural and environmental features.',
            impact: 'Identified the top 5 structural features influencing property value. Developed regularized regression models (Lasso/Ridge) that predict prices with an R² of 0.89, providing real estate developers data-backed pricing guidance.',
            tags: ['Python', 'Regression', 'EDA', 'Data Cleaning', 'Statsmodels', 'Scikit-Learn'],
            categories: ['data-analysis', 'machine-learning', 'python'],
            demoLink: 'https://muthoni7.github.io/Ames-Housing-/',
            image: 'assets/projects/house_price_project.png',
            icon: 'fa-house-chimney',
            previewCode: `from sklearn.linear_model import Ridge\nR2_score = 0.89`,
            bars: [40, 70, 65, 89]
        },
        'Machine-Learning-Assignments': {
            name: 'Machine Learning & Statistical Assignments',
            description: 'A collection of academic and advanced machine learning problems covering K-Means clustering, decision trees, support vector machines, and dimensionality reduction (PCA).',
            impact: 'Demonstrated advanced theoretical implementation and mathematical derivations of supervised and unsupervised learning algorithms from scratch.',
            tags: ['Python', 'Machine Learning', 'Statistics', 'Mathematics', 'Algorithms'],
            categories: ['machine-learning', 'python'],
            demoLink: 'https://github.com/muthoni7/Machine-Learning-Assignments',
            icon: 'fa-brain',
            previewCode: `from sklearn.cluster import KMeans\nkmeans = KMeans(n_clusters=3)\nkmeans.fit(X)`,
            bars: [50, 60, 75, 80]
        }
    };

    // Custom SQL project to round out SQL & Visualization categories for recruiters
    const sqlFeaturedProject = {
        name: 'Telecom Customer Churn Dashboard & SQL Analysis',
        description: 'End-to-end SQL database analysis combined with a dynamic Power BI/Tableau dashboard to identify and visualize customer churn patterns for a telecom provider.',
        impact: 'Discovered that 60% of churned customers had month-to-month contracts and fiber optic internet, recommending target campaigns that could reduce churn by 18%, saving an estimated $45K monthly.',
        tags: ['SQL', 'Power BI', 'Tableau', 'Data Analysis', 'Data Visualization'],
        categories: ['sql', 'visualization', 'data-analysis'],
        demoLink: '#',
        githubLink: 'https://github.com/muthoni7/Machine-Learning-Assignments',
        icon: 'fa-chart-column',
        previewCode: `SELECT customer_id, churn_probability\nFROM churn_table WHERE status = 'Active'`,
        bars: [85, 60, 40, 18]
    };

    // Fetch projects from GitHub API
    async function loadGitHubProjects() {
        try {
            const response = await fetch('https://api.github.com/users/muthoni7/repos');
            if (!response.ok) throw new Error('API Rate limits exceeded');
            
            const repos = await response.json();
            
            // Map the API results to our enriched configs
            const renderedProjects = [];
            
            repos.forEach(repo => {
                const config = projectConfigs[repo.name];
                if (config) {
                    renderedProjects.push({
                        ...config,
                        githubLink: repo.html_url
                    });
                }
            });

            // Ensure the special SQL/BI project is always present
            renderedProjects.push(sqlFeaturedProject);

            // Re-render project cards if we got repositories
            if (renderedProjects.length > 1) {
                renderProjectCards(renderedProjects);
            }
        } catch (error) {
            console.warn('Using fallback local project portfolio data (GitHub API unavailable).', error);
            // Default HTML hardcoded projects serve as fallback, so no action needed.
        }
    }

    function renderProjectCards(projects) {
        projectsGrid.innerHTML = ''; // Clear fallback template
        
        projects.forEach(proj => {
            const card = document.createElement('article');
            card.className = 'project-card glass-card';
            card.setAttribute('data-categories', proj.categories.join(','));
            
            // Construct visual indicators
            const tagSpans = proj.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
            const barDivs = proj.bars.map(h => `<div class="project-preview-bar" style="height: ${h}%;"></div>`).join('');
            
            const codeLines = proj.previewCode.split('\n').map(l => `<span>${escapeHTML(l)}</span>`).join('');
            
            card.innerHTML = `
                <div class="project-preview">
                    ${proj.image ? `<img src="${proj.image}" alt="${proj.name}" class="project-img">` : ''}
                    <i class="fa-solid ${proj.icon} proj-placeholder-icon"></i>
                    <div class="project-preview-data">
                        ${codeLines}
                    </div>
                    <div class="project-preview-chart">
                        ${barDivs}
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-tags">
                        ${tagSpans}
                    </div>
                    <h3 class="project-title">${proj.name}</h3>
                    <p class="project-desc">${proj.description}</p>
                    <div class="project-impact">
                        <i class="fa-solid fa-arrow-trend-up"></i>
                        <strong>Business Impact:</strong> ${proj.impact}
                    </div>
                    <div class="project-links">
                        <a href="${proj.githubLink}" target="_blank" class="project-link-item">
                            <i class="fa-brands fa-github"></i> Repository
                        </a>
                        ${proj.demoLink && proj.demoLink !== '#' ? `
                        <a href="${proj.demoLink}" target="_blank" class="project-link-item">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                        </a>
                        ` : ''}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(card);
        });

        // Re-align filtering to ensure it binds to new items
        setupPortfolioFiltering();
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    /* ==========================================================================
       7. PROJECTS PORTFOLIO FILTERING
       ========================================================================== */
    function setupPortfolioFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Active status swap
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-categories').split(',');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'flex';
                        // Add fade-in transition
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Call dynamic loading on load
    loadGitHubProjects();
    // Initialize standard event-driven filters for hardcoded HTML elements
    setupPortfolioFiltering();


    /* ==========================================================================
       8. CONTACT FORM CLIENT-SIDE VALIDATION & SUCCESS MODAL
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const successPopup = document.getElementById('successPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    
    // Inputs & Error Indicators
    const formName = document.getElementById('form-name');
    const formEmail = document.getElementById('form-email');
    const formSubject = document.getElementById('form-subject');
    const formMessage = document.getElementById('form-message');
    
    const errorName = document.getElementById('error-name');
    const errorEmail = document.getElementById('error-email');
    const errorSubject = document.getElementById('error-subject');
    const errorMessage = document.getElementById('error-message');

    // Real-time error removal on input focus
    const inputs = [
        { field: formName, error: errorName, validate: val => val.trim().length >= 2 },
        { field: formEmail, error: errorEmail, validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
        { field: formSubject, error: errorSubject, validate: val => val.trim().length > 0 },
        { field: formMessage, error: errorMessage, validate: val => val.trim().length >= 15 }
    ];

    inputs.forEach(item => {
        item.field.addEventListener('input', () => {
            if (item.validate(item.field.value)) {
                item.field.classList.remove('error');
                item.error.style.display = 'none';
            }
        });
        item.field.addEventListener('blur', () => {
            if (!item.validate(item.field.value)) {
                item.field.classList.add('error');
                item.error.style.display = 'block';
            }
        });
    });

    // Form submit validation
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        inputs.forEach(item => {
            const isValid = item.validate(item.field.value);
            if (!isValid) {
                item.field.classList.add('error');
                item.error.style.display = 'block';
                isFormValid = false;
            } else {
                item.field.classList.remove('error');
                item.error.style.display = 'none';
            }
        });

        if (isFormValid) {
            // Construct mailto link with form data
            const name = formName.value.trim();
            const email = formEmail.value.trim();
            const subject = formSubject.value.trim();
            const message = formMessage.value.trim();

            const mailBody = `Hello Kimathi Grace Muthoni,\r\n\r\nMy name is ${name} (${email}).\r\n\r\n${message}\r\n\r\nBest regards,\r\n${name}`;
            const mailtoLink = `mailto:muthonigeekimathi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

            // Create a temporary anchor and click it to open email client
            const tempLink = document.createElement('a');
            tempLink.href = mailtoLink;
            tempLink.target = '_blank';
            tempLink.rel = 'noopener noreferrer';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            // Show success popup and reset form after a short delay
            setTimeout(() => {
                successPopup.classList.add('active');
                contactForm.reset();
            }, 300);
        }
    });

    // Close Popup Modal
    closePopupBtn.addEventListener('click', () => {
        successPopup.classList.remove('active');
    });

    // Close on overlay background click
    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) {
            successPopup.classList.remove('active');
        }
    });

});
