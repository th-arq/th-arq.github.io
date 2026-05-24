// js/services.js

(function () {

  // Services ページ以外では何もしない
  if (!document.querySelector('.services-page')) return;

  // ── 初期状態をCSSではなくJSで即セット（DOMContentLoaded前でも安全）──
  // HTMLパース後すぐに隠す（CSSの wipe-inner transform より確実）
  const setInitial = () => {
    document.querySelectorAll('.services-page .wipe-inner').forEach(el => {
      el.style.transform = 'translateY(105%)';
      el.style.transition = 'none';
    });
    document.querySelectorAll('.services-page .summary-p').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'none';
    });
    document.querySelectorAll('.services-page .services-card').forEach(el => {
      el.style.clipPath = 'inset(0 0 100% 0)';
      el.style.transition = 'none';
    });
  };

  // ── アニメーション本体 ────────────────────────────────────────────
  const fire = () => {

    // タイトル
    setTimeout(() => {
      const tw = document.querySelector('.services-page .title-wipe');
      if (!tw) return;
      tw.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
      tw.style.transform  = 'translateY(0)';
    }, 60);

    // summary h3 + p（時間差）
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

    // カード wipe
    document.querySelectorAll('.services-page .services-card').forEach((card, i) => {
      setTimeout(() => {
        card.style.transition = 'clip-path 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
        card.style.clipPath   = 'inset(0 0 0% 0)';
      }, 1380 + i * 110);
    });
  };

  // ── main.appeared を監視して発火 ─────────────────────────────────
  // common.js が window load 後 100ms で .appeared を付ける
  // → MutationObserver で確実に捕まえる
  const observeAppeared = () => {
    const main = document.querySelector('main');
    if (!main) return;

    // すでに appeared なら即発火（キャッシュ等で速い場合）
    if (main.classList.contains('appeared')) {
      fire();
      return;
    }

    const obs = new MutationObserver((_, o) => {
      if (main.classList.contains('appeared')) {
        o.disconnect();
        fire();
      }
    });
    obs.observe(main, { attributes: true, attributeFilter: ['class'] });
  };

  // ── Reviews タイトル：スクロールトリガー ─────────────────────────
  const initReviewsTitle = () => {
    const sections = document.querySelectorAll('.services-page .split-section');
    const last = sections[sections.length - 1];
    if (!last) return;
    const title = last.querySelector('.title');
    if (!title) return;

    // wipe構造に差し替え
    const text = title.textContent.trim();
    title.innerHTML = `<span class="wipe-line"><span class="wipe-inner">${text}</span></span>`;
    // 初期状態セット（setInitialより後なのでここで直接セット）
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

  // ── エントリーポイント ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    setInitial();
    initReviewsTitle();
    observeAppeared();
  });

}());
