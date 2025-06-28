// === Designer/Developer Hover Swap ===
const roleSwap = document.querySelector('.role-swap');

if (roleSwap) {
  roleSwap.addEventListener('mouseenter', () => {
    roleSwap.classList.add('swap');
  });

  roleSwap.addEventListener('mouseleave', () => {
    roleSwap.classList.remove('swap');
  });
}

// === Fade-In on Scroll ===
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

fadeEls.forEach(el => observer.observe(el));

// === Tilt Initialization (optional, if you're using tilt.js) ===
const tiltElements = document.querySelectorAll('.tilt');
if (tiltElements.length > 0) {
  VanillaTilt.init(tiltElements, {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.3
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);

  function updateCometHeight() {
    const section = document.querySelector('.timeline-wrapper');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Compute how far the section has scrolled into view
    let progress = 1 - Math.max(0, Math.min(1, rect.bottom / (rect.height + windowHeight)));
    const heightPercent = Math.floor(progress * 100);

    // Inject style to animate the comet height
    styleEl.innerHTML = `
      .timeline::before {
        height: ${heightPercent}%;
      }
    `;
  }

  window.addEventListener('scroll', updateCometHeight);
  window.addEventListener('resize', updateCometHeight);
  updateCometHeight(); // Trigger once on load
});
