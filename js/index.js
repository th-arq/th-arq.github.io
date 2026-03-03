window.addEventListener("load", () => {
  const loading = document.getElementById('loading');
  const percentText = document.getElementById('loading_percent');
  
  let progress = 0;
  let targetProgress = 0;
  const images = document.querySelectorAll('img');
  
  // 画像読み込み計算
  if (images.length === 0) {
    targetProgress = 100;
  } else {
    let loadedCount = 0;
    images.forEach((img) => {
      const updateProgress = () => {
        loadedCount++;
        targetProgress = Math.floor((loadedCount / images.length) * 100);
      };
      if (img.complete) updateProgress();
      else {
        img.addEventListener('load', updateProgress);
        img.addEventListener('error', updateProgress);
      }
    });
  }

  // カウントアップアニメーション
  const timer = setInterval(() => {
    if (progress < targetProgress) progress++;
    if (percentText) percentText.textContent = progress + "%";

    if (progress >= 100) {
      clearInterval(timer);
      // ローディング終了後のアニメーション
      setTimeout(() => {
        loading?.classList.add('loaded');
        document.querySelector('main')?.classList.add('appeared');
        
        // 画像をふわっと出す
        document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));

        // ヘッダー（ロゴ・メニュー）を出す
        setTimeout(() => {
          document.querySelector(".fade-logo")?.classList.add("show");
          document.querySelector(".fade-menu")?.classList.add("show");
        }, 500);
      }, 600);
    }
  }, 20);
});
