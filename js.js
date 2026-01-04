document.addEventListener('DOMContentLoaded', () => {

  
  /* =========================
     Body Fade In（div不要）
  ========================= 
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.8s ease';

  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
*/

  /* =========================
     Hamburger Menu
  ========================= */
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const wrapper = document.querySelector('.fade-wrapper');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];

  if (burger && menu && overlay && titleArea) {

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

      burger.classList.remove('open');
      menu.classList.remove('open');
      titleArea.classList.remove('open');
      overlay.classList.remove('active');
    });

    // overlay close
    overlay.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
      titleArea.classList.remove('open');
      overlay.classList.remove('active');
    });

    // menu link click → fade out → jump
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.getAttribute('href');

        burger.classList.remove('open');
        menu.classList.remove('open');
        titleArea.classList.remove('open');
        overlay.classList.remove('active');

        if (wrapper) wrapper.classList.add('fade-out');

        setTimeout(() => {
          window.location.href = url;
        }, 600);
      });
    });
  }




});
