/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     Hamburger Menu
  ========================= */
  const overlay   = document.getElementById('overlay');
  const burger    = document.querySelector('.hamburger');
  const menu      = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const wrapper   = document.querySelector('.fade-wrapper') || document.body;
  const menuLinks = menu ? menu.querySelectorAll('a') : [];

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
        transitionTo(link.getAttribute('href'));
      });
    });
  }

  function closeMenu() {
    burger?.classList.remove('open');
    menu?.classList.remove('open');
    titleArea?.classList.remove('open');
    overlay?.classList.remove('active');
  }

  /* =========================
     Page Transition (common)
  ========================= */
  function transitionTo(url) {
    wrapper.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  }

  // 通常リンクも拾う（同一ページ / 外部リンク除外）
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.target === '_blank') return;
    if (link.href === location.href) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      transitionTo(link.href);
    });
  });

});


/* =========================
   Top Page Loading (only)
========================= */
window.addEventListener('load', () => {

  const loading = document.getElementById('loading');
  if (!loading) return; // ← トップ以外では何もしない

  const MIN_DISPLAY_TIME = 2000; // 最低表示秒数（ms）
  const startTime = performance.now();

  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 1s ease';

  const elapsed = perf
