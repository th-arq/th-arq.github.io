window.addEventListener("load", () => {
  // --- 1. ライブラリ(Lenis) ---
  // (ここは変更なし)

  // --- 3. Header / Footer の読み込み ---
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

          // スクロール監視
          window.addEventListener('scroll', () => {
            if (window.scrollY > 50) headerTag.classList.add('is-scrolled');
            else headerTag.classList.remove('is-scrolled');
          });

          // バーガーボタン（全ページ共通で設定）
          const burgerBtn = el.querySelector('.burger-btn');
          if (burgerBtn) {
            burgerBtn.addEventListener('click', (e) => {
              e.preventDefault();
              headerTag.classList.toggle('nav-open');
              if (headerTag.classList.contains('nav-open')) {
                document.body.style.overflow = 'hidden';
              } else {
                if (!document.body.classList.contains('is-index')) {
                  document.body.style.overflow = '';
                }
              }
            });
          }
        }
      });
  };

  // indexページでも他ページでも、まずはこれを実行！
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 4. メインコンテンツの表示 (index以外のフェード用) ---
  if (!document.body.classList.contains('is-index')) {
    setTimeout(() => {
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.classList.add('appeared');
    }, 100);
  }
});
