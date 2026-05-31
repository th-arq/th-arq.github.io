// index.js — ローディング上へ退場 + スクロール連動clip-pathリビール + 引きズーム + パララックス

window.addEventListener("load", () => {
  const loading    = document.getElementById('loading');
  const percentEl  = document.getElementById('loading_percent');

  let progress       = 0;
  let targetProgress = 0;

  const eagerImages = Array.from(document.querySelectorAll('img'))
    .filter(img => img.loading !== 'lazy');

  if (eagerImages.length === 0) {
    targetProgress = 100;
  } else {
    let loadedCount = 0;
    eagerImages.forEach(img => {
      const update = () => {
        loadedCount++;
        targetProgress = Math.floor((loadedCount / eagerImages.length) * 100);
      };
      if (img.complete) update();
      else {
        img.addEventListener('load',  update);
        img.addEventListener('error', update);
      }
    });
  }

  const timer = setInterval(() => {
    if (progress < targetProgress) progress++;
    if (percentEl) percentEl.textContent = progress + '%';

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        exitLoading();
      }, 300);
    }
  }, 20);


  function exitLoading() {
    if (!loading) return;

    // 白地が上へスライドして退場
    loading.style.transition = 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.3s ease 0.6s';
    loading.style.transform  = 'translateY(-100%)';
    loading.style.opacity    = '0';

    setTimeout(() => {
      loading.classList.add('loaded');
      loading.style.transform = '';
    }, 1000);

    // ヘッダー表示
    setTimeout(() => {
      document.querySelector('.fade-logo')?.classList.add('show');
      document.querySelector('.fade-menu')?.classList.add('show');
    }, 500);

    // ギャラリー初期化
    initGallery();
    initParallax();
  }
});


function initGallery() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach(item => {
    // clip-path で隠す。img に引きズーム初期値をセット
    item.style.clipPath = 'inset(0 0 100% 0)';
    item.style.willChange = 'clip-path';
    const img = item.querySelector('img');
    if (img) {
      img.style.transform  = 'scale(1.12)';
      img.style.transition = 'transform 1.6s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  });

  // --- IntersectionObserver でスクロール連動リビール ---
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.revealed) return;
      el.dataset.revealed = '1';

      const delay = 40 + Math.random() * 200;
      setTimeout(() => {
        // ③ clip-path: 上から下にめくれて登場
        el.style.transition = 'clip-path 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
        el.style.clipPath    = 'inset(0 0 0% 0)';

        // リビール完了後に引きズーム
        setTimeout(() => {
          const img = el.querySelector('img');
          if (img) img.style.transform = 'scale(1.0)';
        }, 50);
      }, delay);

      io.unobserve(el);
    });
  }, {
    rootMargin: '0px 0px -4% 0px',
    threshold:  0.04,
  });

  items.forEach(item => io.observe(item));
}


function initParallax() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  const getColumns = () => {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return 3;
    return parseInt(window.getComputedStyle(grid).columnCount, 10) || 3;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const cols    = getColumns();
      items.forEach((item, i) => {
        const col = i % cols;
        let offset = 0;
        if (cols === 2) {
          if (col === 0) offset = scrollY * -0.06;
          if (col === 1) offset = scrollY *  0.04;
        } else {
          if (col === 0) offset = scrollY * -0.08;
          if (col === 1) offset = scrollY *  0.05;
          if (col === 2) offset = scrollY * -0.11;
        }
        item.style.setProperty('--parallax-y', `${offset}px`);
      });
      ticking = false;
    });
  });
}
