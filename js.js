document.addEventListener('DOMContentLoaded', () => {
  // Swiper初期化
  const swiper = new Swiper('.top-slider', {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  // ハンバーガーメニューとオーバーレイ
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');

  // ハンバーガークリックで開閉
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    titleArea.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  // メニュー外クリックで閉じる
  document.addEventListener('click', (e) => {
    const isMenuOpen = menu.classList.contains('open');
    const clickedInsideMenu = menu.contains(e.target);
    const clickedBurger = burger.contains(e.target);

    if (isMenuOpen && !clickedInsideMenu && !clickedBurger) {
      burger.classList.remove('open');
      menu.classList.remove('open');
      titleArea.classList.remove('open');
      overlay.classList.remove('active');
    }
  });

  // オーバーレイクリックで閉じる
  overlay.addEventListener('click', () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    titleArea.classList.remove('open');
    overlay.classList.remove('active');
  });

  // ローディングフェードアウト
  window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    const minTime = 2000;

    setTimeout(() => {
      loading.style.opacity = '0';
      setTimeout(() => { loading.style.display = 'none'; }, 2500);
    }, minTime);
  });

  // AOS初期化
  AOS.init({
    duration: 1000,
    once: true
  });
});
