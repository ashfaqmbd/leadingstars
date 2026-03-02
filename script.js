/* ============================================================
   THE LEADING STARS SCHOOL SYSTEM — SCRIPT.JS
   ============================================================ */

(function () {
  'use strict';

  /* ============= ANNOUNCEMENT BAR ============= */
  const closeAnn = document.getElementById('closeAnnouncement');
  const annBar = document.getElementById('announcementBar');
  if (closeAnn && annBar) {
    if (sessionStorage.getItem('ann_closed')) annBar.style.display = 'none';
    closeAnn.addEventListener('click', () => {
      annBar.style.display = 'none';
      sessionStorage.setItem('ann_closed', '1');
    });
  }

  /* ============= STICKY HEADER ============= */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ============= HAMBURGER MENU ============= */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ============= ACTIVE NAV LINK ON SCROLL ============= */
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-link:not(.btn-enroll-nav)');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ============= HERO SLIDESHOW ============= */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlideshow() {
    slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  startSlideshow();
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(i);
      startSlideshow();
    });
  });

  /* ============= COUNTER ANIMATION ============= */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  // Trigger counters when hero stats visible
  const heroStats = document.querySelector('.hero-stats');
  let countersStarted = false;
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        document.querySelectorAll('.stat-num').forEach(animateCounter);
      }
    });
  }, { threshold: 0.5 });
  if (heroStats) counterObserver.observe(heroStats);

  /* ============= SCROLL REVEAL ============= */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) * 120 : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ============= GALLERY FILTERS & LIGHTBOX ============= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentLightboxIndex = 0;
  let activeGalleryItems = [];

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });

  function openLightbox(index) {
    activeGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
    currentLightboxIndex = index;
    const target = activeGalleryItems[index];
    if (!target) return;
    const img = target.querySelector('img');
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      activeGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
      const idx = activeGalleryItems.indexOf(item);
      openLightbox(idx >= 0 ? idx : i);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    const img = activeGalleryItems[currentLightboxIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt;
  });
  lightboxNext.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % activeGalleryItems.length;
    const img = activeGalleryItems[currentLightboxIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt;
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* ============= LOAD MORE GALLERY ============= */
  const extraImages = [
    { src: 'images/464811005_9132790160104259_378397313190955710_n.jpg', alt: 'School activity', cat: 'events' },
    { src: 'images/464825370_9132790176770924_7581976390887577484_n.jpg', alt: 'Students', cat: 'students' },
    { src: 'images/470567327_1002209601714938_1972204835165824532_n.jpg', alt: 'School event', cat: 'events' },
    { src: 'images/470671025_1002209625048269_5890593511552520158_n.jpg', alt: 'Campus', cat: 'campus' },
    { src: 'images/472714774_1015459950389903_8288323678357820217_n.jpg', alt: 'Students', cat: 'students' },
    { src: 'images/474813488_9644923145557622_6767978368122878336_n.jpg', alt: 'School event', cat: 'events' },
    { src: 'images/475107777_1027682055834359_3901102728898049929_n.jpg', alt: 'Students', cat: 'students' },
    { src: 'images/464979868_9132650260118249_2884689607002222438_n.jpg', alt: 'School campus', cat: 'campus' },
  ];
  let moreLoaded = false;
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const galleryGrid = document.getElementById('galleryGrid');

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (moreLoaded) return;
      moreLoaded = true;
      extraImages.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = 'gallery-item reveal';
        item.dataset.category = img.cat;
        item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy" /><div class="gallery-overlay"><i class="fas fa-expand"></i></div>`;
        item.addEventListener('click', () => {
          activeGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
          const idx = activeGalleryItems.indexOf(item);
          openLightbox(idx >= 0 ? idx : 0);
        });
        galleryGrid.appendChild(item);
        setTimeout(() => revealObserver.observe(item), 50 * i);
      });
      loadMoreBtn.style.display = 'none';
    });
  }

  /* ============= TESTIMONIALS SLIDER ============= */
  const track = document.getElementById('testimonialsTrack');
  const testimonialCards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('testimonialDots');
  let currentTestimonial = 0;
  let testimonialsPerView = 3;
  let testimonialInterval;

  function getTestimonialsPerView() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function buildTestimonialDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = testimonialCards.length - testimonialsPerView + 1;
    for (let i = 0; i < Math.max(1, total); i++) {
      const d = document.createElement('button');
      d.className = 't-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      d.addEventListener('click', () => goToTestimonial(i));
      dotsContainer.appendChild(d);
    }
  }

  function goToTestimonial(n) {
    const maxIndex = Math.max(0, testimonialCards.length - testimonialsPerView);
    currentTestimonial = Math.max(0, Math.min(n, maxIndex));
    const cardWidth = testimonialCards[0] ? testimonialCards[0].offsetWidth + 28 : 0;
    track.style.transform = `translateX(-${currentTestimonial * cardWidth}px)`;
    dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentTestimonial);
    });
  }

  function startTestimonialAutoplay() {
    testimonialInterval = setInterval(() => {
      const max = Math.max(0, testimonialCards.length - testimonialsPerView);
      goToTestimonial(currentTestimonial >= max ? 0 : currentTestimonial + 1);
    }, 5000);
  }

  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(testimonialInterval);
      goToTestimonial(currentTestimonial - 1);
      startTestimonialAutoplay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(testimonialInterval);
      const max = Math.max(0, testimonialCards.length - testimonialsPerView);
      goToTestimonial(currentTestimonial >= max ? 0 : currentTestimonial + 1);
      startTestimonialAutoplay();
    });
  }

  function initTestimonials() {
    testimonialsPerView = getTestimonialsPerView();
    buildTestimonialDots();
    goToTestimonial(0);
    clearInterval(testimonialInterval);
    startTestimonialAutoplay();
  }

  initTestimonials();
  window.addEventListener('resize', () => {
    testimonialsPerView = getTestimonialsPerView();
    buildTestimonialDots();
    goToTestimonial(0);
  });

  /* ============= ADMISSION FORM ============= */
  const admissionForm = document.getElementById('admissionForm');
  const formSuccess = document.getElementById('formSuccess');

  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
  }

  function clearErrors() {
    ['studentName', 'parentName', 'classApplying', 'contactNumber'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });
    ['studentNameError', 'parentNameError', 'classApplyingError', 'contactNumberError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  if (admissionForm) {
    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();
      let valid = true;

      const studentName = document.getElementById('studentName').value.trim();
      const parentName = document.getElementById('parentName').value.trim();
      const classApplying = document.getElementById('classApplying').value;
      const contactNumber = document.getElementById('contactNumber').value.trim();

      if (!studentName || studentName.length < 2) {
        showError('studentName', 'studentNameError', 'Please enter the student\'s full name.');
        valid = false;
      }
      if (!parentName || parentName.length < 2) {
        showError('parentName', 'parentNameError', 'Please enter the parent\'s name.');
        valid = false;
      }
      if (!classApplying) {
        showError('classApplying', 'classApplyingError', 'Please select a class.');
        valid = false;
      }
      if (!contactNumber || !/^[0-9+\-\s]{10,15}$/.test(contactNumber)) {
        showError('contactNumber', 'contactNumberError', 'Please enter a valid contact number.');
        valid = false;
      }

      if (!valid) return;

      // Simulate form submission
      const submitBtn = admissionForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        admissionForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1500);
    });

    // Real-time validation clearing
    admissionForm.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        const errEl = document.getElementById(el.id + 'Error');
        if (errEl) errEl.textContent = '';
      });
    });
  }

  /* ============= BACK TO TOP ============= */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============= SMOOTH SCROLL FOR ALL ANCHORS ============= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============= PROGRAM CARDS STAGGER REVEAL ============= */
  document.querySelectorAll('.program-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  /* ============= WHATSAPP FLOAT PULSE ============= */
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    setTimeout(() => {
      waFloat.style.animation = 'waPulse 2s ease-in-out 3';
    }, 3000);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes waPulse {
      0%, 100% { box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5); }
      50% { box-shadow: 0 6px 30px rgba(37, 211, 102, 0.9), 0 0 0 12px rgba(37, 211, 102, 0.15); }
    }
  `;
  document.head.appendChild(style);

})();
