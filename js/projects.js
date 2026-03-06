document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  // 監視対象に .related-item も追加！
  const projectItems = document.querySelectorAll('.projects-item, .image-wrapper, .related-item');

  // --- ① スクロール時の監視 (IntersectionObserver) ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', // 少し早めに反応するように調整
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 全ての .reveal 要素を監視対象にする
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  // --- ② フィルタリング機能 (一覧ページ用) ---
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectItems.forEach(item => {
          // 一度フェードアウト
          item.classList.remove('show');

          setTimeout(() => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
              item.classList.remove('is-hidden');
              // 再表示の際に監視をリセットしてアニメーションをトリガー
              setTimeout(() => {
                item.classList.add('show');
              }, 50);
            } else {
              item.classList.add('is-hidden');
            }
          }, 300);
        });
      });
    });
  }

  // --- ③ 初期表示の補助 ---
  // ページ読み込み時にすでに画面内にあるものを確実に出す
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('show');
      }
    });
  }, 100);
});
