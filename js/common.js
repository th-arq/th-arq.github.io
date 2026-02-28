window.addEventListener("load", () => {
  // --- 1. Header / Footer 読み込み ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 2. ズレないバトンタッチ ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || !layout || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    // ヘッダーの高さを考慮せず、レイアウト要素のトップからの距離を純粋に取る
    const scrollTop = -layoutRect.top; 
    const panelHeight = panels[0].offsetHeight;

    // 現在のセクション番号
    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    // 動き出すタイミング（90%までは絶対動かない）
    const startMoving = panelHeight * 0.9;
    const itemHeightVh = 100;

    let moveAmount = index * itemHeightVh;

    // 0以下のときはABOUT（index 0）で固定
    if (scrollTop < 0) {
      moveAmount = 0;
    } else if (offsetInPanel > startMoving) {
      // 90%を超えたら、次の文字をスクロールに合わせて引っ張り上げる
      const progress = (offsetInPanel - startMoving) / (panelHeight - startMoving);
      moveAmount += progress * itemHeightVh;
    }

    track.style.transition = "none";
    // translateYだけで制御。-50%とかを使わないシンプルな計算にしたよ！
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
