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

  // menu- close
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

  // overlay - open
  overlay.addEventListener('click', () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    titleArea.classList.remove('open');
    overlay.classList.remove('active');
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

  // AOS
  AOS.init({
    duration: 1000,
    once: true
  });
});
