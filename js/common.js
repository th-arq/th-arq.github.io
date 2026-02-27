window.addEventListener("load", () => {
  // header / footer 読み込み (既存のコード)
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- ここからバトンタッチの処理 ---
  const track = document.querySelector(".title-track");
  const layout = document.querySelector(".about-layout");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || !layout || panels.length === 0) return;

    const rect = layout.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Aboutエリア全体の高さから、画面で見えている分を引いた「スクロールできる全距離」
    const totalScrollRange = layout.offsetHeight - windowHeight;
    
    // 現在、Aboutエリアのトップからどれくらいスクロールしたか
    const currentScroll = -rect.top;

    // 進捗率 (0:最初 〜 1:最後までスクロールした)
    let progress = currentScroll / totalScrollRange;
    progress = Math.max(0, Math.min(1, progress));

    // 文字の塊を上にずらす量（100vh × 文字の数）
    // progressが1に近づくほど、最後の文字が真ん中に来るよ
    const moveAmount = progress * (panels.length - 1) * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 初期表示用
});
