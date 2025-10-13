import { initScrollAnimations } from './animations/scroll-animations';

window.Webflow ||= [];
window.Webflow.push(() => {
  // Initialise les animations au scroll
  initScrollAnimations();

  console.log('🎨 Liberty & Co - Scroll animations loaded');
});
