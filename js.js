let currentScroll = 0;
let targetScroll = 0;
const ease = 0.06; // ぬるっと感の強さ

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
