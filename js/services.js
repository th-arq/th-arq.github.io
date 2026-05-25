(function () {

  if (!document.querySelector('.services-page')) return;

  const setInitial = () => {
    document.querySelectorAll('.services-page .wipe-inner').forEach(el => {
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

    // タイトル
    setTimeout(() => {
      const tw = document.querySelector('.services-page .title-wipe');
      if (!tw) return;
      tw.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
      tw.style.transform  = 'translateY(0)';
    }, 60);

    // summary h3 + p
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

    // 画像 wipe（.services-card-img に変更）
    document.querySelectorAll('.services-page .services-card-img').forEach((img, i) => {
      setTimeout(() => {
        img.style.transition = 'clip-path 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
        img.style.clipPath   = 'inset(0 0 0% 0)';
      }, 1380 + i * 110);
    });
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

  const initReviewsTitle = () => {
    const sections = document.querySelectorAll('.services-page .split-section');
    const last = sections[sections.length - 1];
    if (!last) return;
    const title = last.querySelector('.title');
    if (!title) return;
    const text = title.textContent.trim();
    title.innerHTML = `<span class="wipe-line"><span class="wipe-inner">${text}</span></span>`;
    const inner = title.querySelector('.wipe-inner');
    inner.style.transform  = 'translateY(105%)';
    inner.style.transition = 'none';
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        inner.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
        inner.style.transform  = 'translateY(0)';
        io.unobserve(title);
      });
    }, { threshold: 0.3 });
    io.observe(title);
  };

  document.addEventListener('DOMContentLoaded', () => {
    setInitial();
    initReviewsTitle();
    observeAppeared();
  });

}());
