document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  const applyFilter = (filterValue) => {

    projectItems.forEach(item => {

      let shouldShow = false;

      // ALLは全部出す
      if (filterValue === 'all') {
        shouldShow = true;
      } 
      // それ以外はクラス一致
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
