window.addEventListener("load", () => {
  // header / footer 読み込み (そのまま)
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  const track = document.querySelector(".title-track");
  const layout = document.querySelector(".about-layout");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || !layout || panels.length === 0) return;

    const rect = layout.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // セクション全体の高さから、最後のパネルが画面に収まるまでの距離を計算
    const totalScrollRange = layout.offsetHeight - windowHeight;
    
    // 今のスクロール量（セクションのトップからの距離）
    const currentScroll = -rect.top;

    // 進捗率 0〜1 
    // rect.top が 0 の時（セクションが画面上端に来た時）に progress が 0 になる
    let progress = currentScroll / totalScrollRange;
    progress = Math.max(0, Math.min(1, progress));

    // 移動量計算（1枚 100vh）
    const moveAmount = progress * (panels.length - 1) * 100;

    // 文字を上にスライド
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
