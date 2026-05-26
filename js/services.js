(function () {

  if (!document.querySelector('.services-page')) return;

  const setInitial = () => {
    const titleWipe = document.querySelector('.services-page .title-wipe');
    if (titleWipe) {
      titleWipe.style.transform  = 'translateY(105%)';
      titleWipe.style.transition = 'none';
    }
    document.querySelectorAll('.services-page .summary-block .wipe-inner').forEach(el => {
      el.style.transform  = 'translateY(105%)';
      el.style.transition = 'none';
    });
    document.querySelectorAll('.services-page .summary-p').forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(10px)';
      el.style.transition = 'none';
    });
    document.querySelectorAll('.services-page .services-card-img').forEach(el => {
      el.style.clipPath   = 'inset(0 0 100% 0)';
      el.style.transition = 'none';
    });
  };

  const fire = () => {

    // タイトル wipe
    setTimeout(() => {
      const tw = document.querySelector('.services-page .title-wipe');
      if (!tw) return;
      tw.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
      tw.style.transform  = 'translateY(0)';
    }, 60);

    // summary h3 + p 時間差
    document.querySelectorAll('.services-page .summary-block').forEach((block, i) => {
      const inner = block.querySelector('.wipe-inner');
      const p     = block.querySelector('.summary-p');
      if (inner) {
        setTimeout(() => {
          inner.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
          inner.style.transform  = 'translateY(0)';
        }, 300 + i * 340);
      }
      if (p) {
        setTimeout(() => {
          p.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
          p.style.opacity    = '1';
          p.style.transform  = 'translateY(0)';
        }, 480 + i * 340);
      }
    });

    // 画像 wipe — スクロールトリガー＋列ごとに時間差
    const imgs = [...document.querySelectorAll('.services-page .services-card-img')];
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = (imgs.indexOf(entry.target) % 3) * 100;
        setTimeout(() => {
          entry.target.style.transition = 'clip-path 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
          entry.target.style.clipPath   = 'inset(0 0 0% 0)';
        }, delay);
        imgObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    imgs.forEach(img => imgObserver.observe(img));
  };

  const observeAppeared = () => {
    const main = document.querySelector('main');
    if (!main) return;
    if (main.classList.contains('appeared')) { fire(); return; }
    const obs = new MutationObserver((_, o) => {
      if (main.classList.contains('appeared')) { o.disconnect(); fire(); }
    });
    obs.observe(main, { attributes: true, attributeFilter: ['class'] });
  };

  document.addEventListener('DOMContentLoaded', () => {
    setInitial();
    observeAppeared();
  });

}());
