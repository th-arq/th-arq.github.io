window.addEventListener("load", () => {

  // ===== header =====
  fetch('/head.html')
    .then(res => res.text())
    .then(html => {
      const header = document.getElementById('header');
      if (header) header.innerHTML = html;
    });

  // ===== footer =====
  fetch('/foot.html')
    .then(res => res.text())
    .then(html => {
      const footer = document.getElementById('footer');
      if (footer) footer.innerHTML = html;
    });

  const panels = document.querySelectorAll(".panel");
  const track = document.querySelector(".title-track");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = [...panels].indexOf(entry.target);
          track.style.transform = `translateY(-${index * 100}vh)`;
        }
      });
    },
    {
      root: null,
      threshold: 0.5
    }
  );

  panels.forEach(panel => observer.observe(panel));
});
