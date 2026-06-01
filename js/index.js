// index.js — ローディング上へ退場 + スクロール連動 clip-path + ケンバーンズ

window.addEventListener("load", () => {
  const loading   = document.getElementById('loading');
  const percentEl = document.getElementById('loading_percent');

  let progress       = 0;
  let targetProgress = 0;

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

  const timer = setInterval(() => {
    if (progress < targetProgress) progress++;
    if (percentEl) percentEl.textContent = progress + '%';
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(exitLoading, 300);
    }
  }, 20);

  // 3秒フォールバック
  setTimeout(() => { targetProgress = 100; }, 3000);


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

    // ローディング退場後、少し落ち着いてからギャラリー開始
    setTimeout(() => {
      initGallery();
    }, 1200);
  }
});


function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  // IntersectionObserver — フレームインしたら発火
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

  items.forEach(item => io.observe(item));

  // Observerが発火しない場合のフォールバック：登録直後に画面内のアイテムを強制チェック
  setTimeout(() => {
    items.forEach(item => {
      if (item.dataset.revealed) return;
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        revealItem(item);
      }
    });
  }, 100);
}


function revealItem(item) {
  if (item.dataset.revealed) return;
  item.dataset.revealed = '1';

  const img   = item.querySelector('img');
  const delay = Math.random() * 150;

  const doReveal = () => {
    setTimeout(() => {
      // clip-path: ゆっくりめくれて登場
      item.style.transition = 'clip-path 3s cubic-bezier(0.16, 1, 0.3, 1)';
      item.style.clipPath   = 'inset(0 0 0% 0)';

      // ケンバーンズ: 少し遅れてゆっくり引きズーム開始
      if (img) {
        setTimeout(() => {
          img.style.transform = 'scale(1.0)';
        }, 400);
      }
    }, delay);
  };

  // 画像ロード済みならすぐ、未ロードなら待ってから発火
  if (!img || (img.complete && img.naturalWidth > 0)) {
    doReveal();
  } else {
    img.addEventListener('load',  doReveal, { once: true });
    img.addEventListener('error', doReveal, { once: true });
  }
}
