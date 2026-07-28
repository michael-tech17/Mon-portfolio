document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar');

    // --- GESTION DU MENU BURGER ---
    if (menuIcon && navbar) {
        // Toggle ouverture / fermeture au clic sur l'icône burger
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });

        // Fermeture automatique du menu après un clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
            });
        });
    }

    // --- GESTION DES LIENS ACTIFS ---
    const setActiveLink = (hash) => {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === hash;
            link.classList.toggle('active', isActive);
        });
    };

    // --- DEFILEMENT FLUIDE (SMOOTH SCROLL) ---
    const scrollToSection = (targetId, duration = 900) => {
        const target = document.getElementById(targetId);
        if (!target) return;

        const startY = window.scrollY;
        const targetY = target.getBoundingClientRect().top + window.scrollY - 90;
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

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            event.preventDefault();
            const targetId = href.slice(1);
            setActiveLink(href);
            scrollToSection(targetId);
        });
    });

    // --- BOUTON RETOUR EN HAUT ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (event) => {
            event.preventDefault();
            setActiveLink('#home');
            scrollToSection('home');
        });
    }

    // --- MISE A JOUR AUTOMATIQUE DU LIEN ACTIF AU DEFILEMENT ---
    const updateActiveByScroll = () => {
        const sections = document.querySelectorAll('section[id]');
        let currentId = 'home';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                currentId = section.id;
            }
        });

        setActiveLink(`#${currentId}`);
    };

    window.addEventListener('scroll', updateActiveByScroll);
    updateActiveByScroll();

    // --- GESTION DU FORMULAIRE DE CONTACT ---
    const contactForm = document.getElementById('contact-form');

    const getFeedbackElement = () => {
        let feedback = document.getElementById('contact-feedback');

        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'contact-feedback';
            feedback.style.marginTop = '1rem';
            feedback.style.padding = '1rem';
            feedback.style.borderRadius = '0.75rem';
            feedback.style.fontSize = '0.95rem';
            feedback.style.display = 'none';
            feedback.style.maxWidth = '100%';
            feedback.style.wordBreak = 'break-word';
            contactForm.appendChild(feedback);
        }

        return feedback;
    };

    const showFeedback = (message, isSuccess = true) => {
        const feedback = getFeedbackElement();
        feedback.textContent = message;
        feedback.style.display = 'block';
        feedback.style.color = isSuccess ? '#0f5132' : '#842029';
        feedback.style.backgroundColor = isSuccess ? '#d1e7dd' : '#f8d7da';
        feedback.style.border = isSuccess ? '1px solid #badbcc' : '1px solid #f5c2c7';
    };

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Préparation...';

            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const objet = document.getElementById('objet').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!nom || !email || !objet || !message) {
                showFeedback('Merci de remplir tous les champs du formulaire avant de l\'envoyer.', false);
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            const subject = `Nouveau message de ${nom} - ${objet}`;
            const body = `Nom : ${nom}\r\nEmail : ${email}\r\nObjet : ${objet}\r\n\r\n${message}`;
            const mailtoLink = `mailto:michaelkouakoufolasayo492@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            showFeedback('Votre message est transféré vers Gmail. Vérifiez la fenêtre de votre client de messagerie.', true);

            setTimeout(() => {
                window.location.href = mailtoLink;
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                contactForm.reset();
            }, 400);
        });
    }
});