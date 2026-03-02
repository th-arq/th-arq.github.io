window.addEventListener("load", () => {
  // 1. ローディング開始時にスクロール禁止
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

  // ② カウントアップ（数字をじわじわ増やす）
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

  function startSiteAnimation() {
    setTimeout(() => {
      // 2. ローディング画面を非表示にする
      if (loading) loading.classList.add('loaded');

      // 3. index専用のアニメーション（ヘッダー内の要素やメイン画像）
      // ①の共通JSがヘッダーを読み込み終わるのを少し待ってから実行する
      setTimeout(() => {
        requestAnimationFrame(() => {
          const reveals = document.querySelectorAll(".reveal");
          const logo = document.querySelector(".fade-logo");
          const menu = document.querySelector(".fade-menu");

          // メインコンテンツの表示
          reveals.forEach(el => el.classList.add("show"));

          // ヘッダー内のロゴとメニューをフェードイン
          setTimeout(() => { if (logo) logo.classList.add("show"); }, 300);
          setTimeout(() => { if (menu) menu.classList.add("show"); }, 600);
        });
      }, 500); // 共通JSがHTMLを読み込むための待ち時間

    }, 600);
  }
});
