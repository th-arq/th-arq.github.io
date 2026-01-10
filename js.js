/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {

  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const pageFades = document.querySelectorAll('.page-fade');

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
     Page Transition (ALL LINKS)
  ========================= */
  document.querySelectorAll('a[href]').forEach(link => {
    const url = link.getAttribute('href');

    // 除外条件
    if (
      !url ||
      url.startsWith('#') ||
      url.startsWith('http') ||
      link.target === '_blank'
    ) return;

    link.addEventListener('click', e => {
      e.preventDefault();

      closeMenu();

      pageFades.forEach(el => el.classList.add('fade-out'));

      setTimeout(() => {
        window.location.href = url;
      }, 800);
    });
  });

  /* =========================
     Normal Page Fade In
  ========================= */
  pageFades.forEach(el => el.classList.add('loaded'));
});


/* =========================
   Loading (Top Page Only)
========================= */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  if (!loading) return;

  const pageFades = document.querySelectorAll('.page-fade');

  const MIN_LOADING_TIME = 2500;
  const startTime = performance.now();
  const elapsed = performance.now() - startTime;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

  setTimeout(() => {
    loading.style.opacity = '0';

    setTimeout(() => {
      loading.style.display = 'none';
      pageFades.forEach(el => el.classList.add('loaded'));
    }, 1500);

  }, remaining);
});
