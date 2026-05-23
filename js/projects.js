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

  const SUB_FILTERS = new Set(['living', 'kitchen', 'bath', 'patio']);

  // グリッドの列数を取得（CSS gridのcolumnsに合わせて動的に取得）
  const getColumnCount = () => {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return 5;
    return Math.round(grid.offsetWidth / grid.querySelector('.projects-item')?.offsetWidth) || 5;
  };

  /**
   * アイテムにクリップパス縦スライドアニメーションをかける
   * @param {Element[]} items  表示するアイテム配列
   * @param {number} baseDelay 行・列ごとのベース遅延(ms)
   */
  const revealItems = (items, baseDelay = 60) => {
    const cols = getColumnCount();

    items.forEach((item, index) => {
      const col = index % cols;       // 列番号（左から0始まり）
      const row = Math.floor(index / cols); // 行番号

      // 行が下がるほど + 列が右ほど遅れる（斜めウェーブ）
      const delay = row * baseDelay * 1.4 + col * baseDelay;

      item.style.setProperty('--reveal-delay', `${delay}ms`);
      item.style.display = 'block';

      // 一度リセットしてから付与（フィルター切り替え時のリプレイ用）
      item.classList.remove('is-show');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          item.classList.add('is-show');
        });
      });
    });
  };

  /**
   * アイテムを上方向にスライドアウトさせてから非表示にする
   * @param {Element[]} items
   */
  const hideItems = (items) => {
    items.forEach(item => {
      item.classList.add('is-exit');
      // トランジション完了後に非表示
      const onEnd = () => {
        item.classList.remove('is-show', 'is-exit');
        item.style.display = 'none';
        item.removeEventListener('transitionend', onEnd);
      };
      item.addEventListener('transitionend', onEnd);

      // transitionが発火しない（すでに非表示など）ときのフォールバック
      setTimeout(() => {
        item.classList.remove('is-show', 'is-exit');
        item.style.display = 'none';
      }, 450);
    });
  };

  const applyFilter = (filterValue) => {
    const isAll       = filterValue === 'projects-item';
    const isSubFilter = SUB_FILTERS.has(filterValue);

    const toShow = [];
    const toHide = [];

    projectItems.forEach(item => {
      const level = item.dataset.level;
      let show = false;

      if (isAll) {
        show = level === 'parent';
      } else if (isSubFilter) {
        show = item.classList.contains(filterValue);
      } else {
        show = level === 'parent' && item.classList.contains(filterValue);
      }

      show ? toShow.push(item) : toHide.push(item);
    });

    // 非表示アイテムをアウトアニメーション付きで隠す
    hideItems(toHide);

    // 表示アイテムを少し待ってからイン
    setTimeout(() => revealItems(toShow), 80);
  };

  // 初期表示（ALL）
  applyFilter('projects-item');

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
