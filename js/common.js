window.addEventListener("load", () => {
  // --- 1. Lenis (スムーススクロール) ---
  const script = document.createElement('script');
  script.src = "https://unpkg.com/lenis@1.1.13/dist/lenis.min.js";
  script.onload = () => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    // indexページでもスクロールしたい場合は、lenis.stop()を消すかコメントアウト
    // if (document.body.classList.contains('is-index')) { lenis.stop(); }

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  };
  document.head.appendChild(script);

  // --- 2. スクロール監視 (Aboutページなどのタイトル用) ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      } else {
        entry.target.classList.remove('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  document.querySelectorAll('.split-layout .title').forEach(title => {
    observer.observe(title);
  });

  // --- 3. Header / Footer 読み込み ---
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

          // スクロールで透明度変化
          window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
              headerTag.classList.add('is-scrolled');
            } else {
              headerTag.classList.remove('is-scrolled');
            }
          });

          // バーガーボタン
          const burgerBtn = el.querySelector('.burger-btn');
          if (burgerBtn) {
            burgerBtn.addEventListener('click', (e) => {
              e.preventDefault();
              headerTag.classList.toggle('nav-open');
              document.body.style.overflow = headerTag.classList.contains('nav-open') ? 'hidden' : '';
            });
          }
        }
      });
  };

  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 4. コンテンツ表示 (Aboutなどの下層ページ用) ---
  if (!document.body.classList.contains('is-index')) {
    setTimeout(() => {
      document.querySelector('main')?.classList.add('appeared');
      document.querySelector(".fade-logo")?.classList.add("show");
      document.querySelector(".fade-menu")?.classList.add("show");
    }, 100);
  }
});
