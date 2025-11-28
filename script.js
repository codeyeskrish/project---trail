document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const contactForm = document.getElementById('contactForm');



    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.counter');
                if (counter && !counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-animate="counter"]').forEach(card => {
        counterObserver.observe(card);
    });

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active')
                ? 'rotate(45deg) translate(5px, 5px)'
                : 'none';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active')
                ? 'rotate(-45deg) translate(7px, -6px)'
                : 'none';
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Carousel functionality with Infinite Loop
    let slides = document.querySelectorAll('.carousel-slide');
    const slideCount = slides.length;
    let currentSlide = 1; // Start at 1 because of clone
    let isTransitioning = false;

    if (carouselTrack && slideCount > 0) {
        // Clone first and last slides
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slideCount - 1].cloneNode(true);

        // Add clones to DOM
        carouselTrack.appendChild(firstClone);
        carouselTrack.insertBefore(lastClone, slides[0]);

        // Re-select all slides including clones
        const allSlides = document.querySelectorAll('.carousel-slide');

        // Set initial position to show the first real slide
        carouselTrack.style.transform = `translateX(-100%)`;

        function updateSlide(index, transition = true) {
            if (transition) {
                carouselTrack.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                carouselTrack.style.transition = 'none';
            }
            carouselTrack.style.transform = `translateX(-${index * 100}%)`;
            currentSlide = index;
        }

        function nextSlide() {
            if (isTransitioning) return;
            if (currentSlide >= allSlides.length - 1) return;

            isTransitioning = true;
            currentSlide++;
            updateSlide(currentSlide);
        }

        function prevSlide() {
            if (isTransitioning) return;
            if (currentSlide <= 0) return;

            isTransitioning = true;
            currentSlide--;
            updateSlide(currentSlide);
        }

        // Handle transition end to jump if needed
        carouselTrack.addEventListener('transitionend', () => {
            isTransitioning = false;

            if (allSlides[currentSlide] === firstClone) {
                // We reached the clone of the first slide (at the end)
                // Instantly jump back to the real first slide
                updateSlide(1, false);
            }
            else if (allSlides[currentSlide] === lastClone) {
                // We reached the clone of the last slide (at the start)
                // Instantly jump back to the real last slide
                updateSlide(allSlides.length - 2, false);
            }
        });

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);

            // Auto-advance only to the right
            setInterval(nextSlide, 5000);
        }
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .product-card, .value-box').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn-submit');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#2E7D32';

                setTimeout(() => {
                    contactForm.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 2000);
            }, 1500);
        });
    }

    const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    header.style.transition = 'transform 0.3s ease';

});
