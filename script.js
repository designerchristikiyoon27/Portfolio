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
// Updated room filter and load more handling
const roomFilters = document.querySelectorAll('.room-filter');
const galleryContainers = document.querySelectorAll('.gallery-medium-container');
let currentRoom = 'all'; // default shows all

// Initialize Load More for each gallery container
galleryContainers.forEach(container => {
  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.textContent = 'Load More';
  loadMoreBtn.className = 'load-more-btn';
  loadMoreBtn.style = 'margin:2rem auto;display:block';
  container.parentNode.insertBefore(loadMoreBtn, container.nextSibling);

  // State holder
  container._loadMore = {
    visibleCount: 12,
    filterRoom: 'all',
    update() {
      const items = Array.from(container.querySelectorAll('.g-item'));
      let shown = 0;
      items.forEach(item => {
        const itemRoom = item.getAttribute('data-room');
        const matchesFilter = this.filterRoom === 'all' || itemRoom === this.filterRoom;
        if (!matchesFilter) {
          item.style.display = 'none';
          return;
        }
        if (shown < this.visibleCount) {
          item.style.display = '';
          shown++;
        } else {
          item.style.display = 'none';
        }
      });
      // Show button only if there are hidden matching items
      const totalMatching = items.filter(i => this.filterRoom === 'all' || i.getAttribute('data-room') === this.filterRoom).length;
      loadMoreBtn.style.display = (shown < totalMatching) ? 'block' : 'none';
    },
    reset() {
      this.visibleCount = 12;
      this.update();
    }
  };

  // Initial update
  container._loadMore.update();

  // Load More button click
  loadMoreBtn.addEventListener('click', () => {
    container._loadMore.visibleCount += 12;
    container._loadMore.update();
  });
});

// Room filter interaction
roomFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    // Update active UI
    roomFilters.forEach(f => f.classList.remove('active'));
    filter.classList.add('active');
    const room = filter.getAttribute('data-room');
    currentRoom = room;
    // Apply filter to each container's load more state
    galleryContainers.forEach(container => {
      container._loadMore.filterRoom = room;
      container._loadMore.reset(); // reset visibleCount to 12 for new filter
    });
  });
});

  // Trigger initial filter and load more setup
  const initialFilter = document.querySelector('.room-filter.active');
  if (initialFilter) initialFilter.click();

  /* ── Lightbox Logic ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    // Open lightbox
    document.querySelectorAll('.g-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const cap = item.querySelector('.g-cap');
        if (img) {
          lightbox.style.display = 'flex';
          lightboxImg.src = img.src;
          if (cap) {
            lightboxCaption.textContent = cap.textContent;
          } else {
            lightboxCaption.textContent = '';
          }
          document.body.classList.add('no-scroll'); // Prevent background scrolling
        }
      });
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      document.body.classList.remove('no-scroll');
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on outside click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });
  }

});
