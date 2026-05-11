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

  /**
   * フィルタリングロジック
   *
   * filterValue : ボタンの data-filter 値
   * isSubFilter : サブカテゴリ（living / kitchen / bath / patio）かどうか
   *
   * 表示ルール：
   *   ALL                    → parent のみ
   *   CONDOMINIUM /
   *   RESIDENTIAL /
   *   ARCHITECTURAL          → そのカテゴリに属する parent のみ
   *   サブカテゴリ            → そのクラスを持つ parent + child 両方
   */
  const SUB_FILTERS = new Set(['living', 'kitchen', 'bath', 'patio']);

  const applyFilter = (filterValue) => {
    const isAll       = filterValue === 'projects-item'; // ALLボタンのdata-filter
    const isSubFilter = SUB_FILTERS.has(filterValue);

    projectItems.forEach(item => {
      const level = item.dataset.level; // "parent" or "child"

      let show = false;

      if (isAll) {
        // ALL → parent だけ
        show = level === 'parent';

      } else if (isSubFilter) {
        // サブカテゴリ → クラスを持つ parent + child 両方
        show = item.classList.contains(filterValue);

      } else {
        // CONDOMINIUM / RESIDENTIAL / ARCHITECTURAL → parent のみ
        show = level === 'parent' && item.classList.contains(filterValue);
      }

      if (show) {
        item.style.display = 'block';
        requestAnimationFrame(() => item.classList.add('is-show'));
      } else {
        item.classList.remove('is-show');
        setTimeout(() => { item.style.display = 'none'; }, 450);
      }
    });
  };

  // 初期表示（ALL）
  applyFilter('projects-item');

  // ボタンクリック
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter;

      // active 切り替え
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // サブナビ開閉
      // RESIDENTIAL 本体 or サブカテゴリ選択中 → open
      if (filterValue === 'residential' || SUB_FILTERS.has(filterValue)) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      applyFilter(filterValue);
    });
  });
});
