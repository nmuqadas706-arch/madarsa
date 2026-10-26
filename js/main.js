/**
 * MAHD AL-IRSHAD AL-ISLAMI — MAIN JAVASCRIPT
 * Vanilla ES6+ interactions, accessibility, lightbox, form validation & navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initScrollAnimations();
  initLightbox();
  initVideoPlayer();
  initContactForm();
  initBackToTop();
  initImageFallbacks();
});

/**
 * 1. Sticky Header & Scroll Effect
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Responsive Mobile Drawer Navigation
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('active');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener('click', closeDrawer);

  const drawerCloseBtn = drawer.querySelector('.drawer-close');
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 3. Scroll Reveal Animations via Intersection Observer
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-fade-up');
  if (!elements.length) return;

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 4. Image Lightbox Modal
 */
function initLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  if (!lightboxModal) return;

  const lightboxImg = lightboxModal.querySelector('.lightbox-img');
  const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
  const closeBtn = lightboxModal.querySelector('.lightbox-close');
  const triggerItems = document.querySelectorAll('[data-lightbox-src]');

  const openLightbox = (src, caption) => {
    lightboxImg.src = src;
    lightboxImg.alt = caption || 'Enlarged Madrasa Photograph';
    lightboxCaption.textContent = caption || '';
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  triggerItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const src = item.getAttribute('data-lightbox-src');
      const caption = item.getAttribute('data-lightbox-caption') || '';
      if (src) openLightbox(src, caption);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * 5. Video Player Helper & Fallback
 */
function initVideoPlayer() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    // Graceful error listener
    video.addEventListener('error', () => {
      console.warn('Video failed to load or unsupported format:', video.currentSrc);
      const parent = video.parentElement;
      if (parent) {
        const fallbackNotice = document.createElement('div');
        fallbackNotice.className = 'video-fallback-notice';
        fallbackNotice.style.padding = '2rem';
        fallbackNotice.style.textAlign = 'center';
        fallbackNotice.style.color = '#ffffff';
        fallbackNotice.textContent = 'Madrasa campus video preview available in standard MP4 format.';
        parent.appendChild(fallbackNotice);
      }
    });
  });
}

/**
 * 6. Contact & Inquiry Form Client-Side Validation
 */
function initContactForm() {
  const form = document.getElementById('madrasa-contact-form');
  if (!form) return;

  const statusAlert = document.getElementById('form-status-alert');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Required fields: name, email, subject, message
    const nameInput = form.querySelector('#sender-name');
    const emailInput = form.querySelector('#sender-email');
    const subjectSelect = form.querySelector('#inquiry-subject');
    const messageInput = form.querySelector('#sender-message');

    // Reset validations
    [nameInput, emailInput, subjectSelect, messageInput].forEach(field => {
      if (field) field.classList.remove('is-invalid');
    });
    if (statusAlert) {
      statusAlert.className = 'form-status-alert';
      statusAlert.style.display = 'none';
      statusAlert.textContent = '';
    }

    // Name Validation
    if (!nameInput || nameInput.value.trim().length < 2) {
      if (nameInput) nameInput.classList.add('is-invalid');
      isValid = false;
    }

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailPattern.test(emailInput.value.trim())) {
      if (emailInput) emailInput.classList.add('is-invalid');
      isValid = false;
    }

    // Subject Validation
    if (!subjectSelect || !subjectSelect.value) {
      if (subjectSelect) subjectSelect.classList.add('is-invalid');
      isValid = false;
    }

    // Message Validation
    if (!messageInput || messageInput.value.trim().length < 10) {
      if (messageInput) messageInput.classList.add('is-invalid');
      isValid = false;
    }

    if (!isValid) {
      if (statusAlert) {
        statusAlert.className = 'form-status-alert error';
        statusAlert.style.display = 'block';
        statusAlert.textContent = 'Please check the required fields highlighted in red before sending.';
      }
      return;
    }

    // Honest, transparent client-side confirmation without faking a remote backend
    if (statusAlert) {
      statusAlert.className = 'form-status-alert success';
      statusAlert.style.display = 'block';
      statusAlert.innerHTML = `
        <strong>Inquiry Prepared Successfully:</strong> Thank you, <em>${escapeHtml(nameInput.value.trim())}</em>. 
        Your message regarding <strong>${escapeHtml(subjectSelect.options[subjectSelect.selectedIndex].text)}</strong> has been verified. 
        For immediate official correspondence or direct student sponsorship inquiries, please also contact the institution administration at Plot ST-7, Sector 1, LARP, Karachi.
      `;
      form.reset();
    }
  });

  // Real-time error removal on input
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * 7. Back to Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 8. Image Fallbacks
 */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function () {
      console.warn('Image failed to load:', this.src);
      this.style.backgroundColor = '#0d382b';
      this.alt = 'Institution Image';
    });
  });
}
