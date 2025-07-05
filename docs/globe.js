import createGlobe from 'cobe';

export function initGlobe(containerSelector) {
  const container = document.querySelector(containerSelector);
  const canvas = document.createElement('canvas');
  let width = 0;
  let phi = 0;

  container.appendChild(canvas);
  canvas.style.opacity = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.borderRadius = '50%';
  canvas.style.transition = 'transform 0.4s ease';

  let pointerInteracting = false;
  let lastClientX = 0;
  let userRotation = 0;

  window.addEventListener('resize', () => {
    width = canvas.offsetWidth;
  });
  width = canvas.offsetWidth;

  const globe = createGlobe(canvas, {
    baseColor: [0, 0, 0],
    markerColor: [0.3, 0.5, 1],
    glowColor: [0, 0, 0],
    devicePixelRatio: 2,
    width: width * 2,
    height: width * 2,
    phi: 0,
    theta: 0.3,
    onRender: state => {
      if (!pointerInteracting) phi += 0.002;
      state.phi = phi + userRotation;
      state.width = width * 2;
      state.height = width * 2;
    },
  });

  setTimeout(() => { canvas.style.opacity = '1'; }, 0);

  canvas.addEventListener('pointerdown', e => {
    pointerInteracting = true;
    lastClientX = e.clientX;
  });
  canvas.addEventListener('pointerup', () => (pointerInteracting = false));
  canvas.addEventListener('pointermove', e => {
    if (pointerInteracting) {
      const delta = e.clientX - lastClientX;
      lastClientX = e.clientX;
      userRotation += delta / 200;
    }
  });

  return {
    globe,
    canvas
  };
}
