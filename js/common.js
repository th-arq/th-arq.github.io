window.addEventListener("load", () => {
  // --- 1. Header / Footer 読み込み (絶対に消してないよ！安心してね) ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 2. 呼び寄せバトンタッチ・ロジック ---
  const track = document.querySelector(".title-track");
  const items = document.querySelectorAll(".title-item");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || items.length < 2 || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = Math.max(0, -layoutRect.top);
    const panelHeight = panels[0].offsetHeight;

    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    // --- 動きの数値設定 ---
    const startAction = panelHeight * 0.8; // 80%まで読んだら次の文字を呼び出す
    const itemHeightVh = 25; // CSSの .title-item の高さ

    let moveY = index * itemHeightVh;
    
    // 次の文字（SERVICEなど）を取得
    const nextItem = items[index + 1];
    
    // 他のすべての文字を一旦リセット（基本は画面外へ）
    items.forEach((item, i) => {
      if (i > index) {
        item.style.marginTop = "100vh"; // 画面1枚分下に隠す
        item.style.opacity = "0";      // 念のため透明にしておく
      } else {
        item.style.marginTop = "0";
        item.style.opacity = "1";
      }
    });

    if (offsetInPanel > startAction) {
      const progress = (offsetInPanel - startAction) / (panelHeight - startAction);
      
      // 次の文字を「100vh下」から「0（ABOUTのすぐ下）」までシュッと引き寄せる
      if (nextItem) {
        nextItem.style.marginTop = `${100 * (1 - progress)}vh`;
        nextItem.style.opacity = "1";
      }
      
      // 引き寄せに合わせて、全体を少しずつ上にスライド（バトンタッチ）
      moveY += progress * itemHeightVh;
    }

    track.style.transition = "none";
    // 37.5vh（中央位置）を基準に、計算した分だけ動かす
    track.style.transform = `translateY(calc(37.5vh - ${moveY}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
