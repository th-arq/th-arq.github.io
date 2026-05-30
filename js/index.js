// index.js — Gallery reveal & loading（①時間差拡大 ③clip-pathリビール ⑤パララックス）

window.addEventListener("load", () => {
  const loading = document.getElementById('loading');
  const percentText = document.getElementById('loading_percent');

  let progress = 0;
  let targetProgress = 0;
  const images = document.querySelectorAll('img');
  const eagerImages = Array.from(images).filter(img => img.loading !== 'lazy');

  if (eagerImages.length === 0) {
    targetProgress = 100;
  } else {
    let loadedCount = 0;
    eagerImages.forEach((img) => {
      const update = () => {
        loadedCount++;
        targetProgress = Math.floor((loadedCount / eagerImages.length) * 100);
      };
      if (img.complete) update();
      else {
        img.addEventListener('load', update);
        img.addEventListener('error', update);
      }
    });
  }

  const timer = setInterval(() => {
    if (progress < targetProgress) progress++;
    if (percentText) percentText.textContent = progress + "%";

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        // ローディング：clip-pathでスライス退場
        if (loading) {
          loading.style.transition = 'clip-path 0.7s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.3s ease 0.5s';
          loading.style.clipPath = 'inset(0 0 100% 0)';
          loading.style.opacity = '0';
          setTimeout(() => {
            loading.classList.add('loaded');
            loading.style.clipPath = '';
          }, 800);
        }

        document.querySelector('main')?.classList.add('appeared');

        setTimeout(() => {
          document.querySelector(".fade-logo")?.classList.add("show");
          document.querySelector(".fade-menu")?.classList.add("show");
        }, 400);

        initGallery();
        initParallax();
      }, 600);
    }
  }, 20);
});


function initGallery() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach((item) => {
    // ③ clip-path で隠す（translateY は使わない）
    item.style.opacity = '1';
    item.style.clipPath = 'inset(0 0 100% 0)';
    item.style.transform = '';

    // ① 200〜3500ms のランダム幅で時間差
    const delay = 200 + Math.random() * 3300;

    setTimeout(() => {
      // ③ clip-path をめくれるように展開
      item.style.transition = 'clip-path 1000ms cubic-bezier(0.25, 1, 0.5, 1)';
      item.style.clipPath = 'inset(0 0 0% 0)';
    }, delay);
  });

  // スクロールreveal（画面外から入ってきたアイテム用）
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.entered) return;
        el.dataset.entered = 'true';

        // すでに登場済み（clip-pathが解除されている）ならスキップ
        const current = el.style.clipPath;
        if (!current || current === 'inset(0 0 0% 0)' || current === 'none') {
          io.unobserve(el);
          return;
        }

        const delay = 100 + Math.random() * 600;
        setTimeout(() => {
          el.style.transition = 'clip-path 1000ms cubic-bezier(0.25, 1, 0.5, 1)';
          el.style.clipPath = 'inset(0 0 0% 0)';
        }, delay);

        io.unobserve(el);
      }
    });
  }, {
    rootMargin: '0px 0px -5% 0px',
    threshold: 0.05,
  });

  items.forEach(item => io.observe(item));
}


function initParallax() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // columns数をCSSから動的に取得
  const getColumns = () => {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return 3;
    const style = window.getComputedStyle(grid);
    const cols  = style.getPropertyValue('column-count');
    return parseInt(cols, 10) || 3;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const cols    = getColumns(); // ← リアルタイムで列数取得
        items.forEach((item, i) => {
          const col = i % cols;
          let offset = 0;
          if (cols === 2) {
            // モバイル2列
            if (col === 0) offset = scrollY * -0.06;
            if (col === 1) offset = scrollY *  0.04;
          } else {
            // PC3列
            if (col === 0) offset = scrollY * -0.08;
            if (col === 1) offset = scrollY *  0.05;
            if (col === 2) offset = scrollY * -0.11;
          }
          item.style.setProperty('--parallax-y', `${offset}px`);
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}


function initTilt() {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      item.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) scale(1.03)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      setTimeout(() => item.style.transition = '', 600);
    });
  });
}
