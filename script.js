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

const pN = 3000;
const pg = new THREE.BufferGeometry();
const pp = new Float32Array(pN * 3);
const pc = new Float32Array(pN * 3);

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
    wctx.beginPath();
    wctx.moveTo(p1.x, p1.y);
    wctx.quadraticCurveTo(p2.x, p2.y, p.x, p.y);
    wctx.strokeStyle = `rgba(232,25,44,${(1 - age) * 0.6})`;
    wctx.lineWidth   = 1.8;
    wctx.stroke();
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
  pts.rotation.y += 0.0006;
  pts.rotation.x += 0.0003;
  w1.rotation.x += 0.006; w1.rotation.y += 0.009;
  w2.rotation.y += 0.007; w2.rotation.z += 0.005;
  w3.rotation.x += 0.008; w3.rotation.z += 0.006;
  w4.rotation.y += 0.010; w4.rotation.x += 0.007;
  w5.rotation.z += 0.009; w5.rotation.y += 0.006;
  w1.material.opacity = 0.08 + Math.sin(t)     * 0.04;
  w2.material.opacity = 0.08 + Math.cos(t*0.8) * 0.04;
  camera.position.x += (mox * 15 - camera.position.x) * 0.04;
  camera.position.y += (-moy * 10 - camera.position.y) * 0.04;
  drawDynamic();
  renderer.render(scene, camera);
}
animate();

/* ════════════════════ GSAP SCROLL REVEAL ════════════════════ */
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.rev').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

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

/* ════════════════════════════════════════════════════
   JARVAS — FLOATING AI CHATBOT
   Groq API + EmailJS Tracking
════════════════════════════════════════════════════ */

// ── CONFIG — APNI GROQ KEY YAHAN DAALO ──
const GROQ_KEY    = "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";
const EMAILJS_SVC = "service_y62jj4e";
const EMAILJS_TPL = "jbute9q";
const EMAILJS_KEY = "Xbj9y3WsWB-R1QBm9";

// ── JARVAS SYSTEM PROMPT ──
const JARVAS_SYSTEM = `You are JARVAS — the personal AI assistant of Amber Arya. You were built by him.

About Amber Arya:
- He is a B.Tech CSE student and an AI/ML Engineer from India
- He is passionate about AI, Machine Learning, Blockchain, Web3, and Cybersecurity
- Portfolio: https://amberarya.vercel.app
- GitHub: https://github.com/amber-arya
- LinkedIn: https://www.linkedin.com/in/amber-arya
- Email: amberarya7@gmail.com

His Projects:
1. JARVAS AI Chatbot (that's you!) — Built with Python, Streamlit, Groq API, LLaMA 3.3-70b. Live on HuggingFace.
2. Amber's AI Career Coach — AI-driven resume scoring, ATS optimization, interview prep.
3. Smart India Hackathon — SupplyChain — Blockchain-based agricultural supply chain on Polygon with IoT sensors.
4. AI Human Twin — Generative persona twin for personalization and UX research.

His Skills:
- Languages: Python, JavaScript, TypeScript, C, SQL
- Web: React.js, Next.js, Node.js, Express, Tailwind
- AI/ML: TensorFlow, Scikit-learn, NumPy, Pandas, NLP
- Blockchain: Solidity, Web3.js, Ethers.js, Polygon
- Cloud/DevOps: Salesforce DevOps, Copado, GitHub, Linux
- Cybersecurity: Ethical Hacking, Cryptography

His Achievements:
- Claude Code in Action — Anthropic (Mar 2026)
- Copado AI Certified — Salesforce DevOps (Feb 2026)
- Oracle Certified — SQL & Database
- India AI Impact Summit 2026 — Attendee
- Campus Ambassador — BECON 26, EDC IIT Delhi (Dec 2025 - Feb 2026)

Your Personality:
- You are confident, intelligent, and helpful
- You speak in a friendly, professional tone
- You represent Amber proudly — he built you!
- Keep answers concise but informative
- If asked about Amber, always speak positively about him
- If someone wants to hire or collaborate with Amber, encourage them to reach out at amberarya7@gmail.com`;

// ── EMAILJS LOAD ──
(function(){
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  s.onload = () => emailjs.init(EMAILJS_KEY);
  document.head.appendChild(s);
})();

