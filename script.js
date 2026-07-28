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

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        // 1. Empêcher le rechargement de la page
        e.preventDefault();

        // 2. Bloquer le bouton pendant l'envoi pour éviter les doublons
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        // 3. Préparer les données au format classique de formulaire (FormData)
        const formData = new FormData();
        formData.append('nom', document.getElementById('nom').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('objet', document.getElementById('objet').value);
        formData.append('message', document.getElementById('message').value);


        console.log("Nom :", formData.get("nom"));
console.log("Email :", formData.get("email"));
console.log("Objet :", formData.get("objet"));
console.log("Message :", formData.get("message"));
        try {
            // 4. Envoi de la requête vers votre script PHP sur InfinityFree
            const response = await fetch('https://profil-back-production.up.railway.app', {
                method: 'POST',
                body: formData // On envoie le FormData directement (pas besoin de headers)
            });

            // 5. Lecture de la réponse JSON du serveur
            const result = await response.json();

            if (result.status === 'success') {
                alert('Votre message a bien été envoyé et enregistré !');
                contactForm.reset(); // Réinitialise les champs du formulaire
            } else {
                alert('Erreur : ' + result.message);
            }
        } catch (error) {
            console.error('Erreur réseau ou serveur :', error);
            alert('Une erreur est survenue lors de l\'envoi. Vérifiez votre connexion.');
        } finally {
            // 6. Réactiver le bouton après traitement
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}
});