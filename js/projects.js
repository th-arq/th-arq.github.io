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

  // --- ② フィルタリング機能 (Updated!) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential'); // HTMLにこのIDをつけてね

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      // 1. アクティブなボタンの見た目を切り替え
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // 2. Residential関連のサブメニュー開閉
      // Residential本体、またはその子要素(bath/kitchen)が押されたら開く
      if (filterValue === 'residential' || button.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      // 3. フィルタリング実行
      projectItems.forEach(item => {
        item.classList.remove('show'); // 一旦消すアニメーション用

        setTimeout(() => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
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
