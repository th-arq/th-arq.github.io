document.addEventListener('headerLoaded', () => {

  // ファーストビューだけスクロール禁止
  document.body.style.overflow = "hidden";

  const reveals = document.querySelectorAll(".reveal");
  const logo = document.querySelector(".fade-logo");
  const menu = document.querySelector(".fade-menu");

  /* ① 画像（同時・上から下） */
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
