window.addEventListener("load", () => {
  // header / footer 読み込み
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  const track = document.querySelector(".title-track");
  const layout = document.querySelector(".about-layout");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || !layout || panels.length === 0) return;

    const rect = layout.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 「スクロール可能な全距離」を計算
    const totalScrollRange = layout.offsetHeight - windowHeight;
    
    // セクションのトップが画面の一番上に来たところを 0 にする
    const currentScroll = -rect.top;

    // 進捗率 0 〜 1
    let progress = currentScroll / totalScrollRange;
    progress = Math.max(0, Math.min(1, progress));

    // 移動量を計算（1枚 100vh ずつ上にずらす）
    const moveAmount = progress * (panels.length - 1) * 100;

    // CSSの「上揃え」の状態から、この分だけ上に引っ張る
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
  setTimeout(handleScroll, 100);
});
