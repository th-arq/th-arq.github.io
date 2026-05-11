// index.js — Gallery reveal & loading
 
window.addEventListener("load", () => {
  const loading = document.getElementById('loading');
  const percentText = document.getElementById('loading_percent');
 
  let progress = 0;
  let targetProgress = 0;
  const images = document.querySelectorAll('img');
 
  // ロード進捗計算（lazy画像は除く）
  const eagerImages = Array.from(images).filter(img => img.loading !== 'lazy');
 
  if (eagerImages.length === 0) {
    targetProgress = 100;
  } else {
    let loadedCount = 0;
    eagerImages.forEach((img) => {
      const update = () => {
        loadedCount++;
        targetProgress = Math.floor((loadedCount / eagerImages.length) * 100);
      };
      if (img.complete) update();
      else {
        img.addEventListener('load', update);
        img.addEventListener('error', update);
      }
    });
  }
 
  // カウントアップ
  const timer = setInterval(() => {
    if (progress < targetProgress) progress++;
    if (percentText) percentText.textContent = progress + "%";
 
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        loading?.classList.add('loaded');
 
        // main フェードイン
        document.querySelector('main')?.classList.add('appeared');
 
        // ヘッダー
        setTimeout(() => {
          document.querySelector(".fade-logo")?.classList.add("show");
          document.querySelector(".fade-menu")?.classList.add("show");
        }, 500);
 
        // 最初に見えているアイテムをずらして表示
        initGallery();
      }, 600);
    }
  }, 20);
});
 
 
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
 
  // data-delay を付与（初回表示分のみ stagger）
  items.forEach((item, i) => {
    item.setAttribute('data-delay', i % 9);
  });
 
  // IntersectionObserver でスクロール reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        // 一度出たら遅延をリセットして再アニメしない
        setTimeout(() => {
          el.classList.add('no-delay');
        }, 800);
        io.unobserve(el);
      }
    });
  }, {
    rootMargin: '0px 0px -5% 0px',
    threshold: 0.05,
  });
 
  items.forEach(item => io.observe(item));
}
