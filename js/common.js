window.addEventListener("load", () => {

  // header
  fetch('/head.html')
    .then(res => res.text())
    .then(html => {
      const header = document.getElementById('header');
      if (header) {
        header.innerHTML = html;

        // header 読み込み完了を通知
        document.dispatchEvent(new Event('headerLoaded'));
      }
    });

  // footer
  fetch('/foot.html')
    .then(res => res.text())
    .then(html => {
      const footer = document.getElementById('footer');
      if (footer) footer.innerHTML = html;
    });

});
