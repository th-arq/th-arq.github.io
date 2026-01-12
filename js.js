/* =========================
   DOM Ready + Page Fade + Hamburger + Swiper
========================= */
document.addEventListener('DOMContentLoaded', () => {

  // -------------------------
  // 共通要素取得
  // -------------------------
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];
  const pageFades = document.querySelectorAll('.page-fade');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const mainview = document.getElementById('Mainview');
  const loading = document.getElementById('loading');

  // -------------------------
  // 初期状態
  // -------------------------
  if (header) header.style.opacity = 0;
  if (footer) footer.style.opacity = 0;
  if (mainview) mainview.style.display = 'none';

  // -------------------------
  // ハンバーガーメニュー
  // -------------------------
  function closeMenu() {
    if (!burger || !menu || !titleArea || !overlay) return;
    burger.classList.remove('open');
    menu.classList.remove('open');
    titleArea.classList.remove('open');
    overlay.classList.remove('active');
  }

  if (burger && menu && overlay && titleArea) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
      titleArea.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target) || burger.contains(e.target)) return;
      closeMenu();
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.getAttribute('href');

        closeMenu();
        pageFades.forEach(el => el.classList.add('fade-out'));

        setTimeout(() => {
          window.location.href = url;
        }, 800);
      });
    });
  }

  // -------------------------
  // 通常ページフェードイン
  // -------------------------
  pageFades.forEach(el => el.classList.add('loaded'));
});

// -------------------------
// Loading (Top Pageのみ)
// -------------------------
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  const mainview = document.getElementById('Mainview');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const pageFades = document.querySelectorAll('.page-fade');

  if (!loading) return;

  const MIN_LOADING_TIME = 2500;
  const startTime = performance.now();
  const elapsed = performance.now() - startTime;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

  setTimeout(() => {
    // 1. Loadingフェードアウト
    loading.style.transition = 'opacity 0.5s ease';
    loading.style.opacity = 0;

    setTimeout(() => {
      loading.style.display = 'none';

      // 2. SwiperとMainviewを表示
      if (mainview) {
        mainview.style.display = 'block';
        mainview.style.opacity = 0;
        mainview.style.transition = 'opacity 1s ease';
        setTimeout(() => mainview.style.opacity = 1, 50);

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
      }

      // 3. Header/Footerをフェードイン（Swiper表示と少しズラす）
      setTimeout(() => {
        if (header) {
          header.style.transition = 'opacity 1s ease';
          header.style.opacity = 1;
        }
        if (footer) {
          footer.style.transition = 'opacity 1s ease';
          footer.style.opacity = 1;
        }

        // 4. ページ全体フェードもON
        pageFades.forEach(el => el.classList.add('loaded'));
      }, 300); // Swiperが少し見えてからHeader/Footer

    }, 500); // Loadingフェード完了
  }, remaining);
});
