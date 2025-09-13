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
        setTimeout(preloadImages, 100);
    setupImageObserver();
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


  class LocationsSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.slider = this.container;
        this.slides = this.container.children;
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dots = document.querySelectorAll('.slider-dot');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.slideWidth = 680; // 640px + 40px margin
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.updateSliderPosition(false);
        this.updateNavigation();
        this.bindEvents();
        this.setupKeyboardNavigation();
        this.setupTouchSupport();
        this.setupResizeHandler();
    }

    bindEvents() {
        // Previous button
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        
        // Next button
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dot indicators
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Optional auto-slide (uncomment if needed)
        // this.startAutoSlide();
        
        // Pause auto-slide on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    setupKeyboardNavigation() {
        // Only activate keyboard navigation when slider is focused
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Make container focusable
        this.container.setAttribute('tabindex', '0');
    }

    setupTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.container.style.transition = 'none';
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            const currentTransform = -this.currentSlide * this.slideWidth;
            
            this.slider.style.transform = `translateX(${currentTransform + deltaX}px)`;
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            isDragging = false;
            this.container.style.transition = 'transform 0.6s ease';
            
            const deltaX = currentX - startX;
            const threshold = 50;
            
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0 && this.currentSlide > 0) {
                    this.prevSlide();
                } else if (deltaX < 0 && this.currentSlide < this.totalSlides - 1) {
                    this.nextSlide();
                } else {
                    this.updateSliderPosition();
                }
            } else {
                this.updateSliderPosition();
            }
        });
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            // Adjust slide width for mobile
            if (window.innerWidth <= 768) {
                this.slideWidth = 340; // 300px + 40px margin for mobile
            } else {
                this.slideWidth = 680; // Default width
            }
            this.updateSliderPosition(false);
        });
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides - 1) return;
        
        this.isAnimating = true;
        this.currentSlide++;
        this.updateSliderPosition();
        this.updateNavigation();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    prevSlide() {
        if (this.isAnimating || this.currentSlide <= 0) return;
        
        this.isAnimating = true;
        this.currentSlide--;
        this.updateSliderPosition();
        this.updateNavigation();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    goToSlide(slideIndex) {
        if (this.isAnimating || slideIndex === this.currentSlide || slideIndex < 0 || slideIndex >= this.totalSlides) return;
        
        this.isAnimating = true;
        this.currentSlide = slideIndex;
        this.updateSliderPosition();
        this.updateNavigation();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    updateSliderPosition(animate = true) {
        const translateX = -this.currentSlide * this.slideWidth;
        
        if (animate) {
            this.slider.style.transition = 'transform 0.6s ease';
        } else {
            this.slider.style.transition = 'none';
        }
        
        this.slider.style.transform = `translateX(${translateX}px)`;
        
        // Force transition back after initial setup
        if (!animate) {
            setTimeout(() => {
                this.slider.style.transition = 'transform 0.6s ease';
            }, 50);
        }
    }

    updateNavigation() {
        // Update navigation buttons
        this.prevBtn.classList.toggle('disabled', this.currentSlide === 0);
        this.nextBtn.classList.toggle('disabled', this.currentSlide === this.totalSlides - 1);
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        // Update ARIA attributes for accessibility
        this.prevBtn.setAttribute('aria-disabled', this.currentSlide === 0);
        this.nextBtn.setAttribute('aria-disabled', this.currentSlide === this.totalSlides - 1);
    }

    startAutoSlide() {
        if (this.autoSlideInterval) return;
        
        this.autoSlideInterval = setInterval(() => {
            if (this.currentSlide >= this.totalSlides - 1) {
                this.goToSlide(0);
            } else {
                this.nextSlide();
            }
        }, 5000); // 5 second intervals
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    // Public API methods
    next() { this.nextSlide(); }
    prev() { this.prevSlide(); }
    goto(index) { this.goToSlide(index); }
    getCurrentSlide() { return this.currentSlide; }
    getTotalSlides() { return this.totalSlides; }
    
    // Destroy method for cleanup
    destroy() {
        this.pauseAutoSlide();
        // Remove event listeners if needed
        window.removeEventListener('resize', this.setupResizeHandler);
    }
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const locationsSlider = new LocationsSlider('locationsContainer');
    
    // Make slider instance globally accessible (optional)
    window.locationsSlider = locationsSlider;
});

// Get button elements
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const container = document.getElementById('locationsContainer');

let currentSlide = 0;
const totalSlides = container.children.length;
const slideWidth = 680; // Adjust based on your slide width

// Previous button click
prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
        updateButtons();
    }
});

// Next button click
nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlider();
        updateButtons();
    }
});

