// Enhanced sticky navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.group-18');
    let lastScrollTop = 0;

    // Scroll detection for visual feedback
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - header.offsetHeight - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});


  function animateCounter(element, target, duration = 3000) {
    let start = 0;
    let startTime = null;

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const value = Math.min(Math.floor(progress / duration * target), target);
      element.textContent = `${value}%`;
      if (value < target) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function initCountersOnScroll() {
    const group = document.querySelector('.group-3');
    const counters = [
      { selector: '.text-wrapper-11', target: 99 },     // Customer satisfaction
      { selector: '.text-wrapper-13', target: 56 },     // Experience agents
      { selector: '.text-wrapper-15', target: 249 }     // Total property sell
    ];

    let triggered = false;

    function checkVisibility() {
      const rect = group.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible && !triggered) {
        triggered = true;
        counters.forEach(({ selector, target }) => {
          const el = document.querySelector(selector);
          animateCounter(el, target, 3000); // 3-second smooth animation
        });
      }
    }

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('load', checkVisibility); // In case it's already visible on load
  }

  document.addEventListener('DOMContentLoaded', initCountersOnScroll);
