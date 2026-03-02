window.addEventListener("load", () => {
  document.body.style.overflow = "hidden"; // ロード中は止める

  const loading = document.getElementById('loading');
  const percentText = document.getElementById('loading_percent');
  let progress = 0;
  let targetProgress = 0;
  const images = document.querySelectorAll('img');

  // ① 画像読み込み監視 (ここは変更なし)
  // ... (中略) ...

  // ② カウントアップ
  const timer = setInterval(() => {
    if (progress < targetProgress) progress++;
    if (percentText) percentText.textContent = progress + "%";
    if (progress >= 100) {
      clearInterval(timer);
      startSiteAnimation();
    }
  }, 20);

  function startSiteAnimation() {
    setTimeout(() => {
      if (loading) loading.classList.add('loaded');

      // ヘッダーやロゴのフェードインアニメーションを開始
      requestAnimationFrame(() => {
        const reveals = document.querySelectorAll(".reveal");
        const logo = document.querySelector(".fade-logo");
        const menu = document.querySelector(".fade-menu");

        setTimeout(() => {
          reveals.forEach(el => el.classList.add("show"));
        }, 300);

        // ①で読み込まれたヘッダーの中身に対してクラスをつける
        setTimeout(() => { if (logo) logo.classList.add("show"); }, 900);
        setTimeout(() => { if (menu) menu.classList.add("show"); }, 1200);
      });
    }, 600);
  }
});
