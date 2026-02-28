window.addEventListener("load", () => {
  // --- 1. Header / Footer 読み込み (絶対消してないよ！) ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 2. 合流 ＆ セットで押し出しロジック ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = Math.max(0, -layoutRect.top);
    const panelHeight = panels[0].offsetHeight;

    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    // --- 動きのタイミング ---
    const startCatchUp = panelHeight * 0.4; // 40%からSERVICEが登り始める
    const dockingPoint = panelHeight * 0.8; // 80%でABOUTのすぐ下に到着（ドッキング）
    const itemHeightVh = 25; // CSSの高さ

    let moveY = index * itemHeightVh;

    if (offsetInPanel > startCatchUp && offsetInPanel <= dockingPoint) {
      // 【フェーズ1】ABOUTは固定、SERVICEだけが近づく
      const progress = (offsetInPanel - startCatchUp) / (dockingPoint - startCatchUp);
      moveY += progress * itemHeightVh;
    } 
    else if (offsetInPanel > dockingPoint) {
      // 【フェーズ2】★ここが重要！ドッキング完了後、二人一緒にスライドアップ
      const pushProgress = (offsetInPanel - dockingPoint) / (panelHeight - dockingPoint);
      // ドッキングした状態（+itemHeightVh）から、さらにスクロール分だけ上に逃がす
      moveY = (index * itemHeightVh) + itemHeightVh + (pushProgress * (100 - itemHeightVh));
      // ※100vh分動かすことで、次のセクションへ完全にバトンタッチさせるよ
    }

    track.style.transition = "none";
    // 最初のABOUTを中央に置く基準位置「-12.5vh」から動かす
    track.style.transform = `translateY(calc(-12.5vh - ${moveY}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
