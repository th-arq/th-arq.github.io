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

  const closeMenu = (headerTag) => {
    headerTag.classList.remove('nav-open');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  };

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
            headerTag.style.opacity    = '0';
            headerTag.style.transition = 'none';
          }

          window.addEventListener('scroll', () => {
            headerTag.classList.toggle('is-scrolled', window.scrollY > 50);
          });

          // バーガーボタン: メニューを開く
          const burgerBtn = el.querySelector('.burger-btn');
          if (burgerBtn) {
            burgerBtn.addEventListener('click', (e) => {
              e.preventDefault();
              headerTag.classList.add('nav-open');
              document.body.classList.add('nav-open');
              document.body.style.overflow = 'hidden';
            });
          }

          // ✕ボタン: メニューを閉じる
          const closeBtn = el.querySelector('.sp-nav-close');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => closeMenu(headerTag));
          }

          // オーバーレイクリックで閉じる
          const overlay = document.querySelector('.nav-overlay');
          if (overlay) {
            overlay.addEventListener('click', () => closeMenu(headerTag));
          }

          if (isIndex) return;

          document.addEventListener('page:title-shown', () => {
            setTimeout(() => {
              headerTag.style.transition = 'opacity 0.9s ease';
              headerTag.style.opacity    = '1';
              el.querySelector('.fade-logo')?.classList.add('show');
              el.querySelector('.fade-menu')?.classList.add('show');
            }, 200);
          }, { once: true });
        }

        if (id === 'footer') {
          const footerEl = el.querySelector('footer');
          if (!footerEl) return;

          const footerObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;
              setTimeout(() => {
                footerEl.style.transition = 'opacity 1.1s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
                footerEl.classList.add('footer-visible');
              }, 150);
              footerObserver.unobserve(footerEl);
            });
          }, { threshold: 0.5 });

          footerObserver.observe(footerEl);
        }
      });
  };

  loadParts('header', '/head.html');
  loadParts('footer', '/foot.html');


  // ═══════════════════════════════════════════════
  // 3. Page Appearance — main ふわっと表示
  // ═══════════════════════════════════════════════
  if (!isIndex) {
    setTimeout(() => {
      document.querySelector('main')?.classList.add('appeared');
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('page:content-shown'));
      }, 300);
    }, 200);
  }


  // ═══════════════════════════════════════════════
  // 4. Split Title — ① 左タイトル 下から上 wipe
  // ═══════════════════════════════════════════════
  const titles = document.querySelectorAll('.split-layout .title');

  if (titles.length === 0) {
    document.addEventListener('page:content-shown', () => {
      document.dispatchEvent(new CustomEvent('page:title-shown'));
    }, { once: true });
  } else {
    titles.forEach((title, index) => {
      if (!title.querySelector('.wipe-line')) {
        const text = title.innerHTML;
        title.innerHTML =
          `<span class="wipe-line"><span class="wipe-inner" style="transform:translateY(105%)">${text}</span></span>`;
      }

      const inner = title.querySelector('.wipe-inner');
      if (!inner) return;

      const reveal = () => {
        inner.style.transition = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
        inner.style.transform  = 'translateY(0)';
      };

      if (index === 0) {
        document.addEventListener('page:content-shown', () => {
          reveal();
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('page:title-shown'));
          }, 100);
        }, { once: true });
      } else {
        const io = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            reveal();
            io.unobserve(title);
          });
        }, { threshold: 0.5 });
        io.observe(title);
      }
    });
  }


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
  // 6. Scroll Reveal — clip-path + ケンバーンズ
  // ═══════════════════════════════════════════════
  const isProjectsPage = !!document.querySelector('.projects-grid, .projects-item');

  if (!isProjectsPage) {
    const revealEls = document.querySelectorAll('.image-wrapper.reveal, .related-item.reveal');

    if (revealEls.length) {
      revealEls.forEach(el => {
        const img = el.querySelector('img');
        if (img) {
          img.style.transform  = 'scale(1.12)';
          img.style.transition = 'none';
        }
      });

      const revealOne = (el) => {
        if (el.dataset.revealed) return;
        el.dataset.revealed = '1';
        el.classList.add('show');

        const img = el.querySelector('img');
        if (img) {
          requestAnimationFrame(() => {
            img.style.transition = 'transform 2.4s cubic-bezier(0.25, 1, 0.5, 1)';
            img.style.transform  = 'scale(1)';
          });
          setTimeout(() => {
            img.style.transition = 'transform 0.6s ease';
          }, 2500);
        }
      };

      const checkReveal = () => {
        let remaining = false;
        revealEls.forEach(el => {
          if (el.dataset.revealed) return;
          remaining = true;
          if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
            revealOne(el);
          }
        });
        if (!remaining) window.removeEventListener('scroll', checkReveal);
      };

      const startReveal = () => {
        window.addEventListener('scroll', checkReveal, { passive: true });
        setTimeout(checkReveal, 80);
      };

      const mainEl = document.querySelector('main');
      if (!mainEl || mainEl.classList.contains('appeared')) {
        startReveal();
      } else {
        const obs = new MutationObserver((_, o) => {
          if (mainEl.classList.contains('appeared')) {
            o.disconnect();
            startReveal();
          }
        });
        obs.observe(mainEl, { attributes: true, attributeFilter: ['class'] });
        setTimeout(() => { obs.disconnect(); startReveal(); }, 2000);
      }
    }
  }


  // ═══════════════════════════════════════════════
  // 7. Split Layout — content-box アニメーション
  //    h2/h3/h4 → wipe（下からめくれ上げ）
  //    p/ul/iframe → fade-up（ふわっと）
  // ═══════════════════════════════════════════════
  const splitContentBox = document.querySelectorAll('.split-layout .content-box');

  if (splitContentBox.length) {

    const wipeStyle = document.createElement('style');
    wipeStyle.textContent = `
      .split-layout .content-box .sc-wipe {
        overflow: hidden;
        display: block;
      }
      .split-layout .content-box .sc-wipe-inner {
        display: block;
        will-change: transform;
      }
    `;
    document.head.appendChild(wipeStyle);

    document.querySelectorAll(
      '.split-layout .content-box h2, .split-layout .content-box h3, .split-layout .content-box h4'
    ).forEach(el => {
      if (el.querySelector('.sc-wipe-inner')) return;
      const inner = document.createElement('span');
      inner.className = 'sc-wipe-inner';
      inner.style.cssText = 'transform: translateY(130%); transition: none;';
      inner.innerHTML = el.innerHTML;
      el.innerHTML = '';
      el.classList.add('sc-wipe');
      el.appendChild(inner);
    });

    document.querySelectorAll(
      '.split-layout .content-box p, .split-layout .content-box ul, .split-layout .content-box iframe'
    ).forEach(el => {
      el.style.cssText += 'opacity: 0; transform: translateY(12px); transition: none;';
    });

    const fireSplitAnims = () => {

      document.querySelectorAll('.split-layout .content-box .sc-wipe').forEach(el => {
        const inner = el.querySelector('.sc-wipe-inner');
        if (!inner) return;
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            inner.style.transition = 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
            inner.style.transform  = 'translateY(0)';
            obs.unobserve(el);
          });
        }, { threshold: 0.3 });
        obs.observe(el);
      });

      document.querySelectorAll(
        '.split-layout .content-box p, .split-layout .content-box ul, .split-layout .content-box iframe'
      ).forEach(el => {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            setTimeout(() => {
              el.style.transition = 'opacity 0.85s ease, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
              el.style.opacity    = '1';
              el.style.transform  = 'translateY(0)';
            }, 80);
            obs.unobserve(el);
          });
        }, { threshold: 0.1 });
        obs.observe(el);
      });

    };

    const mainEl = document.querySelector('main');
    if (!mainEl || mainEl.classList.contains('appeared')) {
      fireSplitAnims();
    } else {
      const obs = new MutationObserver((_, o) => {
        if (mainEl.classList.contains('appeared')) {
          o.disconnect();
          fireSplitAnims();
        }
      });
      obs.observe(mainEl, { attributes: true, attributeFilter: ['class'] });
      setTimeout(() => { obs.disconnect(); fireSplitAnims(); }, 2000);
    }
  }


  // ═══════════════════════════════════════════════
  // 8. FAQ Smooth Accordion
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
  // 9. Contact Form Ajax
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
        if (res.ok) { window.location.href = '/contact/thanks.html'; }
        else throw new Error();
      } catch {
        alert('Oops! Something went wrong. Please try again.');
        submitBtn.innerText = original;
        submitBtn.disabled  = false;
      }
    });
  }

});
