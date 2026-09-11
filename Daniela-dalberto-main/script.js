/* Daniela Dalberto · Advogada — interactions (vanilla JS) */
(function () {
  'use strict';

  var WHATS = '5551999825174';

  /* ---- Header scroll state ---- */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.nav-toggle');
  var mobile = document.querySelector('.mobile-nav');
  function closeMenu() {
    mobile.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---- Back to top ---- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      smoothScrollTo(0, 800);
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Contact form -> WhatsApp ---- */
  var form = document.getElementById('whatsForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.nome;
      var area = form.area;
      var msg = form.mensagem;
      var ok = true;

      [nome, area].forEach(function (f) {
        if (!f.value.trim()) { f.classList.add('invalid'); ok = false; }
        else { f.classList.remove('invalid'); }
      });
      if (!ok) { (nome.value.trim() ? area : nome).focus(); return; }

      var text =
        'Olá, Dra. Daniela! Meu nome é ' + nome.value.trim() + '.\n' +
        'Assunto: ' + area.value + '.' +
        (msg.value.trim() ? '\n\n' + msg.value.trim() : '') +
        '\n\nGostaria de agendar uma consulta.';

      var url = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });

    form.querySelectorAll('input,select,textarea').forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('invalid'); });
    });
  }

  /* ---- Smooth anchor scroll (custom rAF easing, ignores OS reduce-motion) ---- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var OFFSET = 72;

  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function smoothScrollTo(destY, duration) {
    var startY = window.pageYOffset;
    var diff = destY - startY;
    if (Math.abs(diff) < 2) return;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var destY;
      if (id === '#topo' || getComputedStyle(target).position === 'fixed') {
        destY = 0; /* fixed header / home → very top */
      } else {
        destY = target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
      }
      var dist = Math.abs(destY - window.pageYOffset);
      var dur = Math.min(1100, Math.max(500, dist * 0.6));
      smoothScrollTo(destY, dur);
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ---- Carousel ---- */
  var carousel = document.getElementById('galeria');
  if (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dotsWrap = carousel.querySelector('.carousel-dots');
    var prev = carousel.querySelector('.carousel-prev');
    var next = carousel.querySelector('.carousel-next');
    var index = 0, total = slides.length, timer = null;

    for (var i = 0; i < total; i++) {
      var d = document.createElement('button');
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Foto ' + (i + 1));
      (function (n) { d.addEventListener('click', function () { go(n); reset(); }); })(i);
      dotsWrap.appendChild(d);
    }
    var dots = dotsWrap.querySelectorAll('button');

    function go(n) {
      index = (n + total) % total;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (dot, k) { dot.classList.toggle('active', k === index); });
    }
    function reset() {
      if (prefersReduced) return;
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, 5000);
    }
    prev.addEventListener('click', function () { go(index - 1); reset(); });
    next.addEventListener('click', function () { go(index + 1); reset(); });

    /* swipe */
    var x0 = null;
    carousel.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); reset(); }
      x0 = null;
    }, { passive: true });

    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', reset);

    go(0); reset();
  }

  /* ---- Footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
