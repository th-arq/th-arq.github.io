// index.js — ローディング退場 + clip-path reveal + ケンバーンズ

window.addEventListener("load", () => {
  const loading   = document.getElementById('loading');
  const percentEl = document.getElementById('loading_percent');

  const allImages = Array.from(document.querySelectorAll('.gallery-item img'));
  let loadedCount = 0;
  let progress    = 0;

  const onAllLoaded = () => {
    // 全画像ロード完了 → パーセントを100まで走らせてから退場
    const finish = setInterval(() => {
      if (progress < 100) progress++;
      if (percentEl) percentEl.textContent = progress + '%';
      if (progress >= 100) {
        clearInterval(finish);
        setTimeout(exitLoading, 300);
      }
    }, 12);
  };

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

  // 8秒フォールバック（重い画像でも必ず進む）
  setTimeout(() => {
    if (loadedCount < allImages.length) {
      loadedCount = allImages.length;
      onAllLoaded();
    }
  }, 8000);


  function exitLoading() {
    if (!loading) return;

    loading.style.transition = 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.4s ease 0.55s';
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

    // 退場後、一呼吸おいてから一斉発火
    setTimeout(() => {
      initGallery();
    }, 1400);
  }
});


function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  // 全画像ロード済みなので、画面内アイテムを一斉にstagger発火
  const cols = getColumns();

  items.forEach((item, i) => {
    const col   = i % cols;
    const row   = Math.floor(i / cols);
    // 列・行ベースの規則的なstagger（ランダムより揃って見える）
    const delay = col * 80 + row * 50;

    setTimeout(() => {
      revealItem(item);
    }, delay);
  });

  // スクロール先（画面外）はObserverで発火
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.revealed) return;
      revealItem(el);
      io.unobserve(el);
    });
  }, {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0,
  });

  items.forEach(item => {
    if (!item.dataset.revealed) io.observe(item);
  });
}


function revealItem(item) {
  if (item.dataset.revealed) return;
  item.dataset.revealed = '1';

  const img = item.querySelector('img');

  // clip-path: ゆっくり幕が開く
  item.style.transition = 'clip-path 2.8s cubic-bezier(0.16, 1, 0.3, 1)';
  item.style.clipPath   = 'inset(0 0 0% 0)';

  // ケンバーンズ: clip-path開始から少し遅れてゆっくり引く
  if (img) {
    setTimeout(() => {
      img.style.transition = 'transform 10s cubic-bezier(0.16, 1, 0.3, 1)';
      img.style.transform  = 'scale(1.0)';
    }, 300);

    // reveal完了後はホバー用transitionに戻す
    setTimeout(() => {
      img.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
    }, 11000);
  }
}


function getColumns() {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return 3;
  return parseInt(window.getComputedStyle(grid).columnCount, 10) || 3;
}
