window.addEventListener("load", () => {

  // ===== 1. header の読み込み =====
  fetch('/head.html')
    .then(res => res.text())
    .then(html => {
      const header = document.getElementById('header');
      if (header) header.innerHTML = html;
    });

  // ===== 2. footer の読み込み =====
  fetch('/foot.html')
    .then(res => res.text())
    .then(html => {
      const footer = document.getElementById('footer');
      if (footer) footer.innerHTML = html;
    });

  // ===== 3. スクロール連動（バトンタッチ・アニメーション） =====
  const track = document.querySelector(".title-track");
  const contentRail = document.querySelector(".content-rail");
  const panels = document.querySelectorAll(".panel");

  // スクロール時に実行する関数
  const handleScroll = () => {
    if (!track || !contentRail || panels.length === 0) return;

    // content-rail（右側のコンテンツ全体）の座標を取得
    const rect = contentRail.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 開始位置：最初のパネルのトップが画面中央あたりに来た時
    // 終了位置：最後のパネルが画面中央あたりに来た時
    // これを計算するために全体の高さを取得
    const totalScrollRange = contentRail.offsetHeight - windowHeight;
    
    // 現在のスクロール進捗（0 〜 1）を計算
    // rect.top がマイナスになるほど下にスクロールしている
    let progress = -rect.top / totalScrollRange;

    // 範囲を 0 (最初) から 1 (最後) の間に固定
    progress = Math.max(0, Math.min(1, progress));

    // 移動量を計算（パネルの数 - 1）分だけ 100vh ずつ動かす
    const moveAmount = progress * (panels.length - 1) * 100;

    // transform で上に引き上げる
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  // スクロールイベントを登録
  window.addEventListener("scroll", handleScroll);
  
  // 初回読み込み時にも一度計算しておく
  handleScroll();

});