// Update slider position
function updateSlider() {
    const translateX = -currentSlide * slideWidth;
    container.style.transform = `translateX(${translateX}px)`;
}

// Update button states
function updateButtons() {
    prevBtn.classList.toggle('disabled', currentSlide === 0);
    nextBtn.classList.toggle('disabled', currentSlide === totalSlides - 1);
}

// Initialize
updateButtons();

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const container = document.getElementById('locationsContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Check if elements exist
    if (!container || !prevBtn || !nextBtn) {
        console.error('Required elements not found');
        return;
    }
    
    // Settings
    let currentSlide = 0;
    const totalSlides = container.children.length;
    let slideWidth = 680; // Default desktop width
    
   // Update slide width based on screen size
function updateSlideWidth() {
    if (window.innerWidth <= 768) {
        slideWidth = 320; // Mobile: 300px + 20px margin
    } else {
        slideWidth = 680; // Desktop: 640px + 40px margin  
    }
}

// Preload images function
function preloadImages() {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
        // Force image load
        const newImg = new Image();
        newImg.src = img.src;
    });
}

// Call preload after slider initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing slider code ...
    
    // Add this at the end of your DOMContentLoaded function
    setTimeout(preloadImages, 100);
});
    
    // Update slider position
    function updateSlider() {
        const translateX = -currentSlide * slideWidth;
        container.style.transform = `translateX(${translateX}px)`;
        console.log(`Moving to slide ${currentSlide}, translateX: ${translateX}px`);
    }
    
    // Update button states
    function updateButtons() {
        prevBtn.classList.toggle('disabled', currentSlide === 0);
        nextBtn.classList.toggle('disabled', currentSlide === totalSlides - 1);
        
        prevBtn.setAttribute('aria-disabled', currentSlide === 0);
        nextBtn.setAttribute('aria-disabled', currentSlide === totalSlides - 1);
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
            updateButtons();
            console.log('Previous slide:', currentSlide);
        }
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlider();
            updateButtons();
            console.log('Next slide:', currentSlide);
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Previous button clicked');
        prevSlide();
    });
    
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Next button clicked');
        nextSlide();
    });
    
// Call this in your button click handlers to debug
prevBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Previous button clicked');
    prevSlide();
    setTimeout(checkImageLoading, 100); // Check after slide
});

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateSlideWidth();
        updateSlider(); // Recalculate position
    });
    
    // Initialize
    updateSlideWidth();
    updateButtons();
    
    console.log('Slider initialized with', totalSlides, 'slides');
});

