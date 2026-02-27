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
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const current = entry.target.dataset.title;

        titles.forEach(title => {
          title.classList.toggle(
            'is-active',
            title.dataset.title === current
          );
        });
      }
    });
  },
  {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  }
);

panels.forEach(panel => observer.observe(panel));
