// Testimonial Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  const cardsPerPage = 3; // Number of cards per slide/page
  
  // Only run testimonial slider code if all elements exist
  if (track && cards.length > 0 && dots.length > 0 && prevBtn && nextBtn) {
    let currentIndex = 0;
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
      // Disable/enable buttons at ends
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === totalPages - 1;
      prevBtn.classList.toggle('disabled', currentIndex === 0);
      nextBtn.classList.toggle('disabled', currentIndex === totalPages - 1);
    }

    function nextSlide() {
      if (currentIndex < totalPages - 1) {
        currentIndex++;
        updateCarousel();
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    // Auto-advance slides every 5 seconds, but stop at last card
    let autoSlideInterval = setInterval(() => {
      if (currentIndex < totalPages - 1) {
        nextSlide();
      } else {
        clearInterval(autoSlideInterval);
      }
    }, 5000);

    // Pause auto-advance when hovering over the carousel
    track.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });

    track.addEventListener('mouseleave', () => {
      if (currentIndex < totalPages - 1) {
        autoSlideInterval = setInterval(() => {
          if (currentIndex < totalPages - 1) {
            nextSlide();
          } else {
            clearInterval(autoSlideInterval);
          }
        }, 5000);
      }
    });

    // Initial state
    updateCarousel();
  }

  const hamburger = document.querySelector('.hamburger');
  const navCenter = document.querySelector('.nav-center');
  const overlay = document.querySelector('.navbar-menu-overlay');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-buttons a, .login-btn a');

  // Only run if all navbar elements exist
  if (hamburger && navCenter && overlay && navLinks.length > 0) {
    hamburger.addEventListener('click', function() {
      navCenter.classList.toggle('open');
      hamburger.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function() {
      navCenter.classList.remove('open');
      hamburger.classList.remove('open');
      overlay.classList.remove('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          navCenter.classList.remove('open');
          hamburger.classList.remove('open');
          overlay.classList.remove('active');
          const href = link.getAttribute('href');
          if (href && href.startsWith('#') && href.length > 1) {
            // Only smooth scroll for real anchor links (not just "#")
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
              }, 300);
            }
          } else if (href && href !== '' && href !== '#') {
            // For normal links, add a tiny delay to allow menu to close before navigating
            e.preventDefault();
            setTimeout(() => {
              window.location.href = href;
            }, 300);
          } else {
            // If href is "#" or empty, just close the menu and do nothing else
            e.preventDefault();
          }
        }
      });
    });
  }
});

if (document.getElementById('incomeForm')) {
  const commissionRates = {
    aeps: 15,
    moneytransfer: 15,
    microatm: 10,
    indonepal: 15,
    airticket: 75,
    irctc_ac: 40,
    irctc_nonac: 20,
    bus: 7,
    billpay: 5,
    recharge: 12,
    lic: 10,
    vehicleins: 180,
    shopins: 152,
    accins: 21,
    pancard: 3,
    incomecert: 20,
    castecert: 20,
    domicilecert: 20
  };
  const serviceLabels = {
    aeps: 'Aadhaar ATM / AePS',
    microatm: 'Micro ATM',
    moneytransfer: 'Money Transfer',
    indonepal: 'Indo Nepal IMT',
    airticket: 'Air Ticketing',
    irctc_ac: 'IRCTC AC Tickets',
    irctc_nonac: 'IRCTC Non-AC Tickets',
    bus: 'Bus Ticketing',
    billpay: 'Bill Payment',
    recharge: 'Mobile & DTH Recharge',
    lic: 'LIC Premium Payment',
    vehicleins: 'Vehicle Insurance',
    shopins: 'Shop Insurance',
    accins: 'Accidental Insurance',
    pancard: 'Pan Card',
    incomecert: 'Income Certificate',
    castecert: 'Caste Certificate',
    domicilecert: 'Domicile Certificate'
  };
  const form = document.getElementById('incomeForm');
  const summaryList = document.getElementById('incomeSummaryList');
  const perDay = document.getElementById('incomePerDay');
  const perMonth = document.getElementById('incomePerMonth');

  function updateIncome() {
    let total = 0;
    let summaryHTML = '';
    for (const key in commissionRates) {
      const input = form.elements[key];
      if (!input) continue;
      const count = parseInt(input.value, 10) || 0;
      const comm = commissionRates[key];
      const amount = count * comm;
      summaryHTML += `<li><span class='summary-label'>${serviceLabels[key]}</span><span>₹${amount}</span></li>`;
      total += amount;
    }
    summaryList.innerHTML = summaryHTML;
    perDay.textContent = `₹${total.toLocaleString()}`;
    perMonth.textContent = `₹${(total * 30).toLocaleString()}`;
  }

  form.addEventListener('input', updateIncome);
  updateIncome();
} 