function setupImageObserver() {
    const images = document.querySelectorAll('.element-rendering-house-1, .element-rendering-house-2, .element-rendering-house-3');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before the image comes into view
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}
// Add this JavaScript to your script.js file - WORKING VERSION

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, looking for scroll arrow...');
    
    // Find the scroll arrow element
    const scrollArrow = document.querySelector('.scroll-down-arrow');
    
    if (scrollArrow) {
        console.log('Scroll arrow found!');
        
        // Remove the href to prevent default anchor behavior
        scrollArrow.removeAttribute('href');
        
        // Add click event listener
        scrollArrow.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Scroll arrow clicked!');
            
            // Get the hero banner section (where video background starts)
            const heroBanner = document.querySelector('.hero-banner');
            const stickyHeader = document.querySelector('.group-18');
            
            if (heroBanner) {
                // Calculate scroll position
                const headerHeight = stickyHeader ? stickyHeader.offsetHeight : 67;
                const targetPosition = heroBanner.offsetTop - headerHeight - 20;
                
                console.log('Scrolling to position:', targetPosition);
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Fallback: scroll down one viewport height
                const viewportHeight = window.innerHeight;
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = currentScroll + viewportHeight - 100;
                
                console.log('Fallback scroll to:', targetPosition);
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Add hover effect styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .scroll-down-arrow {
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .scroll-down-arrow:hover {
                background-color: #ff6613 !important;
                border-color: #ff6613 !important;
                transform: scale(1.1) !important;
            }
            
            .scroll-down-arrow:hover svg {
                stroke: white !important;
            }
            
            .scroll-down-arrow svg {
                transition: stroke 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
        
    } else {
        console.log('Scroll arrow not found!');
    }
});

// Alternative simpler version - use this if the above doesn't work
function initScrollArrow() {
    // Wait a bit for page to fully load
    setTimeout(function() {
        const arrow = document.querySelector('.scroll-down-arrow');
        
        if (arrow) {
            arrow.onclick = function(e) {
                e.preventDefault();
                
                // Simple scroll down by 800px (approximate hero section height)
                window.scrollTo({
                    top: 900,
                    behavior: 'smooth'
                });
                
                return false;
            };
            
            console.log('Simple scroll arrow initialized');
        }
    }, 500);
}

// Initialize both methods
initScrollArrow();
// TESTIMONIALS NAVIGATION JAVASCRIPT - ADD TO YOUR script.js

document.addEventListener('DOMContentLoaded', function() {
    // Testimonials slider functionality
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    const testimonialPrevBtn = document.getElementById('testimonialPrevBtn');
    const testimonialNextBtn = document.getElementById('testimonialNextBtn');
    
    if (testimonialsContainer && testimonialPrevBtn && testimonialNextBtn) {
        let currentTestimonialSlide = 0;
        const testimonialSlides = testimonialsContainer.children;
        const totalTestimonialSlides = testimonialSlides.length;
        const testimonialSlideWidth = 604; // 564px width + 40px margin
        
        console.log('Testimonials initialized with', totalTestimonialSlides, 'slides');
        
        // Update slider position
        function updateTestimonialsSlider() {
            const translateX = -currentTestimonialSlide * testimonialSlideWidth;
            testimonialsContainer.style.transform = `translateX(${translateX}px)`;
            console.log(`Testimonials moving to slide ${currentTestimonialSlide}, translateX: ${translateX}px`);
        }
        
        // Update button states
        function updateTestimonialButtons() {
            testimonialPrevBtn.classList.toggle('disabled', currentTestimonialSlide === 0);
            testimonialNextBtn.classList.toggle('disabled', currentTestimonialSlide === totalTestimonialSlides - 1);
            
            testimonialPrevBtn.setAttribute('aria-disabled', currentTestimonialSlide === 0);
            testimonialNextBtn.setAttribute('aria-disabled', currentTestimonialSlide === totalTestimonialSlides - 1);
        }
        
        // Previous slide
        function prevTestimonialSlide() {
            if (currentTestimonialSlide > 0) {
                currentTestimonialSlide--;
                updateTestimonialsSlider();
                updateTestimonialButtons();
                console.log('Previous testimonial slide:', currentTestimonialSlide);
            }
        }
        
        // Next slide
        function nextTestimonialSlide() {
            if (currentTestimonialSlide < totalTestimonialSlides - 1) {
                currentTestimonialSlide++;
                updateTestimonialsSlider();
                updateTestimonialButtons();
                console.log('Next testimonial slide:', currentTestimonialSlide);
            }
        }
        
        // Event listeners
        testimonialPrevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Testimonial previous button clicked');
            prevTestimonialSlide();
        });
        
        testimonialNextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Testimonial next button clicked');
            nextTestimonialSlide();
        });
        
        // Keyboard navigation for testimonials
        document.addEventListener('keydown', function(e) {
            // Only respond when testimonial buttons are focused
            if (document.activeElement === testimonialPrevBtn || 
                document.activeElement === testimonialNextBtn) {
                
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevTestimonialSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextTestimonialSlide();
                }
            }
        });
        
        // Touch/swipe support for testimonials
        let testimonialStartX = 0;
        let testimonialCurrentX = 0;
        let testimonialIsDragging = false;

        testimonialsContainer.addEventListener('touchstart', function(e) {
            testimonialStartX = e.touches[0].clientX;
            testimonialIsDragging = true;
            testimonialsContainer.style.transition = 'none';
        }, { passive: true });

        testimonialsContainer.addEventListener('touchmove', function(e) {
            if (!testimonialIsDragging) return;
            
            testimonialCurrentX = e.touches[0].clientX;
            const deltaX = testimonialCurrentX - testimonialStartX;
            const currentTransform = -currentTestimonialSlide * testimonialSlideWidth;
            
            testimonialsContainer.style.transform = `translateX(${currentTransform + deltaX}px)`;
        }, { passive: true });

        testimonialsContainer.addEventListener('touchend', function() {
            if (!testimonialIsDragging) return;
            
            testimonialIsDragging = false;
            testimonialsContainer.style.transition = 'transform 0.6s ease';
            
            const deltaX = testimonialCurrentX - testimonialStartX;
            const threshold = 50;
            
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0 && currentTestimonialSlide > 0) {
                    prevTestimonialSlide();
                } else if (deltaX < 0 && currentTestimonialSlide < totalTestimonialSlides - 1) {
                    nextTestimonialSlide();
                } else {
                    updateTestimonialsSlider();
                }
            } else {
                updateTestimonialsSlider();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            updateTestimonialsSlider(); // Recalculate position
        });
        
        // Initialize
        updateTestimonialButtons();
        
        console.log('Testimonials slider initialized');
    } else {
        console.log('Testimonials elements not found');
    }
});