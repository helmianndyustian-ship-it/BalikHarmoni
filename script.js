/* ════════════════════════════════════════════
   BALIK HARMONI — script.js
   Carousel · Scroll Animations · Counter
   Navbar · Particles · Tracking
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. NAVBAR — scroll effect & hamburger
  ───────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when nav link clicked
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    }
  });


  /* ─────────────────────────────────────────
     2. PRODUCT CAROUSEL (Hero)
  ───────────────────────────────────────── */
  const track    = document.getElementById('carouselTrack');
  const slides   = track ? [...track.querySelectorAll('.cslide')] : [];
  const dotsWrap = document.getElementById('carrDots');
  const prevBtn  = document.getElementById('carrPrev');
  const nextBtn  = document.getElementById('carrNext');

  let currentSlide = 0;
  let autoTimer    = null;
  const SLIDE_INTERVAL = 3000; // ms

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carr-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots(idx) {
    dotsWrap?.querySelectorAll('.carr-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function goToSlide(idx) {
    currentSlide = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots(currentSlide);
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (slides.length > 0 && track) {
    buildDots();
    goToSlide(0);
    startAuto();

    prevBtn?.addEventListener('click', () => { prevSlide(); startAuto(); });
    nextBtn?.addEventListener('click', () => { nextSlide(); startAuto(); });

    // Pause on hover
    track.closest('.carousel-stage')?.addEventListener('mouseenter', stopAuto);
    track.closest('.carousel-stage')?.addEventListener('mouseleave', startAuto);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX   = 0;
    const stage = track.closest('.carousel-stage');
    stage?.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    stage?.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? nextSlide() : prevSlide();
        startAuto();
      }
    }, { passive: true });
  }


  /* ─────────────────────────────────────────
     3. SCROLL REVEAL (Intersection Observer)
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay based on position within siblings
        const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Hero text & carousel reveal on load
  setTimeout(() => {
    document.getElementById('heroText')?.classList.add('visible');
  }, 200);
  setTimeout(() => {
    document.getElementById('heroCarousel')?.classList.add('visible');
  }, 400);


  /* ─────────────────────────────────────────
     4. COUNTER ANIMATION
  ───────────────────────────────────────── */
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString('id-ID');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString('id-ID');
      }
    }, step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(el => animateCounter(el));
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);


  /* ─────────────────────────────────────────
     5. FLOATING LEAF PARTICLES
  ───────────────────────────────────────── */
  const leavesContainer = document.getElementById('floatingLeaves');
  const LEAF_EMOJIS = ['🍯', '🐝'];

  function createLeaf() {
    if (!leavesContainer) return;
    const leaf = document.createElement('span');
    leaf.className = 'leaf-particle';
    leaf.textContent = LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)];

    const startX  = Math.random() * 100;
    const delay   = Math.random() * 8;
    const duration = 8 + Math.random() * 12;
    const size    = 0.7 + Math.random() * 0.8;

    leaf.style.cssText = `
      left: ${startX}%;
      top: -30px;
      font-size: ${size}rem;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;

    leavesContainer.appendChild(leaf);

    // Remove after animation
    setTimeout(() => leaf.remove(), (duration + delay) * 1000);
  }

  // Spawn leaves periodically
  const leafInterval = setInterval(createLeaf, 1800);
  // Initial burst
  for (let i = 0; i < 5; i++) setTimeout(createLeaf, i * 300);

  // Stop spawning leaves after 60s to save resources
  setTimeout(() => clearInterval(leafInterval), 60000);


  /* ─────────────────────────────────────────
     6. SMOOTH ANCHOR SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────
     7. ACTIVE NAV LINK on scroll
  ───────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          const href = link.getAttribute('href');
          link.style.color = href === `#${id}` ? 'var(--orange)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ─────────────────────────────────────────
     8. TRACKING HELPER (GA4 + Meta Pixel)
     Global function — also defined inline in HTML
  ───────────────────────────────────────── */
  window.trackCTA = function(eventName, label) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        event_category: 'CTA',
        event_label: label || eventName,
        value: 1
      });
    }
    // Meta Pixel
    // Debug log (remove in production)
    console.log(`[Track] ${eventName}${label ? ' — ' + label : ''}`);
  };


  /* ─────────────────────────────────────────
     9. TRACK SCROLL DEPTH (GA4)
  ───────────────────────────────────────── */
  const scrollMilestones = { 25: false, 50: false, 75: false, 90: false };

  window.addEventListener('scroll', () => {
    const scrollPct = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    Object.keys(scrollMilestones).forEach(pct => {
      if (!scrollMilestones[pct] && scrollPct >= parseInt(pct, 10)) {
        scrollMilestones[pct] = true;
        if (typeof gtag === 'function') {
          gtag('event', 'scroll_depth', { depth_percentage: pct });
        }
      }
    });
  }, { passive: true });


  /* ─────────────────────────────────────────
     10. TRACK TIME ON PAGE (GA4)
         Fires at 30s & 60s to measure engagement
  ───────────────────────────────────────── */
  const engagementTimers = [
    { seconds: 30,  fired: false },
    { seconds: 60,  fired: false },
    { seconds: 120, fired: false },
  ];

  const startTime = Date.now();
  setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    engagementTimers.forEach(t => {
      if (!t.fired && elapsed >= t.seconds) {
        t.fired = true;
        if (typeof gtag === 'function') {
          gtag('event', 'time_on_page', { seconds: t.seconds });
        }
      }
    });
  }, 5000);


  /* ─────────────────────────────────────────
     11. MARQUEE pause on hover
  ───────────────────────────────────────── */
  const marqueeInner = document.querySelector('.marquee-inner');
  const marqueeBar   = document.querySelector('.marquee-bar');
  marqueeBar?.addEventListener('mouseenter', () => {
    marqueeInner.style.animationPlayState = 'paused';
  });
  marqueeBar?.addEventListener('mouseleave', () => {
    marqueeInner.style.animationPlayState = 'running';
  });


  /* ─────────────────────────────────────────
     12. PRODUCT CARD — track view (Pixel)
  ───────────────────────────────────────── */
  const productCards = document.querySelectorAll('.produk-card:not(.pk-cta)');
  const productNames = [
    'Selaras Pure Honey',
    'Herbal Stamina Mix',
    'Propolis Murni',
    'Madu Kelulut',
    'Minyak Zaitun'
  ];

  const productObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...productCards].indexOf(entry.target);
        const name = productNames[idx] || `Produk ${idx + 1}`;
        if (typeof fbq === 'function') {
          fbq('track', 'ViewContent', { content_name: name, content_type: 'product' });
        }
        productObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  productCards.forEach(card => productObserver.observe(card));


  /* ─────────────────────────────────────────
     13. FLOATING PRODUCT CARD hover 3D tilt
  ───────────────────────────────────────── */
  document.querySelectorAll('.cslide-inner').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 4;
      const tiltY  = ((cx - x) / cx) * 4;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ─────────────────────────────────────────
     14. WhatsApp float — show after 3s delay
  ───────────────────────────────────────── */
  const waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    waFloat.style.opacity = '0';
    waFloat.style.transform = 'translateY(20px)';
    waFloat.style.transition = 'opacity .5s, transform .5s';
    setTimeout(() => {
      waFloat.style.opacity = '1';
      waFloat.style.transform = 'translateY(0)';
    }, 3000);
  }

  console.log('✅ Balik Harmoni — All scripts loaded.');
});
