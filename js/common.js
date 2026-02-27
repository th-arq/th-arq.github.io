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
