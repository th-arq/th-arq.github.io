window.addEventListener('load', () => {

  // ① 画像は全て同時に表示
  const images = document.querySelectorAll('.reveal');
  images.forEach(img => {
    img.classList.add('show');
  });

  // ② ロゴを少し遅れて表示
  setTimeout(() => {
    const logo = document.querySelector('.fade-logo');
    if (logo) logo.classList.add('show');
  }, 800);

  // ③ メニューをさらに遅れて表示
  setTimeout(() => {
    const menu = document.querySelector('.fade-menu');
    if (menu) menu.classList.add('show');
  }, 1200);

});
