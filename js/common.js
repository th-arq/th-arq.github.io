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

  // --- 設定値 ---
  const startMeeting = panelHeight * 0.7; // 次の文字が下から見え始めるタイミング
  const dockingPoint = panelHeight * 0.9; // ABOUTのすぐ下まで登りきるタイミング

  let moveAmount = index * 100;

  if (offsetInPanel > startMeeting && offsetInPanel <= dockingPoint) {
    // 【フェーズ1】ABOUTは固定。SERVICEだけが下からスルスル登ってきて近づく
    const meetingProgress = (offsetInPanel - startMeeting) / (dockingPoint - startMeeting);
    // 100vh離れていたのを、一気に近づける
    moveAmount += meetingProgress * 90; // 100じゃなくて90にすることで、少し隙間を残してドッキング
  } 
  else if (offsetInPanel > dockingPoint) {
    // 【フェーズ2】ABOUTのすぐ下にSERVICEが到着。ここからはスクロールと1:1で一緒に上へ
    const pushProgress = (offsetInPanel - dockingPoint) / (panelHeight - dockingPoint);
    moveAmount = (index * 100) + 90 + (pushProgress * 10); // 100%まで残り10をスクロールと同期
  }

  track.style.transition = "none"; // 指の動きに100%合わせる
  track.style.transform = `translateY(-${moveAmount}vh)`;
});
