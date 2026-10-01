document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar');

    // --- 1. GESTION DU MENU BURGER ---
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
            });
        });
    }

    // --- 2. GESTION DES LIENS ACTIFS ---
    const setActiveLink = (hash) => {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === hash;
            link.classList.toggle('active', isActive);
        });
    };

    // --- 3. DÉFILEMENT FLUIDE (SMOOTH SCROLL) ---
    const scrollToSection = (targetId, duration = 800) => {
        const target = document.getElementById(targetId);
        if (!target) return;

        const startY = window.scrollY;
        const targetY = target.getBoundingClientRect().top + window.scrollY - 85;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const progress = Math.min(1, (currentTime - startTime) / duration);
            const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
            window.scrollTo(0, startY + (targetY - startY) * ease);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    // Prise en charge des clics d'ancrage (Navbar, bouton Header "Me contacter", retour en haut)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            event.preventDefault();
            const targetId = href.slice(1);
            setActiveLink(href);
            scrollToSection(targetId);
        });
    });

    // --- 4. ANIMATION AU DÉFILEMENT BIDIRECTIONNELLE (APPARITION & DISPARITION) ---
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Quand l'élément entre dans la vue : il s'affiche
                    entry.target.classList.add('show');
                } else {
                    // Quand l'élément quitte la vue (en descendant ou remontant) : il disparaît
                    entry.target.classList.remove('show');
                }
            });
        }, {
            threshold: 0.12, // Déclenchement dès que 12% de l'élément est visible
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- 5. DÉTECTION DE LA SECTION ACTIVE AU DÉFILEMENT (PERFORMANTE) ---
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(`#${entry.target.id}`);
            }
        });
    }, {
        threshold: 0.35 // Activé dès que 35% de la section est visible
    });

    sections.forEach(sec => sectionObserver.observe(sec));


    // --- GESTION DU FORMULAIRE DE CONTACT VIA API (FORMSPREE) ---
    const contactForm = document.getElementById('contact-form');

    // Récupération ou création du bloc de confirmation
    const getFeedbackElement = () => {
        let feedback = document.getElementById('contact-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'contact-feedback';
            // On l'ajoute juste après le bouton ou en bas du formulaire
            contactForm.appendChild(feedback);
        }
        return feedback;
    };

    const showFeedback = (message, isSuccess = true) => {
        const feedback = getFeedbackElement();
        feedback.className = isSuccess ? 'success' : 'error';
        feedback.innerHTML = isSuccess 
            ? `<i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> ${message}`
            : `<i class="fa-solid fa-triangle-exclamation" style="margin-right: 8px;"></i> ${message}`;
        
        // Fait défiler la vue vers la confirmation si l'écran est petit
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            
            // État pendant l'envoi
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';

            const formData = new FormData(contactForm);

            try {
                // Remplace bien 'TON_ID_FORMSPREE' par ton vrai ID Formspree
                const response = await fetch('https://formspree.io/f/xeaodnnq', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Confirmation claire sur le bouton et dans le bandeau
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Envoyé !';
                    submitBtn.style.background = '#46ECC5';
                    submitBtn.style.color = '#0B0F10';

                    showFeedback('Votre message a bien été transmis à Michaël ! Une réponse vous sera apportée sous peu.', true);
                    contactForm.reset();

                    // Rétablit le bouton après 5 secondes
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                    }, 5000);

                } else {
                    const data = await response.json();
                    const errMsg = data.errors ? data.errors.map(err => err.message).join(', ') : 'Une erreur est survenue lors de l\'envoi.';
                    showFeedback(errMsg, false);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                }
            } catch (error) {
                showFeedback('Impossible d\'envoyer le message. Vérifiez votre connexion Internet.', false);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
});