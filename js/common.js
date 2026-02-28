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

  // --- 2. 追い上げバトンタッチ ---
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

    // --- 動きのロジック ---
    // 60%地点から、下のSERVICEが画面外から中央に向かって「追い上げ」を開始
    const startClimbing = panelHeight * 0.6; 
    const itemHeightVh = 60; // CSSの .title-item の高さと合わせる

    let moveY = index * itemHeightVh;

    if (offsetInPanel > startClimbing) {
      // 60%を過ぎたら、スクロールに合わせてSERVICEを中央へ引き寄せる
      const progress = (offsetInPanel - startClimbing) / (panelHeight - startClimbing);
      moveY += progress * itemHeightVh;
    }

    track.style.transition = "none";
    // calc(-50% ...) で常に現在の文字を画面中央に保ちつつ、moveYでずらす
    track.style.transform = `translateY(calc(-50% - ${moveY}vh))`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
