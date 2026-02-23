window.addEventListener('load', () => {
  const images = document.querySelectorAll('.reveal');
  const headerItems = document.querySelectorAll('.fade-item');

  images.forEach((img, i) => {
    setTimeout(() => {
      img.classList.add('show');
    }, i * 300);
  });

  // header fade after images
  setTimeout(() => {
    headerItems.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('show');
      }, i * 200);
    });
  }, images.length * 300 + 400);
});
