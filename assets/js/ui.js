/* FríoTrack — efectos de interfaz de la landing.
   1) Cabecera: pasa de transparente (sobre el héroe) a sólida al desplazarse.
   2) Aparición suave de bloques con la clase .reveal.
   3) Enlace activo del menú según la sección visible.
   Todo es opcional: sin este archivo, la página se ve y funciona igual. */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Cabecera ---------- */
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Aparición al desplazarse ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          seen.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { seen.observe(el); });
  }

  /* ---------- 3. Enlace activo del menú ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var targets = ['hero', 'about', 'features', 'pricing', 'team', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) current = entry.target.id;
      });
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + current;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }
})();
