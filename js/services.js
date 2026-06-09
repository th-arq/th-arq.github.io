(function () {

  if (!document.querySelector('.services-page')) return;


  const injectBorderCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
      .services-page .summary-block {
        border-top: none !important;
        position: relative;
      }
      .services-page .summary-block::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 1px;
        background: #e0e0e0;
        transform: scaleX(var(--line-scaleX, 0));
        transform-origin: left;
        transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
      }
      .services-page .summary-block:last-of-type::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0;
        width: 100%;
        height: 1px;
        background: #e0e0e0;
        transform: scaleX(var(--line-bottom-scaleX, 0));
        transform-origin: left;
        transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.1s;
      }
      .services-page .summary-block:last-of-type {
        border-bottom: none !important;
      }
    `;
    document.head.appendChild(style);
  };


  const setInitial = () => {
    document.querySelectorAll('.summary-h3').forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(10px)';
      el.style.transition = 'none';
    });
    document.querySelectorAll('.summary-p').forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(10px)';
      el.style.transition = 'none';
    });
    document.querySelectorAll('.summary-block').forEach(el => {
      el.style.setProperty('--line-scaleX', '0');
    });
    document.querySelectorAll('.services-card-img').forEach(el => {
      el.style.clipPath   = 'inset(0 0 100% 0)';
      el.style.transition = 'none';
    });
    document.querySelectorAll('.review-item').forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(24px)';
      el.style.transition = 'none';
    });
  };


  const fire = () => {

    /* Summary blocks */
    const summaryBlocks = [...document.querySelectorAll('.summary-block')];

    const summaryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const block = entry.target;
        const h3    = block.querySelector('.summary-h3');
        const p     = block.querySelector('.summary-p');

        block.style.setProperty('--line-scaleX', '1');
        if (block === summaryBlocks[summaryBlocks.length - 1]) {
          block.style.setProperty('--line-bottom-scaleX', '1');
        }
        if (h3) {
          setTimeout(() => {
            h3.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
            h3.style.opacity    = '1';
            h3.style.transform  = 'translateY(0)';
          }, 120);
        }
        if (p) {
          setTimeout(() => {
            p.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
            p.style.opacity    = '1';
            p.style.transform  = 'translateY(0)';
          }, 280);
        }
        summaryObserver.unobserve(block);
      });
    }, { threshold: 0.15 });

    summaryBlocks.forEach(b => summaryObserver.observe(b));


    /* Services cards */
    const cards = [...document.querySelectorAll('.services-card')];

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card     = entry.target;
        const imgWrap  = card.querySelector('.services-card-img');
        const img      = card.querySelector('.services-card-img img');
        const index    = cards.indexOf(card);
        const gridEl   = card.closest('.services-grid');
        const cols     = gridEl ? Math.round(gridEl.offsetWidth / card.offsetWidth) : 3;
        const colIndex = index % cols;
        const delay    = colIndex * 110;

        if (imgWrap) {
          setTimeout(() => {
            imgWrap.style.transition = 'clip-path 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
            imgWrap.style.clipPath   = 'inset(0 0 0% 0)';
          }, delay);
        }

        if (img) {
          img.style.transform  = 'scale(1.15)';
          img.style.transition = 'none';
          setTimeout(() => {
            img.style.transition = `transform 1s cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`;
            img.style.transform  = 'scale(1)';
          }, 20);
          setTimeout(() => {
            img.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
          }, delay + 1100);
        }

        cardObserver.unobserve(card);
      });
    }, { threshold: 0.1 });

    cards.forEach(c => cardObserver.observe(c));


    /* Reviews */
    const reviewItems = [...document.querySelectorAll('.review-item')];

    const reviewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const item  = entry.target;
        const index = reviewItems.indexOf(item);
        setTimeout(() => {
          item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          item.style.opacity    = '1';
          item.style.transform  = 'translateY(0)';
        }, index * 80);
        reviewObserver.unobserve(item);
      });
    }, { threshold: 0.12 });

    reviewItems.forEach(r => reviewObserver.observe(r));


    /* ── Before / After Sliders ── */
    document.querySelectorAll('.ba-slider').forEach(el => {
      const before = el.dataset.before;
      const after  = el.dataset.after;
      if (!before || !after) return;

      el.innerHTML = `
        <div class="ba-before" style="background-image:url('${before}')"></div>
        <div class="ba-after"  style="background-image:url('${after}')"></div>
        <div class="ba-line"></div>
        <div class="ba-handle">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 4L2 10L7 16M13 4L18 10L13 16" stroke="#666" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="ba-tag b">BEFORE</span>
        <span class="ba-tag a">AFTER</span>
      `;

      const afterEl = el.querySelector('.ba-after');
      const line    = el.querySelector('.ba-line');
      const handle  = el.querySelector('.ba-handle');
      let drag = false;

      function move(clientX) {
        const rect = el.getBoundingClientRect();
        const p = Math.min(Math.max((clientX - rect.left) / rect.width * 100, 1), 99);
        afterEl.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
        line.style.left = handle.style.left = p + '%';
      }

      el.addEventListener('mousedown',  e => { drag = true; move(e.clientX); });
      el.addEventListener('touchstart', e => { drag = true; move(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('mousemove',  e => { if (drag) move(e.clientX); });
      window.addEventListener('touchmove',  e => { if (drag) move(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('mouseup',    () => drag = false);
      window.addEventListener('touchend',   () => drag = false);
    });

  };


  /* ── BOOT ── */
  document.addEventListener('DOMContentLoaded', () => {
    injectBorderCSS();
    setInitial();

    const main = document.querySelector('main');
    if (!main) return;

    if (main.classList.contains('appeared')) {
      fire();
    } else {
      const obs = new MutationObserver((_, o) => {
        if (main.classList.contains('appeared')) {
          o.disconnect();
          fire();
        }
      });
      obs.observe(main, { attributes: true, attributeFilter: ['class'] });
      setTimeout(() => { obs.disconnect(); fire(); }, 2000);
    }
  });

}());
