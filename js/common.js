window.addEventListener("load", () => {
  // (header/footerの読み込みはそのまま)

  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const contentRail = document.querySelector(".content-rail");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    // 画面の中央線の位置（ピクセル）
    const viewCenter = window.innerHeight / 2;

    // 1枚目のパネルの中心と、最後のパネルの中心の距離を計算する
    const firstRect = panels[0].getBoundingClientRect();
    const lastRect = panels[panels.length - 1].getBoundingClientRect();

    // パネルの中心点を基準にする
    const firstCenter = firstRect.top + (firstRect.height / 2);
    const lastCenter = lastRect.top + (lastRect.height / 2);

    // 全体の移動距離（1枚目から最後までの中心間距離）
    const totalDist = lastCenter - firstCenter;
    
    // 現在、どれくらい進んでいるか（1枚目が中央に来た時が0）
    const currentPos = viewCenter - firstCenter;

    let progress = currentPos / totalDist;
    progress = Math.max(0, Math.min(1, progress));

    // パネル1枚分(100vh)ずつ動かす
    const moveAmount = progress * (panels.length - 1) * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
