/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {

  /* Hamburger Menu（そのまま） */
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const wrapper = document.querySelector('.fade-wrapper');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];

  if (!burger || !menu || !overlay || !titleArea) return;

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
      if (wrapper) wrapper.classList.add('fade-out');
      setTimeout(() => window.location.href = url, 600);
    });
  });

  function closeMenu() {
    burger.classList.remove('open');
    menu.classList.remove('open');
    titleArea.classList.remove('open');
    overlay.classList.remove('active');
  }
});


/* =========================
   Loading → Body Fade In
========================= */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  if (!loading) return;

  // bodyは最初透明
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 1s ease';

  // loadingを消す
  loading.style.opacity = '0';

  setTimeout(() => {
    loading.style.display = 'none';

    // bodyをふわっと表示
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });

  }, 2500); // loadingのfade時間と合わせる
});
