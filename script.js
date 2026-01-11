/* =====================================================
   SMOOTH SCROLL (SAFE)
===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  /* =====================================================
     SCROLL REVEAL (ANTI MEMUDAR)
  ===================================================== */
  const reveals = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 120) {
        el.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
   
  /* =====================================================
     MODAL HANDLER (NO LEAK, NO FREEZE)
  ===================================================== */
  const detailButtons = document.querySelectorAll('.detail-btn');
  const modals = document.querySelectorAll('.modal');
  
  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modal);
      if (!modal) return;
  
      modal.classList.add('active');
  
      // stagger animation
      const list = modal.querySelector('.stagger');
      if (list) {
        list.classList.remove('active');
        setTimeout(() => list.classList.add('active'), 100);
      }
    });
  });
  
  modals.forEach(modal => {
    modal.addEventListener('click', e => {
      if (
        e.target === modal ||
        e.target.classList.contains('modal-close')
      ) {
        modal.classList.remove('active');
      }
    });
  });

/* =====================================================
   SKILL CHART + NUMBER COUNT (RELOAD ON VIEW)
===================================================== */
const skillItems = document.querySelectorAll('.skill-item');

const animateSkill = item => {
  const percent = Number(item.dataset.skill);
  const circles = item.querySelectorAll('circle');
  const number = item.querySelector('.skill-value');
  if (circles.length < 2 || !number) return;

  // reset
  const progress = circles[1];
  const circumference = 327;
  progress.style.strokeDasharray = circumference;
  progress.style.strokeDashoffset = circumference;
  number.textContent = '0%';

  // circle progress animasi
  setTimeout(() => {
    const offset = circumference - (circumference * percent) / 100;
    progress.style.strokeDashoffset = offset;
  }, 100);

  // number count animasi
  let current = 0;
  const step = Math.ceil(percent / 40);
  const counter = setInterval(() => {
    current += step;
    if (current >= percent) {
      number.textContent = percent + '%';
      clearInterval(counter);
    } else {
      number.textContent = current + '%';
    }
  }, 20);
};

/* trigger skill animasi setiap scroll ke skill section */
const revealSkills = () => {
  skillItems.forEach(item => {
    const top = item.getBoundingClientRect().top;
    if (top < window.innerHeight - 120) {
      animateSkill(item);
    }
  });
};

window.addEventListener('scroll', revealSkills);
window.addEventListener('load', revealSkills);

