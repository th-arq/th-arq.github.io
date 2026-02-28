window.addEventListener("load", () => {
  // ===== 1. Header / Footer の読み込み =====
  const loadParts = (id, path) => {
    fetch(path)
      .then(res => res.text())
      .then(html => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      })
      .catch(err => console.error("Error loading path:", path, err));
  };

  // パスが正しいか確認してね（例: /head.html か ../head.html かなど）
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // ===== 2. 文字のバトンタッチ処理 =====
  const track = document.querySelector(".title-track");
  const layout = document.querySelector(".about-layout");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || !layout || panels.length === 0) return;

    const rect = layout.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Aboutエリア全体の高さから、画面で見えている分を引いた「スクロールできる全距離」
    const totalHeight = layout.offsetHeight - windowHeight;
    
    // 現在のスクロール進捗 (0 〜 1)
    let progress = -rect.top / totalHeight;
    progress = Math.max(0, Math.min(1, progress));

    // 文字をスライドさせる（粘りを出したいときはCSSのtransitionと組み合わせるよ）
    const moveAmount = progress * (panels.length - 1) * 100;
    
    // ヌルッと動かしたいならここを追加
    track.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  // スクロール時に実行
  window.addEventListener("scroll", handleScroll);
  // 初回読み込み時にも位置を計算
  handleScroll();
});
