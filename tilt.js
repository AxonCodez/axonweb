// Initialize tilt effect on all elements with class "hover-tilt"
import VanillaTilt from 'vanilla-tilt';

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.hover-tilt');
  if (elements.length) {
    VanillaTilt.init(elements, {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.2
    });
  }
});
