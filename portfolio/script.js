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
