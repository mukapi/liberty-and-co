import { greetUser } from '$utils/greet';
import { initScrollAnimations } from './animations/scroll-animations';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Liberty & Co';
  greetUser(name);
  
  // Initialiser les animations
  initScrollAnimations();
});
