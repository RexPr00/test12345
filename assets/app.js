document.addEventListener('DOMContentLoaded', () => {
  const focusables = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  const lockBody = () => document.body.classList.add('no-scroll');
  const unlockBody = () => {
    if (!document.querySelector('.drawer.open') && !document.querySelector('.modal-backdrop.open')) {
      document.body.classList.remove('no-scroll');
    }
  };

  const trapFocus = (container, event) => {
    const items = [...container.querySelectorAll(focusables)].filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  document.querySelectorAll('.lang-picker').forEach((picker) => {
    const btn = picker.querySelector('.lang-btn');
    btn?.addEventListener('click', () => picker.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!picker.contains(e.target)) picker.classList.remove('open');
    });
  });

  const drawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('burgerBtn');
  const closeBtn = document.getElementById('drawerClose');
  const openDrawer = () => {
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    lockBody();
    drawer.querySelector('a, button')?.focus();
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    unlockBody();
    openBtn?.focus();
  };
  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  const modalBackdrop = document.getElementById('privacyModalBackdrop');
  const openPrivacy = document.querySelectorAll('[data-open-privacy]');
  const closePrivacyBtns = document.querySelectorAll('[data-close-privacy]');
  const openModal = () => {
    modalBackdrop.classList.add('open');
    lockBody();
    modalBackdrop.querySelector('.modal-close-x')?.focus();
  };
  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    unlockBody();
  };
  openPrivacy.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  closePrivacyBtns.forEach(btn => btn.addEventListener('click', closeModal));
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer.classList.contains('open')) closeDrawer();
      if (modalBackdrop.classList.contains('open')) closeModal();
    }
    if (e.key === 'Tab') {
      if (drawer.classList.contains('open')) trapFocus(drawer, e);
      if (modalBackdrop.classList.contains('open')) trapFocus(modalBackdrop.querySelector('.modal'), e);
    }
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const opened = document.querySelector('.faq-item.open');
      if (opened && opened !== item) opened.classList.remove('open');
      item.classList.toggle('open');
    });
  });

  document.querySelectorAll('.lead-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-confirm');
      msg.classList.add('show');
      msg.textContent = 'After you sign up, you get instant access to the next steps. We may send a short email to confirm your details.';
      form.reset();
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
});
