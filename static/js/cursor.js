(function () {
  "use strict";

  // só ativa em telas com mouse de verdade (não mexe em nada no touch)
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var dot = document.createElement("div");
  dot.className = "cursor-dot";
  var ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mouseX = 0, mouseY = 0;
  var ringX = 0, ringY = 0;

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  // o anel "persegue" o mouse com um leve atraso (interpolação),
  // é isso que dá a sensação suave em vez de grudado no ponteiro
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // some quando o mouse sai da janela (evita ficar um pontinho
  // "grudado" na borda da tela)
  document.addEventListener("mouseleave", function () {
    dot.classList.add("is-hidden");
    ring.classList.add("is-hidden");
  });
  document.addEventListener("mouseenter", function () {
    dot.classList.remove("is-hidden");
    ring.classList.remove("is-hidden");
  });

  // aumenta o anel sobre qualquer coisa clicável do site
  var hoverSelector =
    "a, button, .project-card, .carousel__arrow, .work__arrow, [role='button']";

  document.addEventListener("mouseover", function (e) {
    if (e.target.closest(hoverSelector)) {
      ring.classList.add("is-hovering");
    }
  });
  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(hoverSelector)) {
      ring.classList.remove("is-hovering");
    }
  });
})();