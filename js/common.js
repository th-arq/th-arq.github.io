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

  // --- 改良版：ステップ式バトンタッチ ---
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    let currentIndex = 0;
    const windowHeight = window.innerHeight;
    const centerLine = windowHeight / 2; // 画面の真ん中の線

    // 今、画面の中央線を越えているのは何番目のセクションか探す
    panels.forEach((panel, index) => {
      const rect = panel.getBoundingClientRect();
      if (rect.top <= centerLine) {
        currentIndex = index;
      }
    });

    // 文字の塊を「今の番号 × 100vh」分だけ一気に引き上げる
    // transitionのおかげで、切り替わりはヌルッと動くよ
    track.style.transition = "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)";
    track.style.transform = `translateY(-${currentIndex * 100}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 初期状態の計算
});