// ── INJECT JARVAS UI ──
const jarvasHTML = `
<div id="jarvas-bubble" title="Chat with Jarvas">
  <div class="jb-pulse"></div>
  <span class="jb-icon">🤖</span>
  <div class="jb-notif" id="jb-notif">1</div>
</div>

<div id="jarvas-chat">
  <div class="jc-header">
    <div class="jc-hinfo">
      <div class="jc-avatar">🤖</div>
      <div>
        <div class="jc-name">JARVAS</div>
        <div class="jc-status"><span class="jc-dot"></span> Online · Amber's AI</div>
      </div>
    </div>
    <button class="jc-close" id="jc-close">✕</button>
  </div>
  <div class="jc-messages" id="jc-messages">
    <div class="jc-msg bot">
      <div class="jc-bubble">
        Hey! I'm <b>Jarvas</b> — Amber Arya's personal AI assistant. 👋<br><br>
        Ask me anything about Amber, his projects, skills, or how to work with him!
      </div>
    </div>
  </div>
  <div class="jc-input-wrap">
    <input type="text" id="jc-input" placeholder="Ask me anything..." autocomplete="off" />
    <button id="jc-send">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  </div>
</div>

<style>
#jarvas-bubble {
  position: fixed; bottom: 28px; right: 28px;
  width: 62px; height: 62px;
  background: linear-gradient(135deg, #1565FF, #E8192C);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 9998;
  box-shadow: 0 8px 32px rgba(21,101,255,.5);
  transition: transform .3s, box-shadow .3s;
}
#jarvas-bubble:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(21,101,255,.7); }
.jb-pulse {
  position: absolute; inset: -4px; border-radius: 50%;
  border: 2px solid rgba(21,101,255,.4);
  animation: jbPulse 2s ease infinite;
}
@keyframes jbPulse {
  0%,100% { transform: scale(1); opacity: .6; }
  50% { transform: scale(1.15); opacity: 0; }
}
.jb-icon { font-size: 1.6rem; }
.jb-notif {
  position: absolute; top: 0; right: 0;
  width: 18px; height: 18px;
  background: #E8192C; border-radius: 50%;
  font-size: .65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  color: #fff; border: 2px solid #03030A;
}
#jarvas-chat {
  position: fixed; bottom: 104px; right: 28px;
  width: 360px; height: 500px;
  background: #0a0a14;
  border: 1px solid rgba(21,101,255,.25);
  border-radius: 18px;
  display: flex; flex-direction: column;
  z-index: 9997;
  box-shadow: 0 24px 80px rgba(0,0,0,.8), 0 0 0 1px rgba(21,101,255,.1);
  transform: scale(.85) translateY(20px);
  opacity: 0; pointer-events: none;
  transition: all .3s cubic-bezier(.2,.8,.3,1);
  overflow: hidden;
}
#jarvas-chat.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
.jc-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(90deg, rgba(21,101,255,.12), rgba(232,25,44,.06));
  border-bottom: 1px solid rgba(255,255,255,.06);
  flex-shrink: 0;
}
.jc-hinfo { display: flex; align-items: center; gap: 10px; }
.jc-avatar {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #1565FF, #E8192C);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
}
.jc-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: .08em; color: #fff; }
.jc-status { display: flex; align-items: center; gap: 5px; font-size: .65rem; color: rgba(240,237,232,.45); letter-spacing: .06em; }
.jc-dot { width: 6px; height: 6px; background: #00d264; border-radius: 50%; animation: jbPulse 2s ease infinite; }
.jc-close {
  background: rgba(255,255,255,.06); border: none; color: rgba(240,237,232,.5);
  cursor: pointer; width: 28px; height: 28px; border-radius: 6px;
  font-size: .8rem; display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
.jc-close:hover { background: rgba(232,25,44,.2); color: #E8192C; }
.jc-messages {
  flex: 1; overflow-y: auto; padding: 16px;
  display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth;
}
.jc-messages::-webkit-scrollbar { width: 3px; }
.jc-messages::-webkit-scrollbar-thumb { background: rgba(21,101,255,.3); border-radius: 2px; }
.jc-msg { display: flex; }
.jc-msg.bot { justify-content: flex-start; }
.jc-msg.user { justify-content: flex-end; }
.jc-bubble { max-width: 80%; padding: 10px 14px; border-radius: 14px; font-size: .82rem; line-height: 1.6; font-family: 'Rajdhani', sans-serif; }
.jc-msg.bot .jc-bubble { background: rgba(21,101,255,.1); border: 1px solid rgba(21,101,255,.2); color: rgba(240,237,232,.9); border-bottom-left-radius: 4px; }
.jc-msg.user .jc-bubble { background: linear-gradient(135deg, #1565FF, #0d45b5); color: #fff; border-bottom-right-radius: 4px; }
.jc-typing { display: flex; gap: 4px; align-items: center; padding: 12px 16px; }
.jc-typing span { width: 6px; height: 6px; background: rgba(21,101,255,.6); border-radius: 50%; animation: typingDot .8s ease infinite; }
.jc-typing span:nth-child(2) { animation-delay: .15s; }
.jc-typing span:nth-child(3) { animation-delay: .3s; }
@keyframes typingDot {
  0%,100% { transform: translateY(0); opacity: .4; }
  50% { transform: translateY(-5px); opacity: 1; }
}
.jc-input-wrap {
  display: flex; gap: 8px; padding: 12px 14px;
  border-top: 1px solid rgba(255,255,255,.06);
  background: rgba(255,255,255,.02); flex-shrink: 0;
}
#jc-input {
  flex: 1; background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08); border-radius: 10px;
  padding: 9px 14px; color: #F0EDE8;
  font-family: 'Rajdhani', sans-serif; font-size: .85rem;
  outline: none; transition: border-color .3s;
}
#jc-input:focus { border-color: rgba(21,101,255,.5); }
#jc-input::placeholder { color: rgba(240,237,232,.3); }
#jc-send {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #1565FF, #0d45b5);
  border: none; border-radius: 10px; color: #fff;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all .3s;
}
#jc-send:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(21,101,255,.5); }
#jc-send:disabled { opacity: .4; cursor: not-allowed; transform: none; }
@media(max-width:480px) {
  #jarvas-chat { width: calc(100vw - 20px); right: 10px; bottom: 90px; }
  #jarvas-bubble { bottom: 18px; right: 18px; }
}
</style>
`;

