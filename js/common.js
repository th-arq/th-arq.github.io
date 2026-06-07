// ═══════════════════════════════════════════════
  // 7. Split Layout — content-box アニメーション
  //    h2/h3/h4 → wipe（下からめくれ上げ）
  //    p/ul/iframe → fade-up（ふわっと）
  // ═══════════════════════════════════════════════

  const splitContentBox = document.querySelectorAll('.split-layout .content-box');

  if (splitContentBox.length) {

    // wipeラップ CSS を注入
    const wipeStyle = document.createElement('style');
    wipeStyle.textContent = `
      .split-layout .content-box .sc-wipe {
        overflow: hidden;
        display: block;
      }
      .split-layout .content-box .sc-wipe-inner {
        display: block;
        will-change: transform;
      }
    `;
    document.head.appendChild(wipeStyle);

    // h2/h3/h4 → wipeラップを動的生成
    document.querySelectorAll(
      '.split-layout .content-box h2, .split-layout .content-box h3, .split-layout .content-box h4'
    ).forEach(el => {
      if (el.querySelector('.sc-wipe-inner')) return;
      const inner = document.createElement('span');
      inner.className = 'sc-wipe-inner';
      inner.style.cssText = 'transform: translateY(130%); transition: none;';
      inner.innerHTML = el.innerHTML;
      el.innerHTML = '';
      el.classList.add('sc-wipe');
      el.appendChild(inner);
    });

    // p / ul / iframe → 初期非表示
    document.querySelectorAll(
      '.split-layout .content-box p, .split-layout .content-box ul, .split-layout .content-box iframe'
    ).forEach(el => {
      el.style.cssText += 'opacity: 0; transform: translateY(12px); transition: none;';
    });

    // 演出を起動する関数
    const fireSplitAnims = () => {

      // h2/h3/h4 wipe Observer
      document.querySelectorAll('.split-layout .content-box .sc-wipe').forEach(el => {
        const inner = el.querySelector('.sc-wipe-inner');
        if (!inner) return;
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            inner.style.transition = 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
            inner.style.transform  = 'translateY(0)';
            obs.unobserve(el);
          });
        }, { threshold: 0.3 });
        obs.observe(el);
      });

      // p / ul / iframe fade-up Observer
      document.querySelectorAll(
        '.split-layout .content-box p, .split-layout .content-box ul, .split-layout .content-box iframe'
      ).forEach(el => {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            setTimeout(() => {
              el.style.transition = 'opacity 0.85s ease, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
              el.style.opacity    = '1';
              el.style.transform  = 'translateY(0)';
            }, 80);
            obs.unobserve(el);
          });
        }, { threshold: 0.1 });
        obs.observe(el);
      });

    };

    // main.appeared 待ち
    const mainEl = document.querySelector('main');
    if (!mainEl || mainEl.classList.contains('appeared')) {
      fireSplitAnims();
    } else {
      const obs = new MutationObserver((_, o) => {
        if (mainEl.classList.contains('appeared')) {
          o.disconnect();
          fireSplitAnims();
        }
      });
      obs.observe(mainEl, { attributes: true, attributeFilter: ['class'] });
      setTimeout(() => { obs.disconnect(); fireSplitAnims(); }, 2000);
    }
  }
