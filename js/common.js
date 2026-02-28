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

  // --- 2. 左タイトル同期 ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  if (!track || panels.length === 0 || !layout) return;

  // 正しい開始位置
  const layoutStart =
    layout.getBoundingClientRect().top + window.scrollY;

  const panelHeight = panels[0].offsetHeight;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const relativeScroll = scrollY - layoutStart;

    if (relativeScroll < 0) {
      // 最初はABOUTを中央固定
      track.style.transform = `translateY(0px)`;
      return;
    }

    const maxScroll =
      panelHeight * panels.length - window.innerHeight;

    const clampedScroll = Math.min(relativeScroll, maxScroll);

    track.style.transform = `translateY(${-clampedScroll}px)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
