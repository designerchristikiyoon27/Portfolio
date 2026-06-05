/* ============================================================
   Kumari Puja — Luxurious Portfolio JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 900);
  };
  if (document.readyState === 'complete') setTimeout(hideLoader, 800);
  else window.addEventListener('load', () => setTimeout(hideLoader, 800));

  /* ── Nav: scroll + auto-hide ── */
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 60);
      if (y > lastY && y > 150) nav.classList.add('nav--hidden');
      else nav.classList.remove('nav--hidden');
    }
    lastY = y;
  }, { passive: true });

  /* ── Hero parallax ── */
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = `scale(1.08) translateY(${y * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight : 0;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ── Active nav link ── */
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id], header[id]');

  const linkObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => linkObserver.observe(s));

  /* ── Mobile menu ── */
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  const toggleMenu = () => {
    const open = navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
  };

  if (navToggle) navToggle.addEventListener('click', toggleMenu);
  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      if (navLinksEl.classList.contains('open')) toggleMenu();
    });
  });

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.section-intro, .project-header, .project-hero-img, .project-desc, .phase-label, .about-portrait, .about-content, .timeline-item, .contact-inner'
  ).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* ── Gallery stagger reveal ── */
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const items = gallery.querySelectorAll('.g-item');
    items.forEach(item => {
      item.classList.add('reveal');
      revealObserver.observe(item);
    });

    const gObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.07}s`;
            item.classList.add('visible');
          });
          gObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    gObs.observe(gallery);
  });

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;

  const animateCount = (el, target) => {
    const start = performance.now();
    const duration = 2000;
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4); // quartic easeOut
      el.textContent = Math.floor(ease * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      const countObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !counted) {
            counted = true;
            counters.forEach((c, i) => setTimeout(() => animateCount(c, +c.dataset.count), i * 200));
            countObs.disconnect();
          }
        });
      }, { threshold: 0.5 });
      countObs.observe(heroEl);
    }
  }

  /* ── Timeline stagger ── */
  const tlItems = document.querySelectorAll('.timeline-item');
  tlItems.forEach((item, i) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${i * 0.1}s`;
  });

  /* ── Gallery Tabs ── */
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const mediumContainers = document.querySelectorAll('.gallery-medium-container');

  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const medium = tab.getAttribute('data-medium');
      mediumContainers.forEach(c => {
        c.style.display = c.id === `medium-${medium}` ? 'block' : 'none';
      });
    });
  });

  /* ── Room Filters ── */
  const roomFilters = document.querySelectorAll('.room-filter');
  const roomItems = document.querySelectorAll('.room-item');

  roomFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      roomFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      const room = filter.getAttribute('data-room');
      
      roomItems.forEach(item => {
        if (room === 'all' || item.getAttribute('data-room') === room) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Trigger initial filter
  const initialFilter = document.querySelector('.room-filter.active');
  if (initialFilter) initialFilter.click();

});
