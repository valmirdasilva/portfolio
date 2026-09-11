/* ============================================================
   Valmir da Silva — side-scroller cyberpunk lo-fi
   Scroll = personagem anda pela cidade. Fundo em canvas.
   ============================================================ */
(function () {
  "use strict";

  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Ano ---------- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = "© " + new Date().getFullYear();

  /* ---------- Mapa (fast travel) ---------- */
  var mapaBtn = document.getElementById("hudMapa");
  var mapa = document.getElementById("mapa");
  if (mapaBtn && mapa) {
    mapaBtn.addEventListener("click", function () {
      var ab = mapa.classList.toggle("aberto");
      mapaBtn.setAttribute("aria-expanded", ab ? "true" : "false");
    });
    mapa.addEventListener("click", function (e) { if (e.target.tagName === "A") { mapa.classList.remove("aberto"); mapaBtn.setAttribute("aria-expanded", "false"); } });
  }

  /* ---------- Configurador ---------- */
  var chips = [].slice.call(document.querySelectorAll(".chip"));
  var frase = document.getElementById("escopo-frase");
  var baseFrase = frase ? frase.textContent : "";
  function juntar(l) { return l.length === 1 ? l[0] : l.length === 2 ? l[0] + " e " + l[1] : l.slice(0, -1).join(", ") + " e " + l[l.length - 1]; }
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true");
      var on = chips.filter(function (x) { return x.getAttribute("aria-pressed") === "true"; }).map(function (x) { return x.dataset.label; });
      frase.innerHTML = on.length ? "Você precisa de <strong>" + juntar(on) + "</strong>. Eu entrego como um projeto só." : baseFrase;
    });
  });

  /* ---------- Reveal dos painéis ---------- */
  var paineis = [].slice.call(document.querySelectorAll(".painel"));
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("dentro"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    paineis.forEach(function (p) { io.observe(p); });
  } else { paineis.forEach(function (p) { p.classList.add("dentro"); }); }

  /* ---------- Dica some ao rolar ---------- */
  var dica = document.getElementById("dica");
  window.addEventListener("scroll", function () { if (dica && window.scrollY > 120) dica.classList.add("some"); }, { passive: true });

  /* ============================================================
     MUNDO (canvas)
     ============================================================ */
  var cv = document.getElementById("mundo");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var W = 0, H = 0, P = 4, chao = 0, dpr = 1;

  function rand(seed) { var x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x); }

  var COR = {
    ceuTopo: [6, 9, 12], ceuBaixo: [15, 21, 23],
    farBld: [11, 16, 18], midBld: [16, 22, 23], nearBld: [8, 11, 12],
    rua: [11, 14, 14], ruaTop: [20, 26, 24],
    tox: [166, 194, 46], cyan: [76, 156, 147], blood: [213, 69, 31],
    bone: [218, 215, 198], quente: [232, 196, 120]
  };
  function rgb(c, a) { return a == null ? "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")" : "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  var LEN = 5600; // px de "viagem" na camada perto
  var skyB = [], farB = [], midB = [], props = [], perto = [], estrelas = [], trafego = [], viaCars = [];
  function gerarCidade() {
    skyB = []; farB = []; midB = []; props = []; perto = []; estrelas = []; trafego = []; viaCars = [];
    var x, i;
    // camada 0: skyline distante colada (torres + agulhas), quase sem parallax
    for (x = -60, i = 0; x < LEN * 0.12 + W; i++) {
      var sw = 24 + rand(i * 2.9 + 7) * 70, sh = 90 + rand(i * 1.3 + 2) * 230;
      skyB.push({ x: x, w: sw, h: sh, s: Math.floor(rand(i * 4.4) * 999), agulha: rand(i * 3.7) < 0.4 });
      x += sw + 2 + rand(i) * 10;
    }
    // camada 1: prédios distantes (densos)
    for (x = -80, i = 0; x < LEN * 0.24 + W; i++) {
      var w = 34 + rand(i * 1.7) * 80, h = 70 + rand(i * 2.3) * 190;
      farB.push({ x: x, w: w, h: h, s: Math.floor(rand(i * 3.1) * 999) }); x += w + 4 + rand(i) * 12;
    }
    // camada 2: prédios médios (com neon, billboards, hologramas)
    for (x = -60, i = 0; x < LEN * 0.55 + W; i++) {
      var w2 = 66 + rand(i * 4.1 + 9) * 120, h2 = 130 + rand(i * 1.9 + 3) * 280;
      var neon = rand(i * 7.3) < 0.45 ? [COR.tox, COR.cyan, COR.blood][Math.floor(rand(i * 8.8) * 3)] : null;
      var bill = rand(i * 15.1 + 6) < 0.22;
      midB.push({
        x: x, w: w2, h: h2, s: Math.floor(rand(i * 5.5) * 999), neon: neon,
        ant: rand(i * 2.2) < 0.55,
        holo: rand(i * 11.2 + 4) < 0.14,
        vsign: rand(i * 6.6 + 1) < 0.34 ? [COR.tox, COR.cyan, COR.blood][Math.floor(rand(i * 4.4) * 3)] : null,
        fuma: rand(i * 13.7 + 2) < 0.26,
        bill: bill,
        billC: [COR.cyan, COR.tox, COR.blood][Math.floor(rand(i * 3.3 + 2) * 3)],
        distrito: bill && rand(i * 19.3) < 0.4 ? String(2 + Math.floor(rand(i * 21.1) * 18)) : null
      });
      x += w2 + 10 + rand(i + 1) * 22;
    }
    for (x = 0, i = 0; x < LEN + W; i++) {
      var t = rand(i * 9.1) < 0.5 ? "poste" : (rand(i * 3.3) < 0.5 ? "lixo" : "vent");
      props.push({ x: x, t: t }); x += 120 + rand(i * 1.3) * 220;
    }
    for (x = -40, i = 0; x < LEN * 1.25 + W; i++) {
      var pw = 120 + rand(i * 2.7 + 5) * 240, ph = 40 + rand(i * 3.9 + 2) * 90;
      var pt = rand(i * 5.1) < 0.34 ? "dish" : (rand(i * 2.9) < 0.5 ? "tank" : "acs");
      perto.push({ x: x, w: pw, h: ph, t: pt, s: Math.floor(rand(i * 8.2) * 999) });
      x += pw + 40 + rand(i * 1.9) * 160;
    }
    var ne = W < 700 ? 40 : 80;
    for (i = 0; i < ne; i++) estrelas.push({ x: rand(i * 1.3) * W, y: rand(i * 2.9) * H * 0.55, b: rand(i * 4.7), tw: rand(i * 6.1) * 6.28 });
    for (i = 0; i < 7; i++) trafego.push({
      y: H * (0.1 + rand(i * 3.7) * 0.34), sp: (0.6 + rand(i * 2.1) * 2.2) * (rand(i) < 0.5 ? 1 : -1),
      x: rand(i * 9.3) * W, len: 8 + rand(i * 1.7) * 26, c: [COR.tox, COR.cyan, COR.blood, COR.bone][i % 4], a: 0.15 + rand(i * 5.5) * 0.3
    });
    // via elevada: carros como riscos de luz em 2 sentidos
    var nv = W < 700 ? 14 : 26;
    for (i = 0; i < nv; i++) {
      var lane = i % 4;
      viaCars.push({
        x: rand(i * 7.7) * (W + 400) - 200, lane: lane,
        sp: (2.6 + rand(i * 3.3) * 4.5) * (lane < 2 ? 1 : -1),
        len: 10 + rand(i * 2.2) * 30, quente: lane < 2
      });
    }
  }

  var gotas = [];
  function gerarChuva() { gotas = []; var n = W < 700 ? 60 : 110; for (var i = 0; i < n; i++) gotas.push({ x: Math.random() * (W + 120), y: Math.random() * H, v: 9 + Math.random() * 9, l: 8 + Math.random() * 14 }); }

  var pedes = [], carro = null, drone = null;
  function gerarVida() {
    pedes = [];
    var n = W < 700 ? 3 : 6;
    for (var i = 0; i < n; i++) pedes.push({
      x: Math.random() * W, sp: (0.3 + Math.random() * 0.9) * (W / 1400),
      dir: Math.random() < 0.55 ? -1 : 1, sz: 0.8 + Math.random() * 0.5,
      y: chao - (Math.random() * 4 - 2) * P, ph: Math.random() * 10,
      cor: ["#3a4a3a", "#33403c", "#2f3a30"][i % 3], luz: ["#a6c22e", "#4c9c93", "#d5451f"][i % 3]
    });
    carro = { on: false, next: 2600, x: 0, y: 0, spd: 0, dir: 1 };
    drone = { on: false, next: 1500, x: 0, y: 0, spd: 0, dir: 1, blink: 0 };
  }

  var marcos = [];
  function medirMarcos() {
    var cenas = [].slice.call(document.querySelectorAll(".cena"));
    var maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    marcos = cenas.map(function (s, idx) {
      var c = s.offsetTop + s.offsetHeight / 2 - window.innerHeight / 2;
      return { p: Math.min(1, Math.max(0, c / maxS)), n: idx };
    });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    P = Math.max(3, Math.round(W / 300));
    chao = Math.round(H * 0.80 / P) * P;
    gerarCidade(); gerarChuva(); gerarVida(); medirMarcos();
  }

  function R(x, y, w, h, color) {
    x = Math.round(x / P) * P; y = Math.round(y / P) * P;
    w = Math.max(P, Math.round(w / P) * P); h = Math.max(P, Math.round(h / P) * P);
    ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
  }

  /* ---- desenho ---- */
  function janelas(bx, by, bw, bh, seed, cor, dens) {
    var gx = P * 3, gy = P * 4, m = P * 2;
    for (var yy = by + m; yy < by + bh - gy; yy += gy + P) {
      for (var xx = bx + m; xx < bx + bw - gx; xx += gx + P) {
        var r = rand((xx * 0.13 + yy * 0.07 + seed) * 1.1);
        if (r < dens) R(xx, yy, gx, gy, r < dens * 0.25 ? rgb(cor, 0.85) : rgb(cor, 0.28));
      }
    }
  }

  // sprite sheet opcional: assets/personagem.png (tira horizontal de frames 64x64)
  var spriteImg = new Image(), spriteReady = false;
  spriteImg.onload = function () { spriteReady = spriteImg.naturalWidth > 0; };
  spriteImg.onerror = function () { spriteReady = false; };
  spriteImg.src = "assets/personagem.png";

  function personagem(px, py, andando, tq, celT) {
    celT = celT || 0;
    var cel = celT > 0.4;
    var scale = (1 + celT * 0.1) * (W < 780 && cel ? 1.4 : 1);
    var u = Math.max(2, Math.round(P * 1.1 * scale));

    // chão: poça de luz + sombra
    var gr = ctx.createRadialGradient(px + 2 * u, py, 0, px + 2 * u, py, 15 * u);
    gr.addColorStop(0, "rgba(166,194,46,0.20)"); gr.addColorStop(1, "rgba(166,194,46,0)");
    ctx.fillStyle = gr; ctx.fillRect(px - 17 * u, py - 5 * u, 36 * u, 12 * u);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(Math.round(px - 7 * u), Math.round(py + u), Math.round(15 * u), Math.round(2 * u));

    // --- caminho A: sprite sheet real ---
    if (spriteReady) {
      var FW = 64, NF = Math.max(1, (spriteImg.naturalWidth / FW) | 0);
      var fr = cel ? NF - 1 : (andando ? Math.floor(tq / 130) % Math.min(4, NF) : 0);
      var dh = u * 32, dw = dh;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(spriteImg, fr * FW, 0, FW, FW, Math.round(px - dw / 2), Math.round(py + u * 4 - dh), dw, dh);
      return;
    }

    // --- caminho B: silhueta procedural simples ---
    var K = "#0a0d09", D = "#1b231b", M = "#333f2c", HH = "#48573b";
    var S = "#b98f68", Sd = "#8a6650", V = "#82e0e7", G = "#a6c22e", Gh = "#d6ee5c";
    var B = "#20241a", Pk = "#2a3024", RD = "#d5451f", HR = "#5a4630";
    var stride = andando ? Math.sin(tq / 150) : 0;
    var s = stride * 1.6;
    var hop = cel ? Math.abs(Math.sin(tq * 0.012)) * 3.2 : (andando ? Math.abs(Math.sin(tq / 150)) * 0.7 : 0);
    var Y = py - hop * u;
    var OX = 0, OY = 0;

    function R2(x, y, w, h, c) {
      var xx = Math.round((px + x * u + OX) / u) * u;
      var yy = Math.round((Y + y * u + OY) / u) * u;
      ctx.fillStyle = c;
      ctx.fillRect(xx, yy, Math.max(u, Math.round(w) * u), Math.max(u, Math.round(h) * u));
    }

    function fig(F) {
      function b(x, y, w, h, c) { R2(x, y, w, h, F === 1 ? K : F === 2 ? HH : c); }
      var legF = cel ? -0.6 : (0.6 + s);
      var legB = cel ? 0.6 : (-0.6 - s);

      b(legB - 1, -6.5, 2.2, 7, D);
      b(legB - 1.4, -1, 3.2, 2, B);
      b(legF - 1, -6.5, 2.2, 7, M);
      b(legF - 1.4, -1, 3.4, 2, B);
      if (F === 0) b(legF - 1.2, -1, 3.2, 0.7, G);

      b(-5, -20, 2.6, 8, Pk);                                   // mochila
      if (F === 0) b(-5, -20, 2.6, 0.8, HH);
      b(-3.6, -29, 0.7, 6, D);                                  // antena
      if (F === 0) b(-3.9, -30, 1.2, 1.2, RD);

      b(-3.8, -22, 7.6, 16, D);                                 // casaco
      if (F === 0) { b(0.3, -22, 3.5, 16, M); b(3.4, -21, 0.7, 15, HH); }
      b(-3.6, -7, 1.6, 2.6, D);                                 // hem rasgado
      b(-1.4, -7, 1.5, 3.4, D);
      b(1.2, -7, 1.6, 2.2, M);

      if (cel) {
        var aw = Math.sin(tq * 0.012) * 0.8;
        b(2.6, -27 + aw, 1.7, 7, D);
        b(3.4 + aw, -30, 1.9, 2, S);
        b(-1.6, -27 - aw, 1.6, 7, D);
        b(-2.8 - aw, -30, 1.8, 2, Sd);
      } else {
        b(2.6, -21, 1.7, 6 - s * 0.6, D);
        b(2.6 - s * 1.2, -15, 1.8, 1.8, S);
      }

      b(-3.4, -30, 7, 8.5, D);                                  // capuz
      b(2.6, -27, 2, 5.5, D);
      b(1.3, -27, 3.4, 6, S);                                   // rosto
      if (F === 0) {
        b(1.1, -28, 2, 1.6, HR);
        b(4.5, -25, 1, 1.8, S);
        b(1.4, -22, 3.2, 1.8, Sd);
        b(1.3, -25.3, 4, 1.5, V);
        b(-3.8, -22, 7.6, 0.9, G);                              // trim ombro
        b(2.7, -20, 0.7, 6, G);                                 // costura
        b(-1.6, -16, 1.1, 1.1, Gh);
      }

      if (cel && F === 0) {
        var ty = -33 - Math.abs(Math.sin(tq * 0.006)) * 1.6;
        ctx.save(); ctx.shadowColor = G; ctx.shadowBlur = 14;
        b(-0.5, ty, 5, 3, G); b(-1.5, ty + 0.4, 1, 1.6, G); b(4.5, ty + 0.4, 1, 1.6, G);
        b(1, ty + 3, 2, 2, G); b(-0.5, ty + 5, 5, 1.4, G);
        ctx.restore();
        var ga = tq * 0.005;
        for (var k = 0; k < 5; k++) R2(1.5 + Math.cos(ga + k * 1.26) * 5, ty + 2 + Math.sin(ga + k * 1.26) * 5, 0.8, 0.8, Gh);
      }
    }

    var off = [[-u, 0], [u, 0], [0, -u], [0, u]];
    for (var i = 0; i < off.length; i++) { OX = off[i][0]; OY = off[i][1]; fig(1); }
    OX = u * 0.6; OY = -u * 0.7; fig(2);
    OX = 0; OY = 0; fig(0);
  }

  function estacao(sx, num) {
    var topo = chao - H * 0.42, alt = chao - topo;
    R(sx - P * 20, chao - alt, P * 3, alt, rgb(COR.midBld));           // pilar esq
    R(sx + P * 17, chao - alt, P * 3, alt, rgb(COR.midBld));           // pilar dir
    // barra de neon
    R(sx - P * 20, topo, P * 40, P * 3, rgb(COR.tox));
    ctx.save(); ctx.shadowColor = rgb(COR.tox); ctx.shadowBlur = 18;
    R(sx - P * 20, topo, P * 40, P * 3, rgb(COR.tox));
    ctx.restore();
    // portal
    R(sx - P * 12, chao - alt * 0.55, P * 24, alt * 0.55, rgb(COR.tox, 0.10));
    R(sx - P * 12, chao - alt * 0.55, P * 24, P, rgb(COR.tox, 0.5));
  }

  var MOSTRAR_PERSONAGEM = false; // idem em pausa: foco no background por enquanto
  var progAlvo = 0, prog = 0, progAnt = 0, andandoAte = 0, celG = 0, confetes = [];

  function lerScroll() {
    var maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progAlvo = Math.min(1, Math.max(0, window.scrollY / maxS));
  }
  window.addEventListener("scroll", lerScroll, { passive: true });

  function frame(ts) {
    prog += (progAlvo - prog) * 0.12;
    var dp = prog - progAnt; progAnt = prog;
    var andando = Math.abs(dp) > 0.00035;
    if (andando) andandoAte = ts + 320;
    var walk = ts < andandoAte;

    // HUD
    var fill = document.getElementById("hudFill"); if (fill) fill.style.width = (prog * 100).toFixed(1) + "%";
    var dist = document.getElementById("hudDist"); if (dist) dist.textContent = Math.round(prog * 1240) + "m";

    // ---- céu ----
    for (var y = 0; y < H; y += P) {
      var f = y / H;
      R(0, y, W, P, rgb([
        COR.ceuTopo[0] + (COR.ceuBaixo[0] - COR.ceuTopo[0]) * f,
        COR.ceuTopo[1] + (COR.ceuBaixo[1] - COR.ceuTopo[1]) * f,
        COR.ceuTopo[2] + (COR.ceuBaixo[2] - COR.ceuTopo[2]) * f
      ]));
    }
    // estrelas
    for (var si = 0; si < estrelas.length; si++) {
      var st = estrelas[si];
      var tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(ts * 0.002 + st.tw));
      R(st.x, st.y, P, P, rgb(st.b < 0.2 ? COR.blood : [150, 165, 120], (0.12 + st.b * 0.5) * tw));
    }
    // lua grande + halo + crateras
    var mx = W * 0.80 - prog * 40, my = H * 0.17, mr = 9;
    ctx.save(); ctx.shadowColor = rgb([150, 165, 110]); ctx.shadowBlur = 40;
    for (var a = -mr; a <= mr; a++) for (var b2 = -mr; b2 <= mr; b2++) {
      var d2 = a * a + b2 * b2; if (d2 > mr * mr) continue;
      var lit = (a + b2) < mr * 0.6;
      R(mx + a * P, my + b2 * P, P, P, rgb(lit ? [168, 182, 128] : [92, 104, 74], 0.9));
    }
    ctx.restore();
    [[-3, -2, 2], [2, 1, 3], [-1, 4, 1.5], [4, -4, 1.5]].forEach(function (cr) {
      for (var a = -cr[2]; a <= cr[2]; a++) for (var b = -cr[2]; b <= cr[2]; b++)
        if (a * a + b * b <= cr[2] * cr[2]) R(mx + (cr[0] + a) * P, my + (cr[1] + b) * P, P, P, rgb([74, 84, 60], 0.7));
    });

    // brilho da metrópole no horizonte (bloom atrás do skyline)
    var hzY = chao - H * 0.30;
    var hg = ctx.createLinearGradient(0, hzY - H * 0.16, 0, hzY + H * 0.10);
    hg.addColorStop(0, "rgba(76,156,147,0)");
    hg.addColorStop(0.6, "rgba(90,150,120,0.10)");
    hg.addColorStop(1, "rgba(166,194,46,0.05)");
    ctx.fillStyle = hg; ctx.fillRect(0, hzY - H * 0.16, W, H * 0.26);

    // camada 0: skyline distante colado
    var sSky = prog * LEN * 0.06;
    skyB.forEach(function (bd) {
      var bx = bd.x - sSky; if (bx > W || bx + bd.w < 0) return;
      R(bx, chao - bd.h, bd.w, bd.h, rgb([10, 14, 16]));
      if (bd.agulha) { R(bx + bd.w * 0.5 - P, chao - bd.h - P * 7, P * 2, P * 7, rgb([10, 14, 16])); R(bx + bd.w * 0.5, chao - bd.h - P * 7, P, P, rgb(COR.blood, 0.5 + 0.5 * Math.sin(ts * 0.004 + bd.s))); }
      for (var wy = chao - bd.h + P * 3; wy < chao - P * 4; wy += P * 5) {
        var xx = bx + P * 2 + (Math.floor(rand(wy * 0.3 + bd.s) * (bd.w / P - 4))) * P;
        if (rand(wy * 0.11 + bd.s) < 0.35) R(xx, wy, P, P * 2, rgb(rand(bd.s + wy) < 0.5 ? COR.cyan : COR.quente, 0.5));
      }
    });
    // haze sobre o skyline
    R(0, chao - H * 0.42, W, H * 0.30, rgb([14, 20, 24], 0.30));

    // tráfego aéreo contínuo (fundo)
    for (var ti = 0; ti < trafego.length; ti++) {
      var tr = trafego[ti];
      tr.x += tr.sp * (reduz ? 0 : 1);
      if (tr.x < -60) tr.x = W + 40; if (tr.x > W + 60) tr.x = -40;
      R(tr.x, tr.y, tr.len * P * 0.4, P, rgb(tr.c, tr.a));
      R(tr.x + (tr.sp > 0 ? tr.len * P * 0.4 : -P), tr.y, P, P, rgb(tr.c, tr.a + 0.3));
    }

    // ---- drone ----
    if (!reduz) {
      if (!drone.on && ts > drone.next) { drone.on = true; drone.dir = Math.random() < 0.5 ? 1 : -1; drone.x = drone.dir > 0 ? -40 : W + 40; drone.y = H * (0.08 + Math.random() * 0.24); drone.spd = 1.3 + Math.random() * 1.8; drone.next = ts + 8000 + Math.random() * 10000; }
      if (drone.on) {
        drone.x += drone.spd * drone.dir;
        var ddy = drone.y + Math.sin(ts * 0.004) * P * 1.4;
        ctx.save(); ctx.globalAlpha = 0.05; ctx.fillStyle = rgb(COR.cyan);
        ctx.beginPath(); ctx.moveTo(drone.x - P, ddy + P * 2); ctx.lineTo(drone.x - P * 7, ddy + P * 22); ctx.lineTo(drone.x + P * 5, ddy + P * 22); ctx.closePath(); ctx.fill(); ctx.restore();
        R(drone.x - P * 3, ddy, P * 6, P * 2, rgb(COR.nearBld));
        R(drone.x - P * 4, ddy + P, P * 2, P, rgb([44, 50, 38]));
        R(drone.x + P * 3, ddy + P, P * 2, P, rgb([44, 50, 38]));
        R(drone.x - P, ddy + P * 2, P, P, (Math.floor(ts / 280) % 2) ? rgb(COR.blood) : rgb(COR.cyan));
        if (drone.x < -60 || drone.x > W + 60) drone.on = false;
      }
    }

    // ---- prédios distantes ----
    var sFar = prog * LEN * 0.20;
    farB.forEach(function (bd) {
      var bx = bd.x - sFar; if (bx > W || bx + bd.w < 0) return;
      R(bx, chao - bd.h, bd.w, bd.h, rgb(COR.farBld));
      janelas(bx, chao - bd.h, bd.w, bd.h, bd.s, COR.tox, 0.04);
    });
    // névoa entre camadas
    R(0, chao - H * 0.36, W, H * 0.36, rgb([14, 20, 23], 0.34));
    R(0, chao - H * 0.20, W, H * 0.20, rgb([16, 22, 24], 0.22));

    // ---- prédios médios ----
    var sMid = prog * LEN * 0.46;
    midB.forEach(function (bd) {
      var bx = bd.x - sMid; if (bx > W || bx + bd.w < 0) return;
      R(bx, chao - bd.h, bd.w, bd.h, rgb(COR.midBld));
      janelas(bx, chao - bd.h, bd.w, bd.h, bd.s, rand(bd.s) < 0.5 ? COR.tox : COR.cyan, 0.11);
      if (bd.neon) {
        var flk = (Math.sin(ts * 0.017 + bd.s) > -0.6) ? 1 : 0.12;
        if (Math.floor(ts / 80 + bd.s) % 41 === 0) flk = 0.3;
        R(bx + bd.w - P * 3, chao - bd.h + P * 4, P * 2, bd.h * 0.5, rgb(bd.neon, 0.8 * flk));
        // placa horizontal com "texto" (barras)
        R(bx + P * 2, chao - bd.h + P * 3, bd.w - P * 6, P * 4, rgb([10, 12, 9], 0.9 * flk + 0.1));
        for (var lx = bx + P * 4; lx < bx + bd.w - P * 6; lx += P * 3) if (rand(lx * 0.2 + bd.s) < 0.6) R(lx, chao - bd.h + P * 4, P * 2, P * 2, rgb(bd.neon, 0.85 * flk));
        if (flk > 0.5) { ctx.save(); ctx.shadowColor = rgb(bd.neon); ctx.shadowBlur = 12; R(bx + bd.w - P * 3, chao - bd.h + P * 4, P * 2, bd.h * 0.4, rgb(bd.neon, 0.8)); ctx.restore(); }
      }
      if (bd.ant) { R(bx + bd.w * 0.5, chao - bd.h - P * 8, P, P * 8, rgb(COR.nearBld)); R(bx + bd.w * 0.5, chao - bd.h - P * 9, P, P, (Math.floor(ts / 500 + bd.s) % 2) ? rgb(COR.blood) : "rgba(0,0,0,0)"); }
      // billboard grande e iluminado (estilo Night City)
      if (bd.bill) {
        var lado = rand(bd.s + 3) < 0.5;
        var bw = Math.min(bd.w * 0.9, P * 20), bh = Math.min(bd.h * 0.55, P * 34);
        var bbx = lado ? bx - P * 2 : bx + bd.w - bw + P * 2;
        var bby = chao - bd.h + P * 5;
        var bon = (Math.floor(ts / 90 + bd.s) % 53 === 0) ? 0.25 : 1; // flicker raro
        // moldura + fundo
        R(bbx - P, bby - P, bw + P * 2, bh + P * 2, rgb([6, 8, 8]));
        R(bbx, bby, bw, bh, rgb(bd.billC, 0.12 * bon));
        // "pôster": silhueta + barras de texto
        var pph = bh * 0.6;
        R(bbx + bw * 0.28, bby + P * 2, bw * 0.44, pph * 0.5, rgb(bd.billC, 0.5 * bon));
        R(bbx + bw * 0.36, bby + P, bw * 0.28, pph * 0.24, rgb(bd.billC, 0.6 * bon));
        for (var tb = 0; tb < 3; tb++) R(bbx + bw * 0.16, bby + pph + tb * P * 3, bw * (0.68 - tb * 0.16), P * 2, rgb(COR.bone, (0.5 - tb * 0.12) * bon));
        // varredura de scanline
        var scv = (ts * 0.05 + bd.s * 30) % bh;
        R(bbx, bby + scv, bw, P * 2, rgb(COR.bone, 0.18 * bon));
        // glow
        if (bon > 0.5) { ctx.save(); ctx.shadowColor = rgb(bd.billC); ctx.shadowBlur = 22; R(bbx, bby, bw, bh, rgb(bd.billC, 0.05)); ctx.restore(); }
        // número do distrito, grande, abaixo do billboard
        if (bd.distrito) {
          ctx.save();
          ctx.fillStyle = rgb(COR.quente, 0.85 * bon);
          ctx.font = (P * 9) + "px 'Press Start 2P', monospace";
          ctx.textAlign = lado ? "left" : "right"; ctx.textBaseline = "top";
          ctx.shadowColor = rgb(COR.quente); ctx.shadowBlur = 16;
          ctx.fillText(bd.distrito, lado ? bbx : bbx + bw, bby + bh + P * 3);
          ctx.restore();
        }
      }
      // placa vertical (blocos empilhados tipo letreiro)
      if (bd.vsign) {
        var vf = (Math.sin(ts * 0.011 + bd.s * 2) > -0.7) ? 1 : 0.15;
        var vx = bx + bd.w - P * 6, vy0 = chao - bd.h + P * 6;
        R(vx - P, vy0 - P, P * 5, P * 2, rgb([8, 10, 7], 0.85));
        for (var vk = 0; vk < 6; vk++) {
          if (rand(bd.s + vk * 3.1) < 0.7) R(vx, vy0 + vk * P * 3, P * 3, P * 2, rgb(bd.vsign, 0.85 * vf));
        }
        if (vf > 0.5) { ctx.save(); ctx.shadowColor = rgb(bd.vsign); ctx.shadowBlur = 10; R(vx, vy0, P * 3, P * 16, rgb(bd.vsign, 0.10)); ctx.restore(); }
      }
      // vapor da chaminé
      if (bd.fuma && !reduz) {
        var fx0 = bx + bd.w * 0.28, fy0 = chao - bd.h;
        R(fx0 - P, fy0 - P * 3, P * 3, P * 3, rgb([26, 32, 22]));
        for (var fk = 0; fk < 5; fk++) {
          var fp = (ts * 0.02 + fk * 40 + bd.s) % 200;
          var fa = 0.16 * (1 - fp / 200);
          R(fx0 + Math.sin(fp * 0.05 + fk) * P * 3, fy0 - P * 3 - fp * 0.7, P * (3 + fp * 0.03), P * 3, rgb([120, 130, 108], fa));
        }
      }
      // holograma glitch no telhado
      if (bd.holo && !reduz) {
        var hw = Math.min(bd.w * 0.7, P * 22), hh = P * 26;
        var hx = bx + (bd.w - hw) / 2, hy = chao - bd.h - hh - P * 2;
        var jit = (Math.floor(ts / 90) % 7 === 0) ? (Math.random() - 0.5) * P * 4 : 0;
        var hon = (Math.sin(ts * 0.006 + bd.s) > -0.85) ? 1 : 0.2;
        ctx.save(); ctx.globalAlpha = 0.5 * hon;
        R(hx + jit, hy, hw, P, rgb(COR.cyan, 0.5));
        for (var hl = 0; hl < 12; hl++) {
          var seg = rand(bd.s + hl * 1.7 + Math.floor(ts / 400));
          if (seg < 0.75) R(hx + jit + seg * hw * 0.3, hy + hl * P * 2, hw * (0.4 + seg * 0.5), P, rgb(COR.cyan, 0.28));
        }
        R(hx + jit + hw * 0.2, hy + P * 6, hw * 0.6, P * 8, rgb(COR.cyan, 0.10));
        ctx.restore();
        // feixe do projetor
        ctx.save(); ctx.globalAlpha = 0.06 * hon; ctx.fillStyle = rgb(COR.cyan);
        ctx.beginPath(); ctx.moveTo(hx + hw * 0.5, chao - bd.h); ctx.lineTo(hx, hy); ctx.lineTo(hx + hw, hy); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    });

    // ---- via elevada (rodovia com rastros de luz) ----
    var viaY = Math.round((chao - H * 0.15) / P) * P;
    var deckH = P * 6;
    // pilares (parallax médio)
    var sVia = prog * LEN * 0.5;
    for (var pv = -((sVia) % (P * 90)); pv < W; pv += P * 90) {
      R(pv, viaY + deckH, P * 4, chao - viaY - deckH, rgb([9, 12, 12]));
      R(pv - P, viaY + deckH, P * 6, P * 2, rgb([9, 12, 12]));
    }
    // deck
    R(0, viaY, W, deckH, rgb([12, 15, 15]));
    R(0, viaY, W, P, rgb([22, 28, 27]));
    R(0, viaY + deckH - P, W, P, rgb(COR.cyan, 0.12));          // luz da borda inferior
    // carros = riscos de luz, 4 faixas
    if (!reduz) {
      viaCars.forEach(function (vc) {
        vc.x += vc.sp * (W / 1400);
        if (vc.sp > 0 && vc.x > W + 220) vc.x = -220 - rand(vc.len) * 200;
        if (vc.sp < 0 && vc.x < -220) vc.x = W + 220 + rand(vc.len) * 200;
        var ly = viaY + P + (vc.lane % 2) * P * 2 + (vc.lane < 2 ? 0 : deckH * 0.42);
        var col = vc.quente ? COR.quente : COR.blood;
        var L = vc.len * P;
        ctx.save(); ctx.globalAlpha = 0.5;
        R(vc.x - (vc.sp > 0 ? L : -L), ly, L, P, rgb(col, 0.5));
        ctx.restore();
        ctx.save(); ctx.shadowColor = rgb(col); ctx.shadowBlur = 10;
        R(vc.x, ly, P * 2, P, rgb(col, 0.95));
        ctx.restore();
        R(vc.x, viaY + deckH, P, P, rgb(col, 0.12));            // reflexo no deck
      });
    }

    // ---- hovercar (tráfego) ----
    if (!reduz) {
      if (!carro.on && ts > carro.next) { carro.on = true; carro.dir = Math.random() < 0.5 ? 1 : -1; carro.x = carro.dir > 0 ? -260 : W + 260; carro.y = chao - H * (0.16 + Math.random() * 0.30); carro.spd = 7 + Math.random() * 10; carro.next = ts + 7000 + Math.random() * 11000; carro.col = [COR.tox, COR.cyan, COR.blood][Math.floor(Math.random() * 3)]; }
      if (carro.on) {
        carro.x += carro.spd * carro.dir;
        var cx0 = carro.x, cy0 = carro.y;
        ctx.save(); ctx.globalAlpha = 0.4; R(cx0 - carro.dir * P * 34, cy0 + P * 2, P * 34, P * 2, rgb(carro.col)); ctx.restore();
        R(cx0 - P * 9, cy0, P * 18, P * 5, rgb([15, 19, 13]));
        R(cx0 - P * 6, cy0 - P * 2, P * 10, P * 3, rgb([24, 30, 22]));
        R(cx0 - P * 5, cy0 - P * 2, P * 7, P, rgb(COR.cyan, 0.4));
        R(cx0 + carro.dir * P * 8, cy0 + P, P * 2, P * 2, rgb(carro.col));
        R(cx0 - carro.dir * P * 9, cy0 + P * 2, P * 2, P, rgb(COR.blood));
        ctx.save(); ctx.shadowColor = rgb(carro.col); ctx.shadowBlur = 14; R(cx0 - P * 8, cy0 + P * 4, P * 16, P, rgb(carro.col, 0.7)); ctx.restore();
        if (carro.x < -330 || carro.x > W + 330) carro.on = false;
      }
    }

    // ---- estações (marcos) ----
    var span = W * 1.9;
    marcos.forEach(function (m) {
      if (m.n <= 1) return;
      var sx = W * 0.5 + (m.p - prog) * span;
      if (sx < -P * 40 || sx > W + P * 40) return;
      estacao(sx, m.n - 1);
    });

    // ---- rua ----
    R(0, chao, W, H - chao, rgb(COR.rua));
    R(0, chao, W, P * 2, rgb(COR.ruaTop));
    // faixa central tracejada rolando
    var sNear = prog * LEN;
    for (var fx = -((sNear) % (P * 12)); fx < W; fx += P * 12) R(fx, chao + (H - chao) * 0.55, P * 6, P, rgb(COR.tox, 0.22));
    // reflexo dos prédios médios (poça)
    ctx.save(); ctx.globalAlpha = 0.14;
    midB.forEach(function (bd) {
      var bx = bd.x - sMid; if (bx > W || bx + bd.w < 0) return;
      R(bx, chao + P * 2, bd.w, Math.min(bd.h * 0.4, H - chao - P * 2), bd.neon ? rgb(bd.neon) : rgb(COR.cyan));
    });
    ctx.restore();

    // ---- pedestres ----
    pedes.forEach(function (pd) {
      pd.x += pd.sp * pd.dir * (reduz ? 0 : 1);
      if (pd.x < -40) pd.x = W + 30; if (pd.x > W + 40) pd.x = -30;
      var u = P * pd.sz, bx = pd.x, by = pd.y;
      var wob = Math.floor(ts * 0.02 + pd.ph) % 2;
      R(bx - u * 2.5, by + u * 0.5, u * 5, u, rgb([0, 0, 0], 0.32));
      if (wob) { R(bx - u * 1.6, by - u, u * 1.4, u * 3, pd.cor); R(bx + u * 0.4, by, u * 1.4, u * 3, pd.cor); }
      else { R(bx - u * 0.4, by, u * 1.4, u * 3, pd.cor); R(bx + u * 0.3, by - u, u * 1.4, u * 3, pd.cor); }
      R(bx - u * 2, by - u * 5, u * 4, u * 5, pd.cor);
      R(bx - u * 2, by - u * 5, u * 4, u, rgb(pd.luz, 0.65));
      R(bx - u * 1.4, by - u * 8, u * 2.8, u * 3, pd.cor);
      R(bx + (pd.dir > 0 ? u * 0.6 : -u * 1.4), by - u * 7, u * 0.8, u * 0.8, rgb(pd.luz, 0.8));
    });

    // ---- props de rua ----
    props.forEach(function (pr) {
      var bx = pr.x - sNear; if (bx > W + 40 || bx < -40) return;
      if (pr.t === "poste") {
        R(bx, chao - P * 22, P * 2, P * 22, rgb(COR.nearBld));
        R(bx - P * 3, chao - P * 22, P * 8, P * 2, rgb(COR.nearBld));
        R(bx + P * 3, chao - P * 21, P * 2, P * 2, rgb(COR.tox, 0.9));
      } else if (pr.t === "lixo") {
        R(bx, chao - P * 5, P * 5, P * 5, rgb([18, 22, 15]));
        R(bx, chao - P * 6, P * 5, P, rgb(COR.blood, 0.6));
      } else {
        R(bx, chao - P * 2, P * 6, P * 2, rgb([20, 24, 16]));
        var pf = (ts * 0.006 + pr.x) % 6;
        R(bx + P * 2, chao - P * 2 - pf * P * 2, P * 2, P * 3, rgb([120, 130, 110], 0.15));
      }
    });

    // ---- camada da frente (silhuetas escuras, parallax forte) ----
    var sFg = prog * LEN * 1.15;
    var fgC = rgb([6, 8, 8]);
    perto.forEach(function (pf) {
      var bx = pf.x - sFg; if (bx > W + 80 || bx + pf.w < -80) return;
      // laje escura subindo do rodapé
      R(bx, chao + (H - chao) * 0.42, pf.w, H, fgC);
      var topY = chao + (H - chao) * 0.42;
      R(bx, topY, pf.w, P, rgb(COR.cyan, 0.07)); // filete de luz no topo
      if (pf.t === "dish") {
        // antena parabólica girando
        var rot = 0.5 + 0.5 * Math.sin(ts * 0.0011 + pf.s);
        R(bx + pf.w * 0.5 - P, topY - P * 10, P * 2, P * 10, fgC);
        R(bx + pf.w * 0.5 - P * 5 * rot, topY - P * 12, P * 10 * Math.max(0.15, rot), P * 5, fgC);
        R(bx + pf.w * 0.5 - P, topY - P * 11, P, P, rgb(COR.blood, 0.7 * (Math.floor(ts / 400) % 2)));
      } else if (pf.t === "tank") {
        R(bx + pf.w * 0.3, topY - P * 9, P * 8, P * 9, fgC);
        R(bx + pf.w * 0.3, topY - P * 11, P * 8, P * 2, fgC);
        R(bx + pf.w * 0.3 + P, topY - P * 6, P * 2, P, rgb(COR.tox, 0.25));
      } else {
        for (var ac = 0; ac < 3; ac++) R(bx + pf.w * (0.15 + ac * 0.28), topY - P * 4, P * 6, P * 4, fgC);
      }
      // parapeito
      R(bx, topY, pf.w, P * 2, fgC);
    });
    // fios atravessando + lanternas balançando (ancoradas na viewport, deriva lenta)
    if (!reduz) {
      var wdrift = (ts * 0.015) % (W + 300);
      ctx.strokeStyle = rgb([4, 6, 4]); ctx.lineWidth = Math.max(1, P * 0.6);
      for (var wc = 0; wc < 3; wc++) {
        var wy = H * (0.06 + wc * 0.05), sag = P * (6 + wc * 4);
        ctx.beginPath(); ctx.moveTo(-20, wy);
        ctx.quadraticCurveTo(W * 0.5, wy + sag, W + 20, wy - P * 2); ctx.stroke();
        // lanterna
        var lxp = ((wc * 220 + wdrift) % (W + 200)) - 100;
        var lyp = wy + sag * (1 - Math.pow(2 * (lxp / W) - 1, 2)) + Math.sin(ts * 0.003 + wc) * P;
        R(lxp - P, lyp, P * 2, P * 3, rgb([10, 12, 9]));
        R(lxp - P * 0.5, lyp + P, P, P, rgb([COR.tox, COR.cyan, COR.blood][wc], 0.9));
        ctx.save(); ctx.shadowColor = rgb([COR.tox, COR.cyan, COR.blood][wc]); ctx.shadowBlur = 12;
        R(lxp - P * 0.5, lyp + P, P, P, rgb([COR.tox, COR.cyan, COR.blood][wc], 0.7)); ctx.restore();
      }
    }

    // ---- personagem + final (troféu) ---- (em pausa)
    if (MOSTRAR_PERSONAGEM) {
    var atFim = prog > 0.93;
    celG += ((atFim ? 1 : 0) - celG) * 0.05;
    var movel = W < 780;
    var baseX = movel ? W * 0.5 : W * 0.16;
    var charX = baseX + (W * 0.4 - baseX) * (movel ? 0 : celG);
    if (atFim && !confetes.length) {
      for (var ci = 0; ci < 70; ci++) confetes.push({ x: charX + (Math.random() - 0.5) * W * 0.55, y: -Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 2.4, vy: 1.4 + Math.random() * 3, s: P * (0.5 + Math.random()), c: [COR.tox, COR.cyan, COR.blood, COR.bone][Math.floor(Math.random() * 4)] });
    }
    if (!atFim && confetes.length) confetes.length = 0;
    if (celG > 0.02 && !reduz) confetes.forEach(function (cf) {
      cf.x += cf.vx; cf.y += cf.vy; cf.vy += 0.02; cf.vx *= 0.995;
      if (cf.y > H + 12) { cf.y = -12; cf.x = charX + (Math.random() - 0.5) * W * 0.55; cf.vy = 1.4 + Math.random() * 3; }
      R(cf.x, cf.y, cf.s, cf.s, rgb(cf.c, 0.85 * celG));
    });
    personagem(charX, chao, walk && celG < 0.15, ts, celG);
    }

    // ---- chuva ----
    if (!reduz) {
      ctx.strokeStyle = rgb([140, 165, 150], 0.15); ctx.lineWidth = Math.max(1, P * 0.4);
      ctx.beginPath();
      for (var g = 0; g < gotas.length; g++) {
        var gt = gotas[g];
        gt.y += gt.v; gt.x -= gt.v * 0.35;
        if (gt.y > H) { gt.y = -20; gt.x = Math.random() * (W + 160); }
        if (gt.x < -20) gt.x = W + Math.random() * 40;
        ctx.moveTo(gt.x, gt.y); ctx.lineTo(gt.x - gt.l * 0.35, gt.y + gt.l);
      }
      ctx.stroke();
    }

    // ---- glitch ocasional (barras RGB) ----
    if (!reduz && Math.random() < 0.03) {
      var nb = 1 + Math.floor(Math.random() * 3);
      for (var gi = 0; gi < nb; gi++) {
        var gy2 = Math.random() * H, gh2 = P + Math.random() * P * 5, ox2 = (Math.random() - 0.5) * P * 10;
        var gc = [COR.tox, COR.cyan, COR.blood][gi % 3];
        R(ox2, gy2, W, gh2, rgb(gc, 0.12));
      }
    }

    if (!reduz) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", function () { resize(); lerScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medirMarcos);
  setTimeout(medirMarcos, 800);

  resize(); lerScroll();
  if (reduz) {
    prog = progAlvo; progAnt = prog; frame(0);
    window.addEventListener("scroll", function () { prog = progAlvo; frame(0); }, { passive: true });
  } else requestAnimationFrame(frame);
})();
