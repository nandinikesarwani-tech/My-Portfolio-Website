/* ═══════════════════════════════════════════════════════
   CURSOR.JS — Custom cursor + glow follow
═══════════════════════════════════════════════════════ */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow-follow');

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
    if (glow) { glow.style.left = mx + 'px'; glow.style.top = my + 'px'; }
  });

  /* Smooth ring lag */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animateRing() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Hover state */
  const hoverTargets = 'a, button, .proj-card, .cert-card, .chip, .social-pill, .nav-cta, .btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      if (ring) ring.classList.add('hovering');
      if (dot)  { dot.style.width = '12px'; dot.style.height = '12px'; }
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      if (ring) ring.classList.remove('hovering');
      if (dot)  { dot.style.width = ''; dot.style.height = ''; }
    }
  });

  /* Click ripple */
  document.addEventListener('mousedown', () => {
    if (dot) { dot.style.transform = 'translate(-50%,-50%) scale(0.6)'; }
  });
  document.addEventListener('mouseup', () => {
    if (dot) { dot.style.transform = ''; }
  });
})();