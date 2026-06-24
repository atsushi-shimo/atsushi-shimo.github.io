/* ============================================
   HERO CANVAS — particle field
   ============================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COUNT = 80;

  const GOLD  = [184, 154, 90];
  const CYAN  = [79, 207, 207];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    randBetween(0.3, 1.4),
      vx:   randBetween(-0.12, 0.12),
      vy:   randBetween(-0.12, 0.12),
      col:  Math.random() > 0.6 ? CYAN : GOLD,
      alpha: randBetween(0.1, 0.55),
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(184,154,90,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.alpha})`;
      ctx.fill();

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
   SCROLL REVEAL
   ============================================ */
(function () {
  const targets = document.querySelectorAll(
    '#showreel, #gallery, #contact, .video-item, .gallery-item, .section-title, .section-label'
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
