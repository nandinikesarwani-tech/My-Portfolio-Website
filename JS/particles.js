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




// ----------------------------------------------------------------------------

const canvas = document.getElementById('interactive-particle-canvas');
const ctx = canvas.getContext('2d');

let mouse = { x: null, y: null, radius: 120 };
let particlesArray = [];

// Handle resizing safely
function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    initParticles();
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = 2;
        this.density = (Math.random() * 30) + 10;
    }
    
    draw() {
        ctx.fillStyle = '#9e8028'; // Matches your beautiful muted gold champagne theme perfectly!
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // Calculate distance between mouse pointer and particles
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function initParticles() {
    particlesArray = [];
    // Creates a neat grid of interactive nodes
    const numberOfParticles = 80; 
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    requestAnimationFrame(animate);
}

// Track cursor interactions cleanly without memory leaks
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animate();