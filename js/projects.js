document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems  = document.querySelectorAll('.projects-item');
  const subNav        = document.getElementById('sub-residential');
  const projectsGrid  = document.querySelector('.projects-grid');

  if (!filterButtons.length || !projectItems.length) return;

  const SUB_FILTERS = new Set(['living', 'kitchen', 'bath', 'patio']);

  // ═══════════════════════════════════════════════
  // Utility: 表示列数を取得
  // ═══════════════════════════════════════════════
  const getColumnCount = () => {
    if (!projectsGrid) return window.innerWidth <= 900 ? 2 : 5;
    const style = getComputedStyle(projectsGrid);
    const cols  = style.gridTemplateColumns.split(' ').length;
    return cols || (window.innerWidth <= 900 ? 2 : 5);
  };

  // ═══════════════════════════════════════════════
  // Kenburns reveal — 1アイテム
  // ═══════════════════════════════════════════════
  const revealOneItem = (item, delay) => {
    const img = item.querySelector('img');

    item.style.setProperty('--reveal-delay', `${delay}ms`);
    item.style.display = 'block';
    item.classList.remove('is-show', 'is-exit');

    if (img) {
      img.style.transition = 'none';
      img.style.transform  = 'scale(1.12)';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        item.classList.add('is-show');

        if (img) {
          setTimeout(() => {
            img.style.transition = `transform 1400ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`;
            img.style.transform  = 'scale(1.0)';
          }, 16);

          setTimeout(() => {
            img.style.transition = '';
            img.style.transform  = '';
          }, delay + 1500);
        }
      });
    });
  };

  // ═══════════════════════════════════════════════
  // 複数アイテムを列・行オフセット付きで reveal
  // ═══════════════════════════════════════════════
  const revealItems = (items) => {
    if (!items.length) return;
    const cols      = getColumnCount();
    const COL_DELAY = 60;
    const ROW_DELAY = 120;

    items.forEach((item, i) => {
      const col   = i % cols;
      const row   = Math.floor(i / cols);
      const delay = row * ROW_DELAY + col * COL_DELAY;
      revealOneItem(item, delay);
    });
  };

  // ═══════════════════════════════════════════════
  // アイテムを exit アニメーションで隠す
  // ═══════════════════════════════════════════════
  const EXIT_DURATION = 300;

  const hideItems = (items, onComplete) => {
    if (!items.length) { onComplete?.(); return; }

    items.forEach(item => {
      item.classList.remove('is-show');
      item.classList.add('is-exit');
    });

    setTimeout(() => {
      items.forEach(item => {
        item.classList.remove('is-exit');
        item.style.display = 'none';
      });
      onComplete?.();
    }, EXIT_DURATION);
  };

  // ═══════════════════════════════════════════════
  // 初期化
  // ═══════════════════════════════════════════════
  projectItems.forEach(item => {
    item.style.display = 'none';
  });

  // ═══════════════════════════════════════════════
  // サブナビ開閉 (4B: めくれ + フェード)
  // ═══════════════════════════════════════════════
  const openSubNav = () => {
    if (!subNav) return;
    const row = subNav.querySelector('.sub-row');
    if (!row) return;

    // 高さを開く
    subNav.style.transition = 'height 0.5s cubic-bezier(0.4,0,0.2,1)';
    subNav.style.height     = (row.scrollHeight + 16) + 'px';

    // 少し遅れてめくれ+フェード発火
    setTimeout(() => subNav.classList.add('is-open'), 20);
  };

  const closeSubNav = () => {
    if (!subNav) return;
    subNav.classList.remove('is-open');

    setTimeout(() => {
      subNav.style.transition = 'height 0.4s cubic-bezier(0.4,0,0.2,1)';
      subNav.style.height     = '0px';
    }, 20);
  };

  // ═══════════════════════════════════════════════
  // フィルター適用
  // ═══════════════════════════════════════════════
  let filterTimer = null;

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

    clearTimeout(filterTimer);

    hideItems(toHide, () => {
      filterTimer = setTimeout(() => {
        revealItems(toShow);
      }, initialLoad ? 800 : 80);
    });
  };

  // ═══════════════════════════════════════════════
  // 初期表示
  // ═══════════════════════════════════════════════
  applyFilter('projects-item', true);

  // ═══════════════════════════════════════════════
  // フィルターボタン
  // ═══════════════════════════════════════════════
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filterValue === 'residential' || SUB_FILTERS.has(filterValue)) {
        openSubNav();
      } else {
        closeSubNav();
      }

      applyFilter(filterValue);
    });
  });

});
