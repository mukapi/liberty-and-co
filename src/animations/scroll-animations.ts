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

  // --- Animation method_item (snap points discrets) ---
  const methodList = document.querySelector<HTMLElement>('.method_list');
  const methodItems = gsap.utils.toArray<HTMLElement>('.method_item');

  // Protection contre le double chargement
  if (methodList && methodItems.length > 0 && !methodList.dataset.initialized) {
    methodList.dataset.initialized = 'true';
    console.log(`🎯 Found ${methodItems.length} method items`);
    console.log('🔍 Method list element:', methodList);
    console.log('🔍 Method items:', methodItems);

    // 1. Initialiser : tous les items cachés sauf le premier
    gsap.set(methodItems, { opacity: 0 });
    gsap.set(methodItems[0], { opacity: 1 });
    console.log('✅ Initial setup: Item 1 visible, others hidden');

    // 2. Créer des snap points discrets (pas de transitions fluides)
    methodItems.forEach((item, i) => {
      console.log(`🔧 Creating ScrollTrigger for item ${i + 1}`);

      // Créer un ScrollTrigger pour chaque item avec des zones fixes
      ScrollTrigger.create({
        trigger: methodList,
        start: `top ${i * 25}%`, // Zone fixe pour chaque item
        end: `top ${(i + 1) * 25}%`, // Zone fixe pour chaque item
        onEnter: () => {
          console.log(`🚀 ENTERING item ${i + 1} zone (${i * 25}% to ${(i + 1) * 25}%)`);
          console.log('🔍 Current scroll position:', window.scrollY);
          console.log('🔍 Method list position:', methodList.getBoundingClientRect().top);

          // Quand on entre dans cette zone : montrer cet item, cacher les autres
          gsap.set(methodItems, { opacity: 0 }); // Cacher tous
          gsap.set(item, { opacity: 1 }); // Montrer celui-ci

          console.log(`📌 Snap to item ${i + 1}`);
        },
        onEnterBack: () => {
          console.log(`🔄 ENTERING BACK item ${i + 1} zone`);

          // Même chose quand on revient en arrière
          gsap.set(methodItems, { opacity: 0 });
          gsap.set(item, { opacity: 1 });

          console.log(`📌 Snap back to item ${i + 1}`);
        },
        markers: false, // Désactivé pour éviter la confusion
      });
    });
  } else {
    console.log('❌ No method_list or method_items found');
    console.log(
      '🔍 Available elements with "method" in class:',
      document.querySelectorAll('[class*="method"]')
    );
  }

  console.log('✅ GSAP ScrollTrigger animations initialized');
};

/**
 * Rafraîchit ScrollTrigger (utile après un changement de DOM)
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};
