window.addEventListener('load', () => {

  // ─────────────────────────────────────────
  // 定数
  // ─────────────────────────────────────────
  const SLIDE_DURATION = 4200; 
  const FIRST_DELAY    = 1700; 
  const EASE_OUT       = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const EASE_REVEAL    = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // ─────────────────────────────────────────
  // 要素取得
  // ─────────────────────────────────────────
  const loading     = document.getElementById('loading');
  const percentEl   = document.getElementById('loading_percent');
  const slider      = document.getElementById('indexSlider');
  const progressBar = document.getElementById('isProgressBar');
  const dotsWrap    = document.getElementById('isDots');
  const slides      = Array.from(document.querySelectorAll('.is-slide'));
  const inners      = Array.from(document.querySelectorAll('.is-slide-inner'));
  const cats        = Array.from(document.querySelectorAll('.ic-item'));
  const heroLoc     = document.getElementById('heroLoc');
  const heroSub     = document.getElementById('heroSub');
  const heroCta     = document.getElementById('heroCta');
  const h1Lines     = Array.from(document.querySelectorAll('.ih-line span'));

  const TOTAL = slides.length;
  let currentIdx   = 0;
  let loopTimer    = null;

  // ─────────────────────────────────────────
  // ユーティリティ
  // ─────────────────────────────────────────
  function applyStyle(el, props, delay = 0) {
    if (delay === 0) {
      Object.assign(el.style, props);
    } else {
      setTimeout(() => Object.assign(el.style, props), delay);
    }
  }

  // ─────────────────────────────────────────
  // ドット生成
  // ─────────────────────────────────────────
  function buildDots() {
    slides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'isd' + (i === 0 ? ' isd-active' : '');
      d.dataset.idx = i;
      dotsWrap.appendChild(d);
    });
  }

  function updateDots(idx) {
    Array.from(dotsWrap.children).forEach((d, i) => {
      d.classList.toggle('isd-active', i === idx);
    });
  }

  // ─────────────────────────────────────────
  // プログレスバー
  // ─────────────────────────────────────────
  function runProgressBar(duration, startDelay) {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    setTimeout(() => {
      progressBar.style.transition = `width ${duration}ms linear`;
      progressBar.style.width = '100%';
    }, startDelay + 20);
  }

  // ─────────────────────────────────────────
  // スライド表示
  // ─────────────────────────────────────────
  function showSlide(idx, isFirst) {
    const slide = slides[idx];
    const inner = inners[idx];
    const clipDelay = isFirst ? FIRST_DELAY : 0;

    slide.style.transition = 'none';
    slide.style.clipPath   = 'inset(0 0 100% 0)';
    slide.style.zIndex     = '2';
    slide.style.opacity    = '1';
    inner.style.transition = 'none';
    inner.style.transform  = 'scale(1.18)';

    setTimeout(() => {
      requestAnimationFrame(() => {
        slide.style.transition = `clip-path 1.4s ${EASE_REVEAL}`;
        slide.style.clipPath   = 'inset(0 0 0% 0)';
        inner.style.transition = `transform ${SLIDE_DURATION + 2000}ms ${EASE_REVEAL}`;
        inner.style.transform  = 'scale(1.0)';
      });
    }, clipDelay);

    if (!isFirst) {
      const prevIdx = (idx - 1 + TOTAL) % TOTAL;
      const prev    = slides[prevIdx];
      setTimeout(() => {
        prev.style.transition = 'opacity 1.0s ease';
        prev.style.opacity    = '0';
        setTimeout(() => {
          prev.style.transition = 'none';
          prev.style.zIndex     = '0';
          prev.style.opacity    = '1';
        }, 1100);
      }, 10);
    }

    updateDots(idx);
  }

  // ─────────────────────────────────────────
  // スライダー起動
  // ─────────────────────────────────────────
  function startSlider() {
    currentIdx = 0;

    const sliderUI = [document.querySelector('.is-progress-wrap'), dotsWrap];
    sliderUI.forEach(el => {
      el.style.transition = 'opacity 0.8s ease';
      setTimeout(() => { el.style.opacity = '1'; }, FIRST_DELAY + 600);
    });

    showSlide(0, true);
    runProgressBar(SLIDE_DURATION, FIRST_DELAY);

    const firstTimer = setTimeout(() => {
      currentIdx = (currentIdx + 1) % TOTAL;
      showSlide(currentIdx, false);
      runProgressBar(SLIDE_DURATION, 0);

      loopTimer = setInterval(() => {
        currentIdx = (currentIdx + 1) % TOTAL;
        showSlide(currentIdx, false);
        runProgressBar(SLIDE_DURATION, 0);
      }, SLIDE_DURATION);

    }, SLIDE_DURATION + FIRST_DELAY);
  }

  // ─────────────────────────────────────────
  // ヒーロー・UI テキストアニメ
  // ─────────────────────────────────────────
  function startHeroAnims() {
    applyStyle(heroLoc, {
      transition: `opacity 0.7s ${EASE_OUT}, transform 0.7s ${EASE_OUT}`,
      opacity: '1', transform: 'translateY(0)'
    }, 400);

    h1Lines.forEach((span, i) => {
      applyStyle(span, {
        transition: `transform 0.8s ${EASE_OUT}`,
        transform: 'translateY(0)'
      }, 540 + i * 130);
    });

    // sub
    applyStyle(heroSub, {
      transition: `opacity 0.8s ${EASE_OUT}, transform 0.8s ${EASE_OUT}`,
      opacity: '1', transform: 'translateY(0)'
    }, 860);


    applyStyle(heroCta, {
      transition: 'opacity 1.4s ease',
      opacity: '1'
    }, 1100);

    cats.forEach((cat, i) => {
      applyStyle(cat, {
        transition: `clip-path 1.1s ${EASE_REVEAL}`,
        clipPath: 'inset(0 0 0% 0)'
      }, 1050 + i * 120);
    });
  }

  // ─────────────────────────────────────────
  // ローディング
  // ─────────────────────────────────────────
  const allImages = Array.from(document.querySelectorAll('.is-slide-inner img, .ic-item img'));
  let loadedCount = 0;
  let progress    = 0;

  function onAllLoaded() {
    const finish = setInterval(() => {
      if (progress < 100) progress++;
      if (percentEl) percentEl.textContent = progress + '%';
      if (progress >= 100) {
        clearInterval(finish);
        setTimeout(exitLoading, 300);
      }
    }, 12);
  }

  function exitLoading() {
    if (!loading) return;


    loading.style.transition = `transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.4s ease 0.55s`;
    loading.style.transform  = 'translateY(-100%)';
    loading.style.opacity    = '0';

    setTimeout(() => {
      loading.classList.add('loaded');
      loading.style.transform = '';
    }, 1050);

    setTimeout(() => {
      document.querySelector('.fade-logo')?.classList.add('show');
      document.querySelector('.fade-menu')?.classList.add('show');
    }, 700);

    setTimeout(() => {
      startHeroAnims();
      startSlider();
    }, 900);
  }

  if (allImages.length === 0) {
    onAllLoaded();
  } else {
    allImages.forEach(img => {
      const done = () => {
        loadedCount++;
        progress = Math.floor((loadedCount / allImages.length) * 100);
        if (percentEl) percentEl.textContent = progress + '%';
        if (loadedCount >= allImages.length) onAllLoaded();
      };
      if (img.complete && img.naturalWidth > 0) {
        done();
      } else {
        img.addEventListener('load',  done, { once: true });
        img.addEventListener('error', done, { once: true });
      }
    });
  }

  setTimeout(() => {
    if (loadedCount < allImages.length) {
      loadedCount = allImages.length;
      onAllLoaded();
    }
  }, 8000);
  buildDots();

});
