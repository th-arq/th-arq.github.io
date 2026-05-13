window.addEventListener("load", () => {
  // --- 1. Lenis (Smooth Scroll) ---
  const script = document.createElement('script');
  script.src = "https://unpkg.com/lenis@1.1.13/dist/lenis.min.js";
  script.onload = () => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  };
  document.head.appendChild(script);

  // --- 2. Scroll Observer (Title fade) ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      } else {
        entry.target.classList.remove('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  document.querySelectorAll('.split-layout .title').forEach(title => {
    observer.observe(title);
  });

  // --- 3. Header / Footer Loader ---
  // 【修正】fetchコールバック内でfade表示を処理するように変更
  const loadParts = (id, path) => {
    fetch(path)
      .then(res => res.text())
      .then(html => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = html;

        if (id === 'header') {
          const headerTag = el.querySelector('header');
          if (!headerTag) return;

          // 【修正】ヘッダー挿入直後にfadeクラスを付与（非同期タイミングのズレを解消）
          if (!document.body.classList.contains('is-index')) {
            setTimeout(() => {
              el.querySelector(".fade-logo")?.classList.add("show");
              el.querySelector(".fade-menu")?.classList.add("show");
            }, 100);
          }

          window.addEventListener('scroll', () => {
            if (window.scrollY > 50) headerTag.classList.add('is-scrolled');
            else headerTag.classList.remove('is-scrolled');
          });

          const burgerBtn = el.querySelector('.burger-btn');
          if (burgerBtn) {
            burgerBtn.addEventListener('click', (e) => {
              e.preventDefault();
              headerTag.classList.toggle('nav-open');
              document.body.style.overflow = headerTag.classList.contains('nav-open') ? 'hidden' : '';
            });
          }
        }
      });
  };

  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');

  // --- 4. FAQ Smooth Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.hasAttribute('open')) {
        const closing = content.animate([
          { opacity: 1, height: content.scrollHeight + 'px' },
          { opacity: 0, height: '0px' }
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
        closing.onfinish = () => item.removeAttribute('open');
      } else {
        item.setAttribute('open', '');
        content.animate([
          { opacity: 0, height: '0px' },
          { opacity: 1, height: content.scrollHeight + 'px' }
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
      }
    });
  });

  // --- 5. Contact Form Ajax Redirect ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.submit-btn');

      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'SENDING...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          window.location.href = 'thanks.html';
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        alert('Oops! Something went wrong. Please try again.');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // --- 6. Page Appearance ---
  // 【修正】重複していたコードブロックを削除し、こちら1箇所のみに統一
  // ※ is-index ページのfade-logo/fade-menuはloadParts内で処理するため、ここではmainのみ対応
  if (!document.body.classList.contains('is-index')) {
    setTimeout(() => {
      document.querySelector('main')?.classList.add('appeared');
    }, 100);
  }

  // --- 7. Services Card Reveal (scroll) ---
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.services-card.reveal').forEach(card => {
    cardObserver.observe(card);
  });

});
// 【修正】load イベント外に重複していた「6. Page Appearance」ブロックを削除
