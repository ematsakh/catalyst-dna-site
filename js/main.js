/**
 * Catalyst-DNA — main.js
 *
 * Converted from React:
 *   - useFadeIn() hook → IntersectionObserver on .fade-in and .reveal elements
 *   - Nav scrolled state → .is-scrolled class on .site-nav
 *   - Mobile menu toggle
 *   - Smooth anchor scroll with nav-height offset
 */

(function () {
  'use strict';

  /* ── Nav: scrolled state ─────────────────────────────────
     Source: Nav() — useState(scrolled), useEffect scroll listener
     const h = () => setScrolled(window.scrollY > 40)
     Mapped to: add/remove .is-scrolled at 40px threshold
  ─────────────────────────────────────────────────────── */
  const nav = document.getElementById('site-nav');

  if (nav) {
    const handleNavScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Initialise on load
  }

  /* ── Mobile menu toggle ─────────────────────────────────
     Source: Nav() — useState(menuOpen), setMenuOpen(!menuOpen)
     Mapped to: toggle .is-open on .mobile-menu
  ─────────────────────────────────────────────────────── */
  const toggle     = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (toggle && mobileMenu) {

    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on any link click inside the menu
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── FadeIn / Reveal: IntersectionObserver ───────────────
     Source: useFadeIn(threshold = 0.15) hook
       const obs = new IntersectionObserver(
         ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
         { threshold }
       );
     FadeIn component: threshold 0.12
     Mapped to: add .is-visible class; CSS handles opacity/transform
  ─────────────────────────────────────────────────────── */
  function observeElements(selector, threshold) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // disconnect per-element, like obs.disconnect()
          }
        });
      },
      { threshold }
    );

    elements.forEach(el => observer.observe(el));
  }

  // FadeIn: threshold 0.12 (useFadeIn(0.12) in FadeIn component)
  observeElements('.fade-in', 0.12);

  // Section children with .reveal: threshold 0.12
  observeElements('.reveal', 0.12);

  /* ── Smooth anchor scroll with nav offset ───────────────
     Replaces default jump behaviour; accounts for fixed nav height.
  ─────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      const navHeight = nav ? nav.offsetHeight : 64;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
