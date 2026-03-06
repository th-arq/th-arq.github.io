document.addEventListener('DOMContentLoaded', () => {
  // --- ① スクロール監視 (共通) ---
  // revealクラスがついているものは、ページに関わらず全て監視する
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -5% 0px', 
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

  // ページ内の全.reveal（一覧のカード、詳細の画像、関連リンク全部）を対象にする
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));


  // --- ② フィルタリング機能 (一覧ページのみ) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.projects-item');

  // ボタンが存在するページ（一覧ページ）のときだけ実行する
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // activeクラスの付け替え
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectItems.forEach(item => {
          // 一旦アニメーションをリセット
          item.classList.remove('show');

          setTimeout(() => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
              item.classList.remove('is-hidden');
              // 10msだけ待ってからふわんと出す
              setTimeout(() => item.classList.add('show'), 10);
            } else {
              item.classList.add('is-hidden');
            }
          }, 300);
        });
      });
    });
  }
});
