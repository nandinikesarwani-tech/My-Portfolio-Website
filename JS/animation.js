/* ── TYPEWRITER ── */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'ML Engineer in the making.',
    'NLP & Ensemble Learning enthusiast.',
    'Building intelligent systems.',
    'B.Tech CSE @ UCER Prayagraj.'
  ];
  let pi = 0, ci = 0, del = false;
  function tick() {
    const p = phrases[pi];
    if (!del) {
      el.textContent = p.slice(0, ++ci);
      if (ci === p.length) { del = true; setTimeout(tick, 2000); return; }
    } else {
      el.textContent = p.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, del ? 38 : 65);
  }
  tick();
})();