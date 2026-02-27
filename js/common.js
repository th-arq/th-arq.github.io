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
  const panels = document.querySelectorAll(".panel");

  const handleScroll = () => {
    if (!track || panels.length === 0) return;

    // 現在、どのパネルが「画面の中央」にかかっているかを探す
    let activeIndex = 0;
    const viewCenter = window.innerHeight / 2;

    panels.forEach((panel, index) => {
      const rect = panel.getBoundingClientRect();
      // パネルの上が画面中央より上で、パネルの下が画面中央より下にある場合
      if (rect.top <= viewCenter && rect.bottom >= viewCenter) {
        activeIndex = index;
      }
    });

    // 見つかったインデックス（0:ABOUT, 1:SERVICE...）に合わせて
    // 100vh単位でガツンと移動させる
    // transitionをCSSでつけておけば、ここを書き換えるだけで滑らかに動くよ！
    const moveAmount = activeIndex * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 初期表示用
});
