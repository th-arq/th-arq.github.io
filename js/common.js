window.addEventListener("load", () => {
  // --- 1. Header / Footer 読み込み (そのまま) ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 2. 全文字共通：中央待機＆バトンパス ---
  const track = document.querySelector(".title-track");
  const items = document.querySelectorAll(".title-item");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = Math.max(0, -layoutRect.top);
    const panelHeight = panels[0].offsetHeight;

    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    const startCatchUp = panelHeight * 0.4; 
    const dockingPoint = panelHeight * 0.8; 

    // 【ここが重要！】
    // 今の文字（index番目）が中央に来るための基本位置
    // 100vh ずつ引き上げることで、SERVICEやCOMPANYもABOUTと同じ位置に固定されるよ
    let moveY = index * 100; 

    const nextItem = items[index + 1];
    
    // --- 次の文字を呼び寄せ、今の文字を追い出す計算 ---
    if (nextItem) {
      if (offsetInPanel > startCatchUp && offsetInPanel <= dockingPoint) {
        // 次の文字を 100vh 下から 0 (今の文字のすぐ下) まで引き寄せる
        const progress = (offsetInPanel - startCatchUp) / (dockingPoint - startCatchUp);
        nextItem.style.marginTop = `${100 * (1 - progress)}vh`;
        // この間、moveY は index * 100 のまま。つまり今の文字は中央固定！
      } 
      else if (offsetInPanel > dockingPoint) {
        // ドッキング完了！ 次の文字を今の文字のすぐ下に固定
        nextItem.style.marginTop = "0vh";
        
        // 80%〜100%の間で、今の文字と次の文字をセットで上に押し出す
        const pushProgress = (offsetInPanel - dockingPoint) / (panelHeight - dockingPoint);
        moveY += pushProgress * 100;
      } else {
        // それ以外の時は、次の文字は画面外で待機
        nextItem.style.marginTop = "100vh";
      }
    }

    track.style.transition = "none";
    // -12.5vh（中央補正）を基準に、全文字を100vh単位で制御！
    track.style.transform = `translateY(calc(-12.5vh - ${moveY}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
