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


const panels = document.querySelectorAll('.panel');
const title = document.querySelector('.title-text');

if (panels.length && title) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const text = entry.target.dataset.title;

          // 一度消す
          title.classList.remove('show');

          // 下→上で入れ替え
          setTimeout(() => {
            title.textContent = text;
            title.classList.add('show');
          }, 200);
        }
      });
    },
    {
      threshold: 0.6
    }
  );

  panels.forEach(panel => observer.observe(panel));
}

