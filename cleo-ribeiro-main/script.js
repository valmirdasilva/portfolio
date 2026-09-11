/* Cleo Ribeiro | Psicóloga — comportamento da página.
   JS puro, sem dependência. Tudo degrada bem se o script não carregar. */

(function () {
    'use strict';

    /* Ano do rodapé é automático. O site anterior ficou congelado em 2023. */
    var ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();

    /* --------------------------------------------------------- menu mobile */
    var botao = document.getElementById('hamburguer');
    var nav = document.getElementById('nav');

    function fecharMenu() {
        if (!nav || !botao) return;
        nav.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir menu');
    }

    if (botao && nav) {
        botao.addEventListener('click', function () {
            var aberto = nav.classList.toggle('aberto');
            botao.setAttribute('aria-expanded', String(aberto));
            botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
        });

        nav.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') fecharMenu();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') fecharMenu();
        });

        /* Voltar pro desktop com o menu aberto deixava o painel presente. */
        window.addEventListener('resize', function () {
            if (window.innerWidth > 980) fecharMenu();
        });
    }

    /* ------------------------------------------------- header e zap no scroll */
    var topo = document.getElementById('topo');
    var zap = document.getElementById('zap');
    var ultimo = -1;

    function aoRolar() {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        if (y === ultimo) return;
        ultimo = y;
        if (topo) topo.classList.toggle('rolou', y > 12);
        if (zap) zap.classList.toggle('visivel', y > 520);
    }

    window.addEventListener('scroll', function () {
        window.requestAnimationFrame(aoRolar);
    }, { passive: true });
    aoRolar();

    /* ------------------------------------------------------------- revelar */
    var alvos = document.querySelectorAll('.revelar');

    if (!('IntersectionObserver' in window)) {
        /* Sem suporte, tudo aparece. Nunca esconder conteúdo por falta de API. */
        Array.prototype.forEach.call(alvos, function (el) { el.classList.add('dentro'); });
    } else {
        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                entrada.target.classList.add('dentro');
                observador.unobserve(entrada.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        Array.prototype.forEach.call(alvos, function (el) { observador.observe(el); });
    }

    /* --------------------------------------------------- link ativo no menu */
    var secoes = document.querySelectorAll('main section[id]');
    var links = document.querySelectorAll('.nav a[href^="#"]');

    if (secoes.length && links.length && 'IntersectionObserver' in window) {
        var espiao = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                var id = entrada.target.getAttribute('id');
                Array.prototype.forEach.call(links, function (a) {
                    a.classList.toggle('ativo', a.getAttribute('href') === '#' + id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        Array.prototype.forEach.call(secoes, function (s) { espiao.observe(s); });
    }
})();
