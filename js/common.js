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

  // --- 2. 右のパネルと完全に同期するロジック ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const rect = layout.getBoundingClientRect();
    // 全体のスクロール量（layoutのトップからの距離）
    const scrollTop = -rect.top; 
    // パネル1枚分の高さ
    const panelHeight = panels[0].offsetHeight;

    // 現在の進捗（0枚目なら0〜1、1枚目なら1〜2...と増えていく）
    const progress = scrollTop / panelHeight;

    // 左側の文字1つ分の高さは 100vh 分（JSでは1枚分として計算）
    const moveAmount = progress * 100;

    track.style.transition = "none";
    // 進捗に合わせて、文字を上にスライドさせる
    track.style.transform = `translateY(${-moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
