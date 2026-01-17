document.addEventListener('DOMContentLoaded', () => {

  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');

  if (!burger || !menu || !overlay || !titleArea) {
    console.warn('burger menu elements missing');
    return;
  }

  // 初期状態を強制リセット（重要）
  overlay.classList.remove('active');
  burger.classList.remove('open');
  menu.classList.remove('open');
  titleArea.classList.remove('open');

  function closeMenu() {
    burger.classList.remove('open');
    menu.classList.remove('open');
    titleArea.classList.remove('open');
    overlay.classList.remove('active');
  }

  burger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    burger.classList.toggle('open');
    menu.classList.toggle('open');
    titleArea.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', closeMenu);

});
