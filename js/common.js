window.addEventListener("load", () => {
  // --- Header / Footer 読み込み (省略せずそのまま) ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- ドッキング＆押し出しバトンタッチ ---
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
    
    // 60%地点からSERVICEが下から「追いつき」を開始
    // 85%地点でABOUTの真下まで「ドッキング」完了
    // 100%まで残り15%で、2つ並んで「押し出し」
    const startCatchUp = panelHeight * 0.6; 
    const startPushOut = panelHeight * 0.85;

    let moveY = index * 100;

    if (offsetInPanel > startCatchUp && offsetInPanel <= startPushOut) {
      // 1. 追い上げフェーズ：ABOUTは固定、SERVICEだけが下からスススッと近づく
      const catchUpProgress = (offsetInPanel - startCatchUp) / (startPushOut - startCatchUp);
      // track全体を動かすのではなく、見かけ上の距離を詰める計算
      moveY += catchUpProgress * 80; // 80vh分だけグイッと近づける
    } 
    else if (offsetInPanel > startPushOut) {
      // 2. 押し出しフェーズ：ドッキングした状態で、スクロールに合わせて2つ一緒に上がる
      const pushOutProgress = (offsetInPanel - startPushOut) / (panelHeight - startPushOut);
      moveY = (index * 100) + 80 + (pushOutProgress * 20); 
    }

    track.style.transition = "none";
    track.style.transform = `translateY(-${moveY}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
