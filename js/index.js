document.addEventListener("DOMContentLoaded", () => {
  // ファーストビュー固定
  document.body.classList.add("is-lock");

  const reveals = document.querySelectorAll(".reveal");
  const logo = document.querySelector(".fade-logo");
  const menu = document.querySelector(".fade-menu");

  // ① 画像3枚 同時に reveal
  reveals.forEach(el => {
    el.classList.add("show");
  });

  // ② ロゴ
  if (logo) {
    setTimeout(() => {
      logo.classList.add("show");
    }, 800);
  }

  // ③ メニュー
  if (menu) {
    setTimeout(() => {
      menu.classList.add("show");
    }, 1100);
  }

  // ④ スクロール解除
  setTimeout(() => {
    document.body.classList.remove("is-lock");
  }, 1600);
});
