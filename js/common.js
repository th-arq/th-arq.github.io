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
    // --- 2. 左タイトルを右スクロールと完全同期 ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0 || !layout) return;

    const layoutTop = layout.offsetTop;
    const scrollY = window.scrollY;

    // about-layout に入ってからのスクロール量
    const relativeScroll = scrollY - layoutTop;
    if (relativeScroll < 0) return;

    const panelHeight = panels[0].offsetHeight;

    // 最大スクロール（最後のタイトルで止める）
    const maxScroll =
      panelHeight * panels.length - window.innerHeight;

    const clampedScroll = Math.min(relativeScroll, maxScroll);

    // 右と完全同期（px）
    track.style.transform = `translateY(${-clampedScroll}px)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
