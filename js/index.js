// index.js — ローディング退場 + clip-path reveal + ケンバーンズ

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

  setTimeout(() => { targetProgress = 100; }, 3000);


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
    }, 600);

    setTimeout(() => {
      initGallery();
    }, 1200);
  }
});


function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  // ── 全アイテムの img を reveal 前の状態にリセット ──
  // CSSの競合を避けるため、JS側で初期スケールを設定する
  items.forEach(item => {
    const img = item.querySelector('img');
    if (img) {
      // clip-path が開く前の状態: 大きく拡大しておく
      img.style.transform  = 'scale(1.15)';
      img.style.transition = 'none'; // まだ transition させない
    }
  });

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

  // フォールバック: 登録直後に画面内アイテムを強制チェック
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
  const delay = Math.random() * 180; // アイテムごとにほんの少しずらす

  const doReveal = () => {
    setTimeout(() => {

      // ① clip-path: 下から上へ幕が開く (Vamtam: vamtam-grow-bottom と同じ方向)
      item.style.transition = 'clip-path 1.4s cubic-bezier(0, 0.55, 0.45, 1)';
      item.style.clipPath   = 'inset(0 0 0% 0)';

      if (img) {
        // ② ケンバーンズ: clip-path と同時に拡大→等倍へゆっくり縮む
        //    transition を有効にしてから scale(1) にする
        img.style.transition = 'transform 1.4s cubic-bezier(0, 0.55, 0.45, 1)';
        img.style.transform  = 'scale(1)';

        // ③ reveal 完了後: ホバー用の transition に切り替える
        //    （ホバーで scale(1.06) するため 2s の遅い transition に戻す）
        setTimeout(() => {
          img.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 1450);
      }

    }, delay);
  };

  if (!img || (img.complete && img.naturalWidth > 0)) {
    doReveal();
  } else {
    img.addEventListener('load',  doReveal, { once: true });
    img.addEventListener('error', doReveal, { once: true });
  }
}
