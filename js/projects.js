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

    toHide.forEach(item => {
      item.classList.remove('is-show');
      item.style.display = 'none';
    });

    toShow.forEach(item => {
      item.style.display = 'block';
      item.classList.remove('is-show');
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toShow.forEach(item => item.classList.add('is-show'));
      });
    });
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
