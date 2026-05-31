// index.js — ローディング上へ退場 + clip-pathリビール + 引きズーム + パララックス

window.addEventListener("load", () => {
  const loading   = document.getElementById('loading');
  const percentEl = document.getElementById('loading_percent');

  let progress       = 0;
  let targetProgress = 0;

  // lazy外したので全画像を対象にカウント
  const allImages = Array.from(document.querySelectorAll('.gallery-item img'));

  if (allImages.length === 0) {
    targetProgress = 100;
  } else {
    let loaded = 0;
    allImages.forEach(img => {
      const update = () => {
        loaded++;
        targetProgress = Math.floor((loaded / allImages.length) * 100);
      };
      if (img.complete && img.naturalWidth > 0) {
        update();
      } else {
        img.addEventListener('load',  update, { once: true });
        img.addEventListener('error', update, { once: true });
      }
    });
  }

  // パーセント表示を進めるタイマー
  const timer = setInterval(() => {
    if (progress < targetProgress) progress++;
    if (percentEl) percentEl.textContent = progress + '%';

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(exitLoading, 300);
    }
  }, 20);

  // 3秒経っても100にならない場合のフォールバック
  setTimeout(() => {
    if (progress < 100) {
      targetProgress = 100;
    }
  }, 3000);


  function exitLoading() {
    if (!loading) return;

    // 白地が上へスライドして退場
    loading.style.transition = 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.4s ease 0.55s';
    loading.style.transform  = 'translateY(-100%)';
    loading.style.opacity    = '0';

    setTimeout(() => {
      loading.classList.add('loaded');
      loading.style.transform = '';
    }, 1050);

    // ヘッダー
    setTimeout(() => {
      document.querySelector('.fade-logo')?.classList.add('show');
      document.querySelector('.fade-menu')?.classList.add('show');
    }, 600);

    // ギャラリー
    initGallery();
    initParallax();
  }
});


function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  // 全アイテムを隠す＋imgにズーム初期値
  items.forEach(item => {
    item.style.clipPath = 'inset(0 0 100% 0)';
    const img = item.querySelector('img');
    if (img) {
      img.style.transform  = 'scale(1.12)';
      img.style.transition = 'transform 1.6s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  });

  // ── 画面内アイテム：ローディング退場後に順次リビール ──
  // columnsレイアウトなので列番号ベースのstagger
  const cols = getColumns();
  
  items.forEach((item, i) => {
    const col = i % cols;
    // 列ごとにベースdelay、さらに行方向に少しずつ追加
    const row   = Math.floor(i / cols);
    const delay = 100 + col * 120 + row * 60 + Math.random() * 80;

    setTimeout(() => {
      revealItem(item);
    }, delay);
  });

  // ── スクロールで画面外から入ってきたアイテム ──
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

  // ページ下部のアイテム（初期表示外）をObserverに登録
  // 一定時間後にまだ未リビールのものだけ対象にする
  setTimeout(() => {
    items.forEach(item => {
      if (!item.dataset.revealed) {
        io.observe(item);
      }
    });
  }, 200);
}


function revealItem(item) {
  if (item.dataset.revealed) return;
  item.dataset.revealed = '1';

  item.style.transition = 'clip-path 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
  item.style.clipPath   = 'inset(0 0 0% 0)';

  // リビール開始と同時に引きズーム
  const img = item.querySelector('img');
  if (img) {
    setTimeout(() => {
      img.style.transform = 'scale(1.0)';
    }, 30);
  }
}


function getColumns() {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return 3;
  const val = window.getComputedStyle(grid).columnCount;
  return parseInt(val, 10) || 3;
}


function initParallax() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

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
