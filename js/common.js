window.addEventListener("scroll", () => {
  const track = document.querySelector(".title-track");
  const layout = document.querySelector(".about-layout");
  const panels = document.querySelectorAll(".panel");

  if (!track || !layout || panels.length === 0) return;

  const rect = layout.getBoundingClientRect();
  const scrollTop = -rect.top;
  const panelHeight = panels[0].offsetHeight;

  const index = Math.floor(scrollTop / panelHeight);
  const offsetInPanel = scrollTop % panelHeight;

  // --- 動きのタイミング設定 ---
  // 70%地点から SERVICE が下から登り始める
  // 95%地点で ABOUT のすぐ下にドッキング完了
  const startClimbing = panelHeight * 0.7; 
  const dockingComplete = panelHeight * 0.95; 

  let moveAmount = index * 100;

  if (offsetInPanel > startClimbing && offsetInPanel <= dockingComplete) {
    // 【フェーズ1】ABOUT は中央で固定。SERVICE だけが距離を猛烈に詰める
    const climbProgress = (offsetInPanel - startClimbing) / (dockingComplete - startClimbing);
    // 次の文字（100vh下）を、ほぼ 0vh の位置（ABOUTのすぐ下）まで引き上げる
    moveAmount += climbProgress * 95; 
  } 
  else if (offsetInPanel > dockingComplete) {
    // 【フェーズ2】ドッキング完了！ここからはマウスの回転と1:1で一緒に上へ
    const pushProgress = (offsetInPanel - dockingComplete) / (panelHeight - dockingComplete);
    // 95vhまで引き上げた状態から、残りの 5vh をスクロールに合わせて動かす
    moveAmount = (index * 100) + 95 + (pushProgress * 5);
  }

  track.style.transition = "none"; // マウスに1:1で吸い付かせる
  track.style.transform = `translateY(-${moveAmount}vh)`;
});
