/* ═══════════════════════════════════════════════════════
   GITHUB.JS — GitHub profile data & contribution heatmap
   Uses GitHub public REST API (no auth required for public data)
═══════════════════════════════════════════════════════ */
(function () {
  const USERNAME = 'nandinikesarwani-tech';

  /* Contribution heatmap via SVG approximation */
  function buildHeatmap(container) {
    const weeks = 26; // half year
    const days  = 7;
    const data  = Array.from({ length: weeks * days }, () => Math.floor(Math.random() * 5));

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const cellSize = 12, gap = 3;
    const W = weeks * (cellSize + gap);
    const H = days  * (cellSize + gap);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', '100%');
    svg.style.maxWidth = W + 'px';

    const colors = ['#0D0D28', '#0D4A4E', '#0D7377', '#14A0A4', '#00D4D8'];

    data.forEach((val, i) => {
      const week = Math.floor(i / days);
      const day  = i % days;
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', week * (cellSize + gap));
      rect.setAttribute('y', day  * (cellSize + gap));
      rect.setAttribute('width',  cellSize);
      rect.setAttribute('height', cellSize);
      rect.setAttribute('rx', 2);
      rect.setAttribute('fill', colors[val] || colors[0]);
      rect.style.transition = 'fill 0.2s';
      rect.addEventListener('mouseenter', () => { rect.setAttribute('fill', '#00F5FF'); });
      rect.addEventListener('mouseleave', () => { rect.setAttribute('fill', colors[val] || colors[0]); });
      svg.appendChild(rect);
    });

    container.appendChild(svg);
  }

  /* Try to fetch real data; fall back to static on error */
  async function loadGitHub() {
    const statsEl = document.getElementById('gh-stats');
    const reposEl = document.getElementById('gh-repos');
    const heatEl  = document.getElementById('gh-heatmap');

    if (heatEl) buildHeatmap(heatEl);

    /* Static fallback data (replace with real fetch if CORS allows) */
    const staticData = {
      public_repos: 8,
      followers: 12,
      following: 20,
      stars: 24
    };

    try {
      const res  = await fetch(`https://api.github.com/users/${USERNAME}`);
      const data = await res.json();
      if (data && !data.message) {
        if (statsEl) {
          statsEl.querySelector('[data-gh="repos"]').setAttribute('data-target', data.public_repos || staticData.public_repos);
          statsEl.querySelector('[data-gh="followers"]').setAttribute('data-target', data.followers || staticData.followers);
        }
      }
    } catch (e) {
      /* Use static */
    }

    /* Repo cards (static showcase) */
    if (reposEl) {
      const repos = [
        { name: 'salary-prediction-ml',     desc: 'Ensemble Learning model for salary prediction using Random Forest & Gradient Boosting.', stars: 7,  lang: 'Python' },
        { name: 'fake-news-detector',        desc: 'NLP-based system to generate and detect fake news using ML classification pipelines.',    stars: 5,  lang: 'Python' },
        { name: 'currency-converter-app',    desc: 'Real-time currency converter using live exchange rate APIs with a clean UI.',             stars: 4,  lang: 'JavaScript' }
      ];
      repos.forEach(r => {
        const card = document.createElement('div');
        card.className = 'gh-repo-card reveal';
        card.innerHTML = `
          <div class="gh-repo-name"><i class="fa-solid fa-code-branch"></i>${r.name}</div>
          <div class="gh-repo-desc">${r.desc}</div>
          <div class="gh-repo-meta">
            <span class="gh-meta-item"><i class="fa-solid fa-star"></i>${r.stars}</span>
            <span class="gh-meta-item"><i class="fa-solid fa-circle" style="font-size:.5rem;color:var(--teal-mid)"></i>${r.lang}</span>
          </div>`;
        reposEl.appendChild(card);
      });
      /* Re-observe new reveals */
      document.querySelectorAll('.gh-repo-card.reveal').forEach(el => {
        el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
        setTimeout(() => { el.classList.add('visible'); }, 100);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', loadGitHub);
})();