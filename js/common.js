window.addEventListener("load", () => {

  // ===== 1. header の読み込み (復活) =====
  fetch('/head.html')
    .then(res => res.text())
    .then(html => {
      const header = document.getElementById('header');
      if (header) header.innerHTML = html;
    });

  // ===== 2. footer の読み込み (復活) =====
  fetch('/foot.html')
    .then(res => res.text())
    .then(html => {
      const footer = document.getElementById('footer');
      if (footer) footer.innerHTML = html;
    });

  // ===== 3. スクロール連動（バトンタッチ） =====
  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0 || !layout) return;

    // about-layoutが画面の上端からどれくらいの位置にいるか
    const rect = layout.getBoundingClientRect();
    
    // スクロールの開始地点を調整（ヘッダーの高さなどを考慮）
    // セクションのトップが画面の一番上に来た時を 0 とする
    const currentScroll = -rect.top;
    
    // スクロールが終わる距離（全体の高さから画面1枚分を引いたもの）
    const totalScrollRange = layout.offsetHeight - window.innerHeight;

    // 進捗率 0〜1
    let progress = currentScroll / totalScrollRange;
    
    // 0(ABOUT) 〜 1(COMPANY) の間に収める
    progress = Math.max(0, Math.min(1, progress));

    // 移動量を計算（1枚 100vh）
    const moveAmount = progress * (panels.length - 1) * 100;

    // 文字を上にスライド
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  // スクロールイベントを登録
  window.addEventListener("scroll", handleScroll);
  
  // 読み込み直後にも実行して初期位置を合わせる
  handleScroll();
  // 少し遅れてもう一度実行（画像などの読み込みで高さが変わる対策）
  setTimeout(handleScroll, 100);
});
