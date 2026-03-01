document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  // ここを gallery-item から projects-item に修正
  const projectItems = document.querySelectorAll('.projects-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // アクティブなボタンの見た目を切り替え
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectItems.forEach(item => {
        // filterValueが'all'、またはアイテムがそのクラスを持っていれば表示
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.classList.remove('is-hidden'); // CSSに合わせて is-hidden に修正
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });
});