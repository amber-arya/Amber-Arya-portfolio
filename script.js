/* ══════════════════════════════════════
   AMBER ARYA — PORTFOLIO SCRIPTS
   Three.js · GSAP · Spider-Web Canvas
══════════════════════════════════════ */

/* ════════════════════ CUSTOM CURSOR ════════════════════ */
const cd = document.getElementById('cd');
const cr = document.getElementById('cr');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cd.style.left = mx + 'px';
  cd.style.top  = my + 'px';
  cr.style.left = rx + 'px';
  cr.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .sk-card, .pj-card, .ac-card, .int-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ════════════════════ THREE.JS BACKGROUND ════════════════════ */
const bgc      = document.getElementById('bgc');
const renderer = new THREE.WebGLRenderer({ canvas: bgc, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 90;

/* -- Particle Field -- */
const pN = 3000;
const pg = new THREE.BufferGeometry();
const pp = new Float32Array(pN * 3);
const pc = new Float32Array(pN * 3);

// Color palette: red, blue, white, purple
const pal = [
  [0.91, 0.10, 0.17],
  [0.08, 0.40, 1.00],
  [1.00, 1.00, 1.00],
  [0.60, 0.20, 0.80]
];

for (let i = 0; i < pN; i++) {
  pp[i*3]   = (Math.random() - 0.5) * 240;
  pp[i*3+1] = (Math.random() - 0.5) * 240;
  pp[i*3+2] = (Math.random() - 0.5) * 150;
  const c = pal[Math.floor(Math.random() * pal.length)];
  pc[i*3] = c[0]; pc[i*3+1] = c[1]; pc[i*3+2] = c[2];
}

pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
pg.setAttribute('color',    new THREE.BufferAttribute(pc, 3));

const pts = new THREE.Points(pg, new THREE.PointsMaterial({
  size: 0.5, vertexColors: true, transparent: true, opacity: 0.55, sizeAttenuation: true
}));
scene.add(pts);

/* -- Wireframe Geometries -- */
function mkWire(geo, col, x, y, z, op = 0.1) {
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: col, wireframe: true, transparent: true, opacity: op
  }));
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

const w1 = mkWire(new THREE.IcosahedronGeometry(16, 1), 0xE8192C, -65,  22, -25, 0.11);
const w2 = mkWire(new THREE.OctahedronGeometry(10, 0),  0x1565FF,  65, -18, -15, 0.11);
const w3 = mkWire(new THREE.DodecahedronGeometry(12, 0),0xE8192C,   5,  48, -35, 0.08);
const w4 = mkWire(new THREE.TetrahedronGeometry(8, 0),  0x8833FF,  30, -35, -10, 0.09);
const w5 = mkWire(new THREE.IcosahedronGeometry(7, 0),  0x1565FF, -35, -40,  -5, 0.12);

/* ════════════════════ SPIDER WEB CANVAS ════════════════════ */
const webo = document.getElementById('webo');
const wctx = webo.getContext('2d');

function resizeWeb() {
  webo.width  = innerWidth;
  webo.height = innerHeight;
}
resizeWeb();

// Static web patterns in corners
function drawStatic() {
  wctx.clearRect(0, 0, webo.width, webo.height);
  const W = webo.width, H = webo.height;

  const webs = [
    { x: W*-.02, y: H*-.02, r: W*.62, rings:10, spokes:18, rc:'rgba(232,25,44,',  bc:'rgba(21,101,255,' },
    { x: W*1.02, y: H*1.02, r: W*.50, rings: 8, spokes:16, rc:'rgba(21,101,255,', bc:'rgba(232,25,44,'  },
    { x: W*1.02, y: H*.05,  r: W*.30, rings: 6, spokes:14, rc:'rgba(232,25,44,',  bc:'rgba(255,255,255,'},
    { x: W*.50,  y: H*1.08, r: W*.38, rings: 7, spokes:16, rc:'rgba(21,101,255,', bc:'rgba(232,25,44,'  }
  ];

  webs.forEach(({ x, y, r, rings, spokes, rc, bc }) => {
    // Concentric rings
    for (let ri = 1; ri <= rings; ri++) {
      const rad  = r * (ri / rings);
      const fade = 1 - (ri / rings) * 0.7;
      wctx.beginPath();
      for (let s = 0; s < spokes; s++) {
        const a1 = (s / spokes)     * Math.PI * 2;
        const a2 = ((s+1) / spokes) * Math.PI * 2;
        wctx.moveTo(x + Math.cos(a1)*rad, y + Math.sin(a1)*rad);
        wctx.lineTo(x + Math.cos(a2)*rad, y + Math.sin(a2)*rad);
      }
      wctx.strokeStyle = rc + (0.1 * fade) + ')';
      wctx.lineWidth   = 0.7;
      wctx.stroke();
    }
    // Radial spokes
    for (let s = 0; s < spokes; s++) {
      const a = (s / spokes) * Math.PI * 2;
      wctx.beginPath();
      wctx.moveTo(x, y);
      wctx.lineTo(x + Math.cos(a)*r, y + Math.sin(a)*r);
      wctx.strokeStyle = bc + '.05)';
      wctx.lineWidth   = 0.6;
      wctx.stroke();
    }
  });
}
drawStatic();

