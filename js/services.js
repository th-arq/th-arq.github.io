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
    // clip-path は .services-card-img にかけるが、
    // 監視は親の .services-card で行うためここでセットだけ
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

    // 画像 wipe — 親の .services-card を監視、発火したら img に適用
    const cards = [...document.querySelectorAll('.services-page .services-card')];

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card  = entry.target;
        const img   = card.querySelector('.services-card-img');
        const index = cards.indexOf(card);
        const delay = (index % 3) * 100;

        if (img) {
          setTimeout(() => {
            img.style.transition = 'clip-path 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
            img.style.clipPath   = 'inset(0 0 0% 0)';
          }, delay);
        }

        cardObserver.unobserve(card);
      });
    }, { threshold: 0.1 });

    cards.forEach(card => cardObserver.observe(card));
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
