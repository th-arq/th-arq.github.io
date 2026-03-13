document.addEventListener('DOMContentLoaded', () => {
  // --- ① ふわっと出す処理 ---
  const revealElements = document.querySelectorAll('.reveal');
  const showElements = () => {
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('show');
      }
    });
  };
  window.addEventListener('scroll', showElements);
  setTimeout(showElements, 200);

  // --- ② フィルタリング機能 ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      // アクティブボタンの切り替え
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // サブメニューの開閉制御
      // 「RESIDENTIAL」か、その中の「Bathroom/Kitchen」が選ばれている時だけ開く
      if (filterValue === 'residential' || button.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      // 画像の絞り込み
      projectItems.forEach(item => {
        item.classList.remove('show'); 

        setTimeout(() => {
          let shouldShow = false;
          if (filterValue === 'all') {
            shouldShow = true;
          } else if (item.classList.contains(filterValue)) {
            shouldShow = true;
          }

          if (shouldShow) {
            item.classList.remove('is-hidden');
            setTimeout(() => item.classList.add('show'), 50);
          } else {
            item.classList.add('is-hidden');
          }
        }, 300);
      });
    });
  });
});
