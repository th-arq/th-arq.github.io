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

  // --- 2. 追い上げ＆ドッキング・ロジック ---
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

    // 追い上げ開始: 50%地点から / 合流完了: 90%地点
    const startCatchUp = panelHeight * 0.5; 
    const dockingPoint = panelHeight * 0.9;
    const itemHeightVh = 25; 

    // 基本の移動量（現在の文字のインデックス分）
    let moveY = index * itemHeightVh;

    if (offsetInPanel > startCatchUp) {
      // 50%を超えたら、次の文字をABOUTに近づけるための計算
      // 90%に達するまでの間に、徐々に移動量を増やしていく
      const progress = Math.min(1, (offsetInPanel - startCatchUp) / (dockingPoint - startCatchUp));
      
      // 90%になるまでは、ABOUTを固定したままSERVICEを引き寄せる魔法の計算
      moveY += progress * itemHeightVh;
    }

    track.style.transition = "none";
    // translateYの中で、ABOUTが動かないように補正をかけつつSERVICEを引き寄せる
    // 初期値の -12.5vh を起点にするよ
    track.style.transform = `translateY(calc(-12.5vh - ${moveY}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
