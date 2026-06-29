// ============================================================
// INNOVACANN — Anti-Plagiarism Protection Script
// Protección contra copia no autorizada del sitio web
// Versión: 1.0.0
// ============================================================

(function() {
    'use strict';

    // ── Configuración ─────────────────────────────────────────
    var CONFIG = {
        siteName: 'Innovacann',
        owner: 'Corporación INNOVACANN',
        year: 2026,
        enabled: true,
        debug: false // Cambiar a true para ver logs en consola
    };

    // ── Watermark Digital Invisible ────────────────────────────
    function createDigitalWatermark() {
        var watermark = document.createElement('div');
        watermark.id = 'innovacann-watermark';
        watermark.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100%',
            'height: 100%',
            'pointer-events: none',
            'z-index: 9999',
            'opacity: 0.03',
            'background: repeating-linear-gradient(',
            '  45deg',
            '  transparent',
            '  transparent 10px',
            '  rgba(45, 90, 61, 0.1) 10px',
            '  rgba(45, 90, 61, 0.1) 20px',
            ')'
        ].join('');
        document.body.appendChild(watermark);

        // Agregar texto watermark invisible
        var watermarkText = document.createElement('div');
        watermarkText.style.cssText = [
            'position: fixed',
            'top: 50%',
            'left: 50%',
            'transform: translate(-50%, -50%) rotate(-45deg)',
            'font-size: 120px',
            'font-weight: bold',
            'color: rgba(45, 90, 61, 0.02)',
            'pointer-events: none',
            'z-index: 9998',
            'white-space: nowrap',
            'user-select: none'
        ].join('');
        watermarkText.textContent = '© ' + CONFIG.year + ' ' + CONFIG.siteName;
        document.body.appendChild(watermarkText);
    }

    // ── Copyright Notice en Código ─────────────────────────────
    function addCopyrightNotices() {
        // Agregar comentario copyright al inicio del HTML
        var htmlComment = document.createComment(
            ' ============================================================\n' +
            '   ' + CONFIG.owner + ' — Sitio Web Oficial\n' +
            '   Copyright © ' + CONFIG.year + ' ' + CONFIG.owner + '\n' +
            '   Todos los derechos reservados.\n' +
            '   Este código es propiedad exclusiva de ' + CONFIG.owner + '\n' +
            '   Queda prohibida su reproducción total o parcial sin autorización.\n' +
            ' ============================================================ '
        );
        document.insertBefore(htmlComment, document.firstChild);

        // Agregar meta tag de copyright
        var metaCopyright = document.createElement('meta');
        metaCopyright.name = 'copyright';
        metaCopyright.content = '© ' + CONFIG.year + ' ' + CONFIG.owner + ' — Todos los derechos reservados';
        document.head.appendChild(metaCopyright);
    }

    // ── Protección contra Click Derecho ────────────────────────
    function protectAgainstRightClick() {
        document.addEventListener('contextmenu', function(e) {
            if (!CONFIG.enabled) return;
            
            // Prevenir click derecho
            e.preventDefault();
            
            // Mostrar mensaje personalizado
            showProtectionMessage(
                '🔒 Protección de Contenido',
                'Este sitio está protegido por derechos de autor. ' +
                'El contenido no puede ser copiado sin autorización de ' + CONFIG.owner + '.'
            );
            
            return false;
        });
    }

    // ── Protección contra Copia ────────────────────────────────
    function protectAgainstCopy() {
        // Prevenir selección de texto en elementos protegidos
        document.addEventListener('selectstart', function(e) {
            if (!CONFIG.enabled) return;
            
            var target = e.target;
            var isProtected = target.closest('.no-copy, .hero, .about, .benefits, .testimonials, .footer');
            
            if (isProtected) {
                e.preventDefault();
                return false;
            }
        });

        // Prevenir copia
        document.addEventListener('copy', function(e) {
            if (!CONFIG.enabled) return;
            
            // Permitir copia en campos de formulario
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return true;
            }
            
            e.preventDefault();
            
            showProtectionMessage(
                '📋 Copia Restringida',
                'El contenido de este sitio está protegido. ' +
                'Para solicitar autorización, contacta a ' + CONFIG.owner + '.'
            );
            
            return false;
        });

        // Prevenir corte
        document.addEventListener('cut', function(e) {
            if (!CONFIG.enabled) return;
            e.preventDefault();
            return false;
        });
    }

    // ── Protección contra DevTools ─────────────────────────────
    function protectAgainstDevTools() {
        // Detectar apertura de DevTools
        var devtools = {
            open: false,
            orientation: null
        };

        var threshold = 170;

        setInterval(function() {
            if (!CONFIG.enabled) return;
            
            var widthThreshold = window.outerWidth - window.innerWidth > threshold;
            var heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.log(
                        '%c⚠️ ADVERTENCIA: ' + CONFIG.owner + '\n' +
                        'Este sitio está protegido. El uso de herramientas de desarrollo ' +
                        'para inspeccionar o copiar contenido está prohibido.',
                        'color: #C0392B; font-size: 16px; font-weight: bold;'
                    );
                    
                    // Opcional: redirigir o mostrar advertencia
                    // showProtectionMessage('⚠️ Acceso Restringido', '...');
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    // ── Fingerprint del Sitio ──────────────────────────────────
    function generateSiteFingerprint() {
        var fingerprint = {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform
        };

        // Crear hash simple del fingerprint
        var hash = 0;
        var str = JSON.stringify(fingerprint);
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return {
            hash: Math.abs(hash).toString(16),
            data: fingerprint
        };
    }

    // ── Mensaje de Protección ──────────────────────────────────
    function showProtectionMessage(title, message) {
        // Crear modal de protección
        var modal = document.createElement('div');
        modal.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100%',
            'height: 100%',
            'background: rgba(0, 0, 0, 0.8)',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'z-index: 99999',
            'animation: fadeIn 0.3s ease'
        ].join('');

        var content = document.createElement('div');
        content.style.cssText = [
            'background: white',
            'padding: 40px',
            'border-radius: 16px',
            'max-width: 400px',
            'text-align: center',
            'box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3)',
            'animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        ].join('');

        content.innerHTML = [
            '<div style="font-size: 48px; margin-bottom: 20px;">🔒</div>',
            '<h3 style="margin: 0 0 16px; color: #1A1A2E; font-family: Outfit, sans-serif;">' + title + '</h3>',
            '<p style="margin: 0 0 24px; color: #5A6275; line-height: 1.6;">' + message + '</p>',
            '<button id="protection-close" style="',
            '  background: linear-gradient(135deg, #2D5A3D 0%, #4A8C63 100%);',
            '  color: white;',
            '  border: none;',
            '  padding: 14px 28px;',
            '  border-radius: 50px;',
            '  font-family: Outfit, sans-serif;',
            '  font-size: 16px;',
            '  font-weight: 600;',
            '  cursor: pointer;',
            '  transition: transform 0.2s ease;',
            '" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'translateY(0)\'">',
            '  Entendido',
            '</button>'
        ].join('');

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Cerrar modal
        document.getElementById('protection-close').addEventListener('click', function() {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                modal.remove();
            }, 300);
        });

        // Cerrar con Escape
        document.addEventListener('keydown', function closeHandler(e) {
            if (e.key === 'Escape') {
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease';
                setTimeout(function() {
                    modal.remove();
                }, 300);
                document.removeEventListener('keydown', closeHandler);
            }
        });
    }

    // ── Detección de Herramientas de Análisis ──────────────────
    function detectAnalysisTools() {
        // Detectar Lighthouse, PageSpeed, etc.
        var scripts = document.querySelectorAll('script[src]');
        scripts.forEach(function(script) {
            var src = script.src.toLowerCase();
            if (src.includes('lighthouse') || src.includes('pagespeed') || src.includes('analytics')) {
                if (CONFIG.debug) {
                    console.log('🔍 Herramienta de análisis detectada:', src);
                }
            }
        });
    }

    // ── Protección de Imágenes ─────────────────────────────────
    function protectImages() {
        var images = document.querySelectorAll('img');
        images.forEach(function(img) {
            // Prevenir arrastrar imágenes
            img.setAttribute('draggable', 'false');
            
            // Agregar overlay de protección
            img.style.position = 'relative';
            
            // Agregar evento de clic derecho
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showProtectionMessage(
                    '🖼️ Imagen Protegida',
                    'Esta imagen es propiedad de ' + CONFIG.owner + '. ' +
                    'No está autorizada para su uso sin permiso.'
                );
                return false;
            });
        });
    }

    // ── Watermark en Consola ───────────────────────────────────
    function addConsoleWatermark() {
        var styles = [
            'color: #2D5A3D',
            'background: #F0F7F2',
            'font-size: 14px',
            'font-weight: bold',
            'padding: 10px 20px',
            'border-radius: 4px',
            'border-left: 4px solid #2D5A3D'
        ].join(';');

        console.log(
            '%c© ' + CONFIG.year + ' ' + CONFIG.owner + '\n' +
            'Todos los derechos reservados.\n' +
            'Este sitio está protegido por derechos de autor.',
            styles
        );
    }

    // ── Inicialización ─────────────────────────────────────────
    function init() {
        if (!CONFIG.enabled) return;

        // Crear watermark digital
        createDigitalWatermark();

        // Agregar notices de copyright
        addCopyrightNotices();

        // Proteger contra click derecho
        protectAgainstRightClick();

        // Proteger contra copia
        protectAgainstCopy();

        // Proteger contra DevTools
        protectAgainstDevTools();

        // Proteger imágenes
        protectImages();

        // Agregar watermark en consola
        addConsoleWatermark();

        // Detectar herramientas de análisis
        detectAnalysisTools();

        // Generar fingerprint
        var fingerprint = generateSiteFingerprint();
        if (CONFIG.debug) {
            console.log('🔒 Fingerprint del sitio:', fingerprint);
        }

        // Agregar clase al body para CSS
        document.body.classList.add('protected-site');

        if (CONFIG.debug) {
            console.log('✅ Protección anti-plagio activada para ' + CONFIG.siteName);
        }
    }

    // ── Estilos CSS para Protección ────────────────────────────
    function addProtectionStyles() {
        var style = document.createElement('style');
        style.textContent = [
            '/* Anti-Plagiarism Protection Styles */',
            '.protected-site {',
            '  -webkit-user-select: none;',
            '  -moz-user-select: none;',
            '  -ms-user-select: none;',
            '  user-select: none;',
            '}',
            '',
            '.protected-site input,',
            '.protected-site textarea {',
            '  -webkit-user-select: text;',
            '  -moz-user-select: text;',
            '  -ms-user-select: text;',
            '  user-select: text;',
            '}',
            '',
            '.protected-site img {',
            '  -webkit-user-drag: none;',
            '  user-drag: none;',
            '}',
            '',
            '@keyframes fadeIn {',
            '  from { opacity: 0; }',
            '  to { opacity: 1; }',
            '}',
            '',
            '@keyframes modalSlideUp {',
            '  from {',
            '    opacity: 0;',
            '    transform: translateY(30px) scale(0.95);',
            '  }',
            '  to {',
            '    opacity: 1;',
            '    transform: translateY(0) scale(1);',
            '  }',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    // ── Ejecutar cuando el DOM esté listo ──────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addProtectionStyles();
            init();
        });
    } else {
        addProtectionStyles();
        init();
    }

    // ── Exponer API pública ────────────────────────────────────
    window.INNOVACANN_PROTECTION = {
        config: CONFIG,
        fingerprint: generateSiteFingerprint(),
        disable: function() {
            CONFIG.enabled = false;
            console.log('⚠️ Protección deshabilitada temporalmente');
        },
        enable: function() {
            CONFIG.enabled = true;
            console.log('✅ Protección habilitada');
        }
    };

})();
