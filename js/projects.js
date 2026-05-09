document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  // --- 初期表示（重要：これで.allだけ出す） ---
  const init = () => {
    projectItems.forEach(item => {
      if (item.classList.contains('all')) {
        item.classList.add('is-show');
      } else {
        item.classList.remove('is-show');
      }
    });
  };

  // --- フィルター処理 ---
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

  // 初期状態
  init();

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {

      const filterValue = button.getAttribute('data-filter');

      // active切り替え
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // sub nav制御
      if (filterValue === 'residential' || button.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      applyFilter(filterValue);
    });
  });

});
