document.addEventListener('DOMContentLoaded', () => {

  // --- スクロール時のふわっと表示（詳細ページ用） ---
  const revealElements = document.querySelectorAll('.image-wrapper.reveal, .related-item.reveal');
  if (revealElements.length) {
    const showOnScroll = () => {
      revealElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add('show');
        }
      });
    };
    window.addEventListener('scroll', showOnScroll);
    setTimeout(showOnScroll, 200);
  }

  // --- カテゴリフィルター ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems  = document.querySelectorAll('.projects-item');
  const subNav        = document.getElementById('sub-residential');
  const projectsGrid  = document.querySelector('.projects-grid');

  const SUB_FILTERS = new Set(['living', 'kitchen', 'bath', 'patio']);

  const getColumnCount = () => {
    if (!projectsGrid) return window.innerWidth <= 900 ? 2 : 5;
    const visible = Array.from(projectItems).find(el => el.style.display !== 'none');
    if (!visible) return window.innerWidth <= 900 ? 2 : 5;
    return Math.max(1, Math.round(projectsGrid.offsetWidth / visible.offsetWidth));
  };

  // グリッド全体を呼吸させる（待機中アニメーション）
  const startBreathing = () => {
    projectsGrid?.classList.add('is-breathing');
  };

  const stopBreathing = () => {
    projectsGrid?.classList.remove('is-breathing');
  };

  // アイテムをクリップパス斜めウェーブで展開
  const revealItems = (items) => {
    stopBreathing();

    const cols = getColumnCount();
    const COL_DELAY = 70;
    const ROW_DELAY = 160;

    items.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
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

  // アイテムをフェードアウト
  const hideItems = (items, onComplete) => {
    if (!items.length) { onComplete?.(); return; }

    let completed = 0;
    items.forEach(item => {
      item.classList.remove('is-show');
      item.classList.add('is-exit');

      const finish = () => {
        item.classList.remove('is-exit');
        item.style.display = 'none';
        completed++;
        if (completed >= items.length) onComplete?.();
      };

      const timer = setTimeout(finish, 500);
      item.addEventListener('transitionend', () => {
        clearTimeout(timer);
        finish();
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

    // 非表示アイテムをまず隠す
    hideItems(toHide, () => {
      // 呼吸アニメ開始（待機中の演出）
      // 初期ロードは display:block にしてから呼吸させる
      toShow.forEach(item => { item.style.display = 'block'; });
      startBreathing();

      // 850ms 後にクリップ展開
      filterTimeout = setTimeout(() => {
        revealItems(toShow);
      }, initialLoad ? 850 : 700);
    });
  };

  // 初期表示
  applyFilter('projects-item', true);

  // ボタンクリック
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filterValue === 'residential' || SUB_FILTERS.has(filterValue)) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      applyFilter(filterValue);
    });
  });

});
