// Configuration
const config = {
    typingSpeed: 120,
    pauseDuration: 800,
    particleCount: {
        mobile: 25,
        desktop: 50
    }
};

// DOM Elements
const elements = {
    menuBtn: document.getElementById('menuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    particles: document.getElementById('particles'),
    typingText: document.querySelector('.typing-text'),
    typingCursor: document.querySelector('.typing-cursor'),
    contactForm: document.getElementById('contactForm'),
    backToTop: document.getElementById('backToTop')
};

// Initialize AOS
function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        offset: 120,
        once: true,
        disable: 'mobile'
    });
}

// Mobile Menu
function initMobileMenu() {
    elements.menuBtn.addEventListener('click', () => {
        elements.mobileMenu.classList.toggle('active');
        const menuIcon = elements.menuBtn.querySelector('i');
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-times');
    });

    document.addEventListener('click', (e) => {
        if (!elements.menuBtn.contains(e.target) && !elements.mobileMenu.contains(e.target)) {
            elements.mobileMenu.classList.remove('active');
            elements.menuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Particle Background
function createParticles() {
    const particleCount = window.innerWidth < 768 ? config.particleCount.mobile : config.particleCount.desktop;
    elements.particles.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.width = `${Math.random() * 3 + 2}px`;
        particle.style.height = particle.style.width;
        elements.particles.appendChild(particle);
    }
}

// Typing Animation
function initTypingAnimation() {
    const text = "Fahmy Omara";
    let charIndex = 0;
    let isTyping = false;

    function typeWriter() {
        if (!isTyping) {
            isTyping = true;
            elements.typingText.style.width = '0';
            elements.typingText.textContent = '';
            charIndex = 0;
            elements.typingCursor.style.opacity = '0.8';
            
            setTimeout(() => {
                const type = () => {
                    if (charIndex < text.length) {
                        elements.typingText.textContent += text.charAt(charIndex);
                        elements.typingText.style.width = `${(charIndex + 1) * 100 / text.length}%`;
                        charIndex++;
                        setTimeout(type, config.typingSpeed);
                    } else {
                        isTyping = false;
                        elements.typingCursor.style.animation = 'none';
                        setTimeout(() => {
                            elements.typingCursor.style.animation = 'blink 0.7s step-end infinite';
                        }, 10);
                    }
                };
                type();
            }, config.pauseDuration);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('#home'));
}

// Form Handling
function initFormHandling() {
    elements.contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.contactForm);
    const isValid = validateForm(formData);
    
    if (!isValid) return;
    
    submitForm(formData);
}

function validateForm(formData) {
    // Add validation logic here
    return true;
}

function submitForm(formData) {
    // Add form submission logic here
}

// Back to Top Button
function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }
    });

    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Testimonials Carousel
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;

    function updateCarousel() {
        const cardWidth = carousel.querySelector('.testimonial-card').offsetWidth;
        carousel.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Handle dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Handle arrow clicks
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + dots.length) % dots.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % dots.length;
        updateCarousel();
    });

    // Handle touch events
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left
                currentIndex = (currentIndex + 1) % dots.length;
            } else {
                // Swipe right
                currentIndex = (currentIndex - 1 + dots.length) % dots.length;
            }
            updateCarousel();
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initMobileMenu();
    initSmoothScroll();
    createParticles();
    initTypingAnimation();
    initFormHandling();
    initBackToTop();
    initTestimonialsCarousel();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createParticles, 250);
    });

    // Optimize for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.style.setProperty('--transition-duration', '0s');
    }

    // Optimize for touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.documentElement.classList.add('touch-device');
    }
}); 