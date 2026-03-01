document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');

  // --- ① 初期表示のアニメーション (1回だけ実行) ---
  // 画面内にあるものだけを対象に、少しずつずらして表示
  setTimeout(() => {
    projectItems.forEach((item, index) => {
      // 画面内に入っているかチェック（IntersectionObserverを使わずに初期表示だけ実行）
      setTimeout(() => {
        item.classList.add('show');
      }, index * 100);
    });
  }, 500);

  // --- ② フィルタリング機能 ---
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectItems.forEach(item => {
        // 一度フェードアウトさせる
        item.classList.remove('show');

        setTimeout(() => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.classList.remove('is-hidden');
            // 表示する瞬間にアニメーションを再トリガー
            setTimeout(() => {
              item.classList.add('show');
            }, 50); 
          } else {
            item.classList.add('is-hidden');
          }
        }, 300); // 300msはフェードアウトを待つ時間
      });
    });
  });

  // --- ③ スクロール時の監視 (個別ページや長い一覧用) ---
  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // 一度表示されたら監視を止める（何度もパカパカしないように）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // .reveal クラスがついている要素すべてを監視
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
