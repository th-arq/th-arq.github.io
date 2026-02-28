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
});

  // --- ここからバトンタッチの処理 ---
  cwindow.addEventListener("scroll", () => {
  const track = document.querySelector(".title-track");
  const layout = document.querySelector(".about-layout");
  const panels = document.querySelectorAll(".panel");

  if (!track || !layout || panels.length === 0) return;

  const rect = layout.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // 「Aboutエリア全体の高さ」から「画面の高さ」を引いた、実際に動かせる距離
  const totalHeight = layout.offsetHeight - windowHeight;
  
  // 今、どれくらいスクロールしたか (0 〜 1)
  let progress = -rect.top / totalHeight;
  progress = Math.max(0, Math.min(1, progress));

  // 文字の塊を動かす。文字が3つなら (3-1) * 100 = 200vh 分動かす
  const moveAmount = progress * (panels.length - 1) * 100;
  track.style.transform = `translateY(-${moveAmount}vh)`;
});
