document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  const applyFilter = (filterValue) => {

    projectItems.forEach(item => {

      let shouldShow = false;

      // ALL → 全部表示
      if (filterValue === 'all') {
        shouldShow = true;
      } 
      // その他 → クラス一致
      else {
        shouldShow = item.classList.contains(filterValue);
      }

      if (shouldShow) {

        item.classList.add('is-show');

        // display blockにするため少し遅延（アニメ安定）
        setTimeout(() => {
          item.style.display = 'block';
        }, 0);

      } else {

        item.classList.remove('is-show');

        // フェードアウト後に完全削除
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);

      }

    });
  };

  // 初期表示
  projectItems.forEach(item => item.style.display = 'block');
  applyFilter('all');

  filterButtons.forEach(button => {

    button.addEventListener('click', () => {

      const filterValue = button.getAttribute('data-filter');

      // active切替
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // subnav制御
      if (filterValue === 'residential' || button.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      applyFilter(filterValue);

    });

  });

});
