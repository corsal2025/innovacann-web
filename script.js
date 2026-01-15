// ================================
// INNOVACANN - Minimal JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function () {

    // Age Verification Modal
    const ageModal = document.getElementById('age-modal');
    const ageYes = document.getElementById('age-yes');
    const ageNo = document.getElementById('age-no');

    // Check if user already verified
    if (localStorage.getItem('ageVerified') === 'true') {
        ageModal.classList.add('hidden');
    }

    ageYes?.addEventListener('click', function () {
        localStorage.setItem('ageVerified', 'true');
        ageModal.classList.add('hidden');
    });

    ageNo?.addEventListener('click', function () {
        window.location.href = 'https://www.google.com';
    });

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileToggle?.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission - Real API
    const form = document.getElementById('registration-form');

    form?.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.phone) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }

        if (!data.terms) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        try {
            // Register user via API
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password || 'TempPass123!', // Generate temp password if not provided
                phone: data.phone,
                medicalCondition: data.condition || ''
            };

            await api.auth.register(userData);

            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Solicitud Enviada!';
            submitBtn.style.backgroundColor = '#10B981';
            form.reset();

            // Show success message
            alert('¡Gracias por tu solicitud! Te contactaremos pronto para continuar el proceso de inscripción.');

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            alert('Error: ' + error.message);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections for animation
    const animatedElements = document.querySelectorAll(
        '.mission-card, .service-card, .product-card, .blog-card, ' +
        '.about-content, .contact-info, .contact-hours, .contact-map, ' +
        '.registration-info, .registration-form, .section-header, ' +
        '.hero-stats, .hero-badge'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`;
        observer.observe(el);
    });

    // Animated counter for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    function animateCounter(el) {
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[0]);
        const suffix = text.replace(match[0], '');
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }

});
