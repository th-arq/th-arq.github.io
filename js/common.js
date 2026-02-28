window.addEventListener("load", () => {
  // --- 1. Header / Footer 読み込み (消さずに残したよ！) ---
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
    if (!track || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    const scrollTop = -layoutRect.top;
    const panelHeight = panels[0].offsetHeight;

    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    // --- 動きの微調整 ---
    const startMoving = panelHeight * 0.8; // 80%まで来たら動き出す
    const itemHeightVh = 25; // CSSの .title-item の height と合わせる

    // 基本は現在のインデックスの位置
    let moveAmount = index * itemHeightVh;

    if (offsetInPanel > startMoving) {
      // 境界線を越えたら、スクロールの進捗に合わせて文字を動かす
      const progress = (offsetInPanel - startMoving) / (panelHeight - startMoving);
      moveAmount += progress * itemHeightVh;
    }

    track.style.transition = "none"; // マウスに100%同期
    // 最初の -50% は、常に「今の文字」を中央に置くための魔法
    track.style.transform = `translateY(calc(-50% - ${moveAmount}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
