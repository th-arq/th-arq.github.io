document.addEventListener('DOMContentLoaded', () => {

  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];
  const pageFades = document.querySelectorAll('.page-fade');

  if (!burger || !menu || !overlay || !titleArea) return;

  function closeMenu() {
    burger.classList.remove('open');
    menu.classList.remove('open');
    titleArea.classList.remove('open');
    overlay.classList.remove('active');
  }

  // バーガー開閉
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    titleArea.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  // overlayクリックで閉じる
  overlay.addEventListener('click', closeMenu);

  // メニューリンク遷移フェード
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const url = link.getAttribute('href');

      closeMenu();

      pageFades.forEach(el => el.classList.add('fade-out'));

      setTimeout(() => {
        window.location.href = url;
      }, 800);
    });
  });

});
