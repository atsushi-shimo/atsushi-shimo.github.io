/* ============================================
   HERO CANVAS — intense sparkle particle field
   ============================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COUNT = 220;

  // Color palette: metallic gold, cyan, electric blue, white
  const COLORS = [
    [255, 220, 120],  // bright metallic gold
    [200, 170,  80],  // deep gold
    [ 80, 230, 230],  // bright cyan
    [ 40, 200, 220],  // deep cyan
    [120, 200, 255],  // electric blue
    [255, 255, 240],  // near-white shimmer
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => {
      const type = Math.random();
      const isLarge   = type < 0.12;  // big sparkles
      const isMedium  = type < 0.30;  // medium glow dots
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x:      Math.random() * W,
        y:      Math.random() * H,
        r:      isLarge ? rand(1.2, 2.2) : isMedium ? rand(0.6, 1.2) : rand(0.2, 0.7),
        vx:     rand(-0.18, 0.18),
        vy:     rand(-0.18, 0.18),
        col,
        alpha:  isLarge ? rand(0.6, 0.9) : isMedium ? rand(0.35, 0.65) : rand(0.12, 0.4),
        phase:  Math.random() * Math.PI * 2,
        speed:  rand(0.015, 0.045),
        type:   isLarge ? 'star' : isMedium ? 'glow' : 'dot',
      };
    });
  }

  function drawStar(p, t) {
    const pulse = 0.55 + 0.45 * Math.sin(t * p.speed + p.phase);
    const r     = p.r * pulse;
    const a     = p.alpha * pulse;
    const [cr, cg, cb] = p.col;

    // large outer glow
    let grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
    grd.addColorStop(0,   `rgba(${cr},${cg},${cb},${a * 0.45})`);
    grd.addColorStop(0.4, `rgba(${cr},${cg},${cb},${a * 0.12})`);
    grd.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // mid glow
    grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
    grd.addColorStop(0, `rgba(${cr},${cg},${cb},${a * 0.9})`);
    grd.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // bright core
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a * 0.95})`;
    ctx.fill();

    // cross flare (4-point star)
    ctx.save();
    ctx.globalAlpha = a * 0.65;
    const len = r * 5;
    const shortLen = r * 3;
    // long arms
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},1)`;
    ctx.lineWidth = r * 0.35;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x - len, p.y); ctx.lineTo(p.x + len, p.y);
    ctx.moveTo(p.x, p.y - len); ctx.lineTo(p.x, p.y + len);
    ctx.stroke();
    // diagonal arms (thinner)
    ctx.globalAlpha = a * 0.3;
    ctx.lineWidth = r * 0.2;
    ctx.beginPath();
    ctx.moveTo(p.x - shortLen * 0.7, p.y - shortLen * 0.7);
    ctx.lineTo(p.x + shortLen * 0.7, p.y + shortLen * 0.7);
    ctx.moveTo(p.x + shortLen * 0.7, p.y - shortLen * 0.7);
    ctx.lineTo(p.x - shortLen * 0.7, p.y + shortLen * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  function drawGlow(p, t) {
    const pulse = 0.6 + 0.4 * Math.sin(t * p.speed + p.phase);
    const r     = p.r * pulse;
    const a     = p.alpha * pulse;
    const [cr, cg, cb] = p.col;

    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.5);
    grd.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`);
    grd.addColorStop(0.5, `rgba(${cr},${cg},${cb},${a * 0.3})`);
    grd.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`;
    ctx.fill();
  }

  let t = 0;

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    t++;

    // connection lines — cyan tint
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const a = (1 - dist / 100) * 0.1;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(60,200,220,${a})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    particles.forEach(p => {
      if (p.type === 'star') drawStar(p, t);
      else if (p.type === 'glow') drawGlow(p, t);
      else {
        const [cr, cg, cb] = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.alpha})`;
        ctx.fill();
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    });

    requestAnimationFrame(drawFrame);
  }

  resize();
  initParticles();
  drawFrame();

  window.addEventListener('resize', () => { resize(); initParticles(); });
})();


/* ============================================
   HEADER — scroll behaviour
   ============================================ */
(function () {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


/* ============================================
   MOBILE NAV
   ============================================ */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const links = document.querySelectorAll('.nav-mobile-link');
  if (!toggle || !navMobile) return;
  toggle.addEventListener('click', () => {
    const open = navMobile.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ============================================
   GALLERY FILTER
   ============================================ */
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();


/* ============================================
   GALLERY LIGHTBOX
   ============================================ */
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.innerHTML = `
    <div id="lightbox-bg"></div>
    <button id="lightbox-close" aria-label="Close">✕</button>
    <button id="lightbox-prev" aria-label="Previous">‹</button>
    <button id="lightbox-next" aria-label="Next">›</button>
    <img id="lightbox-img" src="" alt="">
  `;
  document.body.appendChild(overlay);

  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev  = document.getElementById('lightbox-prev');
  const lbNext  = document.getElementById('lightbox-next');
  let items = [], current = 0;

  function getVisibleItems() {
    return [...document.querySelectorAll('.gallery-item:not(.hidden) img')];
  }
  function open(idx) {
    items = getVisibleItems(); current = idx;
    lbImg.src = items[current].src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateNav();
  }
  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  function updateNav() {
    lbPrev.style.display = current === 0 ? 'none' : 'flex';
    lbNext.style.display = current === items.length - 1 ? 'none' : 'flex';
  }
  function prev() { if (current > 0) { current--; lbImg.src = items[current].src; updateNav(); } }
  function next() { if (current < items.length - 1) { current++; lbImg.src = items[current].src; updateNav(); } }

  document.addEventListener('click', e => {
    const img = e.target.closest('.gallery-item:not(.hidden) img');
    if (img) { const all = getVisibleItems(); open(all.indexOf(img)); }
  });
  lbClose.addEventListener('click', close);
  document.getElementById('lightbox-bg').addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();


/* ============================================
   SCROLL REVEAL
   ============================================ */
(function () {
  const targets = document.querySelectorAll(
    '#showreel, #contact, .section-title, .section-label'
  );
  targets.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach(el => observer.observe(el));
})();


/* ============================================
   CONTACT FORM — Web3Forms
   ============================================ */
(function () {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.disabled = true;
    status.textContent = 'Sending…';
    try {
      const data = new FormData(form);
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const json = await res.json();
      if (json.success) {
        status.textContent = 'Message sent. Thank you.';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please try again.';
      }
    } catch {
      status.textContent = 'Network error. Please try again.';
    } finally {
      btn.disabled = false;
    }
  });
})();
