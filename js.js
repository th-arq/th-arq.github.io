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

  setTimeout(() => {
    // 1. Loadingフェードアウト
    loading.style.opacity = '0';

    setTimeout(() => {
      loading.style.display = 'none';

      // 2. Swiperを表示＆ふんわり
      mainview.style.opacity = '0';
      mainview.style.display = 'block';
      mainview.style.transition = 'opacity 1s ease';
      setTimeout(() => {
        mainview.style.opacity = '1';
      }, 50); // 少し遅らせてopacityアニメ

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

      // 3. Header/Footerをさらに遅らせてふんわり表示
      header.style.opacity = '0';
      footer.style.opacity = '0';
      header.style.transition = 'opacity 1.2s ease';
      footer.style.transition = 'opacity 1.2s ease';
      setTimeout(() => {
        header.style.opacity = '1';
        footer.style.opacity = '1';
      }, 600); // ← Swiper表示から0.6秒後にフェードイン

    }, 500); // loadingのフェード時間
  }, remaining);
});
