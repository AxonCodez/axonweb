// tilt.js
document.querySelectorAll('.hover-react').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale(1.05)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
});
