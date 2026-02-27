window.addEventListener("load", () => {
  // ファーストビューはスクロール禁止
  document.body.style.overflow = "hidden";

  // header 読み込み
  fetch('/head.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('header').innerHTML = html;

      // 🔑 DOM反映を1フレーム待つ
      requestAnimationFrame(() => {
        const reveals = document.querySelectorAll(".reveal");
        const logo = document.querySelector(".fade-logo");
        const menu = document.querySelector(".fade-menu");

        /* ① 画像（同時・上→下） */
        setTimeout(() => {
          reveals.forEach(el => el.classList.add("show"));
        }, 300);

        /* ② ロゴ */
        setTimeout(() => {
          if (logo) logo.classList.add("show");
        }, 900);

        /* ③ メニュー */
        setTimeout(() => {
          if (menu) menu.classList.add("show");
        }, 1200);

        /* ④ スクロール解放 */
        setTimeout(() => {
          document.body.style.overflow = "";
        }, 1500);
      });
    });
});
