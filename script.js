// ============================================================
// INNOVACANN — Lógica del sitio
// Verificación de edad · navegación · canales de contacto ·
// asistente de inscripción multi-paso con autoguardado
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    var CFG = window.INNOVACANN || {};
    var DRAFT_KEY = 'innovacann_draft_v1';

    // ── Canales de contacto (desde config.js) ────────────────
    var channelLinks = {
        whatsapp: 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(CFG.mensajeContacto || ''),
        instagram: 'https://instagram.com/' + CFG.instagram,
        email: 'mailto:' + CFG.email
    };

    document.querySelectorAll('[data-channel]').forEach(function (el) {
        var url = channelLinks[el.dataset.channel];
        if (url) el.href = url;
    });

    var phoneLabel = document.getElementById('contact-phone-label');
    if (phoneLabel && CFG.whatsapp) phoneLabel.textContent = formatChileanPhone(CFG.whatsapp);
    var igLabel = document.getElementById('contact-ig-label');
    if (igLabel && CFG.instagram) igLabel.textContent = '@' + CFG.instagram;
    var emailLabel = document.getElementById('contact-email-label');
    if (emailLabel && CFG.email) emailLabel.textContent = CFG.email;

    function formatChileanPhone(digits) {
        // 56978900761 -> +56 9 7890 0761
        var m = String(digits).match(/^56(9)(\d{4})(\d{4})$/);
        return m ? '+56 ' + m[1] + ' ' + m[2] + ' ' + m[3] : '+' + digits;
    }

    // ── Verificación de edad ─────────────────────────────────
    var ageModal = document.getElementById('age-modal');
    var ageYes = document.getElementById('age-yes');
    var ageNo = document.getElementById('age-no');

    if (localStorage.getItem('ageVerified') === 'true') {
        ageModal.classList.add('hidden');
    } else {
        ageYes.focus();
    }

    ageYes.addEventListener('click', function () {
        localStorage.setItem('ageVerified', 'true');
        ageModal.classList.add('hidden');
    });
    ageNo.addEventListener('click', function () {
        window.location.href = 'https://www.google.com';
    });

    // Mantener el foco dentro del modal mientras esté abierto (es una puerta bloqueante)
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || ageModal.classList.contains('hidden')) return;
        var focusables = [ageYes, ageNo];
        var idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey ? (idx <= 0 ? focusables.length - 1 : idx - 1) : (idx === focusables.length - 1 ? 0 : idx + 1);
        focusables[next].focus();
    });

    // ── Menú móvil ───────────────────────────────────────────
    var mobileToggle = document.getElementById('mobile-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    mobileToggle.addEventListener('click', function () {
        var open = mobileMenu.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileToggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.querySelector('i').className = 'fas fa-bars';
        });
    });

    // ── Sombra del navbar al hacer scroll ────────────────────
    var navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ── Scroll suave para anclas ─────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
            }
        });
    });

    // ── Animaciones de entrada ───────────────────────────────
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

        var animated = document.querySelectorAll(
            '.section-header, .about-content, .about-image, .step-card, ' +
            '.wizard, .contact-card, .hero-content, .hero-visual, ' +
            '.benefit-card, .testimonial-card, .stats-strip'
        );
        animated.forEach(function (el) {
            el.classList.add('pre-animate');
            observer.observe(el);
        });

        // Failsafe: si el observer no se dispara (saltos por ancla, navegadores
        // antiguos), nada puede quedar invisible
        setTimeout(function () {
            animated.forEach(function (el) { el.classList.add('animate-in'); });
        }, 2500);
    }

    // ── Stats Counter Animation ──────────────────────────────
    var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
                statNumbers.forEach(function (el) {
                    animateCounter(el);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector('.stats-strip');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-target'));
        var duration = 2000; // 2 seconds
        var start = 0;
        var startTime = null;

        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function for smooth animation
            var easeOutQuart = 1 - Math.pow(1 - progress, 4);
            var current = Math.floor(easeOutQuart * target);
            
            element.textContent = current + (target >= 100 ? '+' : '+');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
                element.classList.add('counting');
                setTimeout(function () {
                    element.classList.remove('counting');
                }, 300);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ── Parallax effect for hero section ─────────────────────
    var heroSection = document.querySelector('.hero');
    if (heroSection && !reduceMotion) {
        window.addEventListener('scroll', function () {
            var scrolled = window.pageYOffset;
            var heroVisual = document.querySelector('.hero-visual');
            if (heroVisual && scrolled < 800) {
                heroVisual.style.transform = 'translateY(' + (scrolled * 0.1) + 'px)';
            }
        }, { passive: true });
    }

    // ── Smooth reveal for sections ───────────────────────────
    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(function (section) {
        if (!reduceMotion) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            sectionObserver.observe(section);
        }
    });

    // ════════════════════════════════════════════════════════
    //  ASISTENTE DE INSCRIPCIÓN
    // ════════════════════════════════════════════════════════
    var form = document.getElementById('registration-form');
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll('.wizard-step'));
    var TOTAL = steps.length;
    var current = 1;
    var wizardReady = false; // evita que la carga inicial pise el borrador guardado

    var btnPrev = document.getElementById('wizard-prev');
    var btnNext = document.getElementById('wizard-next');
    var btnSubmit = document.getElementById('wizard-submit');
    var countEl = document.getElementById('wizard-count');
    var barFill = document.getElementById('wizard-bar-fill');
    var labels = document.querySelectorAll('.wizard-label');
    var summaryEl = document.getElementById('wizard-summary');
    var successEl = document.getElementById('wizard-success');
    var draftBox = document.getElementById('wizard-draft');

    // ── Formateo automático de RUT ───────────────────────────
    var rutInput = document.getElementById('rut');
    var rutHint = document.getElementById('rut-hint');

    rutInput.addEventListener('input', function () {
        var clean = this.value.replace(/[^0-9kK]/g, '').toUpperCase().slice(0, 9);
        this.value = formatRut(clean);
        if (clean.length >= 8) {
            var ok = validateRut(clean);
            rutHint.textContent = ok ? '✓ RUT válido' : 'Revisa el dígito verificador';
            rutHint.className = 'field-hint ' + (ok ? 'hint-ok' : 'hint-bad');
        } else {
            rutHint.textContent = '';
        }
    });

    function formatRut(clean) {
        if (clean.length < 2) return clean;
        var body = clean.slice(0, -1);
        var dv = clean.slice(-1);
        return body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
    }

    function validateRut(clean) {
        if (clean.length < 8) return false;
        var body = clean.slice(0, -1);
        var dv = clean.slice(-1);
        var sum = 0, mul = 2;
        for (var i = body.length - 1; i >= 0; i--) {
            sum += parseInt(body[i], 10) * mul;
            mul = mul === 7 ? 2 : mul + 1;
        }
        var res = 11 - (sum % 11);
        var expected = res === 11 ? '0' : res === 10 ? 'K' : String(res);
        return dv === expected;
    }

    // ── Formateo automático de teléfono ──────────────────────
    var phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', function () {
        var digits = this.value.replace(/\D/g, '');
        if (digits.startsWith('56')) digits = digits.slice(2);
        if (digits.length === 9 && digits[0] === '9') {
            this.value = '+56 ' + digits[0] + ' ' + digits.slice(1, 5) + ' ' + digits.slice(5);
        }
    });

    // ── Edad mínima en fecha de nacimiento ───────────────────
    var birthInput = document.getElementById('birthdate');
    var birthHint = document.getElementById('birthdate-hint');
    var today = new Date();
    var maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    birthInput.max = maxDate.toISOString().split('T')[0];
    birthInput.min = '1920-01-01';

    birthInput.addEventListener('change', function () {
        if (!this.value) { birthHint.textContent = ''; return; }
        var adult = isAdult(this.value);
        birthHint.textContent = adult ? '' : 'Debes ser mayor de 18 años para inscribirte';
        birthHint.className = 'field-hint ' + (adult ? '' : 'hint-bad');
    });

    function isAdult(dateStr) {
        var birth = new Date(dateStr + 'T00:00:00');
        if (isNaN(birth)) return false;
        var cutoff = new Date(birth.getFullYear() + 18, birth.getMonth(), birth.getDate());
        return cutoff <= new Date();
    }

    // ── Panel del paso 3 según tipo de membresía ─────────────
    var healthPanel = document.getElementById('health-panel');
    var memberPanel = document.getElementById('member-panel');

    form.querySelectorAll('input[name="membershipType"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            markSelectedChoice();
            applyMembershipPanels();
            // Avance automático con una pequeña pausa para ver la selección
            if (current === 1) setTimeout(function () { goTo(2); }, 350);
        });
    });

    // Respaldo de :has() para navegadores antiguos
    function markSelectedChoice() {
        form.querySelectorAll('.choice-card').forEach(function (card) {
            card.classList.toggle('selected', card.querySelector('input').checked);
        });
    }

    function applyMembershipPanels() {
        var type = getValue('membershipType');
        var healthOnly = type === 'Socio';
        healthPanel.hidden = healthOnly;
        memberPanel.hidden = !healthOnly;
    }

    // ── Navegación entre pasos ───────────────────────────────
    btnNext.addEventListener('click', function () {
        if (!validateStep(current)) return;
        goTo(current + 1);
    });

    btnPrev.addEventListener('click', function () {
        goTo(current - 1);
    });

    function goTo(step) {
        if (step < 1 || step > TOTAL) return;
        clearError(current);
        current = step;

        steps.forEach(function (fs) {
            fs.classList.toggle('active', Number(fs.dataset.step) === current);
        });
        labels.forEach(function (lb) {
            var n = Number(lb.dataset.label);
            lb.classList.toggle('active', n === current);
            lb.classList.toggle('done', n < current);
        });

        barFill.style.width = ((current - 1) / (TOTAL - 1) * 100) + '%';
        countEl.textContent = 'Paso ' + current + ' de ' + TOTAL;
        btnPrev.hidden = current === 1;
        btnNext.hidden = current === TOTAL;
        btnSubmit.hidden = current !== TOTAL;

        if (current === 3) applyMembershipPanels();
        if (current === TOTAL) renderSummary();

        saveDraft();

        var wizardTop = document.getElementById('wizard').offsetTop - 90;
        if (window.scrollY > wizardTop) window.scrollTo({ top: wizardTop, behavior: 'smooth' });
    }

    // ── Validación por paso ──────────────────────────────────
    function validateStep(step) {
        clearError(step);

        if (step === 1) {
            if (!getValue('membershipType')) {
                return showError(1, 'Elige cómo te gustaría participar para continuar.');
            }
        }

        if (step === 2) {
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var comuna = document.getElementById('comuna').value.trim();
            var phoneDigits = phoneInput.value.replace(/\D/g, '');
            var rutClean = rutInput.value.replace(/[^0-9kK]/g, '').toUpperCase();

            if (name.length < 5 || name.split(/\s+/).length < 2) {
                return showError(2, 'Escribe tu nombre y apellido completos.');
            }
            if (!validateRut(rutClean)) {
                return showError(2, 'El RUT no es válido. Revisa el dígito verificador.');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showError(2, 'Escribe un correo electrónico válido.');
            }
            if (phoneDigits.length < 9) {
                return showError(2, 'Escribe un teléfono válido, por ejemplo +56 9 1234 5678.');
            }
            if (!birthInput.value || !isAdult(birthInput.value)) {
                return showError(2, 'Debes indicar tu fecha de nacimiento y ser mayor de 18 años.');
            }
            if (!comuna) {
                return showError(2, 'Indica tu comuna o ciudad.');
            }
        }

        if (step === 3) {
            var type = getValue('membershipType');
            if (type !== 'Socio') {
                if (!getValue('condition')) {
                    return showError(3, 'Selecciona el motivo principal de uso medicinal.');
                }
                if (!getValue('receta')) {
                    return showError(3, 'Cuéntanos si tienes receta médica (puedes marcar "Aún no").');
                }
            }
        }

        if (step === 4) {
            if (!document.getElementById('terms').checked || !document.getElementById('truth').checked) {
                return showError(4, 'Debes aceptar ambas declaraciones para enviar tu solicitud.');
            }
        }

        return true;
    }

    function showError(step, msg) {
        var el = form.querySelector('[data-error-for="' + step + '"]');
        el.textContent = msg;
        el.hidden = false;
        return false;
    }

    function clearError(step) {
        var el = form.querySelector('[data-error-for="' + step + '"]');
        if (el) { el.hidden = true; el.textContent = ''; }
    }

    function getValue(nameAttr) {
        var field = form.elements[nameAttr];
        if (!field) return '';
        if (field instanceof RadioNodeList || field.type === 'radio') return field.value || '';
        if (field.type === 'checkbox') return field.checked;
        return (field.value || '').trim();
    }

    function getInterests() {
        return Array.prototype.slice.call(form.querySelectorAll('input[name="interests"]:checked'))
            .map(function (c) { return c.value; });
    }

    // ── Resumen (paso 4) ─────────────────────────────────────
    function renderSummary() {
        var type = getValue('membershipType');
        var rows = [
            ['Tipo de membresía', type],
            ['Nombre', getValue('name')],
            ['RUT', getValue('rut')],
            ['Correo', getValue('email')],
            ['Teléfono', getValue('phone')],
            ['Nacimiento', formatDate(getValue('birthdate'))],
            ['Comuna', getValue('comuna')]
        ];

        if (type === 'Socio') {
            var interests = getInterests();
            if (interests.length) rows.push(['Áreas de interés', interests.join(', ')]);
            if (getValue('memberNotes')) rows.push(['Motivación', getValue('memberNotes')]);
        } else {
            rows.push(['Motivo de uso', getValue('condition')]);
            if (getValue('experience')) rows.push(['Experiencia', getValue('experience')]);
            rows.push(['Receta médica', getValue('receta')]);
            if (getValue('healthNotes')) rows.push(['Observaciones', getValue('healthNotes')]);
        }

        summaryEl.innerHTML = rows
            .filter(function (r) { return r[1]; })
            .map(function (r) {
                return '<div class="summary-row"><span>' + escapeHtml(r[0]) + '</span><strong>' + escapeHtml(r[1]) + '</strong></div>';
            }).join('');
    }

    function formatDate(iso) {
        if (!iso) return '';
        var p = iso.split('-');
        return p.length === 3 ? p[2] + '-' + p[1] + '-' + p[0] : iso;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    // ── Autoguardado de borrador ─────────────────────────────
    var saveTimer = null;
    form.addEventListener('input', function () {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveDraft, 400);
    });

    function saveDraft() {
        if (!wizardReady) return;
        var data = { step: current, values: {} };
        Array.prototype.slice.call(form.elements).forEach(function (el) {
            if (!el.name) return;
            if (el.type === 'radio') {
                if (el.checked) data.values[el.name] = el.value;
            } else if (el.type === 'checkbox') {
                if (el.name === 'interests') {
                    data.values.interests = getInterests();
                } else {
                    data.values[el.name] = el.checked;
                }
            } else {
                data.values[el.name] = el.value;
            }
        });
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (e) { /* almacenamiento lleno o bloqueado */ }
    }

    function loadDraft() {
        try {
            var raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            return (data && data.values && Object.keys(data.values).some(function (k) {
                var v = data.values[k];
                return v && v !== false && String(v).length > 0;
            })) ? data : null;
        } catch (e) { return null; }
    }

    function applyDraft(data) {
        Object.keys(data.values).forEach(function (key) {
            var value = data.values[key];
            if (key === 'interests' && Array.isArray(value)) {
                form.querySelectorAll('input[name="interests"]').forEach(function (c) {
                    c.checked = value.indexOf(c.value) !== -1;
                });
                return;
            }
            var field = form.elements[key];
            if (!field) return;
            if (field instanceof RadioNodeList) {
                field.value = value;
            } else if (field.type === 'checkbox') {
                field.checked = value === true;
            } else {
                field.value = value || '';
            }
        });
        markSelectedChoice();
        applyMembershipPanels();
        rutInput.dispatchEvent(new Event('input'));
        goTo(Math.min(Math.max(data.step || 1, 1), TOTAL));
    }

    function clearDraft() {
        try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* sin acceso a storage */ }
    }

    // Ofrecer retomar el borrador guardado
    var draft = loadDraft();
    if (draft) {
        draftBox.hidden = false;
        document.getElementById('draft-resume').addEventListener('click', function () {
            applyDraft(draft);
            draftBox.hidden = true;
        });
        document.getElementById('draft-restart').addEventListener('click', function () {
            clearDraft();
            form.reset();
            markSelectedChoice();
            draftBox.hidden = true;
            goTo(1);
        });
    }

    // ── Envío por WhatsApp ───────────────────────────────────
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateStep(4)) return;

        var url = 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(buildMessage());

        // Abrir primero, dentro del gesto del usuario, para evitar bloqueo de popups
        window.open(url, '_blank', 'noopener');

        document.getElementById('success-whatsapp').href = url;
        form.hidden = true;
        document.querySelector('.wizard-progress').hidden = true;
        successEl.hidden = false;
        clearDraft();
    });

    function buildMessage() {
        var type = getValue('membershipType');
        var lines = [
            'Hola Innovacann 👋 Quiero inscribirme en la corporación.',
            '',
            '*Solicitud de inscripción*',
            '• Tipo: ' + type,
            '• Nombre: ' + getValue('name'),
            '• RUT: ' + getValue('rut'),
            '• Correo: ' + getValue('email'),
            '• Teléfono: ' + getValue('phone'),
            '• Nacimiento: ' + formatDate(getValue('birthdate')),
            '• Comuna: ' + getValue('comuna')
        ];

        if (type === 'Socio') {
            var interests = getInterests();
            if (interests.length) lines.push('• Áreas de interés: ' + interests.join(', '));
            if (getValue('memberNotes')) lines.push('• Motivación: ' + getValue('memberNotes'));
        } else {
            lines.push('• Motivo de uso: ' + getValue('condition'));
            if (getValue('experience')) lines.push('• Experiencia: ' + getValue('experience'));
            lines.push('• Receta médica: ' + getValue('receta'));
            if (getValue('healthNotes')) lines.push('• Observaciones: ' + getValue('healthNotes'));
        }

        lines.push('');
        lines.push('Declaro ser mayor de 18 años y que mis datos son verídicos.');
        lines.push('A continuación adjunto mi carnet (ambos lados) y mi receta médica.');
        return lines.join('\n');
    }

    document.getElementById('success-restart').addEventListener('click', function () {
        form.reset();
        markSelectedChoice();
        form.hidden = false;
        document.querySelector('.wizard-progress').hidden = false;
        successEl.hidden = true;
        clearDraft();
        goTo(1);
    });

    // Estado inicial
    goTo(1);
    wizardReady = true;
});
