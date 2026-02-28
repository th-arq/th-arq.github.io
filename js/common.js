window.addEventListener("load", () => {
  // --- Header / Footer 読み込み (そのまま残してね) ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 完全同期型・入れ替えバトンタッチ ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = -layoutRect.top; // Aboutエリアの開始点からのスクロール量
    const panelHeight = panels[0].offsetHeight; // 1パネルの高さ

    // 今、何番目のパネルにいるか (0, 1, 2...)
    const index = Math.floor(scrollTop / panelHeight);
    // そのパネルの中で、上から何ピクセル進んだか
    const offsetInPanel = scrollTop % panelHeight;

    // バトンタッチを開始する「境界線」の位置 (パネルの下から20%の地点)
    const triggerPoint = panelHeight * 0.8;

    let moveAmount = index * 100; // 基本の文字位置 (0vh, 100vh...)

    if (offsetInPanel > triggerPoint) {
      // 【ここが重要！】
      // 境界線を越えたら、スクロールした「比率」をそのまま移動量に足す
      // これでマウスの回転速度と、文字が上に消える速度が100%一致するよ
      const zoneProgress = (offsetInPanel - triggerPoint) / (panelHeight - triggerPoint);
      moveAmount += zoneProgress * 100;
    }

    // transitionを "none" にして、マウスの動きに遊びを作らない
    track.style.transition = "none";
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
