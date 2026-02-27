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
const titles = document.querySelectorAll('.title-item');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const current = entry.target.dataset.title;

        titles.forEach(title => {
          if (title.dataset.title === current) {
            title.classList.add('is-active');
          } else {
            title.classList.remove('is-active');
          }
        });
      }
    });
  },
  {
    threshold: 0.5
  }
);

panels.forEach(panel => observer.observe(panel));
