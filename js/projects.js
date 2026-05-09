document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  const applyFilter = (filterValue) => {

    projectItems.forEach(item => {

      let shouldShow = false;

      if (filterValue === 'all') {
        shouldShow = item.classList.contains('all');
      } else {
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

      // active切替
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // subnav
      if (filterValue === 'residential' || button.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      applyFilter(filterValue);

    });
  });

});
