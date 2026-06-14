/* ═══════════════════════════════════════════════════════
   PARTICLES.JS — Full-page twinkling starfield
═══════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.15,
      speed: Math.random() * 0.005 + 0.001,
      phase: Math.random() * Math.PI * 2,
      /* teal-tinted occasional stars */
      type: Math.random() > 0.85 ? 'teal' : Math.random() > 0.7 ? 'blue' : 'white'
    }));
  }

  const COLORS = {
    white: '220,228,255',
    blue:  '160,190,255',
    teal:  '100,240,255'
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() * 0.001;
    stars.forEach(s => {
      const a = 0.15 + 0.7 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed * 50));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLORS[s.type]},${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();