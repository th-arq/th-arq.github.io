window.addEventListener("load", () => {
  // --- Header / Footer 読み込み ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- スクロール完全同期型バトンタッチ ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = -layoutRect.top; // Aboutエリア内でのスクロール量
    const panelHeight = panels[0].offsetHeight; // 各パネルの高さ

    // 今何番目のセクションにいるか
    const index = Math.floor(scrollTop / panelHeight);
    // そのパネルの中で、上から何ピクセル進んだか
    const offsetInPanel = scrollTop % panelHeight;

    // バトンタッチを開始する位置（パネルの下から20%の位置）
    const triggerPoint = panelHeight * 0.8;

    let moveY = index * 100; // 基本の文字位置 (0vh, 100vh, 200vh...)

    if (offsetInPanel > triggerPoint) {
      // 境界線ゾーンに入ったら、スクロールしたピクセル分をそのままvhに変換して動かす
      // (進んだピクセル / ゾーンの幅) * 100vh
      const zoneProgress = (offsetInPanel - triggerPoint) / (panelHeight - triggerPoint);
      moveY += zoneProgress * 100;
    }

    // transitionを完全に消すことで、スクロール速度と100%一致するよ！
    track.style.transition = "none";
    track.style.transform = `translateY(-${moveY}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
