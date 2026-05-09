document.addEventListener('DOMContentLoaded', () => {
  // --- ① スクロール時のふわっと表示 ---
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

  // --- ② カテゴリ切り替え（フェードアニメーション付き） ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');
  const subNav = document.getElementById('sub-residential');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      // ボタン active 切り替え
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // サブメニュー開閉
      if (filterValue === 'residential' || button.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      // フェードアウト
      projectItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-10px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      });

      // 少し待ってから表示切替
      setTimeout(() => {
        projectItems.forEach(item => {

          const shouldShow = (() => {

            // ALLの場合：allクラス持ってるものだけ表示
            if (filterValue === 'all') {
              return item.classList.contains('all');
            }

            // その他フィルター
            return item.classList.contains(filterValue);

          })();

          if (shouldShow) {
            item.classList.remove('is-hidden');
            void item.offsetWidth; // reflow
            item.style.opacity = '';
            item.style.transform = '';
          } else {
            item.classList.add('is-hidden');
          }
        });
      }, 300);
    });
  });
});
