document.addEventListener('DOMContentLoaded', () => {

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
