// Déclaration TypeScript pour GSAP (déjà inclus dans Webflow)
declare const gsap: typeof import('gsap').gsap;

/**
 * Initialise toutes les animations au scroll
 * Note: GSAP et ScrollTrigger sont déjà chargés nativement par Webflow
 */
// Protection globale contre le double chargement
let isInitialized = false;

export const initScrollAnimations = () => {
  // Vérifier que GSAP est bien disponible
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP not found - make sure you are running on Webflow');
    return;
  }

  // Protection contre le double chargement
  if (isInitialized) {
    console.log('⚠️ Scroll animations already initialized, skipping...');
    return;
  }
  isInitialized = true;

  console.log('🚀 Initializing scroll animations...');
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

  // --- Animation method_item (étapes qui apparaissent 1 par 1) ---
  const methodList = document.querySelector<HTMLElement>('.method_list');
  const methodItems = gsap.utils.toArray<HTMLElement>('.method_item');

  if (methodList && methodItems.length > 0 && !methodList.dataset.initialized) {
    methodList.dataset.initialized = 'true';
    console.log(`🎯 Found ${methodItems.length} method items`);

    // 1. Tous cachés au départ sauf le premier
    gsap.set(methodItems, { opacity: 0 });
    gsap.set(methodItems[0], { opacity: 1 });

    // 2. Animation fluide avec scrub - UN SEUL trigger pour tout gérer
    ScrollTrigger.create({
      trigger: methodList,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress; // 0 à 1
        const totalItems = methodItems.length;

        // Calculer quelle étape doit être visible
        const currentStep = Math.floor(progress * totalItems);
        const activeIndex = Math.min(currentStep, totalItems - 1);

        console.log(
          `📍 Progress: ${(progress * 100).toFixed(1)}% | Étape active: ${activeIndex + 1}/${totalItems}`
        );

        // Animation fluide sans chevauchement - utilisation de display
        methodItems.forEach((item, index) => {
          if (index === activeIndex) {
            // Afficher l'item actif avec animation
            gsap.set(item, { display: 'block' });
            gsap.fromTo(item, 
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
          } else {
            // Cacher complètement les autres items
            gsap.set(item, { 
              opacity: 0, 
              display: 'none',
              y: 0 
            });
          }
        });
      },
      markers: true,
    });

    console.log('✅ Method items scroll setup complete');
  } else {
    console.log('❌ No method_list or method_items found');
  }

  console.log('✅ GSAP ScrollTrigger animations initialized');
};

/**
 * Rafraîchit ScrollTrigger (utile après un changement de DOM)
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};
