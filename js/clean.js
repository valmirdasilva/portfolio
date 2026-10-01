(function () {
  "use strict";

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = "© " + new Date().getFullYear();

  /* menu móvel */
  var toggle = document.getElementById("navToggle");
  var movel = document.getElementById("navMovel");
  if (toggle && movel) {
    toggle.addEventListener("click", function () {
      var ab = movel.classList.toggle("aberto");
      toggle.setAttribute("aria-expanded", ab ? "true" : "false");
    });
    movel.addEventListener("click", function (e) { if (e.target.tagName === "A") movel.classList.remove("aberto"); });
  }

  /* configurador de escopo */
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

  /* reveal suave ao rolar */
  var alvos = [].slice.call(document.querySelectorAll(".surge"));
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("dentro"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    alvos.forEach(function (a) { io.observe(a); });
  } else { alvos.forEach(function (a) { a.classList.add("dentro"); }); }
})();
