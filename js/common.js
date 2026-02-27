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
        if (!entry.isIntersecting) return;

        const index = [...panels].indexOf(entry.target);

        // 👇 少しだけ下から押し上げる余白
        const offset = 0.15; // ← ここがバトンタッチ感の肝
        track.style.transform = `translateY(-${(index - offset) * 100}vh)`;
      });
    },
    {
      threshold: 0.4
    }
  );

  panels.forEach(panel => observer.observe(panel));
});
