window.addEventListener("load", () => {
  // 1. 初期設定：スクロール禁止
  document.body.style.overflow = "hidden";

  const loading = document.getElementById('loading');
  const percentText = document.getElementById('loading_percent');
  
  let progress = 0;
  let targetProgress = 0;
  const images = document.querySelectorAll('img');
  const totalCount = images.length;

  // ① 画像読み込み監視
  if (totalCount === 0) {
    targetProgress = 100;
  } else {
    let loadedCount = 0;
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        targetProgress = Math.floor((loadedCount / totalCount) * 100);
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          targetProgress = Math.floor((loadedCount / totalCount) * 100);
        });
        img.addEventListener('error', () => {
          loadedCount++;
          targetProgress = Math.floor((loadedCount / totalCount) * 100);
        });
      }
    });
  }

  // ② カウントアップ
  const timer = setInterval(() => {
    if (progress < targetProgress) {
      progress++;
    }
    if (percentText) percentText.textContent = progress + "%";

    if (progress >= 100) {
      clearInterval(timer);
      startSiteAnimation();
    }
  }, 20);

  // ③ サイト表示アニメーション
  function startSiteAnimation() {
    // 確実に画像を表示するための処理
    const showContent = () => {
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.classList.add('appeared');

      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach(el => {
        el.classList.add("show");
      });
    };

    setTimeout(() => {
      // ローディング画面を消す
      if (loading) loading.classList.add('loaded');

      // 1. まずメインコンテンツ（画像）を出す
      showContent();

      // 2. その後、ヘッダー内の要素（ロゴ・メニュー）を出す
      // 共通JSがHTMLを読み込む時間を考慮して少し遅らせる
      setTimeout(() => {
        const logo = document.querySelector(".fade-logo");
        const menu = document.querySelector(".fade-menu");
        if (logo) logo.classList.add("show");
        if (menu) menu.classList.add("show");
      }, 500);

    }, 600);
  }
});
