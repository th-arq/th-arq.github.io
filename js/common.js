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

  // --- 2. ガチ中央固定 ＆ 瞬間バトンパス ---
  const track = document.querySelector(".title-track");
  const items = document.querySelectorAll(".title-item");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = Math.max(0, -layoutRect.top);
    const panelHeight = panels[0].offsetHeight;

    // 今、何番目のセクションにいるか
    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    // タイミングの設定
    const startCatchUp = panelHeight * 0.4; // 40%で次の文字が動き出す
    const dockingPoint = panelHeight * 0.8; // 80%でピタッと合流

    // 【ここが修正のキモ！】
    // 80%に達するまでは、移動量を「index * 100」で完全に固定する。
    // これで ABOUT(0), SERVICE(100), COMPANY(200) が同じ位置でロックされるよ。
    let moveY = index * 100;

    const nextItem = items[index + 1];

    if (nextItem) {
      if (offsetInPanel > startCatchUp && offsetInPanel <= dockingPoint) {
        // 次の文字を 100vh 下から 0 (今の文字のすぐ下) まで引き寄せる
        const progress = (offsetInPanel - startCatchUp) / (dockingPoint - startCatchUp);
        nextItem.style.marginTop = `${100 * (1 - progress)}vh`;
        // この間、moveY は変わらない = 今の文字は中央固定！
      } 
      else if (offsetInPanel > dockingPoint) {
        // ドッキング完了後、一気に次の文字へバトンタッチ
        nextItem.style.marginTop = "0vh";
        const pushProgress = (offsetInPanel - dockingPoint) / (panelHeight - dockingPoint);
        // ここで初めて moveY を動かして、今の文字を上に追い出す
        moveY += pushProgress * 100;
      } else {
        // それ以外の時は、次の文字は画面外(100vh下)で待機
        nextItem.style.marginTop = "100vh";
      }
    }

    track.style.transition = "none";
    // -12.5vh（中央補正）を基準に、全文字をガチッと固定！
    track.style.transform = `translateY(calc(-12.5vh - ${moveY}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
