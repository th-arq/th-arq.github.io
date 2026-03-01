window.addEventListener("load", () => {
  // --- 1. ライブラリ(Lenis)を動的に読み込む ---
  const script = document.createElement('script');
  script.src = "https://unpkg.com/lenis@1.1.13/dist/lenis.min.js";
  script.onload = () => {
    // ライブラリが読み終わったら初期化する
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

  // --- 2. Header / Footer の読み込み (既存のコード) ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  setTimeout(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.classList.add('appeared');
    }
  }, 100);
  
});
