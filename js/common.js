window.addEventListener("load", () => {
  // --- Header / Footer 読み込み (省略せず残してね) ---
  const loadParts = (id, path) => {
    fetch(path).then(res => res.text()).then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  };
  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 連動型バトンタッチ ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    const windowHeight = window.innerHeight;
    const layoutRect = layout.getBoundingClientRect();
    
    // 全体のスクロール量
    const totalScroll = layout.offsetHeight - windowHeight;
    const currentScroll = -layoutRect.top;
    
    // 進捗を 0 〜 1 に変換
    let progress = currentScroll / totalScroll;
    progress = Math.max(0, Math.min(1, progress));

    // 【ここがポイント】
    // transitionを "none" にすることで、指の動きにピタッと吸い付くようになるよ
    track.style.transition = "none"; 
    const moveAmount = progress * (panels.length - 1) * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
