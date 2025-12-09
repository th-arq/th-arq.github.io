document.addEventListener('DOMContentLoaded', () => {

  // hamberger overlay
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');

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

  // ▼ ここから追記：メニューリンク押したとき「閉じて遷移」
  const menuLinks = menu.querySelectorAll('a');

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const url = link.getAttribute('href');

      // すぐ遷移しないよう止める
      e.preventDefault();

      // メニュー閉じる
      burger.classList.remove('open');
      menu.classList.remove('open');
      titleArea.classList.remove('open');
      overlay.classList.remove('active');

      // アニメーション終わるのに合わせて遅延
      setTimeout(() => {
        window.location.href = url;
      }, 300); // ← メニュー閉じるアニメの速さに合わせて調整してOK
    });
  });
  // ▲ ここまで追記

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
