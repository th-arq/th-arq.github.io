window.addEventListener("load", () => {

  // ===== 1. header/footer 読み込み (そのまま) =====
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // ===== 2. スクロール連動（バトンタッチ）の修正版 =====
  const track = document.querySelector(".title-track");
  const contentRail = document.querySelector(".content-rail");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || !contentRail || panels.length === 0) return;

    // contentRail（右側のエリア）が画面全体に対してどこにいるか
    const railRect = contentRail.getBoundingClientRect();
    
    // 【重要】最初のパネルの「中心」から最後のパネルの「中心」までの距離で計算する
    const firstPanel = panels[0].getBoundingClientRect();
    const lastPanel = panels[panels.length - 1].getBoundingClientRect();

    // 全体の動くべき距離を計算
    // 最初のパネルが画面中央に来た時を 0 、最後が中央に来た時を 1 にする
    const startPoint = window.innerHeight / 2;
    const totalDistance = lastPanel.top - firstPanel.top;
    const currentPos = startPoint - firstPanel.top;

    let progress = currentPos / totalDistance;

    // 0〜1の間に固定
    progress = Math.max(0, Math.min(1, progress));

    // 移動量を計算
    const moveAmount = progress * (panels.length - 1) * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 初期位置調整
});
