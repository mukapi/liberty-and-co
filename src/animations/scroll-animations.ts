// Déclaration TypeScript pour GSAP (déjà inclus dans Webflow)
declare const gsap: typeof import('gsap').gsap;

/**
 * Initialise toutes les animations au scroll
 * Note: GSAP et ScrollTrigger sont déjà chargés nativement par Webflow
 */
export const initScrollAnimations = () => {
  // Vérifier que GSAP est bien disponible
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP not found - make sure you are running on Webflow');
    return;
  }
  // Animation fade-in depuis le bas
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((element) => {
    gsap.from(element, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%', // Déclenche quand l'élément atteint 85% du viewport
        toggleActions: 'play none none reverse',
        // markers: true, // Décommente pour debug
      },
    });
  });

  // Animation fade-in depuis la gauche
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-left"]').forEach((element) => {
    gsap.from(element, {
      x: -60,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Animation fade-in depuis la droite
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-right"]').forEach((element) => {
    gsap.from(element, {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Animation scale + fade
  gsap.utils.toArray<HTMLElement>('[data-animate="scale"]').forEach((element) => {
    gsap.from(element, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Animation stagger (décalage) pour les listes
  gsap.utils.toArray<HTMLElement>('[data-animate-stagger]').forEach((container) => {
    const items = container.querySelectorAll('[data-animate-item]');

    gsap.from(items, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15, // Décalage de 0.15s entre chaque élément
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Animation parallax (mouvement au scroll)
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
    const speed = parseFloat(element.getAttribute('data-parallax-speed') || '0.5');

    gsap.to(element, {
      y: () => -window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true, // Animation liée au scroll
      },
    });
  });

  // --- Animation method_item (un à la fois) ---
  const methodList = document.querySelector<HTMLElement>('.method_list');
  const methodItems = gsap.utils.toArray<HTMLElement>('.method_item');

  if (methodList && methodItems.length > 0) {
    console.log(`🎯 Found ${methodItems.length} method items`);

    // 1. Initialiser l'opacité : le premier item est visible, les autres sont cachés
    gsap.set(methodItems, { opacity: 0 });
    gsap.set(methodItems[0], { opacity: 1 });

    // 2. Créer une timeline GSAP qui sera contrôlée par le scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: methodList,
        start: 'top top', // Déclenche quand le haut de method_list atteint le haut du viewport
        end: 'bottom top', // Finit quand le bas de method_list atteint le haut du viewport
        scrub: true, // L'animation est liée au scroll
        markers: true, // Décommente pour le débogage
      },
    });

    // 3. Créer les transitions entre chaque item
    methodItems.forEach((item, i) => {
      if (i === 0) {
        // Premier item : visible au début, puis s'estompe
        tl.to(item, { opacity: 0, duration: 0.3 }, 0.2);
      } else if (i < methodItems.length - 1) {
        // Items intermédiaires : apparaissent puis disparaissent
        tl.fromTo(
          item,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          i * 0.25 // Commence à apparaître à 25% de la timeline par item
        ).to(
          item,
          { opacity: 0, duration: 0.3 },
          (i + 1) * 0.25 - 0.1 // Commence à disparaître juste avant l'item suivant
        );
      } else {
        // Dernier item : apparaît et reste visible
        tl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.3 }, i * 0.25);
      }
    });
  }

  console.log('✅ GSAP ScrollTrigger animations initialized');
};

/**
 * Rafraîchit ScrollTrigger (utile après un changement de DOM)
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};
