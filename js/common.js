window.addEventListener("load", () => {
  // --- 1. Header / Footer 読み込み (絶対に消さないよ！) ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 2. 理想のドッキング・スクロール ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = -layoutRect.top;
    const panelHeight = panels[0].offsetHeight;

    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    // --- 設定値 ---
    const startCatchUp = panelHeight * 0.5; // 半分くらいからSERVICEがコッソリ登り始める
    const dockingPoint = panelHeight * 0.9; // 90%地点でABOUTの真下にピタッと付く
    const itemHeightVh = 25; // 文字の間隔（CSSと合わせてね）

    let moveY = index * itemHeightVh;

    if (offsetInPanel > startCatchUp && offsetInPanel <= dockingPoint) {
      // 【フェーズ1】ABOUTは中央で不動！SERVICEだけが下から距離を詰める
      // 0から100%（itemHeightVh分）をここで動かす
      const catchUpProgress = (offsetInPanel - startCatchUp) / (dockingPoint - startCatchUp);
      moveY += catchUpProgress * itemHeightVh;
      
      // ABOUTを固定し続けるための補正：track全体の動きを打ち消す
      track.style.transform = `translateY(calc(-12.5vh - ${index * itemHeightVh}vh + ${catchUpProgress * itemHeightVh}vh))`;
      // ※ちょっと複雑に見えるけど、「track全体は下がるけど、SERVICEだけがそれ以上に上がる」動きにしてるよ
    } 
    else if (offsetInPanel > dockingPoint) {
      // 【フェーズ2】合流完了！ここからはマウスの動き1:1で一緒に上に去る
      const pushProgress = (offsetInPanel - dockingPoint) / (panelHeight - dockingPoint);
      moveY = (index * itemHeightVh) + (pushProgress * itemHeightVh);
      track.style.transform = `translateY(calc(-12.5vh - ${moveY}vh))`;
    } else {
      // 通常時（固定中）
      track.style.transform = `translateY(calc(-12.5vh - ${moveY}vh))`;
    }

    track.style.transition = "none";
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
