window.addEventListener("load", () => {
  document.body.style.overflow = "hidden";

  const loading = document.getElementById('loading');
  const percentText = document.getElementById('loading_percent');
  
  let progress = 0;
  let targetProgress = 0;
  const images = document.querySelectorAll('img');
  const totalCount = images.length;

  // ① 実際の画像読み込み監視
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

  // ② 数字を「じわじわ」増やすアニメーション
  const timer = setInterval(() => {
    // 実際の読み込み状況（targetProgress）を追いかけるように数字を増やす
    if (progress < targetProgress) {
      progress++;
    }
    
    // 表示を更新
    if (percentText) percentText.textContent = progress + "%";

    // 100%になったら終了
    if (progress >= 100) {
      clearInterval(timer);
      startSiteAnimation();
    }
  }, 20); // この数字を大きくするともっとゆっくりになるよ（20ms = 0.02秒ごと）

  function startSiteAnimation() {
    setTimeout(() => {
      if (loading) loading.classList.add('loaded');

      fetch('/head.html')
        .then(res => res.text())
        .then(html => {
          const headerEl = document.getElementById('header');
          if (headerEl) headerEl.innerHTML = html;

          requestAnimationFrame(() => {
            const reveals = document.querySelectorAll(".reveal");
            const logo = document.querySelector(".fade-logo");
            const menu = document.querySelector(".fade-menu");

            setTimeout(() => {
              reveals.forEach(el => el.classList.add("show"));
            }, 300);

            setTimeout(() => {
              if (logo) logo.classList.add("show");
            }, 900);

            setTimeout(() => {
              if (menu) menu.classList.add("show");
            }, 1200);

            setTimeout(() => {
              document.body.style.overflow = "";
            }, 1500);
          });
        });
    }, 600);
  }
});
