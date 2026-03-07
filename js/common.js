window.addEventListener("load", () => {
  // --- 1. Lenis (そのまま) ---
  const script = document.createElement('script');
  script.src = "https://unpkg.com/lenis@1.1.13/dist/lenis.min.js";
  script.onload = () => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  };
  document.head.appendChild(script);

  // --- 2. Scroll (そのまま) ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      } else {
        entry.target.classList.remove('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  document.querySelectorAll('.split-layout .title').forEach(title => {
    observer.observe(title);
  });

  // --- 3. Header / Footer (そのまま) ---
  const loadParts = (id, path) => {
    fetch(path)
      .then(res => res.text())
      .then(html => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = html;
        if (id === 'header') {
          const headerTag = el.querySelector('header');
          if (!headerTag) return;
          window.addEventListener('scroll', () => {
            if (window.scrollY > 50) headerTag.classList.add('is-scrolled');
            else headerTag.classList.remove('is-scrolled');
          });
          const burgerBtn = el.querySelector('.burger-btn');
          if (burgerBtn) {
            burgerBtn.addEventListener('click', (e) => {
              e.preventDefault();
              headerTag.classList.toggle('nav-open');
              document.body.style.overflow = headerTag.classList.contains('nav-open') ? 'hidden' : '';
            });
          }
        }
      });
  };

  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 4. FAQ Smooth Accordion (New!) ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');

    summary.addEventListener('click', (e) => {
      e.preventDefault(); // デフォルトのパチッと開く動きを止める

      if (item.hasAttribute('open')) {
        // 閉じるときのアニメーション
        const closing = content.animate([
          { opacity: 1, height: content.scrollHeight + 'px' },
          { opacity: 0, height: '0px' }
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

        closing.onfinish = () => item.removeAttribute('open');
      } else {
        // 開くとき
        item.setAttribute('open', '');
        content.animate([
          { opacity: 0, height: '0px' },
          { opacity: 1, height: content.scrollHeight + 'px' }
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
      }
    });
  });

  if (!document.body.classList.contains('is-index')) {
    setTimeout(() => {
      document.querySelector('main')?.classList.add('appeared');
      document.querySelector(".fade-logo")?.classList.add("show");
      document.querySelector(".fade-menu")?.classList.add("show");
    }, 100);
  }
});
