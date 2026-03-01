document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');

  // --- ① ページ読み込み時のRevealアニメーション ---
  // mainがふわっと出た後（CSSで0.8s）、少し遅れてプロジェクトを出す
  setTimeout(() => {
    projectItems.forEach((item, index) => {
      // 少しずつずらして表示（index * 100ms）
      setTimeout(() => {
        item.classList.add('show');
      }, index * 100);
    });
  }, 500); // 0.5秒後に開始


  // --- フィルター機能 ---
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // ボタンの活性化切り替え
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectItems.forEach(item => {
        // --- ① 切り替え時のRevealアニメーション ---
        // 一度すべてのshowクラスを外してクリップパスを閉じる
        item.classList.remove('show');

        // 少し遅らせて（10ms）、対象のものだけ表示＆showクラスを付ける
        setTimeout(() => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.classList.remove('is-hidden');
            // 表示する対象だけ show を付ける
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
