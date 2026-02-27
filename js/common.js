window.addEventListener("load", () => {
  
  // header/footer (変更なし)
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  const track = document.querySelector(".title-track");
  const contentRail = document.querySelector(".content-rail");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || !contentRail || panels.length === 0) return;

    // contentRailが画面の上端からどれくらい離れているか
    const railRect = contentRail.getBoundingClientRect();
    
    // 開始位置：contentRailのトップが画面のトップに重なった時
    // 終了位置：最後のパネルが表示しきった時
    const scrollDistance = -railRect.top;
    const totalHeight = contentRail.offsetHeight - window.innerHeight;

    // 進捗率 0〜1
    let progress = scrollDistance / totalHeight;
    progress = Math.max(0, Math.min(1, progress));

    // 移動量 (パネル1枚分は 100vh)
    const moveAmount = progress * (panels.length - 1) * 100;

    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 読み込み時にも実行
});
