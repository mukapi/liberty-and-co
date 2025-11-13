/**
 * Liberty & Co - Animations GSAP
 * Note: GSAP et ScrollTrigger sont déjà chargés nativement par Webflow
 */

// Variable pour empêcher la double initialisation
let isInitialized = false;

// Fonction principale d'initialisation
function initScrollAnimations() {
  // Vérifier que GSAP est bien disponible
  if (typeof gsap === "undefined") {
    console.error("❌ GSAP not found - make sure you are running on Webflow");
    return;
  }

  // Protection contre le double chargement
  if (isInitialized) {
    return;
  }
  isInitialized = true;

  // Animation fade-in depuis le bas
  gsap.utils.toArray('[data-animate="fade-up"]').forEach((element) => {
    gsap.from(element, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Animation fade-in depuis la gauche
  gsap.utils.toArray('[data-animate="fade-left"]').forEach((element) => {
    gsap.from(element, {
      x: -60,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Animation fade-in depuis la droite
  gsap.utils.toArray('[data-animate="fade-right"]').forEach((element) => {
    gsap.from(element, {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Animation scale + fade
  gsap.utils.toArray('[data-animate="scale"]').forEach((element) => {
    gsap.from(element, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Animation stagger (décalage) pour les listes
  gsap.utils.toArray("[data-animate-stagger]").forEach((container) => {
    const items = container.querySelectorAll("[data-animate-item]");

    gsap.from(items, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Animation parallax (mouvement au scroll)
  gsap.utils.toArray("[data-parallax]").forEach((element) => {
    const speed = parseFloat(
      element.getAttribute("data-parallax-speed") || "0.5"
    );

    gsap.to(element, {
      y: () => -window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // --- Animation method_item (étapes qui apparaissent 1 par 1) ---
  const methodList = document.querySelector(".method_list");
  const methodItems = gsap.utils.toArray(".method_item");

  // Ne s'exécute que sur desktop (992px et plus)
  const isDesktop = window.innerWidth >= 992;

  if (
    methodList &&
    methodItems.length > 0 &&
    !methodList.dataset.initialized &&
    isDesktop
  ) {
    methodList.dataset.initialized = "true";

    // 1. Tous cachés au départ, SAUF le premier
    gsap.set(methodItems, { opacity: 0 });
    if (methodItems[0]) {
      gsap.set(methodItems[0], { opacity: 1, visibility: "visible" });
    }

    // Variable pour tracker l'étape précédente
    let previousActiveIndex = 0;

    // 2. Animation optimisée pour position sticky
    ScrollTrigger.create({
      trigger: methodList,
      start: "top center",
      end: "bottom center",
      scrub: 0.1,
      onUpdate: (self) => {
        const { progress } = self;
        const totalItems = methodItems.length;

        const segmentSize = 1 / totalItems;
        const currentSegment = Math.floor(progress / segmentSize);
        const activeIndex = Math.min(currentSegment, totalItems - 1);

        // Transition seulement lors du changement d'étape
        if (activeIndex !== previousActiveIndex) {
          const tl = gsap.timeline();

          // 1. Masquer instantanément l'ancien item
          if (previousActiveIndex >= 0 && methodItems[previousActiveIndex]) {
            tl.set(
              methodItems[previousActiveIndex],
              {
                opacity: 0,
                visibility: "hidden",
              },
              0
            );
          }

          // 2. Préparer le nouvel item
          tl.set(
            methodItems[activeIndex],
            {
              visibility: "visible",
              opacity: 0,
            },
            0
          );

          // 3. Afficher avec animation rapide
          tl.to(
            methodItems[activeIndex],
            {
              opacity: 1,
              duration: 0.2,
              ease: "power1.out",
            },
            0.05
          );

          previousActiveIndex = activeIndex;
        }
      },
    });
  }

  // --- Animation method_line_inner (lignes qui grandissent 1 par 1) ---
  if (methodList && methodItems.length > 0 && isDesktop) {
    const linesByItem = [];
    methodItems.forEach((item) => {
      const lines = Array.from(item.querySelectorAll(".method_line_inner"));
      if (lines.length > 0) {
        linesByItem.push(lines);
      }
    });

    if (linesByItem.length > 0) {
      // 1. Initialiser toutes les lignes à 0% de hauteur
      linesByItem.forEach((lines) => {
        gsap.set(lines, { height: "0%" });
      });

      // 2. Animation synchronisée avec le scroll
      ScrollTrigger.create({
        trigger: methodList,
        start: "top center",
        end: "bottom center",
        scrub: 0.1,
        onUpdate: (self) => {
          const { progress } = self;
          const totalItems = methodItems.length;

          const segmentSize = 1 / totalItems;
          const currentSegment = Math.floor(progress / segmentSize);
          const activeItemIndex = Math.min(currentSegment, totalItems - 1);
          const progressInItem =
            (progress - activeItemIndex * segmentSize) / segmentSize;

          // Pour chaque item
          linesByItem.forEach((lines, itemIndex) => {
            if (itemIndex < activeItemIndex) {
              // Items complétés : toutes les lignes à 100%
              lines.forEach((line) => {
                gsap.to(line, {
                  height: "100%",
                  duration: 0.3,
                  ease: "power1.out",
                  overwrite: "auto",
                });
              });
            } else if (itemIndex === activeItemIndex) {
              // Item actif : animer les lignes selon la progression
              const totalLinesInItem = lines.length;

              lines.forEach((line, lineIndex) => {
                const lineSegment = 1 / totalLinesInItem;
                const lineStart = lineIndex * lineSegment;
                const lineEnd = (lineIndex + 1) * lineSegment;

                if (progressInItem <= lineStart) {
                  gsap.set(line, { height: "0%" });
                } else if (progressInItem >= lineEnd) {
                  gsap.to(line, {
                    height: "100%",
                    duration: 0.3,
                    ease: "power1.out",
                    overwrite: "auto",
                  });
                } else {
                  const progressInLine =
                    (progressInItem - lineStart) / lineSegment;
                  const lineHeight = Math.min(progressInLine * 100, 100);

                  gsap.to(line, {
                    height: `${lineHeight}%`,
                    duration: 0.1,
                    ease: "none",
                    overwrite: "auto",
                  });
                }
              });
            } else {
              // Items futurs : lignes à 0%
              lines.forEach((line) => {
                gsap.set(line, { height: "0%" });
              });
            }
          });
        },
      });

      console.log(
        `✅ Method lines animation initialized (${linesByItem.length} items)`
      );
    }
  }
}

// Initialisation Webflow
window.Webflow ||= [];
window.Webflow.push(() => {
  console.log("🎨 Liberty & Co - Animations loaded");
  initScrollAnimations();
});
