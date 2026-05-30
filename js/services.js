(function () {

  if (!document.querySelector('.services-page')) return;

  /* ============================================================
     INITIAL STATE
     - タイトルwipe    → common.js に統一
     - コンテンツfade  → common.js に統一（isServices 判定を外した）
     - is-active       → common.js に統一
     ここでは services 専用の演出（border-line / card / review）のみ初期化
  ============================================================ */
  const setInitial = () => {

    /* summary-block — h3 wipe */
    document.querySelectorAll('.summary-block .wipe-inner').forEach(el => {
      el.style.transform  = 'translateY(105%)';
      el.style.transition = 'none';
    });

    /* summary-block — p フェード */
    document.querySelectorAll('.summary-p').forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(10px)';
      el.style.transition = 'none';
    });

    /* summary-block — border-line */
    document.querySelectorAll('.summary-block').forEach(el => {
      el.style.setProperty('--line-scaleX', '0');
    });

    /* services-card — 画像 clip-path */
    document.querySelectorAll('.services-card-img').forEach(el => {
      el.style.clipPath   = 'inset(0 0 100% 0)';
      el.style.transition = 'none';
    });

    /* review-item — フェード */
    document.querySelectorAll('.review-item').forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(24px)';
      el.style.transition = 'none';
    });
  };


  /* ============================================================
     ボーダーライン scaleX アニメーション用 CSS 注入
  ============================================================ */
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


  /* ============================================================
     FIRE — main.appeared 後に起動
     services 専用演出のみ担当
  ============================================================ */
  const fire = () => {

    /* ① Summary ブロック — border-line / h3 wipe / p フェード */
    const summaryBlocks = [...document.querySelectorAll('.summary-block')];

    const summaryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const block = entry.target;
        const inner = block.querySelector('.wipe-inner');
        const p     = block.querySelector('.summary-p');

        block.style.setProperty('--line-scaleX', '1');
        if (block === summaryBlocks[summaryBlocks.length - 1]) {
          block.style.setProperty('--line-bottom-scaleX', '1');
        }

        if (inner) {
          setTimeout(() => {
            inner.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
            inner.style.transform  = 'translateY(0)';
          }, 120);
        }

        if (p) {
          setTimeout(() => {
            p.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
            p.style.opacity    = '1';
            p.style.transform  = 'translateY(0)';
          }, 300);
        }

        summaryObserver.unobserve(block);
      });
    }, { threshold: 0.15 });

    summaryBlocks.forEach(b => summaryObserver.observe(b));


    /* ② Services カード — 列ごとに時間差で clip-path 展開 */
    const cards = [...document.querySelectorAll('.services-card')];

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card     = entry.target;
        const img      = card.querySelector('.services-card-img');
        const index    = cards.indexOf(card);
        const gridEl   = card.closest('.services-grid');
        const cols     = gridEl ? Math.round(gridEl.offsetWidth / card.offsetWidth) : 3;
        const colIndex = index % cols;

        if (img) {
          setTimeout(() => {
            img.style.transition = 'clip-path 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
            img.style.clipPath   = 'inset(0 0 0% 0)';
          }, colIndex * 110);
        }

        cardObserver.unobserve(card);
      });
    }, { threshold: 0.1 });

    cards.forEach(c => cardObserver.observe(c));


    /* ③ Reviews — 下からフェードアップ */
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
  };


  /* ============================================================
     BOOT — DOMContentLoaded で初期化、main.appeared を待って fire
  ============================================================ */
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
    }
  });

}());
