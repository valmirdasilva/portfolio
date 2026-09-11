/* Carolina Guaragna — interações.
   Sem dependência externa: IntersectionObserver no lugar do Framer Motion. */
(function () {
  'use strict';

  /* Navbar ganha fundo ao rolar */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu-mobile');

  var fecharMenu = function () {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
  };

  burger.addEventListener('click', function () {
    var aberto = burger.getAttribute('aria-expanded') === 'true';
    if (aberto) {
      fecharMenu();
    } else {
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fechar menu');
    }
  });

  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', fecharMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharMenu();
  });

  /* Entrada das seções ao rolar. Dispara uma vez só. */
  var alvos = document.querySelectorAll('.reveal');
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduzido || !('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-in');
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* Só um accordion do FAQ aberto por vez */
  var perguntas = document.querySelectorAll('.faq__list details');
  perguntas.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      perguntas.forEach(function (outra) {
        if (outra !== d) outra.open = false;
      });
    });
  });

  /* Ano do rodapé */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
