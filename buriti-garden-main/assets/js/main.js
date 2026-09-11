/* =========================================================
   Buriti Garden Premium — interações do site
   ========================================================= */
(function () {
  'use strict';

  var FULL = 'assets/img/full/';
  var THUMB = 'assets/img/thumb/';

  /* --------- catálogo de imagens do projeto --------- */
  var ITEMS = [
    { s: 'club-house',                   t: 'Club House',                  c: 'convivencia' },
    { s: 'salao-de-festas',              t: 'Salão de Festas',             c: 'convivencia' },
    { s: 'salao-de-festas-2',            t: 'Salão de Festas Gourmet',     c: 'convivencia' },
    { s: 'sala-de-jogos',                t: 'Sala de Jogos',               c: 'convivencia' },
    { s: 'area-gourmet',                 t: 'Área Gourmet',                c: 'convivencia' },
    { s: 'churrasqueira-interna-2',      t: 'Churrasqueira Interna',       c: 'convivencia' },
    { s: 'churrasqueira-externa',        t: 'Churrasqueira Externa',       c: 'convivencia' },
    { s: 'espaco-para-mercado-autonomo', t: 'Mercado Autônomo',            c: 'convivencia' },
    { s: 'rooftop',                      t: 'Rooftop',                     c: 'convivencia' },
    { s: 'estar-com-mirante',            t: 'Estar com Mirante',           c: 'convivencia' },
    { s: 'estar-com-mirante-1',          t: 'Mirante do Lago',             c: 'convivencia' },

    { s: 'praia',                        t: 'Praia Artificial',            c: 'lago' },
    { s: 'casa-do-lago',                 t: 'Casa de Apoio Náutico',       c: 'lago' },
    { s: 'atividades-aquaticas-no-lago', t: 'Atividades Aquáticas',        c: 'lago' },
    { s: 'deck-suspenso',                t: 'Deck Suspenso',               c: 'lago' },
    { s: 'deck-suspenso-1',              t: 'Deck do Pôr do Sol',          c: 'lago' },
    { s: 'mirante-talude',               t: 'Mirante do Talude',           c: 'lago' },
    { s: 'pomar',                        t: 'Pomar',                       c: 'lago' },
    { s: 'horta',                        t: 'Horta Comunitária',           c: 'lago' },
    { s: 'ciclovia',                     t: 'Ciclovia',                    c: 'lago' },
    { s: 'recante-relax',                t: 'Recanto Relax',               c: 'lago' },
    { s: 'espaco-fogo-no-chao',          t: 'Espaço Fogo de Chão',         c: 'lago' },
    { s: 'espaco-para-fogo-de-chao-2',   t: 'Estar do Fogo',               c: 'lago' },

    { s: 'academia',                     t: 'Academia',                    c: 'esporte' },
    { s: 'quadra-de-tenis',              t: 'Quadra de Tênis',             c: 'esporte' },
    { s: 'quadra-poliesportiva',         t: 'Quadra Poliesportiva',        c: 'esporte' },
    { s: 'quadra-poliesportiva-1',       t: 'Quadra Coberta',              c: 'esporte' },
    { s: 'quadras-esportivas-de-areia',  t: 'Quadras de Areia',            c: 'esporte' },
    { s: 'campo-de-futbol',              t: 'Campo de Futebol',            c: 'esporte' },
    { s: 'futmesa',                      t: 'Futmesa',                     c: 'esporte' },
    { s: 'espaco-para-alongamento',      t: 'Espaço de Alongamento',       c: 'esporte' },

    { s: 'spa-com-sauna',                t: 'SPA com Sauna',               c: 'bemestar' },
    { s: 'piscina-coberta-2',            t: 'Piscina Coberta',             c: 'bemestar' },
    { s: 'piscina-coberta-acessivel',    t: 'Piscina Coberta Acessível',   c: 'bemestar' },
    { s: 'piscina-externa-acessivel',    t: 'Piscina Externa',             c: 'bemestar' },
    { s: 'piscina-externa-acessivel-2',  t: 'Piscina Externa Acessível',   c: 'bemestar' },
    { s: 'espaco-beauty',                t: 'Espaço Beauty',               c: 'bemestar' },

    { s: 'playground',                   t: 'Playground',                  c: 'familia' },
    { s: 'play-aventura',                t: 'Play Aventura',               c: 'familia' },
    { s: 'play-ludico',                  t: 'Play Lúdico',                 c: 'familia' },
    { s: 'brinquedoteca',                t: 'Brinquedoteca',               c: 'familia' },
    { s: 'pet-place',                    t: 'Pet Place',                   c: 'familia' },

    { s: 'portaria',                     t: 'Portaria',                    c: 'infra' },
    { s: 'portaria-2',                   t: 'Portaria com Iluminação',     c: 'infra' },
    { s: 'rua',                          t: 'Ruas Arborizadas',            c: 'infra' }
  ];

  var CATS = [
    { k: 'todos',       n: 'Todos' },
    { k: 'convivencia', n: 'Club House' },
    { k: 'lago',        n: 'Lago & Natureza' },
    { k: 'esporte',     n: 'Esportes' },
    { k: 'bemestar',    n: 'Bem-estar' },
    { k: 'familia',     n: 'Família & Pets' },
    { k: 'infra',       n: 'Infraestrutura' }
  ];

  var HERO = [
    { s: 'praia',                     t: 'Praia Artificial' },
    { s: 'piscina-externa-acessivel', t: 'Piscina Externa' },
    { s: 'deck-suspenso-1',           t: 'Deck do Pôr do Sol' },
    { s: 'atividades-aquaticas-no-lago', t: 'Lago Navegável' },
    { s: 'portaria-2',                t: 'Portaria Principal' }
  ];

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ================= LOADER ================= */
  var loader = $('#loader');
  var bar = $('.loader__bar i');
  var pct = 0;
  var tick = setInterval(function () {
    pct = Math.min(96, pct + Math.random() * 18);
    if (bar) bar.style.width = pct + '%';
  }, 160);
  window.addEventListener('load', function () {
    clearInterval(tick);
    if (bar) bar.style.width = '100%';
    setTimeout(function () {
      loader.classList.add('is-done');
      document.body.classList.add('is-ready');
      revealAll();
    }, 420);
  });

  /* =========================================================
     SCROLL SUAVE (lerp) + ÂNCORAS COM EASING
     No desktop o JS assume a rolagem para dar inércia; em telas
     de toque e com "reduzir movimento" mantém o comportamento nativo.
     ========================================================= */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var SMOOTH = !reduceMotion && !coarse;

  var sTarget = window.pageYOffset;
  var sNow = sTarget;
  var sRAF = null;
  var sLock = false; /* trava enquanto menu/lightbox estiverem abertos */

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }
  function clampS(v) { return Math.max(0, Math.min(maxScroll(), v)); }

  function loopScroll() {
    var diff = sTarget - sNow;
    if (Math.abs(diff) < 0.4) {
      sNow = sTarget;
      window.scrollTo(0, sNow);
      sRAF = null;
      return;
    }
    sNow += diff * 0.105;
    window.scrollTo(0, sNow);
    sRAF = requestAnimationFrame(loopScroll);
  }
  function runScroll() { if (!sRAF) sRAF = requestAnimationFrame(loopScroll); }

  if (SMOOTH) {
    document.documentElement.classList.add('has-smooth');
    window.addEventListener('wheel', function (e) {
      if (sLock || e.ctrlKey) return;
      if (e.target.closest && e.target.closest('.lb')) return;
      e.preventDefault();
      var d = e.deltaY * (e.deltaMode === 1 ? 22 : e.deltaMode === 2 ? window.innerHeight : 1);
      sTarget = clampS(sTarget + d);
      runScroll();
    }, { passive: false });

    window.addEventListener('scroll', function () {
      if (!sRAF) { sTarget = sNow = window.pageYOffset; }
    }, { passive: true });

    window.addEventListener('resize', function () { sTarget = clampS(sTarget); });

    document.addEventListener('keydown', function (e) {
      if (sLock) return;
      var t = e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      var vh = window.innerHeight;
      var step = { PageDown: vh * 0.9, PageUp: -vh * 0.9, ArrowDown: 120, ArrowUp: -120, Home: -1e7, End: 1e7 }[e.key];
      if (e.key === ' ' && !e.shiftKey) step = vh * 0.9;
      if (e.key === ' ' && e.shiftKey) step = -vh * 0.9;
      if (step === undefined) return;
      e.preventDefault();
      sTarget = clampS(sTarget + step);
      runScroll();
    });
  }

  /* rolagem programática até um alvo, respeitando o header fixo */
  function headerOffset() {
    var h = document.querySelector('.header');
    return (h ? h.offsetHeight : 80) - 2;
  }
  function scrollToEl(el) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    top = clampS(top);
    if (SMOOTH) { sTarget = top; runScroll(); }
    else { window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' }); }
  }

  /* todas as âncoras internas (header, hero, footer, CTAs) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    var el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    if (history.replaceState) history.replaceState(null, '', hash);
    /* fecha o menu mobile antes de rolar */
    var navEl = document.getElementById('nav');
    if (navEl && navEl.classList.contains('is-open')) {
      navEl.classList.remove('is-open');
      document.getElementById('burger').classList.remove('is-open');
      document.body.style.overflow = '';
      sLock = false;
      setTimeout(function () { scrollToEl(el); }, 260);
      return;
    }
    scrollToEl(el);
  });

  /* entrada direta por âncora (#lazer, #contato...) sem salto seco */
  window.addEventListener('load', function () {
    if (!location.hash) return;
    var el = document.querySelector(location.hash);
    if (!el) return;
    window.scrollTo(0, 0);
    sTarget = sNow = 0;
    setTimeout(function () { scrollToEl(el); }, 600);
  });

  /* ================= HEADER ================= */
  var header = $('#header');
  var scrollbar = $('#scrollbar i');
  var fab = $('.fab');

  function onScroll() {
    var y = window.pageYOffset;
    header.classList.toggle('is-stuck', y > 60);
    if (fab) fab.classList.toggle('is-on', y > 500);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollbar) scrollbar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    spy(y);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* menu mobile */
  var burger = $('#burger');
  var nav = $('#nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    sLock = open;
  });
  $$('#nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  /* scrollspy */
  var sections = $$('section[id]');
  function spy(y) {
    var cur = '';
    sections.forEach(function (s) {
      if (y >= s.offsetTop - window.innerHeight * 0.35) cur = s.id;
    });
    $$('#nav a').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur);
    });
  }

  /* ================= REVEAL ================= */
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) show(e.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
  }
  /* atraso em cascata: cada .reveal entra logo após o irmão anterior */
  function stagger(el) {
    if (el.style.getPropertyValue('--d')) return;
    var sibs = el.parentNode ? Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    }) : [];
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i * 0.09, 0.45).toFixed(2) + 's');
  }
  /* fila dos elementos ainda não revelados — verificada a cada quadro de rolagem.
     O IntersectionObserver continua sendo o caminho principal; esta fila garante
     que nada fique invisível se ele não disparar (rolagem muito rápida, entrada
     direta por âncora, aba em segundo plano, navegador sem suporte). */
  var pending = [];

  function show(el) {
    el.classList.add('is-in');
    var i = pending.indexOf(el);
    if (i > -1) pending.splice(i, 1);
    if (io) io.unobserve(el);
  }
  function observe(el) {
    stagger(el);
    if (pending.indexOf(el) === -1) pending.push(el);
    if (io) io.observe(el); else show(el);
  }
  function revealVisible() {
    if (!pending.length) return;
    var vh = window.innerHeight;
    var vw = window.innerWidth;
    for (var i = pending.length - 1; i >= 0; i--) {
      var el = pending[i];
      var r = el.getBoundingClientRect();
      var dentroY = r.top < vh * 0.96 && r.bottom > 0;
      var dentroX = r.left < vw + 40 && r.right > -40;
      if (dentroY && dentroX) show(el);
    }
  }
  function revealAll() { $$('.reveal:not(.is-in)').forEach(observe); }
  revealAll();
  revealVisible();

  var rafRv = null;
  window.addEventListener('scroll', function () {
    if (rafRv) return;
    rafRv = requestAnimationFrame(function () { rafRv = null; revealVisible(); });
  }, { passive: true });
  window.addEventListener('resize', revealVisible);

  /* contadores */
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var end = parseInt(el.getAttribute('data-count'), 10);
        var t0 = null;
        (function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1400);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* parallax leve + profundidade do hero, num único loop de rAF */
  var pxEls = $$('[data-parallax]');
  var heroContent = $('.hero__content');
  var heroSlidesEl = $('#heroSlides');
  var quoteBg = $('.quote__bg');
  var rafPx = null;

  function paintParallax() {
    rafPx = null;
    var vh = window.innerHeight;
    var y = window.pageYOffset;

    revealVisible();

    if (heroContent && y < vh * 1.2) {
      var p = Math.min(1, y / vh);
      heroContent.style.transform = 'translate3d(0,' + (p * 90).toFixed(1) + 'px,0)';
      heroContent.style.opacity = (1 - p * 1.15).toFixed(3);
      if (heroSlidesEl) heroSlidesEl.style.transform = 'translate3d(0,' + (p * 40).toFixed(1) + 'px,0)';
    }

    pxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var amt = parseFloat(el.getAttribute('data-parallax'));
      var prog = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = 'translate3d(0,' + (prog * amt).toFixed(1) + 'px,0)';
    });

    if (quoteBg) {
      var qr = quoteBg.parentNode.getBoundingClientRect();
      if (qr.bottom > -200 && qr.top < vh + 200) {
        var qp = (qr.top + qr.height / 2 - vh / 2) / vh;
        quoteBg.style.transform = 'translate3d(0,' + (qp * -70).toFixed(1) + 'px,0)';
      }
    }
  }
  function queueParallax() { if (!rafPx) rafPx = requestAnimationFrame(paintParallax); }
  if (!reduceMotion) {
    window.addEventListener('scroll', queueParallax, { passive: true });
    window.addEventListener('resize', queueParallax);
    queueParallax();
  }

  /* ================= HERO SLIDER ================= */
  var slidesBox = $('#heroSlides');
  HERO.forEach(function (it, i) {
    var d = document.createElement('div');
    d.className = 'hero__slide' + (i === 0 ? ' is-active' : '');
    d.innerHTML = '<img src="' + FULL + it.s + '.jpg" alt="' + it.t + '" ' + (i ? 'loading="lazy"' : '') + '>';
    slidesBox.appendChild(d);
  });
  var hSlides = $$('.hero__slide');
  var hIdx = 0;
  var hTimer;
  $('#slideTotal').textContent = pad(HERO.length);
  $('#heroCaption').textContent = HERO[0].t;

  function goHero(n) {
    hIdx = (n + HERO.length) % HERO.length;
    hSlides.forEach(function (s, i) { s.classList.toggle('is-active', i === hIdx); });
    $('#slideNow').textContent = pad(hIdx + 1);
    $('#heroCaption').textContent = HERO[hIdx].t;
    restart();
  }
  function restart() {
    clearInterval(hTimer);
    hTimer = setInterval(function () { goHero(hIdx + 1); }, 6500);
  }
  $('#nextSlide').addEventListener('click', function () { goHero(hIdx + 1); });
  $('#prevSlide').addEventListener('click', function () { goHero(hIdx - 1); });
  restart();

  /* ================= FILTROS + SLIDER DE LAZER ================= */
  var filters = $('#filters');
  var track = $('#sliderTrack');
  var slider = $('#slider');
  var barEl = $('#sliderBar');
  var current = 'todos';
  var pos = 0;

  CATS.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'chip' + (c.k === 'todos' ? ' is-active' : '');
    b.textContent = c.n;
    b.setAttribute('data-cat', c.k);
    b.addEventListener('click', function () {
      $$('.chip').forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      current = c.k;
      pos = 0;
      renderSlider();
    });
    filters.appendChild(b);
  });

  function list() {
    return current === 'todos' ? ITEMS : ITEMS.filter(function (i) { return i.c === current; });
  }
  function catName(k) {
    var f = CATS.filter(function (c) { return c.k === k; })[0];
    return f ? f.n : '';
  }

  function renderSlider() {
    var data = list();
    track.innerHTML = '';
    data.forEach(function (it, i) {
      var a = document.createElement('article');
      a.className = 'card reveal reveal--mask';
      a.style.setProperty('--d', Math.min(i * 0.08, 0.4).toFixed(2) + 's');
      a.setAttribute('data-slug', it.s);
      a.innerHTML =
        '<div class="card__img"><img src="' + THUMB + it.s + '.jpg" alt="' + it.t + '" loading="lazy"></div>' +
        '<div class="card__veil"></div>' +
        '<div class="card__body">' +
          '<span class="card__num">' + pad(i + 1) + ' / ' + pad(data.length) + '</span>' +
          '<h3 class="card__title">' + it.t + '</h3>' +
          '<span class="card__cat">' + catName(it.c) + '</span>' +
        '</div>';
      a.addEventListener('click', function () { openLb(it.s); });
      track.appendChild(a);
      observe(a);
    });
    track.style.transform = 'translate3d(0,0,0)';
    updateBar();
  }

  function step() {
    var card = track.querySelector('.card');
    if (!card) return 320;
    return card.getBoundingClientRect().width + 22;
  }
  function maxPos() {
    return Math.max(0, track.scrollWidth - slider.clientWidth + 40);
  }
  function move(delta) {
    pos = Math.min(maxPos(), Math.max(0, pos + delta));
    track.style.transform = 'translate3d(' + -pos + 'px,0,0)';
    updateBar();
  }
  function updateBar() {
    var m = maxPos();
    var w = m > 0 ? Math.max(12, (slider.clientWidth / track.scrollWidth) * 100) : 100;
    barEl.style.width = w + '%';
    barEl.style.transform = 'translateX(' + (m > 0 ? (pos / m) * (100 / w) * 100 : 0) + '%)';
    $('#slidePrev').disabled = pos <= 0;
    $('#slideNext').disabled = pos >= m - 1;
  }
  $('#slideNext').addEventListener('click', function () { move(step()); });
  $('#slidePrev').addEventListener('click', function () { move(-step()); });
  window.addEventListener('resize', updateBar);

  /* arrastar com mouse/touch */
  var down = false, startX = 0, startPos = 0, moved = 0;
  slider.addEventListener('pointerdown', function (e) {
    down = true; moved = 0; startX = e.clientX; startPos = pos;
    slider.classList.add('is-drag');
    track.style.transition = 'none';
  });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    moved = e.clientX - startX;
    pos = Math.min(maxPos(), Math.max(0, startPos - moved));
    track.style.transform = 'translate3d(' + -pos + 'px,0,0)';
  });
  window.addEventListener('pointerup', function () {
    if (!down) return;
    down = false;
    slider.classList.remove('is-drag');
    track.style.transition = '';
    updateBar();
  });
  track.addEventListener('click', function (e) {
    if (Math.abs(moved) > 6) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  renderSlider();

  /* ================= GALERIA ================= */
  var grid = $('#grid');
  var shown = 0;
  var PAGE = 18; /* múltiplo de 9: mantém a grade fechada (1 tile grande + 8 normais = 3 linhas) */
  function renderGrid() {
    var slice = ITEMS.slice(shown, shown + PAGE);
    slice.forEach(function (it, k) {
      var idx = shown + k;
      var f = document.createElement('figure');
      f.className = 'tile reveal reveal--mask' + (idx % 9 === 0 ? ' tile--big' : '');
      f.style.setProperty('--d', ((idx % 9) * 0.06).toFixed(2) + 's');
      f.innerHTML = '<img src="' + THUMB + it.s + '.jpg" alt="' + it.t + '" loading="lazy"><figcaption>' + it.t + '</figcaption>';
      f.addEventListener('click', function () { openLb(it.s); });
      grid.appendChild(f);
      observe(f);
    });
    shown += slice.length;
    $('#loadMore').style.display = shown >= ITEMS.length ? 'none' : '';
  }
  $('#loadMore').addEventListener('click', renderGrid);
  renderGrid();

  /* ================= LIGHTBOX ================= */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  var lbIdx = 0;
  function openLb(slug) {
    lbIdx = 0;
    ITEMS.forEach(function (it, i) { if (it.s === slug) lbIdx = i; });
    paintLb();
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    sLock = true;
  }
  function paintLb() {
    var it = ITEMS[lbIdx];
    lbImg.src = FULL + it.s + '.jpg';
    lbImg.alt = it.t;
    lbCap.textContent = it.t;
  }
  function closeLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    sLock = false;
  }
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbNext').addEventListener('click', function () { lbIdx = (lbIdx + 1) % ITEMS.length; paintLb(); });
  $('#lbPrev').addEventListener('click', function () { lbIdx = (lbIdx - 1 + ITEMS.length) % ITEMS.length; paintLb(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % ITEMS.length; paintLb(); }
    if (e.key === 'ArrowLeft') { lbIdx = (lbIdx - 1 + ITEMS.length) % ITEMS.length; paintLb(); }
  });

  /* ================= FORM ================= */
  var form = $('#form');
  var tel = $('#tel');
  tel.addEventListener('input', function () {
    var v = tel.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4);
    else if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    else if (v.length) v = '(' + v;
    tel.value = v;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('#formMsg');
    var ok = true;
    [['#nome', 2], ['#email', 5], ['#tel', 14]].forEach(function (p) {
      var el = $(p[0]);
      var valid = el.value.trim().length >= p[1] && (p[0] !== '#email' || /.+@.+\..+/.test(el.value));
      el.parentNode.classList.toggle('is-error', !valid);
      if (!valid) ok = false;
    });
    if (!$('#aceite').checked) ok = false;
    if (!ok) {
      msg.style.color = '#E38A7A';
      msg.textContent = 'Confira os campos destacados e aceite os termos para continuar.';
      return;
    }
    msg.style.color = '';
    msg.textContent = 'Cadastro enviado! Em instantes um especialista entra em contato.';
    form.reset();
  });

  /* ano do rodapé */
  $('#year').textContent = new Date().getFullYear();
})();
