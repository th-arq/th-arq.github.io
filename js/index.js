fetch('../head.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('header').innerHTML = html;
  });

fetch('../foot.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footer').innerHTML = html;
  });


  const panels = document.querySelectorAll('.panel');
const title = document.querySelector('.title-text');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const text = entry.target.dataset.title;

        // 一旦消す → 入れ替え → 下から表示
        title.classList.remove('show');

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
