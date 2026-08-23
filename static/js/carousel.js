(function () {
  const root = document.getElementById('carousel');
  if (!root) return;

  const stage = document.getElementById('carouselStage');
  const cards = Array.from(stage.querySelectorAll('.project-card'));
  const dotsWrap = document.getElementById('carouselDots');
  const captionTitle = document.getElementById('captionTitle');
  const captionCategory = document.getElementById('captionCategory');
  const prevBtn = root.querySelector('.carousel__arrow[data-dir="-1"]');
  const nextBtn = root.querySelector('.carousel__arrow[data-dir="1"]');

  const total = cards.length;
  let active = 0;

  // ---------- dots ----------
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel__dot';
    dot.setAttribute('aria-label', `Ir para o projeto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  // ---------- posicionamento (coverflow) ----------
  function render() {
    cards.forEach((card, i) => {
      // distância circular até o card ativo (ex: com 4 cards, o mais
      // curto entre ir "pra frente" ou "pra trás")
      let offset = i - active;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const abs = Math.abs(offset);
      const isActive = offset === 0;
      const visible = abs <= 2;

      const x = offset * 60; // % do card-w, via custom property abaixo
      const z = -abs * 160;
      const rotateY = offset * -12;
      const scale = 1 - abs * 0.18;
      const opacity = visible ? Math.max(1 - abs * 0.62, 0.12) : 0;
      const blur = abs * 1.6; // px — leve desfoque nos cards de trás
      const saturate = Math.max(1 - abs * 0.55, 0.25);
      const brightness = Math.max(1 - abs * 0.18, 0.7);

      card.style.transform =
        `translate(-50%, -50%) translateX(${x}%) translateZ(${z}px) rotateY(${rotateY}deg) scale(${Math.max(scale, 0.62)})`;
      card.style.opacity = opacity;
      card.style.filter = isActive ? 'none' : `blur(${blur}px) saturate(${saturate}) brightness(${brightness})`;
      card.style.zIndex = String(total - abs);
      card.style.pointerEvents = visible ? 'auto' : 'none';
      card.classList.toggle('is-active', isActive);
    });

    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));

    const activeCard = cards[active];
    captionTitle.textContent = activeCard.dataset.title;
    captionCategory.textContent = activeCard.dataset.category;
  }

  function goTo(index) {
    active = ((index % total) + total) % total;
    render();
  }

  function next() { goTo(active + 1); }
  function prev() { goTo(active - 1); }

  // ---------- clique num card lateral leva ele pro centro;
  //            clique no card já ativo segue o link normalmente
  //            (a menos que o clique tenha sido, na verdade, um arraste) ----------
  let dragMoved = false;

  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (dragMoved) {
        e.preventDefault();
        dragMoved = false;
        return;
      }
      if (i !== active) {
        e.preventDefault();
        goTo(i);
      }
    });
  });

  prevBtn.addEventListener('click', () => prev());
  nextBtn.addEventListener('click', () => next());

  // ---------- teclado ----------
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // ---------- swipe (touch) ----------
  let touchStartX = null;
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      delta < 0 ? next() : prev();
    }
    touchStartX = null;
  });

  // ---------- arrastar com o mouse (desktop) ----------
  let mouseDownX = null;
  let isDragging = false;

  stage.addEventListener('mousedown', (e) => {
    mouseDownX = e.clientX;
    isDragging = true;
    dragMoved = false;
    stage.classList.add('is-dragging');
  });

  // escuta no window (não só no stage) pra continuar funcionando mesmo
  // se o mouse sair da área do carrossel enquanto ainda está pressionado
  window.addEventListener('mousemove', (e) => {
    if (!isDragging || mouseDownX === null) return;
    const delta = e.clientX - mouseDownX;
    if (Math.abs(delta) > 5) dragMoved = true; // além de "arrastando", virou um gesto de verdade
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-dragging');
    if (mouseDownX === null) return;

    const delta = e.clientX - mouseDownX;
    if (Math.abs(delta) > 40) {
      delta < 0 ? next() : prev();
    }
    mouseDownX = null;
  });

  // evita o navegador tentar "arrastar" a imagem como se fosse um link/arquivo
  stage.addEventListener('dragstart', (e) => e.preventDefault());

  render();
})();