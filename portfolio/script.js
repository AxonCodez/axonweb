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

document.addEventListener("DOMContentLoaded", () => {
  const comet = document.querySelector(".comet");
  const fireball = comet.querySelector(".fireball");
  const timeline = document.querySelector(".timeline");
  const entries = document.querySelectorAll(".timeline-entry");

  window.addEventListener("scroll", () => {
    const timelineRect = timeline.getBoundingClientRect();
    const scrollY = window.scrollY + window.innerHeight / 2;
    const timelineTop = timeline.offsetTop;
    const timelineHeight = timeline.offsetHeight;

    // Animate comet height
    const progress = Math.min(Math.max((scrollY - timelineTop) / timelineHeight, 0), 1);
    comet.style.height = `${progress * 100}%`;
    fireball.style.top = `calc(${progress * 100}% - 10px)`;

    // Animate timeline entries as fireball crosses
    entries.forEach(entry => {
      const entryTop = entry.offsetTop + timeline.offsetTop;
      if (scrollY > entryTop - 100) {
        entry.classList.add("animated");
      }
    });
  });
});

 window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.work-dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const parent = toggle.closest('.work-card');
        const dropdown = parent.querySelector('.work-dropdown-content');
        toggle.classList.toggle('open');
        dropdown.classList.toggle('show');
      });
    });
  });