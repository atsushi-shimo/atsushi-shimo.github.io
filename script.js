/* ============================================
   HERO CANVAS — particle field with sparkle
   ============================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COUNT = 120;

  const GOLD  = [212, 184, 122];
  const CYAN  = [79, 207, 207];
  const BLUE  = [100, 160, 255];
  const WHITE = [240, 237, 232];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function pickColor() {
    const r = Math.random();
    if (r < 0.35) return GOLD;
    if (r < 0.60) return CYAN;
    if (r < 0.80) return BLUE;
    return WHITE;
  }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => {
      const isSparkle = Math.random() < 0.18;
      return {
        x:        Math.random() * W,
        y:        Math.random() * H,
        r:        isSparkle ? randBetween(1.8, 3.5) : randBetween(0.4, 1.6),
        vx:       randBetween(-0.15, 0.15),
        vy:       randBetween(-0.15, 0.15),
        col:      pickColor(),
        alpha:    isSparkle ? randBetween(0.5, 0.9) : randBetween(0.1, 0.45),
        sparkle:  isSparkle,
        phase:    Math.random() * Math.PI * 2,
        speed:    randBetween(0.012, 0.03),
      };
    });
  }

  function drawSparkle(p, t) {
    const pulse = 0.6 + 0.4 * Math.sin(t * p.speed + p.phase);
    const r = p.r * pulse;
    const alpha = p.alpha * pulse;

    // outer glow
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
    grd.addColorStop(0, `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${alpha * 0.6})`);
    grd.addColorStop(1, `rgba(${p.col[0]},${p.col[1]},${p.col[2]},0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // core dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${alpha})`;
    ctx.fill();

    // cross flare
    ctx.save();
    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},1)`;
    ctx.lineWidth = 0.6;
    const len = r * 3.5;
    ctx.beginPath();
    ctx.moveTo(p.x - len, p.y); ctx.lineTo(p.x + len, p.y);
    ctx.moveTo(p.x, p.y - len); ctx.lineTo(p.x, p.y + len);
    ctx.stroke();
    ctx.restore();
  }

  let t = 0;

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    t++;

    // subtle radial gradient bg tint
    const bgGrd = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.7);
    bgGrd.addColorStop(0, 'rgba(15, 30, 60, 0.35)');
    bgGrd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bgGrd;
    ctx.fillRect(0, 0, W, H);

    // connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const a = (1 - dist / 110) * 0.07;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(100,160,255,${a})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // dots & sparkles
    particles.forEach(p => {
      if (p.sparkle) {
        drawSparkle(p, t);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.alpha})`;
        ctx.fill();
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });

    requestAnimationFrame(drawFrame);
  }

  resize();
  initParticles();
  drawFrame();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
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
   GALLERY LIGHTBOX — fullscreen on click
   ============================================ */
(function () {
  // create overlay
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

  let items = [];
  let current = 0;

  function getVisibleItems() {
    return [...document.querySelectorAll('.gallery-item:not(.hidden) img')];
  }

  function open(idx) {
    items = getVisibleItems();
    current = idx;
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

  function prev() {
    if (current > 0) { current--; lbImg.src = items[current].src; updateNav(); }
  }

  function next() {
    if (current < items.length - 1) { current++; lbImg.src = items[current].src; updateNav(); }
  }

  document.addEventListener('click', e => {
    const img = e.target.closest('.gallery-item:not(.hidden) img');
    if (img) {
      const allImgs = getVisibleItems();
      open(allImgs.indexOf(img));
    }
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
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
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
