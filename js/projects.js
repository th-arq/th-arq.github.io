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

  // --- カテゴリフィルター（一覧ページ用） ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  const applyFilter = (filterValue) => {

    projectItems.forEach(item => {

      const show = filterValue === 'all'
        ? true
        : item.classList.contains(filterValue);

      if (show) {

        // 先にdisplay復活
        item.style.display = 'block';

        // 次フレームでアニメ開始
        requestAnimationFrame(() => {
          item.classList.add('is-show');
        });

      } else {

        // ふわっと消す
        item.classList.remove('is-show');

        // アニメ後に完全削除（トルツメ）
        setTimeout(() => {
          item.style.display = 'none';
        }, 450);

      }

    });

  };

  // 初期表示
  applyFilter('all');

  filterButtons.forEach(btn => {

    btn.addEventListener('click', () => {

      const filterValue = btn.dataset.filter;

      // active切替
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // subnav
      if (
        filterValue === 'residential' ||
        btn.classList.contains('sub-item')
      ) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      applyFilter(filterValue);

    });

  });

});
