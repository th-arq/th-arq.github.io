document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];
  const pageFades = document.querySelectorAll('.page-fade');

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
        setTimeout(() => { window.location.href = url; }, 800);
      });
    });
  }

  // ページ全体フェードイン
  pageFades.forEach(el => el.classList.add('loaded'));
});
