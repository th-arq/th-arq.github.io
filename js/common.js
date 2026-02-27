window.addEventListener("load", () => {
  // header / footer 読み込み (そのまま)
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0 || !layout) return;

    // Aboutセクション全体の座標を取得
    const rect = layout.getBoundingClientRect();
    
    // 【ここがポイント！】
    // 最初のパネルが「画面中央」に来た時をスタート(0)にする
    const startOffset = window.innerHeight / 2;
    const currentScroll = startOffset - rect.top;

    // 最後のパネルが「画面中央」に来るまでの全距離
    const totalDistance = layout.offsetHeight - window.innerHeight;

    // 進捗率を出す (0 〜 1)
    let progress = currentScroll / totalDistance;
    progress = Math.max(0, Math.min(1, progress));

    // マウスの動きと完全に連動させて、文字の塊(track)を上に引き上げる
    const moveAmount = progress * (panels.length - 1) * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 初期位置を合わせる
});
