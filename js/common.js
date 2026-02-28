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

  // --- 2. ズレ解消版バトンタッチ ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const layoutRect = layout.getBoundingClientRect();
    // レイアウトのトップからのスクロール距離。少しの誤差も出ないようMath.maxで調整
    const scrollTop = Math.max(0, -layoutRect.top);
    const panelHeight = panels[0].offsetHeight;

    // 今「完全に」表示されているセクションの番号
    const index = Math.floor(scrollTop / panelHeight);
    const offsetInPanel = scrollTop % panelHeight;

    // --- 設定値（ここをいじるとタイミングが変わるよ） ---
    const startMoving = panelHeight * 0.8; // 80%まで読んだら動き出す
    const itemHeightVh = 60; // CSSの .title-item の height と合わせる

    // 基本は、今のインデックスの位置で「固定」
    let moveAmount = index * itemHeightVh;

    // 80%を過ぎたときだけ、次の文字を呼び寄せる
    if (offsetInPanel > startMoving && index < panels.length - 1) {
      const progress = (offsetInPanel - startMoving) / (panelHeight - startMoving);
      moveAmount += progress * itemHeightVh;
    }

    track.style.transition = "none";
    // -50% は最初のABOUTを中央に置くためのオフセット
    track.style.transform = `translateY(calc(-50% - ${moveAmount}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
