window.addEventListener("load", () => {
  // --- 1. ライブラリ(Lenis)を動的に読み込む ---
  const script = document.createElement('script');
  script.src = "https://unpkg.com/lenis@1.1.13/dist/lenis.min.js";
  script.onload = () => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    if (document.body.classList.contains('is-index')) {
      lenis.stop();
    }
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  };
  document.head.appendChild(script);

  // --- 2. スクロール監視（タイトルの色変化） ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      } else {
        entry.target.classList.remove('is-active');
      }
    });
  }, {
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0 
  });

  document.querySelectorAll('.split-layout .title').forEach(title => {
    observer.observe(title);
  });

  // --- 3. Header / Footer の読み込み ＋ ヘッダー監視 ＋ バーガーメニュー ---
  const loadParts = (id, path) => {
    fetch(path)
      .then(res => res.text())
      .then(html => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = html;

        if (id === 'header') {
          const headerTag = el.querySelector('header');
          if (!headerTag) return;

          // A: スクロール監視（ヘッダーを半透明にする等）
          window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
              headerTag.classList.add('is-scrolled');
            } else {
              headerTag.classList.remove('is-scrolled');
            }
          });

          // B: バーガーボタンのクリック処理
          const burgerBtn = el.querySelector('.burger-btn');
          if (burgerBtn) {
            burgerBtn.addEventListener('click', (e) => {
              e.preventDefault();
              headerTag.classList.toggle('nav-open');
              
              // メニューが開いているときは背景をスクロールさせない
              if (headerTag.classList.contains('nav-open')) {
                document.body.style.overflow = 'hidden';
              } else {
                // indexページ以外ならスクロールを戻す
                if (!document.body.classList.contains('is-index')) {
                  document.body.style.overflow = '';
                }
              }
            });
          }
        }
      });
  };

  // 全ページ共通でヘッダーとフッターを読み込む
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 4. メインコンテンツの表示 (index以外のページ用) ---
  if (!document.body.classList.contains('is-index')) {
    setTimeout(() => {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.classList.add('appeared');
      }
    }, 100);
  }
});
