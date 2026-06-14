/* ═══════════════════════════════════════════════════════
   ANIMATIONS.JS — Three.js Planet + Typewriter
═══════════════════════════════════════════════════════ */

/* ── THREE.JS PLANET ── */
(function () {
  const canvas = document.getElementById('planet-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.width  = canvas.offsetWidth  || 560;
  const H = canvas.height = canvas.offsetHeight || 560;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.z = 3.4;

  /* ── Geometry base ── */
  const sGeo = new THREE.SphereGeometry(1, 72, 72);

  /* 1 — Dark core, teal emissive */
  const core = new THREE.Mesh(sGeo, new THREE.MeshPhongMaterial({
    color: 0x030D12,
    emissive: 0x004A50,
    emissiveIntensity: 0.8,
    shininess: 120,
    opacity: 0.97, transparent: true
  }));
  core.scale.setScalar(0.975);
  scene.add(core);

  /* 2 — Teal wireframe lattice */
  const wire1 = new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({
    color: 0x14A0A4, wireframe: true, opacity: 0.12, transparent: true
  }));
  scene.add(wire1);

  /* 3 — Bright cyan fine overlay */
  const wire2 = new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({
    color: 0x00F5FF, wireframe: true, opacity: 0.04, transparent: true
  }));
  wire2.scale.setScalar(1.004);
  scene.add(wire2);

  /* 4 — Atmosphere inner glow */
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.13, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00D4D8, side: THREE.BackSide, opacity: 0.09, transparent: true })
  ));

  /* 5 — Outer haze shell */
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0D7377, side: THREE.BackSide, opacity: 0.04, transparent: true })
  ));

  /* 6 — Primary ring (tilted) */
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.62, 0.05, 2, 100),
    new THREE.MeshBasicMaterial({ color: 0x14A0A4, opacity: 0.38, transparent: true })
  );
  ring1.rotation.x = Math.PI * 0.28;
  scene.add(ring1);

  /* 7 — Secondary faint ring */
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.0, 0.025, 2, 100),
    new THREE.MeshBasicMaterial({ color: 0x00F5FF, opacity: 0.15, transparent: true })
  );
  ring2.rotation.x = Math.PI * 0.28;
  ring2.rotation.y = Math.PI * 0.1;
  scene.add(ring2);

  /* 8 — Orbiting particle cloud */
  const N = 180, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.38 + Math.random() * 0.75;
    pos[i * 3]     = Math.cos(a) * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const orbitCloud = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x00F5FF, size: 0.028, opacity: 0.65, transparent: true
  }));
  scene.add(orbitCloud);

  /* 9 — Background star cloud */
  const sN = 320, sPos = new Float32Array(sN * 3);
  for (let i = 0; i < sN; i++) {
    sPos[i * 3]     = (Math.random() - 0.5) * 16;
    sPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    sPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0xCCEEFF, size: 0.022, opacity: 0.5, transparent: true
  })));

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0x001A1A, 4));
  const pl1 = new THREE.PointLight(0x00D4D8, 6, 14);
  pl1.position.set(3, 2, 3);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0x4F46E5, 3, 12);
  pl2.position.set(-3, -2, 2);
  scene.add(pl2);
  const pl3 = new THREE.PointLight(0x0D7377, 2.5, 10);
  pl3.position.set(0, 3, -2);
  scene.add(pl3);

  /* ── Mouse reaction ── */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Animate ── */
  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    wire1.rotation.y  =  t * 0.09;
    wire1.rotation.x  =  t * 0.035;
    wire2.rotation.y  = -t * 0.065;
    wire2.rotation.z  =  t * 0.025;
    core.rotation.y   =  t * 0.065;
    ring1.rotation.z  =  t * 0.055;
    ring2.rotation.z  = -t * 0.03;
    orbitCloud.rotation.y = t * 0.15;

    /* Gentle float + mouse parallax */
    scene.position.y = Math.sin(t * 0.4) * 0.08 - mouseY * 0.06;
    scene.position.x = mouseX * 0.05;
    scene.rotation.y = mouseX * 0.04;

    renderer.render(scene, camera);
  }
  animate();
})();

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