document.body.insertAdjacentHTML('beforeend', jarvasHTML);

// ── CHAT STATE ──
let chatOpen    = false;
let isTyping    = false;
let chatHistory = [];

const bubble   = document.getElementById('jarvas-bubble');
const chatWin  = document.getElementById('jarvas-chat');
const closeBtn = document.getElementById('jc-close');
const input    = document.getElementById('jc-input');
const sendBtn  = document.getElementById('jc-send');
const messages = document.getElementById('jc-messages');
const notif    = document.getElementById('jb-notif');

bubble.addEventListener('click', () => {
  chatOpen = !chatOpen;
  chatWin.classList.toggle('open', chatOpen);
  if (chatOpen) { notif.style.display = 'none'; setTimeout(() => input.focus(), 300); }
});
closeBtn.addEventListener('click', () => { chatOpen = false; chatWin.classList.remove('open'); });

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(); });

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `jc-msg ${role}`;
  div.innerHTML = `<div class="jc-bubble">${text}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'jc-msg bot';
  div.id = 'jc-typing-indicator';
  div.innerHTML = `<div class="jc-bubble jc-typing"><span></span><span></span><span></span></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('jc-typing-indicator');
  if (t) t.remove();
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text || isTyping) return;

  input.value = '';
  isTyping = true;
  sendBtn.disabled = true;

  addMessage(text, 'user');
  chatHistory.push({ role: 'user', content: text });
  showTyping();

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: JARVAS_SYSTEM },
          ...chatHistory
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try again!";

    hideTyping();
    addMessage(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });

    if (chatHistory.length % 6 === 0) sendEmailSummary();

  } catch (err) {
    hideTyping();
    addMessage("Oops! Something went wrong. Please try again. 🔧", 'bot');
  }

  isTyping = false;
  sendBtn.disabled = false;
  input.focus();
}

function sendEmailSummary() {
  if (typeof emailjs === 'undefined') return;
  let convo = '';
  chatHistory.forEach(msg => {
    convo += `${msg.role === 'user' ? '👤 User' : '🤖 Jarvas'}: ${msg.content}\n\n`;
  });
  emailjs.send(EMAILJS_SVC, EMAILJS_TPL, {
    name: 'Portfolio Visitor',
    time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    message: convo,
    email: 'visitor@portfolio.com'
  }).catch(() => {});
}

window.addEventListener('beforeunload', () => {
  if (chatHistory.length > 0) sendEmailSummary();
});