document.addEventListener('DOMContentLoaded', () => {

  // hamberger overlay
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const wrapper = document.querySelector('.fade-wrapper');
  const menuLinks = menu.querySelectorAll('a');

  // menu - open
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    titleArea.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  // menu- close (クリック外)
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

  // overlay - close
  overlay.addEventListener('click', () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    titleArea.classList.remove('open');
    overlay.classList.remove('active');
  });

  // ▼ メニューリンク押したとき「閉じてフェードアウトして遷移」
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('href');

      // メニュー閉じる
      burger.classList.remove('open');
      menu.classList.remove('open');
      titleArea.classList.remove('open');
      overlay.classList.remove('active');

      // 少し遅らせてフェードアウト開始
      setTimeout(() => {
        wrapper.classList.add('fade-out');
      }, 100);

      // さらに遅らせてページ遷移
      setTimeout(() => {
        window.location.href = url;
      }, 600);
    });
  });

  // ▼ ページ読み込み時にフェードイン
  requestAnimationFrame(() => {
    wrapper.classList.add('loaded');
  });

  // loading animation
  window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    const minTime = 2000;

    setTimeout(() => {
      loading.style.opacity = '0';
      setTimeout(() => { loading.style.display = 'none'; }, 2500);
    }, minTime);
  });

});
