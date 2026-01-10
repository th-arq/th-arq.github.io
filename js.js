/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     Body Fade In
  ========================= */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.8s ease';

  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });


  /* =========================
     Hamburger Menu
  ========================= */
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const wrapper = document.querySelector('.fade-wrapper');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];

  if (!burger || !menu || !overlay || !titleArea) return;

  // menu open
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    titleArea.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  // menu close (outside click)
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('open')) return;
    if (menu.contains(e.target) || burger.contains(e.target)) return;

    closeMenu();
  });

  // overlay close
  overlay.addEventListener('click', closeMenu);

  // menu link click → fade out → jump
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('href');

      closeMenu();
      if (wrapper) wrapper.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = url;
      }, 600);
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
   Loading Fade Out
========================= */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  if (!loading) return;

  loading.style.opacity = '0';

  setTimeout(() => {
    loading.style.display = 'none';
  }, 1500); // CSSのtransition時間と合わせる
});