/* -- Dynamic Mouse Web Trail -- */
let trail = [];
document.addEventListener('mousemove', e => {
  trail.push({ x: e.clientX, y: e.clientY, t: Date.now() });
  if (trail.length > 30) trail.shift();
});

function drawDynamic() {
  const now   = Date.now();
  const fresh = trail.filter(p => now - p.t < 400);
  if (fresh.length < 3) { drawStatic(); return; }

  drawStatic();

  for (let i = 2; i < fresh.length; i++) {
    const p1  = fresh[i-2], p2 = fresh[i-1], p = fresh[i];
    const age = (now - p.t) / 400;

    // Curved web thread
    wctx.beginPath();
    wctx.moveTo(p1.x, p1.y);
    wctx.quadraticCurveTo(p2.x, p2.y, p.x, p.y);
    wctx.strokeStyle = `rgba(232,25,44,${(1 - age) * 0.6})`;
    wctx.lineWidth   = 1.8;
    wctx.stroke();

    // Cross-thread every 3rd point
    if (i > 3 && i % 3 === 0) {
      wctx.beginPath();
      wctx.moveTo(fresh[i-3].x, fresh[i-3].y);
      wctx.lineTo(p.x, p.y);
      wctx.strokeStyle = `rgba(21,101,255,${(1 - age) * 0.25})`;
      wctx.lineWidth   = 0.8;
      wctx.stroke();
    }
  }
}

/* ════════════════════ MAIN ANIMATION LOOP ════════════════════ */
let mox = 0, moy = 0;
document.addEventListener('mousemove', e => {
  mox = (e.clientX / innerWidth  - 0.5) * 0.6;
  moy = (e.clientY / innerHeight - 0.5) * 0.6;
});

window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  resizeWeb();
  drawStatic();
});

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.004;

  // Rotate particles
  pts.rotation.y += 0.0006;
  pts.rotation.x += 0.0003;

  // Rotate wireframes
  w1.rotation.x += 0.006; w1.rotation.y += 0.009;
  w2.rotation.y += 0.007; w2.rotation.z += 0.005;
  w3.rotation.x += 0.008; w3.rotation.z += 0.006;
  w4.rotation.y += 0.010; w4.rotation.x += 0.007;
  w5.rotation.z += 0.009; w5.rotation.y += 0.006;

  // Pulsating opacity
  w1.material.opacity = 0.08 + Math.sin(t)     * 0.04;
  w2.material.opacity = 0.08 + Math.cos(t*0.8) * 0.04;

  // Camera follows mouse
  camera.position.x += (mox * 15 - camera.position.x) * 0.04;
  camera.position.y += (-moy * 10 - camera.position.y) * 0.04;

  drawDynamic();
  renderer.render(scene, camera);
}
animate();

/* ════════════════════ GSAP SCROLL REVEAL ════════════════════ */
gsap.registerPlugin(ScrollTrigger);

// Fade-in on scroll
document.querySelectorAll('.rev').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

// ── TO UPDATE STATS: just change data-count values in index.html ──
// Counter animation
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  ScrollTrigger.create({
    trigger: el, start: 'top 90%',
    onEnter: () => {
      let c = 0;
      const step = target / 60;
      const iv = setInterval(() => {
        c = Math.min(c + step, target);
        el.textContent = Math.round(c);
        if (c >= target) clearInterval(iv);
      }, 16);
    }
  });
});

/* ════════════════════ 3D CARD TILT ════════════════════ */
document.querySelectorAll('.sk-card, .pj-card, .ac-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    card.style.transform = `perspective(700px) rotateX(${(y-.5)*-14}deg) rotateY(${(x-.5)*14}deg) translateY(-8px)`;
    card.style.setProperty('--px', x * 100 + '%');
    card.style.setProperty('--py', y * 100 + '%');
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ════════════════════ PHOTO 3D PARALLAX ════════════════════ */
const pf = document.getElementById('pf');
document.addEventListener('mousemove', e => {
  if (!pf) return;
  const x = (e.clientX / innerWidth  - 0.5) * 20;
  const y = (e.clientY / innerHeight - 0.5) * 20;
  pf.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
});

/* ════════════════════ HERO LOAD ANIMATION ════════════════════ */
window.addEventListener('load', () => {
  gsap.from('.hero-eyebrow',    { y:20, opacity:0, duration:.70, ease:'power3.out', delay:.25 });
  gsap.from('.hero-name .n1',   { y:50, opacity:0, duration:.85, ease:'power3.out', delay:.40 });
  gsap.from('.hero-name .n2',   { y:50, opacity:0, duration:.85, ease:'power3.out', delay:.56 });
  gsap.from('.hero-tagline',    { y:20, opacity:0, duration:.70, ease:'power3.out', delay:.72 });
  gsap.from('.hero-about',      { y:20, opacity:0, duration:.70, ease:'power3.out', delay:.88 });
  gsap.from('.hero-btns',       { y:20, opacity:0, duration:.70, ease:'power3.out', delay:1.04 });
  gsap.from('.photo-wrap',      { scale:.82, opacity:0, duration:1, ease:'power3.out', delay:.50 });
  gsap.from('.badge',           { scale:.50, opacity:0, duration:.70, ease:'back.out(1.7)', stagger:.18, delay:1.20 });
  gsap.from('.scroll-hint',     { opacity:0, duration:1, delay:1.80 });
}); 