document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  const applyFilter = (filterValue) => {

    projectItems.forEach(item => {

      let shouldShow = false;

      // ALL
      if (filterValue === 'all') {
        shouldShow = item.classList.contains('all');
      }

      // residential（親カテゴリ）
      else if (filterValue === 'residential') {
        shouldShow =
          item.classList.contains('residential') &&
          item.classList.contains('all');
      }

      // それ以外（living / bath / kitchen etc）
      else {
        shouldShow = item.classList.contains(filterValue);
      }

      if (shouldShow) {
        item.classList.add('is-show');
      } else {
        item.classList.remove('is-show');
      }
    });
  };

  // 初期表示
  applyFilter('all');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {

      const filterValue = button.getAttribute('data-filter');

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      if (filterValue === 'residential' || button.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      applyFilter(filterValue);
    });
  });

});
