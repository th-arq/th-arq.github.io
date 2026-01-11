/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {

  const overlay = document.getElementById('overlay');
const burger = document.querySelector('.hamburger');
const menu = document.getElementById('menu');
const body = document.body;

burger.addEventListener('click', () => {
  menu.classList.toggle('open');
  body.classList.toggle('menu-open');
});

  function closeMenu() {
    burger?.classList.remove('open');
    menu?.classList.remove('open');
    titleArea?.classList.remove('open');
    overlay?.classList.remove('active');
  }

  /* =========================
     Hamburger Menu
  ========================= */
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
  }

  /* =========================
     Page Transition（遷移時フェードアウト）
  ========================= */
  document.querySelectorAll('a[href]').forEach(link => {
    const url = link.getAttribute('href');

    // 除外（外部・アンカー・別タブ）
    if (
      !url ||
      url.startsWith('#') ||
      url.startsWith('http') ||
      link.target === '_blank'
    ) return;

    link.addEventListener('click', e => {
      e.preventDefault();

      closeMenu();
      pageFade.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = url;
      }, 800); // CSSのtransitionと合わせる
    });
  });

  /* =========================
     通常ページ Fade In
     （loading がないページ用）
  ========================= */
  if (!document.getElementById('loading')) {
    pageFade.classList.add('loaded');
  }
});


/* =========================
   Loading（Top Page Only）
========================= */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  if (!loading) return; // ← 他ページは完全に無関係

  const pageFade = document.body;

  const MIN_LOADING_TIME = 2500;

  setTimeout(() => {
    loading.style.opacity = '0';

    setTimeout(() => {
      loading.style.display = 'none';
      pageFade.classList.add('loaded'); // ← ここで初めて表示
    }, 1500);

  }, MIN_LOADING_TIME);
});
