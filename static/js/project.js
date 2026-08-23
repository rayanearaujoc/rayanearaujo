/* ===================================================
   project.js — animações de scroll (reveal) para as
   páginas de case (appta.html, getsnack.html, ...)

   Como usar no HTML:
   - Adicione a classe "reveal" em qualquer elemento
     que deve "aparecer" quando entrar na tela.
   - Para atrasar alguns itens de um mesmo grupo
     (ex: par de imagens, cards), some as classes
     "reveal-delay-1", "reveal-delay-2", "reveal-delay-3".
   - Inclua este arquivo com:
     <script src="../static/js/project.js" defer></script>
   =================================================== */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var items = document.querySelectorAll(".reveal");

  // Se o usuário prefere menos movimento (ou o navegador não
  // suporta IntersectionObserver), mostra tudo de uma vez, sem animar.
  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.15,
    }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ===================================================
   botão "voltar" — usa o histórico do navegador quando a
   pessoa veio de outra página do próprio site; senão, cai
   no link normal (href="../index.html")
   =================================================== */
   /* ===================================================
   botão "voltar" — vai para a página anterior do próprio
   site (quando existir), sempre abrindo no topo dela
   =================================================== */
(function () {
  "use strict";

  var backLinks = document.querySelectorAll(".case-back");
  if (!backLinks.length) return;

  var cameFromSameSite =
    document.referrer && document.referrer.indexOf(location.origin) === 0;

  if (cameFromSameSite) {
    backLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        history.back();
      });
    });
  }

  // quando o navegador restaura a página pelo cache (ao voltar),
  // ele tende a manter a posição de scroll anterior — isso força
  // o topo de qualquer jeito
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      window.scrollTo(0, 0);
    }
  });
})();

/* ===================================================
   card final expansível (CTA de contato) — só existe
   na página da Lumpia; nas outras, os elementos não
   são encontrados e este bloco não faz nada
   =================================================== */
(function () {
  "use strict";

  var toggle = document.getElementById("ctaToggle");
  var panel = document.getElementById("ctaPanel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    var isOpen = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (isOpen) {
      // dá um tempinho pra transição começar antes de rolar até o painel
      setTimeout(function () {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 150);
    }
  });
})();
