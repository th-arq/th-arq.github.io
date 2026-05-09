document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  const applyFilter = (filterValue) => {

    projectItems.forEach(item => {

      let show = filterValue === 'all'
        ? true
        : item.classList.contains(filterValue);

      if (show) {
        item.classList.add('is-show');
      } else {
        item.classList.remove('is-show');
      }

    });

  };

  applyFilter('all');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {

      const filterValue = btn.dataset.filter;

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filterValue === 'residential' || btn.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      applyFilter(filterValue);

    });
  });

});
