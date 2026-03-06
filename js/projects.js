document.addEventListener('DOMContentLoaded', () => {
  // --- ① ふわっと出す処理 (共通) ---
  const revealElements = document.querySelectorAll('.reveal');

  const showElements = () => {
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 要素が画面の「下から少し入った」か、既に「画面より上」にあるなら表示
      if (rect.top < windowHeight * 0.9) {
        el.classList.add('show');
      }
    });
  };

  // 読み込み時とスクロール時に実行
  window.addEventListener('scroll', showElements);
  // 少しだけ遅らせて確実に実行
  setTimeout(showElements, 200);


  // --- ② フィルタリング機能 (一覧ページのみ) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');

  if (filterButtons.length > 0) {
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
              setTimeout(() => item.classList.add('show'), 50);
            } else {
              item.classList.add('is-hidden');
            }
          }, 300);
        });
      });
    });
  }
});
