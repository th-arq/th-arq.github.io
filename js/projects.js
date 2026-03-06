document.addEventListener('DOMContentLoaded', () => {
  // --- ① スクロール監視の設定 ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // 画面の下から10%の位置に来たら表示
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // 一度出たら監視終了
      }
    });
  }, observerOptions);

  // ページ内のすべての .reveal 要素を監視（これで関連プロジェクトも解決！）
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));


  // --- ② フィルタリング機能 (一覧ページにある場合のみ動く) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item'); // 一覧のカードだけを対象に

  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // ボタンの切り替え
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectItems.forEach(item => {
          item.classList.remove('show'); // 一旦消す

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
