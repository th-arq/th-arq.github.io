document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════
  // スクロール reveal（詳細ページ用）
  // main.appeared を待ってから開始
  // ═══════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.image-wrapper.reveal, .related-item.reveal');

  if (revealElements.length) {

    const showOnScroll = () => {
      let allShown = true;
      revealElements.forEach(el => {
        if (el.classList.contains('show')) return;
        allShown = false;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add('show');
        }
      });
      // 全要素が show になったらリスナー解除
      if (allShown) window.removeEventListener('scroll', showOnScroll);
    };

    const startReveal = () => {
      window.addEventListener('scroll', showOnScroll, { passive: true });
      // appeared直後に画面内の要素を即チェック
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

      // フォールバック
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

  // フィルター要素がなければ終了（詳細ページでは何もしない）
  if (!filterButtons.length || !projectItems.length) return;

  const SUB_FILTERS = new Set(['living', 'kitchen', 'bath', 'patio']);

  const getColumnCount = () => {
    if (!projectsGrid) return window.innerWidth <= 900 ? 2 : 5;
    const visible = Array.from(projectItems).find(el => el.style.display !== 'none');
    if (!visible) return window.innerWidth <= 900 ? 2 : 5;
    return Math.max(1, Math.round(projectsGrid.offsetWidth / visible.offsetWidth));
  };

  const startBreathing = () => projectsGrid?.classList.add('is-breathing');
  const stopBreathing  = () => projectsGrid?.classList.remove('is-breathing');

  const revealItems = (items) => {
    stopBreathing();
    const cols = getColumnCount();
    const COL_DELAY = 70;
    const ROW_DELAY = 160;

    items.forEach((item, index) => {
      const col   = index % cols;
      const row   = Math.floor(index / cols);
      const delay = row * ROW_DELAY + col * COL_DELAY;

      item.style.setProperty('--reveal-delay', `${delay}ms`);
      item.style.display = 'block';
      item.classList.remove('is-show', 'is-exit');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          item.classList.add('is-show');
        });
      });
    });
  };

  const hideItems = (items, onComplete) => {
    if (!items.length) { onComplete?.(); return; }

    let completed  = 0;
    const total    = items.length;
    let   finished = false; // 二重呼び出し防止

    const finish = (item) => {
      if (item._hideFinished) return; // 同一アイテムの二重発火防止
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
