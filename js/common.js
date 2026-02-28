window.addEventListener("load", () => {
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  const track = document.querySelector(".title-track");
  const items = document.querySelectorAll(".title-item"); // itemsを取得
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
    const itemHeightVh = 25; 

    let moveY = index * itemHeightVh;

    // --- 次の文字を呼び寄せる処理 ---
    const nextItem = items[index + 1];
    if (nextItem) {
      if (offsetInPanel > startCatchUp) {
        // 40%から80%にかけて、margin-topを100vhから0vhに縮める
        const progress = Math.min(1, (offsetInPanel - startCatchUp) / (dockingPoint - startCatchUp));
        nextItem.style.marginTop = `${100 * (1 - progress)}vh`;
      } else {
        nextItem.style.marginTop = "100vh";
      }
    }

    // --- 全体のスライド（バトンタッチ） ---
    if (offsetInPanel > dockingPoint) {
      const pushProgress = (offsetInPanel - dockingPoint) / (panelHeight - dockingPoint);
      // ドッキング後は、次のセクションの開始位置（index + 1）までスライドさせる
      moveY = (index * itemHeightVh) + (pushProgress * itemHeightVh);
    }

    track.style.transition = "none";
    track.style.transform = `translateY(calc(-12.5vh - ${moveY}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
