/* =====================================================
   INITIALIZATION & DOM READY
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.getElementById('loadingScreen').classList.add('hidden');
    }, 1500);
  
    // Initialize all features
    setupNavigation();
    setupScrollReveal();
    setupSkillChart();
    setupModalHandlers();
    setupContactForm();
    setupSmoothScroll();
    setupScrollTop();
    setupTheme();
  });
  
  /* =====================================================
     NAVIGATION & MOBILE MENU
  ===================================================== */
  function setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');
  
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
      }
    });
  }
  
  /* =====================================================
     SMOOTH SCROLL
  ===================================================== */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
  
  /* =====================================================
     SCROLL REVEAL ANIMATION
  ===================================================== */
  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
  
    const revealOnScroll = () => {
      reveals.forEach(element => {
        const top = element.getBoundingClientRect().top;
        const isVisible = top < window.innerHeight - 100;
  
        if (isVisible) {
          element.classList.add('active');
        }
      });
    };
  
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load
  }
  
  /* =====================================================
     SKILL CHART ANIMATION
  ===================================================== */
  function setupSkillChart() {
    const skillItems = document.querySelectorAll('.skill-item');
  
    const animateSkills = () => {
      skillItems.forEach(item => {
        const percent = Number(item.dataset.skill);
        const circles = item.querySelectorAll('circle.skill-progress');
        const valueDisplay = item.querySelector('.skill-value');
  
        if (circles.length > 0) {
          const circle = circles[0];
          const circumference = 2 * Math.PI * 52; // radius = 52
  
          circle.style.strokeDasharray = circumference;
          circle.style.strokeDashoffset = circumference;
  
          // Check if element is in viewport
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.top > 0) {
            // Animate offset
            const offset = circumference - (circumference * percent) / 100;
            circle.style.transition = 'stroke-dashoffset 2s ease';
            circle.style.strokeDashoffset = offset;
  
            // Animate number
            if (valueDisplay && valueDisplay.textContent === '0%') {
              let currentValue = 0;
              const increment = Math.ceil(percent / 60);
              const interval = setInterval(() => {
                currentValue += increment;
                if (currentValue >= percent) {
                  valueDisplay.textContent = percent + '%';
                  clearInterval(interval);
                } else {
                  valueDisplay.textContent = currentValue + '%';
                }
              }, 30);
            }
          }
        }
      });
    };
  
    window.addEventListener('scroll', animateSkills);
    animateSkills();
  }
  
  /* =====================================================
     MODAL HANDLERS
  ===================================================== */
  function setupModalHandlers() {
    const detailButtons = document.querySelectorAll('.detail-btn');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
  
    detailButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    });
  
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    });
  
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modals.forEach(modal => {
          modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  /* =====================================================
   CONTACT FORM - FORMSPREE
===================================================== */
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
  
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        // Get form data
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const subject = form.querySelector('input[name="subject"]').value;
        const message = form.querySelector('textarea[name="message"]').value;
  
        // Validasi
        if (!name || !email || !message) {
          showMessage('❌ Semua field harus diisi!', 'error', formMessage);
          return;
        }
  
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showMessage('❌ Email tidak valid!', 'error', formMessage);
          return;
        }
  
        try {
          // Kirim ke Formspree
          const formData = new FormData(form);
          
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
  
          if (response.ok) {
            // Reset form
            form.reset();
            
            // Tampilkan pesan sukses
            showMessage('✅ Pesan berhasil dikirim! Terima kasih telah menghubungi saya.', 'success', formMessage);
  
            // Tampilkan success modal
            setTimeout(() => {
              const successModal = document.getElementById('successModal');
              if (successModal) {
                successModal.classList.add('active');
              }
            }, 800);
  
            // Hapus pesan setelah 5 detik
            setTimeout(() => {
              formMessage.className = 'form-message';
            }, 5000);
          } else {
            showMessage('❌ Terjadi kesalahan saat mengirim pesan.', 'error', formMessage);
          }
        } catch (error) {
          console.error('Error:', error);
          showMessage('❌ Koneksi gagal. Silakan coba lagi.', 'error', formMessage);
        }
      });
    }
  }
  
  function showMessage(text, type, element) {
    element.textContent = text;
    element.className = `form-message ${type}`;
  }  
  
  /* =====================================================
     SCROLL TOP BUTTON
  ===================================================== */
  function setupScrollTop() {
    const scrollTop = document.getElementById('scrollTop');
  
    if (scrollTop) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollTop.classList.add('visible');
        } else {
          scrollTop.classList.remove('visible');
        }
      });
  
      scrollTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  /* =====================================================
     THEME TOGGLE (DARK MODE)
  ===================================================== */
  function setupTheme() {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.style.colorScheme = 'dark';
    }
  
    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
    });
  }
  
  /* =====================================================
     UTILITY FUNCTIONS
  ===================================================== */
  
  // Debounce function for performance
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  // Log page analytics
  console.log('%c Indra Wijaya - CV Website', 'font-size: 16px; color: #2563eb; font-weight: bold;');
  console.log('%c Welcome to my professional portfolio', 'font-size: 12px; color: #64748b;');