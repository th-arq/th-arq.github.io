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

      // indexページはもともとスクロールしない設定(is-index)なので
      // ここで overflow = "" にする必要はなし

      // ★ここが修正ポイント！
      // index専用JSでは fetch('/head.html') をしない。
      // ①の共通JSが読み込んでくれるのを待つだけにするよ。

      requestAnimationFrame(() => {
        // メインコンテンツ（画像など）のフェードインだけ担当する
        const reveals = document.querySelectorAll(".reveal");
        setTimeout(() => {
          reveals.forEach(el => el.classList.add("show"));
        }, 300);
      });
    }, 600);
  }
});
