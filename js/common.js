window.addEventListener('load', () => {

  // ═══════════════════════════════════════════════
  // 1. Lenis (Smooth Scroll)
  // ═══════════════════════════════════════════════
  const lenisScript = document.createElement('script');
  lenisScript.src = 'https://unpkg.com/lenis@1.1.13/dist/lenis.min.js';
  lenisScript.onload = () => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };
  document.head.appendChild(lenisScript);


  // ═══════════════════════════════════════════════
  // 2. Header / Footer Loader
  // ═══════════════════════════════════════════════
  const isIndex = document.body.classList.contains('is-index');

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

          if (!isIndex) {
            headerTag.style.opacity = '0';
            headerTag.style.transition = 'none';
          }

          window.addEventListener('scroll', () => {
            headerTag.classList.toggle('is-scrolled', window.scrollY > 50);
          });

          const burgerBtn = el.querySelector('.burger-btn');
          if (burgerBtn) {
            burgerBtn.addEventListener('click', (e) => {
              e.preventDefault();
              headerTag.classList.toggle('nav-open');
              document.body.style.overflow =
                headerTag.classList.contains('nav-open') ? 'hidden' : '';
            });
          }

          if (isIndex) return;

          const revealHeader = () => {
            setTimeout(() => {
              el.querySelector('.fade-logo')?.classList.add('show');
              el.querySelector('.fade-menu')?.classList.add('show');
              headerTag.style.transition = 'opacity 0.7s ease';
              headerTag.style.opacity = '1';

              // ヘッダーfade-in完了(0.7s)後にtitleをwipe
              // ヘッダー開始から700ms = ヘッダーがちょうど出終わるタイミング
              setTimeout(() => {
                document.dispatchEvent(new CustomEvent('header:revealed'));
              }, 700);

            }, 2000);
          };

          const mainEl = document.querySelector('main');
          if (!mainEl) {
            setTimeout(revealHeader, 500);
            return;
          }

          if (mainEl.classList.contains('appeared')) {
            revealHeader();
          } else {
            const obs = new MutationObserver((_, o) => {
              if (mainEl.classList.contains('appeared')) {
                o.disconnect();
                revealHeader();
              }
            });
            obs.observe(mainEl, { attributes: true, attributeFilter: ['class'] });

            setTimeout(() => {
              obs.disconnect();
              headerTag.style.transition = 'opacity 0.7s ease';
              headerTag.style.opacity = '1';
              el.querySelector('.fade-logo')?.classList.add('show');
              el.querySelector('.fade-menu')?.classList.add('show');
              setTimeout(() => {
                document.dispatchEvent(new CustomEvent('header:revealed'));
              }, 700);
            }, 2000);
          }
        }
      });
  };

  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');


  // ═══════════════════════════════════════════════
  // 3. Page Appearance — main フェードイン
  // ═══════════════════════════════════════════════
  if (!isIndex) {
    setTimeout(() => {
      document.querySelector('main')?.classList.add('appeared');
    }, 200);
  }


  // ═══════════════════════════════════════════════
  // 4. Split Title — wipe アニメーション
  //    header:revealed イベントを受けて最初のtitleを発火
  // ═══════════════════════════════════════════════
  const titles = document.querySelectorAll('.split-layout .title');
  const isServices = document.querySelector('.services-page');

  titles.forEach((title, index) => {
    if (isServices && index === 0) return;

    if (!title.querySelector('.wipe-line')) {
      const text = title.innerHTML;
      title.innerHTML = `<span class="wipe-line"><span class="wipe-inner" style="transform:translateY(105%)">${text}</span></span>`;
    }

    const inner = title.querySelector('.wipe-inner');
    if (!inner) return;

    const reveal = () => {
      inner.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
      inner.style.transform  = 'translateY(0)';
    };

    if (index === 0) {
      // ヘッダーが出終わってから最初のtitleをwipe
      document.addEventListener('header:revealed', reveal, { once: true });
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          reveal();
          io.unobserve(title);
        });
      }, { threshold: 0.3 });
      io.observe(title);
    }
  });


  // ═══════════════════════════════════════════════
  // 5. Split Title — is-active（スクロール連動カラー）
  // ═══════════════════════════════════════════════
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-active', entry.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  titles.forEach(title => activeObserver.observe(title));


  // ═══════════════════════════════════════════════
  // 6. Content Fade-up
  // ═══════════════════════════════════════════════
  if (!isServices) {
    const fadeTargets = document.querySelectorAll(
      '.content-box > section, .content-box > p, .content-box > h2, .content-box > h4, .content-box > ul, .content-box > iframe'
    );

    fadeTargets.forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'none';
    });

    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
        }, 80);
        fadeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    fadeTargets.forEach(el => fadeObserver.observe(el));
  }


  // ═══════════════════════════════════════════════
  // 7. FAQ Smooth Accordion
  // ═══════════════════════════════════════════════
  document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');
    if (!summary || !content) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.hasAttribute('open')) {
        content.animate([
          { opacity: 1, height: content.scrollHeight + 'px' },
          { opacity: 0, height: '0px' }
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' })
          .onfinish = () => item.removeAttribute('open');
      } else {
        item.setAttribute('open', '');
        content.animate([
          { opacity: 0, height: '0px' },
          { opacity: 1, height: content.scrollHeight + 'px' }
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
      }
    });
  });


  // ═══════════════════════════════════════════════
  // 8. Contact Form Ajax
  // ═══════════════════════════════════════════════
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData  = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.submit-btn');
      const original  = submitBtn.innerText;
      submitBtn.innerText = 'SENDING...';
      submitBtn.disabled  = true;
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST', body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) { window.location.href = 'thanks.html'; }
        else throw new Error();
      } catch {
        alert('Oops! Something went wrong. Please try again.');
        submitBtn.innerText = original;
        submitBtn.disabled  = false;
      }
    });
  }

});
