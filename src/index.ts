import { greetUser } from '$utils/greet';
import './animations/scroll-animations';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Liberty & Co';
  greetUser(name);
});
