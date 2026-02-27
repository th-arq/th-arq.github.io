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
