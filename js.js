document.addEventListener('DOMContentLoaded', () => {

  // hamberger overlay
  const overlay = document.getElementById('overlay');
  const burger = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const titleArea = document.getElementById('title_area');
  const wrapper = document.querySelector('.fade-wrapper');
  const menuLinks = menu.querySelectorAll('a');

  // menu - open
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    titleArea.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  // menu - close
  document.addEventListener('click', (e) => {
    const isMenuOpen = menu.classList.contains('open');
    if (!isMenuOpen) return;

    const clickedInsideMenu = menu.contains(e.target);
    const clickedBurger = burger.contains(e.target);

    if (!clickedInsideMenu && !clickedBurger) {
      burger.classList.remove('open');
      menu.classList.remove('open');
      titleArea.classList.remove('open');
      overlay.classList.remove('active');
    }
  });

  // overlay close
  overlay.addEventListener('click', () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    titleArea.classList.remove('open');
    overlay.classList.remove('active');
  });

  // menu link click → close → fade → jump
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('href');

      burger.classList.remove('open');
      menu.classList.remove('open');
      titleArea.classList.remove('open');
      overlay.classList.remove('active');

      setTimeout(() => wrapper.classList.add('fade-out'), 100);
      setTimeout(() => window.location.href = url, 600);
    });
  });

  // fade in on load
  requestAnimationFrame(() => wrapper.classList.add('loaded'));

  // loading animation
  window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    setTimeout(() => {
      loading.style.opacity = '0';
      setTimeout(() => loading.style.display = 'none', 2500);
    }, 2000);
  });


  // Smooth Scroll
  const body = document.body;
  const content = document.createElement("div");
  content.id = "smooth-scroll";

  while (body.firstChild) content.appendChild(body.firstChild);
  body.appendChild(content);

  let current = 0;
  let target = 0;
  const ease = 0.08; // Weight：0.05〜0.15
  let maxScroll = 0;

  function updateSize() {
    maxScroll = Math.max(0, content.clientHeight - window.innerHeight);
  }
  updateSize();
  window.addEventListener("resize", updateSize);

  // wheel & trackpad
  window.addEventListener("wheel", (e) => {
    target += e.deltaY;
    if (target < 0) target = 0;
    if (target > maxScroll) target = maxScroll;
    e.preventDefault();
  }, { passive: false });

  // touch
  let startY = null;
  window.addEventListener("touchstart", e => startY = e.touches[0].clientY, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (startY == null) return;
    const y = e.touches[0].clientY;
    const dy = startY - y;
    startY = y;

    target += dy;
    if (target < 0) target = 0;
    if (target > maxScroll) target = maxScroll;

    e.preventDefault();
  }, { passive: false });
  window.addEventListener("touchend", () => startY = null);

  // animate
  function raf() {
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.1) current = target;
    content.style.transform = `translateY(${-current}px)`;
    requestAnimationFrame(raf);
  }
  raf();

});
