document.addEventListener('DOMContentLoaded', () => {

  // page fade in
  document.body.classList.add('loaded');

  // ======================
  // Burger Menu
  // ======================

  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');

  if (burger && menu && overlay && titleArea) {

    function closeMenu() {
      burger.classList.remove('open');
      menu.classList.remove('open');
      titleArea.classList.remove('open');
      overlay.classList.remove('active');
    }

    burger.addEventListener('click', (e) => {
      e.stopPropagation();

      burger.classList.toggle('open');
      menu.classList.toggle('open');
      titleArea.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeMenu);
  }

  // ======================
  // Gallery Image Zoom
  // ======================

  const projectImages = document.querySelectorAll('.project_image');

  if (projectImages.length) {

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-show');

          // 一回だけ発火 → パフォーマンス最適化
          imageObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25
    });

    projectImages.forEach(img => imageObserver.observe(img));
  }

});


  // ======================
  // Scroll
  // ======================
let currentScroll = 0;
let targetScroll = 0;
const ease = 0.03; // ぬるっと感の強さ

const container = document.getElementById('scroll-container');

function inertiaScroll() {
  targetScroll = window.scrollY;

  const diff = targetScroll - currentScroll;
  currentScroll += diff * ease;

  if (Math.abs(diff) < 0.1) {
    currentScroll = targetScroll;
  }

  container.style.transform = `translateY(${-currentScroll}px)`;

  requestAnimationFrame(inertiaScroll);
}

inertiaScroll();
