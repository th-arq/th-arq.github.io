window.addEventListener("load", () => {

  // ===== header / footer 読み込み (そのまま) =====
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // ===== スクロール連動 =====
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    // 1. 基準となる「画面の真ん中」のライン
    const viewCenter = window.innerHeight / 2;

    // 2. 最初のパネルと最後のパネルの「中心点」を取得
    const firstRect = panels[0].getBoundingClientRect();
    const lastRect = panels[panels.length - 1].getBoundingClientRect();

    const firstCenter = firstRect.top + (firstRect.height / 2);
    const lastCenter = lastRect.top + (lastRect.height / 2);

    // 3. 最初の中心から最後の中心までの「全距離」
    const totalDistance = lastCenter - firstCenter;

    // 4. 今、最初の中心が「画面の中央」からどれだけ離れているか
    // (ページを開いた直後はこれが 0 に近くなるはず！)
    const currentOffset = viewCenter - firstCenter;

    // 5. 進捗率 0 〜 1
    let progress = currentOffset / totalDistance;
    progress = Math.max(0, Math.min(1, progress));

    // 6. 移動量を計算して適用
    const moveAmount = progress * (panels.length - 1) * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  // 読み込み直後に実行。位置が安定しないことがあるので2回たたくよ。
  handleScroll();
  setTimeout(handleScroll, 100); 
});
