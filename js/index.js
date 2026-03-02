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

  function startSiteAnimation() {
    setTimeout(() => {
      // 2. ローディング画面を非表示にする
      if (loading) loading.classList.add('loaded');

      // 3. 重要！ローディングが消えたらすぐにスクロールを解禁（演出を待たない）
      // ただし、トップページ(is-index)の場合は固定したいので条件をつける
      if (!document.body.classList.contains('is-index')) {
        document.body.style.overflow = "";
      }

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

            setTimeout(() => { if (logo) logo.classList.add("show"); }, 900);
            setTimeout(() => { if (menu) menu.classList.add("show"); }, 1200);
            
            // 念のため、全ての演出が終わった後にもう一度解禁（ダメ押し）
            if (!document.body.classList.contains('is-index')) {
              document.body.style.overflow = "";
            }
          });
        });
    }, 600);
  }
});
