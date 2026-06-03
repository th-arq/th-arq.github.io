(function () {

  if (!document.querySelector('.services-page')) return;

  /* ============================================================
     services.js が担当する演出:
       ① summary-block の border-line scaleX
       ② summary-block の h3 wipe / p フェード
       ③ services-card の clip-path 展開（列ずらし）
       ④ review-item の フェードアップ

     ※ common.js が担当するもの（重複させない）:
       - 左タイトルの wipe（.title）
       - main ふわっと表示 / ヘッダー表示
       - services-grid / reviews-list のコンテナ自体の fade-up
  ============================================================ */


  /* ── border-line CSS 注入 ── */
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


  /* ── 初期状態セット ── */
  const setInitial = () => {
    document.querySelectorAll('.summary-block .wipe-inner').forEach(el => {
      el.style.transform  = 'translateY(105%)';
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


  /* ── 演出起動 ── */
  const fire = () => {

    /* ① ② Summary ブロック */
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


    /* ③ Services カード — 列ごとに時間差 clip-path */
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
          // clip-path: 下から開く
          setTimeout(() => {
            imgWrap.style.transition = 'clip-path 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
            imgWrap.style.clipPath   = 'inset(0 0 0% 0)';
          }, delay);
        }

        // ケンバーンズ: clip と同時に img 縮む
        if (img) {
          img.style.transform  = 'scale(1.15)';
          img.style.transition = 'none';
          setTimeout(() => {
            img.style.transition = `transform 1s cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`;
            img.style.transform  = 'scale(1)';
          }, 20);
          // reveal 完了後はホバー用に戻す
          setTimeout(() => {
            img.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
          }, delay + 1100);
        }

        cardObserver.unobserve(card);
      });
    }, { threshold: 0.1 });

    cards.forEach(c => cardObserver.observe(c));


    /* ④ Reviews — 下からフェードアップ */
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
