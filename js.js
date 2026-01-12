
/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     Hamburger Menu
  ========================= */
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];
  const pageFades = document.querySelectorAll('.page-fade');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const mainview = document.getElementById('Mainview');

  function closeMenu() {
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

  /* =========================
     Normal Page Fade In
  ========================= */
  // ほんのちょっと遅らせて自然なフェードに
  setTimeout(() => {
    pageFades.forEach(el => el.classList.add('loaded'));
  }, 100);

});


/* =========================
   Loading + Swiper (Top Page Only)
========================= */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  const mainview = document.getElementById('Mainview');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');

  if (!loading || !mainview || !header || !footer) return;

  const MIN_LOADING_TIME = 2500;
  const startTime = performance.now();
  const elapsed = performance.now() - startTime;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

  // Loadingフェードアウト開始
  setTimeout(() => {
    loading.style.opacity = '0';

    setTimeout(() => {
      loading.style.display = 'none';

      // Swiper表示
      mainview.style.display = 'block';

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

      // Header/Footerをふんわり表示
      header.style.opacity = '0';
      footer.style.opacity = '0';
      setTimeout(() => {
        header.style.transition = 'opacity 1.2s ease';
        footer.style.transition = 'opacity 1.2s ease';
        header.style.opacity = '1';
        footer.style.opacity = '1';
      }, 100);

    }, 500); // loadingのフェード時間
  }, remaining);

});
