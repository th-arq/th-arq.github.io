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

  // --- 2. 完璧なバトンタッチ・ロジック ---
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

    // --- 【修正】文字を溜めないための計算 ---
    // これまでのセクション（index分）は、まるごと上に押し出す
    // index * 100vh 動かすことで、前の文字を完全に画面外へ飛ばすよ
    let moveY = index * 100; 

    const nextItem = items[index + 1];
    if (nextItem) {
      if (offsetInPanel > startCatchUp && offsetInPanel <= dockingPoint) {
        // 次の文字を 100vh 下から 0 (今の文字のすぐ下) まで引き寄せる
        const progress = (offsetInPanel - startCatchUp) / (dockingPoint - startCatchUp);
        nextItem.style.marginTop = `${100 * (1 - progress)}vh`;
      } else if (offsetInPanel > dockingPoint) {
        // ドッキング完了！ 次の文字を ABOUT のすぐ下に固定
        nextItem.style.marginTop = "0vh";
        
        // ここからが「押し出し」！ 
        // 80%〜100%の間で、今の文字をさらに上に追い出す
        const pushProgress = (offsetInPanel - dockingPoint) / (panelHeight - dockingPoint);
        moveY += pushProgress * 100;
      } else {
        // まだ追い上げ開始前なら、次の文字は画面外
        nextItem.style.marginTop = "100vh";
      }
    }

    track.style.transition = "none";
    // 基準位置（-12.5vh）から、計算した moveY(vh) 分だけ引き上げる
    track.style.transform = `translateY(calc(-12.5vh - ${moveY}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
