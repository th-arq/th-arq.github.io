window.addEventListener("load", () => {
  // ① 初期設定：スクロール禁止
  document.body.style.overflow = "hidden";

  const loading = document.getElementById('loading');
  const percentText = document.getElementById('loading_percent');
  const images = document.querySelectorAll('img');
  let loadedCount = 0;
  const totalCount = images.length;

  // 進捗を更新する関数
  function updateProgress() {
    loadedCount++;
    let progress = Math.floor((loadedCount / totalCount) * 100);
    if (percentText) percentText.textContent = progress + "%";

    if (loadedCount >= totalCount) {
      // 全読み込み完了！
      startSiteAnimation();
    }
  }

  // 画像の読み込みをチェック
  if (totalCount === 0) {
    startSiteAnimation();
  } else {
    images.forEach((img) => {
      if (img.complete) {
        updateProgress();
      } else {
        img.addEventListener('load', updateProgress);
        img.addEventListener('error', updateProgress); // エラーでも進める
      }
    });
  }

  // ② メインのアニメーション開始関数
  function startSiteAnimation() {
    // 100%になってから少しだけ余韻
    setTimeout(() => {
      // ローディング画面を非表示に
      if (loading) loading.classList.add('loaded');

      // ヘッダーの読み込みを開始
      fetch('/head.html')
        .then(res => res.text())
        .then(html => {
          const headerEl = document.getElementById('header');
          if (headerEl) headerEl.innerHTML = html;

          requestAnimationFrame(() => {
            const reveals = document.querySelectorAll(".reveal");
            const logo = document.querySelector(".fade-logo");
            const menu = document.querySelector(".fade-menu");

            /* 1. 画像表示（同時・上→下） */
            setTimeout(() => {
              reveals.forEach(el => el.classList.add("show"));
            }, 300);

            /* 2. ロゴ */
            setTimeout(() => {
              if (logo) logo.classList.add("show");
            }, 900);

            /* 3. メニュー */
            setTimeout(() => {
              if (menu) menu.classList.add("show");
            }, 1200);

            /* 4. スクロール解放 */
            setTimeout(() => {
              document.body.style.overflow = "";
            }, 1500);
          });
        });
    }, 600); // 100%表示後の待ち時間
  }
});
