window.addEventListener("load", () => {
  // ファーストビューはスクロール禁止
  document.body.style.overflow = "hidden";

  const reveals = document.querySelectorAll(".reveal");

  // 少し待ってから一斉に表示
  setTimeout(() => {
    reveals.forEach(el => {
      el.classList.add("show");
    });

    // アニメーション終わったらスクロール解放
    setTimeout(() => {
      document.body.style.overflow = "";
    }, 1300);

  }, 300);

  // ② ロゴ
  if (logo) {
    setTimeout(() => {
      logo.classList.add("show");
    }, 800);
  }

  // ③ メニュー
  if (menu) {
    setTimeout(() => {
      menu.classList.add("show");
    }, 1100);
  }

  // ④ スクロール解除
  setTimeout(() => {
    document.body.classList.remove("is-lock");
  }, 1600);
});

fetch('head.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('header').innerHTML = html;
  });

fetch('foot.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footer').innerHTML = html;
  });
