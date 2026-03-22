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
                const start = window.scrollY;
                const distance = offsetTop - start;
                const duration = 300;
                let startTime = null;
                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                    window.scrollTo(0, start + distance * ease);
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            }
        });
    });

    // File upload - show filename
    const fileInputs = document.querySelectorAll('.upload-card input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function () {
            const card = this.closest('.upload-card');
            const filenameEl = card.querySelector('.upload-filename');
            const uploadArea = card.querySelector('.upload-area');
            if (this.files.length > 0) {
                filenameEl.textContent = this.files[0].name;
                uploadArea.classList.add('has-file');
            } else {
                filenameEl.textContent = '';
                uploadArea.classList.remove('has-file');
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
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
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
        el.style.transform = 'translateY(20px)';
        const delay = el.classList.contains('section-header') ? 0 : index * 0.03;
        el.style.transition = `all 0.25s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;
        observer.observe(el);
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            scrollTopBtn?.classList.add('visible');
        } else {
            scrollTopBtn?.classList.remove('visible');
        }
    });
    scrollTopBtn?.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Load blog news from RSS feed
    loadBlogNews();

    // Load gallery from API
    loadGalleryFromAPI();

    // ── Blog: live cannabis medical news via RSS ──────────────────
    async function loadBlogNews() {
        const grid = document.getElementById('blog-grid');
        if (!grid) return;

        // RSS feeds de noticias cannabis medicinal (via rss2json - CORS free)
        const feeds = [
            'https://www.projectcbd.org/feed',
            'https://cannabistech.com/feed/',
            'https://www.leafly.com/news/feed.xml'
        ];
        const apiBase = 'https://api.rss2json.com/v1/api.json?count=3&rss_url=';

        const fallback = [
            {
                title: 'CBD y Ansiedad: Lo que dice la evidencia científica',
                description: 'Un análisis de los estudios más recientes sobre el uso de cannabidiol para el tratamiento de la ansiedad.',
                link: 'blog/cbd-ansiedad.html',
                pubDate: '2026-01-14',
                thumbnail: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=600&h=300&fit=crop',
                category: 'Ciencia'
            },
            {
                title: 'Cómo obtener tu receta médica de cannabis en Chile',
                description: 'Guía paso a paso para acceder legalmente a tratamientos con cannabis medicinal.',
                link: 'blog/receta-medica.html',
                pubDate: '2026-01-10',
                thumbnail: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&h=300&fit=crop',
                category: 'Legal'
            },
            {
                title: 'Microdosificación: Beneficios sin efectos intensos',
                description: 'Descubre cómo pequeñas dosis de cannabis pueden mejorar tu calidad de vida.',
                link: 'blog/microdosificacion.html',
                pubDate: '2026-01-05',
                thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop',
                category: 'Bienestar'
            }
        ];

        let articles = null;
        for (const feed of feeds) {
            try {
                const res = await fetch(apiBase + encodeURIComponent(feed));
                if (!res.ok) continue;
                const data = await res.json();
                if (data.status === 'ok' && data.items?.length) {
                    articles = data.items.slice(0, 3).map(item => ({
                        title: item.title,
                        description: stripHtml(item.description || item.content || '').slice(0, 120) + '…',
                        link: item.link,
                        pubDate: item.pubDate,
                        thumbnail: item.thumbnail || item.enclosure?.link || 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=600&h=300&fit=crop',
                        category: (item.categories?.[0] || 'Noticias')
                    }));
                    break;
                }
            } catch (e) { continue; }
        }

        renderBlog(articles || fallback);
    }

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    function renderBlog(articles) {
        const grid = document.getElementById('blog-grid');
        if (!grid) return;

        grid.innerHTML = articles.map(a => {
            const date = a.pubDate ? new Date(a.pubDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
            const isExternal = a.link.startsWith('http');
            return `
            <article class="blog-card">
                <div class="blog-image">
                    <img src="${a.thumbnail}" alt="${a.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=600&h=300&fit=crop'">
                    ${date ? `<span class="blog-date">${date}</span>` : ''}
                </div>
                <div class="blog-content">
                    <span class="blog-category">${a.category}</span>
                    <h4>${a.title}</h4>
                    <p>${a.description}</p>
                    <a href="${a.link}" class="blog-link" ${isExternal ? 'target="_blank" rel="noopener"' : ''}>
                        Leer más <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>`;
        }).join('');
    }

    async function loadGalleryFromAPI() {
        try {
            const res = await fetch('https://innovacann-api.onrender.com/api/content/gallery');
            if (!res.ok) return;
            const data = await res.json();
            const photos = Array.isArray(data.content) ? data.content : [];
            if (photos.length === 0) return;

            const grid = document.getElementById('gallery-grid');
            if (!grid) return;

            grid.innerHTML = photos.map(photo => `
                <div class="gallery-item ${photo.featured ? 'large' : ''}">
                    <img src="${photo.url}" alt="${photo.title || 'Evento Innovacann'}" loading="lazy">
                    <div class="gallery-overlay">
                        ${photo.title ? `<span class="gallery-title">${photo.title}</span>` : ''}
                        ${photo.date ? `<span class="gallery-date">${photo.date}</span>` : ''}
                    </div>
                </div>
            `).join('');
        } catch (e) {
            // Keep hardcoded fallback photos
        }
    }

});
