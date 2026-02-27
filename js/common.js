window.addEventListener("load", () => {
  // header/footerの読み込みは省略（今のままでOK！）

  const track = document.querySelector(".title-track");
  const panels = document.querySelectorAll(".panel");
  const layout = document.querySelector(".about-layout");

  const handleScroll = () => {
    if (!track || panels.length === 0 || !layout) return;

    // Aboutセクション全体のエリア情報を取得
    const rect = layout.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // セクションが画面のトップに来てから、最後まで行くまでの距離
    // (最後のパネルが画面中央に来るまで)
    const totalScrollRange = layout.offsetHeight - windowHeight;
    
    // セクションのトップが画面上端を通過した距離
    const currentScroll = -rect.top;

    // 進捗率 0〜1 (0ならABOUT、1ならCOMPANY)
    let progress = currentScroll / totalScrollRange;
    
    // 0未満（まだ到達してない）なら0、1以上（通り過ぎた）なら1に固定
    progress = Math.max(0, Math.min(1, progress));

    // 移動量を計算
    const moveAmount = progress * (panels.length - 1) * 100;
    track.style.transform = `translateY(-${moveAmount}vh)`;
  };

  window.addEventListener("scroll", handleScroll);
  // ページ読み込み時にも少し遅らせて実行（位置計算を安定させるため）
  setTimeout(handleScroll, 100); 
});
