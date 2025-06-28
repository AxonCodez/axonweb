// script.js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.scroll-fade').forEach(el => {
  observer.observe(el);
});

const roleSwap = document.getElementById('roleSwap');

  setInterval(() => {
    roleSwap.classList.toggle('swap');
  }, 2000); // Swap every 2 seconds
