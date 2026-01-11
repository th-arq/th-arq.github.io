/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     Hamburger Menu
  ========================= */
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

        setTimeout(() => {
          window.location.href = url;
        }, 800);
      });
    });
  }

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
  if (!loading) return; // ← 他ページはここで終了

  const pageFades = document.querySelectorAll('.page-fade');

  // 最低表示時間（ms）
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

let current = window.scrollY;
let target = window.scrollY;
let velocity = 0; // 速度

function smoothScroll() {
  target = window.scrollY;

  // 差分
  let diff = target - current;

  // 単純イージング＋加速度っぽく
  velocity += diff * 0.1;   // 加速
  velocity *= 0.8;           // 減速で自然に止まる

  current += velocity;

  // 目標に近づいたら直接合わせる
  if (Math.abs(diff) < 0.5 && Math.abs(velocity) < 0.1) {
    current = target;
    velocity = 0;
  }

  window.scrollTo(0, current);
  requestAnimationFrame(smoothScroll);
}

requestAnimationFrame(smoothScroll);
