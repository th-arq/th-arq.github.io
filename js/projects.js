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

    // display: block を先に確定（clip-path: inset(100%) のまま）
    item.style.visibility = 'visible';
    item.style.opacity    = '1';

    if (img) {
      img.style.transition = 'none';
      img.style.transform  = 'scale(1.12)';
    }

    // ダブル rAF で paint を確定させてからアニメ開始
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        item.classList.remove('is-exit');
        item.classList.add('is-show');

        if (img) {
          setTimeout(() => {
            img.style.transition = `transform 1400ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`;
            img.style.transform  = 'scale(1.0)';
          }, 16);

          // reveal 完了後はホバー用に戻す
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
  const EXIT_DURATION = 320; // ms — CSS の is-exit transition に合わせる

  const hideItems = (items, onComplete) => {
    if (!items.length) { onComplete?.(); return; }

    items.forEach(item => {
      item.classList.remove('is-show');
      item.classList.add('is-exit');
    });

    setTimeout(() => {
      items.forEach(item => {
        item.classList.remove('is-exit');
        item.style.visibility = 'hidden';
        item.style.opacity    = '0';
      });
      onComplete?.();
    }, EXIT_DURATION);
  };

  // ═══════════════════════════════════════════════
  // 初期化: 全アイテムを hidden 状態に
  // ═══════════════════════════════════════════════
  projectItems.forEach(item => {
    item.style.display    = 'block';  // display は常に block
    item.style.visibility = 'hidden';
    item.style.opacity    = '0';
  });

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
        subNav?.classList.add('is-open');
      } else {
        subNav?.classList.remove('is-open');
      }

      applyFilter(filterValue);
    });
  });

});
