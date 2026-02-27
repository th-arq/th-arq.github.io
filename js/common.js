window.addEventListener("load", () => {

  // ===== header / footer (そのまま) =====
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // ===== スクロール連動 =====
  const track = document.querySelector(".title-track");
  const layout = document.querySelector(".about-layout");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || !layout || panels.length === 0) return;

    const rect = layout.getBoundingClientRect();
    
    // 【修正ポイント】
    // セクションが画面の上端にくるまでは、絶対に 0 (ABOUT) から動かさない
    if (rect.top > 0) {
      track.style.transform = `translateY(0)`;
      return;
    }

    // セクション全体の高さから画面の高さを引いた「可動域」
    const totalScrollRange = layout.offsetHeight - window.innerHeight;
    
    // 今どれくらいスクロールしたか
    const currentScroll = -rect.top;

    // 進捗率 0〜1
    let progress = currentScroll / totalScrollRange;
    progress = Math.max(0, Math.min(1, progress));

    // 移動量計算
    const moveAmount = progress * (panels.length - 1) * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
