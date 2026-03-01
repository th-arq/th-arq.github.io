document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');

  setTimeout(() => {
    projectItems.forEach((item, index) => {
      // 少しずつずらして表示（index * 100ms）
      setTimeout(() => {
        item.classList.add('show');
      }, index * 100);
    });
  }, 500);


  // -Sort
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectItems.forEach(item => {
        item.classList.remove('show');

        setTimeout(() => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.classList.remove('is-hidden');
            setTimeout(() => {
              item.classList.add('show');
            }, 10); 
          } else {
            item.classList.add('is-hidden');
          }
        }, 10);
      });
    });
  });
});
