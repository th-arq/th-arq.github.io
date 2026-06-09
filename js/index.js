// index.js — ローディング退場 + clip-path reveal + ケンバーンズ

window.addEventListener("load", () => {
  const loading   = document.getElementById('loading');
  const percentEl = document.getElementById('loading_percent');

  const allImages = Array.from(document.querySelectorAll('.gallery-item img'));
  let loadedCount = 0;
  let progress    = 0;

  const onAllLoaded = () => {
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

    setTimeout(() => {
      // SP時のみDレイアウトに組み替え
      if (window.innerWidth <= 900) shuffleAndBuildD();
      initGallery();
    }, 1400);
  }
});


/* ----------------------------------------
  SP用: シャッフル → フル+ペア交互に組み替え
---------------------------------------- */
function shuffleAndBuildD() {
  const grid  = document.getElementById('galleryGrid');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.gallery-item'));

  // Fisher–Yates シャッフル
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  // DOMを空にして再構築
  grid.innerHTML = '';

  let idx = 0;
  while (idx < items.length) {
    // フル幅
    if (idx < items.length) {
      const full = items[idx++];
      full.classList.add('d-full');
      grid.appendChild(full);
    }
    // ペア（2枚）
    if (idx < items.length) {
      const pair = document.createElement('div');
      pair.className = 'd-pair';
      const a = items[idx++];
      pair.appendChild(a);
      if (idx < items.length) {
        const b = items[idx++];
        pair.appendChild(b);
      }
      grid.appendChild(pair);
    }
  }
}


/* ----------------------------------------
  reveal & ケンバーンズ（変更なし）
---------------------------------------- */
function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  const cols = getColumns();

  items.forEach((item, i) => {
    const col   = i % cols;
    const row   = Math.floor(i / cols);
    const delay = col * 80 + row * 50;
    setTimeout(() => { revealItem(item); }, delay);
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.revealed) return;
      revealItem(el);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px 0px 0px', threshold: 0 });

  items.forEach(item => {
    if (!item.dataset.revealed) io.observe(item);
  });
}


function revealItem(item) {
  if (item.dataset.revealed) return;
  item.dataset.revealed = '1';

  const img = item.querySelector('img');

  item.style.transition = 'clip-path 2.8s cubic-bezier(0.16, 1, 0.3, 1)';
  item.style.clipPath   = 'inset(0 0 0% 0)';

  if (img) {
    setTimeout(() => {
      img.style.transition = 'transform 10s cubic-bezier(0.16, 1, 0.3, 1)';
      img.style.transform  = 'scale(1.0)';
    }, 300);

    setTimeout(() => {
      img.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
    }, 11000);
  }
}


function getColumns() {
  // SP時はDレイアウトなので列数計算は不要（stagger用に便宜上1返す）
  if (window.innerWidth <= 900) return 1;
  const grid = document.querySelector('.gallery-grid, .gallery-d');
  if (!grid) return 3;
  return parseInt(window.getComputedStyle(grid).columnCount, 10) || 3;
}
