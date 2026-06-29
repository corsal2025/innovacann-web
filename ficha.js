// ============================================================
// INNOVACANN — Ficha de Ingreso
// Sistema de fichas con persistencia localStorage
// ============================================================

var FichaIngreso = (function() {
    'use strict';

    var STORAGE_KEY = 'innovacann_fichas_v1';
    var CURRENT_FICHA_KEY = 'innovacann_current_ficha';

    // ── Guardar ficha ────────────────────────────────────────
    function saveFicha(data) {
        var fichas = getAllFichas();
        data.id = data.id || generateId();
        data.fechaCreacion = data.fechaCreacion || new Date().toISOString();
        data.fechaActualizacion = new Date().toISOString();
        data.estado = data.estado || 'pendiente';

        var exists = fichas.findIndex(function(f) { return f.id === data.id; });
        if (exists >= 0) {
            fichas[exists] = data;
        } else {
            fichas.push(data);
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
            return { success: true, id: data.id };
        } catch (e) {
            return { success: false, error: 'Error al guardar' };
        }
    }

    // ── Obtener todas las fichas ─────────────────────────────
    function getAllFichas() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    // ── Obtener ficha por ID ─────────────────────────────────
    function getFichaById(id) {
        var fichas = getAllFichas();
        return fichas.find(function(f) { return f.id === id; }) || null;
    }

    // ── Eliminar ficha ───────────────────────────────────────
    function deleteFicha(id) {
        var fichas = getAllFichas();
        fichas = fichas.filter(function(f) { return f.id !== id; });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
        return true;
    }

    // ── Generar ID único ─────────────────────────────────────
    function generateId() {
        return 'FICHA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    // ── Formatear RUT ────────────────────────────────────────
    function formatRut(rut) {
        if (!rut) return '';
        var clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
        if (clean.length < 2) return clean;
        var body = clean.slice(0, -1);
        var dv = clean.slice(-1);
        return body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
    }

    // ── Formatear fecha ──────────────────────────────────────
    function formatDate(iso) {
        if (!iso) return '-';
        var p = iso.split('T')[0].split('-');
        return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
    }

    // ── Generar HTML de ficha para imprimir ───────────────────
    function generateFichaHTML(ficha) {
        var type = ficha.membershipType || 'No especificado';
        var isPaciente = type !== 'Socio';

        var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">';
        html += '<title>Ficha de Ingreso - ' + escapeHtml(ficha.name) + '</title>';
        html += '<style>';
        html += '* { margin: 0; padding: 0; box-sizing: border-box; }';
        html += 'body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }';
        html += '.ficha-container { max-width: 800px; margin: 0 auto; border: 2px solid #2D5A3D; border-radius: 8px; overflow: hidden; }';
        html += '.ficha-header { background: linear-gradient(135deg, #2D5A3D, #3d7a52); color: white; padding: 24px; text-align: center; }';
        html += '.ficha-header h1 { font-size: 1.5rem; margin-bottom: 4px; }';
        html += '.ficha-header p { opacity: 0.9; font-size: 0.9rem; }';
        html += '.ficha-id { background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; display: inline-block; margin-top: 8px; }';
        html += '.ficha-body { padding: 24px; }';
        html += '.ficha-section { margin-bottom: 24px; }';
        html += '.ficha-section h2 { font-size: 1rem; color: #2D5A3D; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 16px; }';
        html += '.ficha-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }';
        html += '.ficha-field { background: #f8f9fa; padding: 12px; border-radius: 6px; }';
        html += '.ficha-field.full { grid-column: 1 / -1; }';
        html += '.ficha-label { font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }';
        html += '.ficha-value { font-size: 0.95rem; font-weight: 500; }';
        html += '.ficha-footer { background: #f8f9fa; padding: 16px 24px; text-align: center; font-size: 0.8rem; color: #666; border-top: 1px solid #e0e0e0; }';
        html += '.ficha-stamp { margin-top: 24px; padding-top: 24px; border-top: 2px dashed #ccc; text-align: center; }';
        html += '.ficha-stamp-line { width: 200px; border-bottom: 1px solid #333; margin: 0 auto 8px; }';
        html += '@media print { body { padding: 20px; } .no-print { display: none; } }';
        html += '</style></head><body>';

        html += '<div class="ficha-container">';
        html += '<div class="ficha-header">';
        html += '<h1>Corporación Innovacann</h1>';
        html += '<p>Ficha de Ingreso — ' + escapeHtml(type) + '</p>';
        html += '<span class="ficha-id">ID: ' + escapeHtml(ficha.id) + '</span>';
        html += '</div>';

        html += '<div class="ficha-body">';

        // Datos personales
        html += '<div class="ficha-section">';
        html += '<h2>1. Datos Personales</h2>';
        html += '<div class="ficha-grid">';
        html += fieldHTML('Nombre Completo', ficha.name);
        html += fieldHTML('RUT', formatRut(ficha.rut));
        html += fieldHTML('Correo Electrónico', ficha.email);
        html += fieldHTML('Teléfono', ficha.phone);
        html += fieldHTML('Fecha de Nacimiento', formatDate(ficha.birthdate));
        html += fieldHTML('Comuna / Ciudad', ficha.comuna);
        html += '</div></div>';

        // Información de salud (pacientes)
        if (isPaciente) {
            html += '<div class="ficha-section">';
            html += '<h2>2. Información de Salud</h2>';
            html += '<div class="ficha-grid">';
            html += fieldHTML('Motivo de Uso Medicinal', ficha.condition);
            html += fieldHTML('Experiencia con Cannabis Medicinal', ficha.experience);
            html += fieldHTML('Receta Médica', ficha.receta);
            html += fieldHTML('Observaciones de Salud', ficha.healthNotes, true);
            html += '</div></div>';
        }

        // Información de socio
        if (type === 'Socio' || type === 'Socio + Paciente') {
            html += '<div class="ficha-section">';
            html += '<h2>' + (isPaciente ? '3' : '2') + '. Participación como Socio</h2>';
            html += '<div class="ficha-grid">';
            html += fieldHTML('Áreas de Interés', (ficha.interests || []).join(', '));
            html += fieldHTML('Motivación', ficha.memberNotes, true);
            html += '</div></div>';
        }

        // Consentimiento
        html += '<div class="ficha-section">';
        html += '<h2>' + (isPaciente ? '4' : '3') + '. Consentimiento</h2>';
        html += '<div class="ficha-grid">';
        html += fieldHTML('Acepta Términos', ficha.terms ? 'Sí' : 'No');
        html += fieldHTML('Declara Veracidad', ficha.truth ? 'Sí' : 'No');
        html += fieldHTML('Fecha de Solicitud', formatDate(ficha.fechaCreacion));
        html += fieldHTML('Estado', ficha.estado.charAt(0).toUpperCase() + ficha.estado.slice(1));
        html += '</div></div>';

        // Firma
        html += '<div class="ficha-stamp">';
        html += '<div class="ficha-stamp-line"></div>';
        html += '<p>Firma del Solicitante</p>';
        html += '</div>';

        html += '</div>'; // ficha-body

        html += '<div class="ficha-footer">';
        html += '<p>Corporación Innovacann · RUT: 65.221.834-2 · Valparaíso, Chile</p>';
        html += '<p>Documento generado el ' + new Date().toLocaleString('es-CL') + '</p>';
        html += '</div>';

        html += '</div>'; // ficha-container

        html += '<div class="no-print" style="text-align:center;margin-top:20px;">';
        html += '<button onclick="window.print()" style="padding:10px 24px;background:#2D5A3D;color:white;border:none;border-radius:6px;cursor:pointer;font-size:1rem;">Imprimir Ficha</button>';
        html += ' <button onclick="window.close()" style="padding:10px 24px;background:#666;color:white;border:none;border-radius:6px;cursor:pointer;font-size:1rem;margin-left:10px;">Cerrar</button>';
        html += '</div>';

        html += '</body></html>';
        return html;
    }

    function fieldHTML(label, value, isFull) {
        return '<div class="ficha-field' + (isFull ? ' full' : '') + '">' +
            '<div class="ficha-label">' + escapeHtml(label) + '</div>' +
            '<div class="ficha-value">' + escapeHtml(value || '-') + '</div>' +
            '</div>';
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = String(str || '');
        return div.innerHTML;
    }

    // ── Imprimir ficha ───────────────────────────────────────
    function printFicha(id) {
        var ficha = getFichaById(id);
        if (!ficha) return false;

        var win = window.open('', '_blank', 'width=900,height=700');
        win.document.write(generateFichaHTML(ficha));
        win.document.close();
        return true;
    }

    // ── Exportar todas las fichas como CSV ────────────────────
    function exportCSV() {
        var fichas = getAllFichas();
        if (!fichas.length) return null;

        var headers = ['ID', 'Fecha', 'Estado', 'Tipo', 'Nombre', 'RUT', 'Email', 'Teléfono', 'Nacimiento', 'Comuna', 'Motivo Uso', 'Experiencia', 'Receta', 'Observaciones', 'Áreas Interés', 'Motivación'];
        var rows = fichas.map(function(f) {
            return [
                f.id,
                formatDate(f.fechaCreacion),
                f.estado,
                f.membershipType,
                f.name,
                f.rut,
                f.email,
                f.phone,
                f.birthdate,
                f.comuna,
                f.condition || '',
                f.experience || '',
                f.receta || '',
                f.healthNotes || '',
                (f.interests || []).join('; '),
                f.memberNotes || ''
            ].map(function(v) { return '"' + String(v || '').replace(/"/g, '""') + '"'; });
        });

        var csv = headers.join(',') + '\n' + rows.map(function(r) { return r.join(','); }).join('\n');
        var blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'innovacann_fichas_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
        URL.revokeObjectURL(url);
        return true;
    }

    // ── Interfaz pública ─────────────────────────────────────
    return {
        save: saveFicha,
        getAll: getAllFichas,
        getById: getFichaById,
        delete: deleteFicha,
        print: printFicha,
        exportCSV: exportCSV,
        formatRut: formatRut,
        formatDate: formatDate
    };
})();
