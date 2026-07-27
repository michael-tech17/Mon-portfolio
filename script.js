/* ==========================================================================
   1. GESTION DU FORMULAIRE DE CONTACT
   ========================================================================== */

// Écoute la soumission du formulaire de contact
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  // Empêche le rechargement par défaut de la page
  e.preventDefault();

  // Récupération des données saisis par l'utilisateur
  const data = {
    nom: document.getElementById('nom').value,
    email: document.getElementById('email').value,
    objet: document.getElementById('objet').value,
    message: document.getElementById('message').value
  };

  try {
    // Envoi des données via une requête HTTP POST vers le script PHP
    const response = await fetch('https://folasayo-mon-portofolio.xo.je/contact.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Traitement de la réponse JSON renvoyée par le serveur
    const result = await response.json();

    if (result.status === 'success') {
      alert('Votre message a bien été envoyé et enregistré !');
      // Réinitialise les champs du formulaire après succès
      document.getElementById('contact-form').reset();
    } else {
      alert('Erreur : ' + result.message);
    }
  } catch (error) {
    console.error('Erreur réseau :', error);
    alert('Une erreur est survenue lors de l\'envoi.');
  }
});


/* ==========================================================================
   2. GESTION DE LA NAVIGATION DYNAMIQUE (LIENS ACTIFS & SCROLL)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Sélection de tous les liens de la barre de navigation et des sections de la page
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');

    /* Mettre à jour le lien actif pendant le défilement (ScrollSpy) */
    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        // Détection de la section visible à l'écran
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Décalage pour prendre en compte la hauteur du header fixe
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Applique la classe 'active' uniquement au lien correspondant à la section affichée
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* Changer de lien actif immédiatement au clic */
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Retire la classe 'active' de tous les liens
            navLinks.forEach(l => l.classList.remove('active'));
            // Ajoute la classe 'active' au lien cliqué
            this.classList.add('active');
        });
    });
});