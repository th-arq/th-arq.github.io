window.addEventListener("load", () => {

  // ===== header の読み込み =====
  fetch('/head.html')
    .then(res => res.text())
    .then(html => {
      const header = document.getElementById('header');
      if (header) header.innerHTML = html;
    });

  // ===== footer の読み込み =====
  fetch('/foot.html')
    .then(res => res.text())
    .then(html => {
      const footer = document.getElementById('footer');
      if (footer) footer.innerHTML = html;
    });

  // ※ スクロール連動の長いコードは全部消してスッキリさせてOK！
});

window.addEventListener("scroll", () => {
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  if (!track || panels.length === 0) return;

  const rect = layout.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // ABOUTの開始地点から、全体の終わりまでの距離
  const totalHeight = layout.offsetHeight - windowHeight;
  // 現在どれくらい進んだか (0 〜 1)
  let progress = -rect.top / totalHeight;
  progress = Math.max(0, Math.min(1, progress));

  // 文字を「100vh × (パネル数-1)」分だけ、進捗に合わせて上にずらす
  const moveAmount = progress * (panels.length - 1) * 100;
  track.style.transform = `translateY(-${moveAmount}vh)`;
});
