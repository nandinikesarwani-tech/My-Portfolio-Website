/* ═══════════════════════════════════════════════════════
   MAIN.JS — Core page behaviour
═══════════════════════════════════════════════════════ */

/* ── Page Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1000);
});

/* ── Scroll Progress Bar ── */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  const bar = document.getElementById('scroll-bar');
  if (bar) bar.style.width = pct + '%';
}, { passive: true });

/* ── Back To Top ── */
const bt = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  if (bt) bt.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

/* ── Navbar scroll effect ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ── Active Nav Highlight ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
      );
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => navObs.observe(s));

/* ── Scroll Reveal ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .slide-in-left, .slide-in-right, .stagger-fade').forEach(el => revObs.observe(el));

/* ── Animated Stat Counters ── */
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const tgt = parseInt(el.getAttribute('data-target'));
      const dur = 1300;
      const s = performance.now();
      const decimals = el.getAttribute('data-decimals') || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      (function step(now) {
        const t = Math.min((now - s) / dur, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        el.textContent = (ease * tgt).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = tgt + suffix;
      })(s);
      cntObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => cntObs.observe(el));

/* ── Skill Bars ── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.getAttribute('data-width') + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.sb-fill').forEach(el => barObs.observe(el));

/* ── Card Spotlight (mouse-tracking radial) ── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
});

/* ── Card Tilt Effect ── */
document.querySelectorAll('.proj-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
});

/* ── Copy Email ── */
window.copyEmail = function(btn) {
  navigator.clipboard.writeText('nandinikesarwani0221@gmail.com').then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.cssText = 'border-color:var(--border-hover);color:var(--teal-bright)';
    setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; }, 2000);
  });
};

/* ── Smooth scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Magnetic Buttons ── */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.3;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── Keyboard: Scroll to top on Backquote ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' });
});