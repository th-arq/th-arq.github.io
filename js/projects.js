document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════
  // スクロール reveal（詳細ページ用）
  // .image-wrapper.reveal — clip-path + ケンバーンズ
  // ═══════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.image-wrapper.reveal, .related-item.reveal');

  if (revealElements.length) {

    // 各要素の img を事前に拡大しておく（transition なし）
    revealElements.forEach(el => {
      const img = el.querySelector('img');
      if (img) {
        img.style.transform  = 'scale(1.12)';
        img.style.transition = 'none';
      }
    });

    const revealDetail = (el) => {
      if (el.dataset.revealed) return;
      el.dataset.revealed = '1';
      el.classList.add('show'); // clip-path は CSS の .reveal.show で動く

      const img = el.querySelector('img');
      if (img) {
        // CSS の clip-path transition(2s) に合わせてケンバーンズ開始
        requestAnimationFrame(() => {
          img.style.transition = 'transform 2.4s cubic-bezier(0.25, 1, 0.5, 1)';
          img.style.transform  = 'scale(1)';
        });
      }
    };

    const showOnScroll = () => {
      let allShown = true;
      revealElements.forEach(el => {
        if (el.dataset.revealed) return;
        allShown = false;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          revealDetail(el);
        }
      });
      if (allShown) window.removeEventListener('scroll', showOnScroll);
    };

    const startReveal = () => {
      window.addEventListener('scroll', showOnScroll, { passive: true });
      setTimeout(showOnScroll, 50);
    };

    const mainEl = document.querySelector('main');
    if (!mainEl || mainEl.classList.contains('appeared')) {
      startReveal();
    } else {
      const obs = new MutationObserver((_, o) => {
        if (mainEl.classList.contains('appeared')) {
          o.disconnect();
          startReveal();
        }
      });
      obs.observe(mainEl, { attributes: true, attributeFilter: ['class'] });
      setTimeout(() => { obs.disconnect(); startReveal(); }, 2000);
    }
  }


  // ═══════════════════════════════════════════════
  // カテゴリフィルター（一覧ページ専用）
  // ═══════════════════════════════════════════════
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems  = document.querySelectorAll('.projects-item');
  const subNav        = document.getElementById('sub-residential');
  const projectsGrid  = document.querySelector('.projects-grid');

  if (!filterButtons.length || !projectItems.length) return;

  const SUB_FILTERS = new Set(['living', 'kitchen', 'bath', 'patio']);

  const getColumnCount = () => {
    const visible = Array.from(projectItems).find(el => el.style.display !== 'none');
    if (!visible) return window.innerWidth <= 900 ? 2 : 5;
    return Math.max(1, Math.round(projectsGrid.offsetWidth / visible.offsetWidth));
  };

  const startBreathing = () => projectsGrid?.classList.add('is-breathing');
  const stopBreathing  = () => projectsGrid?.classList.remove('is-breathing');

  // ── ケンバーンズ付き reveal ──
  const revealOneItem = (item, delay) => {
    const img = item.querySelector('img');

    // 初期スケールを先にセット（transition なし）
    if (img) {
      img.style.transition = 'none';
      img.style.transform  = 'scale(1.15)';
    }

    item.style.setProperty('--reveal-delay', `${delay}ms`);
    item.style.display = 'block';
    item.classList.remove('is-show', 'is-exit');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // clip-path 開始
        item.classList.add('is-show');

        // ケンバーンズ: clip-path の transition 時間(1100ms)に合わせて縮む
        if (img) {
          setTimeout(() => {
            img.style.transition = `transform 1200ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`;
            img.style.transform  = 'scale(1)';
          }, 20);

          // reveal 完了後はホバー用 transition に戻す
          setTimeout(() => {
            img.style.transition = 'transform 0.6s ease';
          }, delay + 1300);
        }
      });
    });
  };

  const revealItems = (items) => {
    stopBreathing();
    const cols      = getColumnCount();
    const COL_DELAY = 70;
    const ROW_DELAY = 160;

    items.forEach((item, index) => {
      const col   = index % cols;
      const row   = Math.floor(index / cols);
      const delay = row * ROW_DELAY + col * COL_DELAY;
      revealOneItem(item, delay);
    });
  };

  const hideItems = (items, onComplete) => {
    if (!items.length) { onComplete?.(); return; }

    let completed  = 0;
    const total    = items.length;
    let   finished = false;

    const finish = (item) => {
      if (item._hideFinished) return;
      item._hideFinished = true;
      item.classList.remove('is-exit');
      item.style.display = 'none';
      completed++;
      if (completed >= total && !finished) {
        finished = true;
        onComplete?.();
      }
    };

    items.forEach(item => {
      item._hideFinished = false;
      item.classList.remove('is-show');
      item.classList.add('is-exit');

      const timer = setTimeout(() => finish(item), 500);
      item.addEventListener('transitionend', () => {
        clearTimeout(timer);
        finish(item);
      }, { once: true });
    });
  };

  let filterTimeout = null;

  const applyFilter = (filterValue, initialLoad = false) => {
    const isAll       = filterValue === 'projects-item';
    const isSubFilter = SUB_FILTERS.has(filterValue);

    const toShow = [];
    const toHide = [];

    projectItems.forEach(item => {
      const level = item.dataset.level;
      let show = false;
      if (isAll)            show = level === 'parent';
      else if (isSubFilter) show = item.classList.contains(filterValue);
      else                  show = level === 'parent' && item.classList.contains(filterValue);
      show ? toShow.push(item) : toHide.push(item);
    });

    clearTimeout(filterTimeout);

    hideItems(toHide, () => {
      toShow.forEach(item => { item.style.display = 'block'; });
      startBreathing();

      filterTimeout = setTimeout(() => {
        revealItems(toShow);
      }, initialLoad ? 850 : 700);
    });
  };

  applyFilter('projects-item', true);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filterValue === 'residential' || SUB_FILTERS.has(filterValue)) {
        subNav?.classList.add('is-open');
      } else {
        subNav?.classList.remove('is-open');
      }

      applyFilter(filterValue);
    });
  });

});
