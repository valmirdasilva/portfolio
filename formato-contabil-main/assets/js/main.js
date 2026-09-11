/* Formato Contábil — interações */
(function () {
  'use strict';

  var WHATSAPP = '5551980700800';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Header sticky state ---------- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (hasIO && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Contadores ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var formatNumber = function (n) { return n.toLocaleString('pt-BR'); };

  var runCounter = function (el) {
    var target = parseInt(el.dataset.count, 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var start = performance.now();

    var tick = function (now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + formatNumber(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if (reduceMotion || !hasIO) {
      counters.forEach(function (el) {
        el.textContent = (el.dataset.prefix || '') + formatNumber(parseInt(el.dataset.count, 10)) + (el.dataset.suffix || '');
      });
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- Tabs de serviços ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));

  var activateTab = function (tab, focus) {
    tabs.forEach(function (t) {
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    if (focus) tab.focus();
  };

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { activateTab(tab); });

    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      activateTab(next, true);
    });
  });

  document.querySelectorAll('[data-tab]').forEach(function (link) {
    link.addEventListener('click', function () {
      var tab = document.getElementById(link.dataset.tab);
      if (tab) activateTab(tab);
    });
  });

  /* ---------- Carrossel de depoimentos ---------- */
  var slider = document.getElementById('slider-depoimentos');

  if (slider) {
    var track = document.getElementById('slider-track');
    var slides = Array.prototype.slice.call(track.children);
    var dotsBox = document.getElementById('slider-dots');
    var prevBtn = document.getElementById('slider-prev');
    var nextBtn = document.getElementById('slider-next');

    var perView = function () {
      if (window.innerWidth <= 680) return 1;
      if (window.innerWidth <= 1000) return 2;
      return 3;
    };

    var index = 0;
    var timer = null;

    var maxIndex = function () { return Math.max(0, slides.length - perView()); };

    var renderDots = function () {
      dotsBox.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Ir para o depoimento ' + (i + 1));
        dot.dataset.index = i;
        dotsBox.appendChild(dot);
      }
    };

    var update = function () {
      index = Math.min(index, maxIndex());
      track.style.transform = 'translateX(' + (-index * (100 / perView())) + '%)';
      Array.prototype.forEach.call(dotsBox.children, function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };

    var goTo = function (i) {
      var last = maxIndex();
      index = i < 0 ? last : (i > last ? 0 : i);
      update();
    };

    var startAuto = function () {
      if (reduceMotion) return;
      stopAuto();
      timer = setInterval(function () { goTo(index + 1); }, 6000);
    };
    var stopAuto = function () {
      if (timer) clearInterval(timer);
      timer = null;
    };

    prevBtn.addEventListener('click', function () { goTo(index - 1); startAuto(); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); startAuto(); });

    dotsBox.addEventListener('click', function (e) {
      var dot = e.target.closest('button');
      if (!dot) return;
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);

    /* swipe no touch */
    var startX = 0;
    slider.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 45) goTo(index + (delta < 0 ? 1 : -1));
      startAuto();
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { renderDots(); update(); }, 150);
    });

    renderDots();
    update();
    startAuto();
  }

  /* ---------- Nav ativa conforme a seção ---------- */
  var sections = ['inicio', 'sobre', 'servicos', 'infos', 'contato']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (hasIO && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.nav__link').forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Formulário → WhatsApp ---------- */
  var form = document.getElementById('form-contato');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var required = ['nome', 'email', 'mensagem'];
      var valid = true;

      required.forEach(function (id) {
        var field = document.getElementById(id);
        var ok = field.value.trim() !== '' && field.checkValidity();
        field.classList.toggle('is-invalid', !ok);
        if (!ok && valid) field.focus();
        if (!ok) valid = false;
      });

      if (!valid) return;

      var nome = document.getElementById('nome').value.trim();
      var sobrenome = document.getElementById('sobrenome').value.trim();
      var email = document.getElementById('email').value.trim();
      var telefone = document.getElementById('telefone').value.trim();
      var assunto = document.getElementById('assunto').value;
      var mensagem = document.getElementById('mensagem').value.trim();

      var linhas = [
        'Olá! Vim pelo site da Formato Contábil.',
        '',
        'Nome: ' + nome + (sobrenome ? ' ' + sobrenome : ''),
        'E-mail: ' + email
      ];
      if (telefone) linhas.push('Telefone: ' + telefone);
      linhas.push('Assunto: ' + assunto, '', mensagem);

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });

    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
        e.target.classList.remove('is-invalid');
      }
    });
  }

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
