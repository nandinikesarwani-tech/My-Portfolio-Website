/* ═══════════════════════════════════════════════════════
   STATS.JS — Extended analytics (LeetCode placeholder,
   future API integrations)
═══════════════════════════════════════════════════════ */

/* Update these manually or wire to a backend proxy */
const PORTFOLIO_STATS = {
  projectsBuilt:    3,
  certifications:   5,
  yearsStudy:       4,
  cgpaX10:         74
};

/* Trigger counter re-run if elements added dynamically */
function reObserveCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const tgt = parseInt(e.target.getAttribute('data-target'));
        const dur = 1200, s = performance.now();
        const suffix = e.target.getAttribute('data-suffix') || '';
        (function step(now) {
          const t = Math.min((now - s) / dur, 1);
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          e.target.textContent = Math.round(ease * tgt) + suffix;
          if (t < 1) requestAnimationFrame(step);
          else e.target.textContent = tgt + suffix;
        })(s);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]:not([data-counted])').forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(reObserveCounters, 200);
});