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

  // --- 2. スクロール連動バトンタッチ ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    // 要素がない場合はエラーにならないよう抜ける
    if (!track || !layout || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = -layoutRect.top; // Aboutエリア内でのスクロール量
    const panelHeight = panels[0].offsetHeight; // 各セクションの高さ

    // 今何番目のセクションか
    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    // --- 動きの調整（ここがゆうきのこだわりポイント！） ---
    const startMoving = panelHeight * 0.8; // 8割読んだら次の文字が動き出す
    const itemHeightVh = 25; // CSSの .title-item の height (25vh) と合わせる

    let moveAmount = index * itemHeightVh;

    if (offsetInPanel > startMoving) {
      // 8割を超えたら、残りの距離(2割分)で文字をスススッと動かす
      const progress = (offsetInPanel - startMoving) / (panelHeight - startMoving);
      moveAmount += progress * itemHeightVh;
    }

    // transformを直接操作して、スクロール速度と100%同期
    track.style.transition = "none";
    track.style.transform = `translateY(calc(-50% - ${moveAmount}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 読み込み時にも一度計算
});
