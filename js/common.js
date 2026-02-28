window.addEventListener("load", () => {
  // --- 1. Header / Footer 読み込み ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 2. 右のスクロールと100%連動するロジック ---
  const track = document.querySelector(".title-track");
  const items = document.querySelectorAll(".title-item");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || items.length === 0) return;

    const rect = layout.getBoundingClientRect();
    const scrollTop = -rect.top; // レイアウト内でのスクロール量
    const totalHeight = layout.offsetHeight - window.innerHeight;
    
    // 全体の進捗率 (0.0 〜 1.0)
    const scrollPercent = Math.max(0, Math.min(1, scrollTop / totalHeight));

    // 全体の移動距離： (タイトルの数 - 1) × タイトル1個分の高さ
    // これで、最後にはちょうど最後の文字が中央に来る
    const itemHeight = items[0].offsetHeight;
    const totalMove = itemHeight * (items.length - 1);

    // 進捗に合わせて、リニア（直線的）に動かす
    const currentMove = scrollPercent * totalMove;

    track.style.transition = "none";
    track.style.transform = `translateY(${-currentMove}px)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
