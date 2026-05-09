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

      // ボタンのactive切り替え
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // サブメニューの開閉
      if (filterValue === 'residential' || button.classList.contains('sub-item')) {
        subNav.classList.add('is-open');
      } else {
        subNav.classList.remove('is-open');
      }

      // --- ここからアニメーションの核 ---
      // 1. まず全てのアイテムを透明にする（上にふわっと消えていく感じ）
      projectItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-10px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      });

      // 2. 少し待ってから、中身を入れ替えて再表示
      setTimeout(() => {
        projectItems.forEach(item => {
          // 判定
          const shouldShow = (filterValue === 'all' || item.classList.contains(filterValue));

          if (shouldShow) {
            item.classList.remove('is-hidden');
            // リフロー（再描画）を促してからshowをつけることでアニメーションを確実に発火
            void item.offsetWidth; 
            item.style.opacity = ''; // CSS側の設定に戻す
            item.style.transform = '';
            item.classList.add('show');
          } else {
            item.classList.add('is-hidden');
            item.classList.remove('show');
          }
        });
      }, 300); // 0.3秒待ってから表示開始
    });
  });
});
