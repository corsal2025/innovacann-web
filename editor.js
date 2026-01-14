// ================================
// INNOVACANN - Visual Page Editor
// Allows admin to edit page content inline
// ================================

(function () {
    'use strict';

    // Check if admin is logged in
    const isAdmin = () => {
        const user = api?.getUser?.();
        return user && user.role === 'admin';
    };

    // Editor state
    let editMode = false;
    let editToolbar = null;
    let unsavedChanges = {};

    // Initialize editor
    function initEditor() {
        // Only for admins
        if (!isAdmin()) return;

        // Create floating admin button
        createAdminButton();
    }

    // Create admin edit button
    function createAdminButton() {
        const btn = document.createElement('button');
        btn.id = 'admin-edit-btn';
        btn.innerHTML = '<i class="fas fa-edit"></i> Modo Editor';
        btn.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 14px 24px;
            background: #2D5A3D;
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: 'Inter', sans-serif;
            transition: all 0.3s;
        `;
        btn.addEventListener('click', toggleEditMode);
        document.body.appendChild(btn);
    }

    // Toggle edit mode
    function toggleEditMode() {
        editMode = !editMode;
        const btn = document.getElementById('admin-edit-btn');

        if (editMode) {
            btn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
            btn.style.background = '#10B981';
            enableEditMode();
            showEditorToolbar();
        } else {
            saveAllChanges();
            btn.innerHTML = '<i class="fas fa-edit"></i> Modo Editor';
            btn.style.background = '#2D5A3D';
            disableEditMode();
            hideEditorToolbar();
        }
    }

    // Show editor toolbar
    function showEditorToolbar() {
        if (editToolbar) return;

        editToolbar = document.createElement('div');
        editToolbar.id = 'editor-toolbar';
        editToolbar.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <span style="font-weight: 600;"><i class="fas fa-magic"></i> Modo Edición Activo</span>
                <span style="font-size: 12px; opacity: 0.8;">Click en textos para editar • Click en imágenes para cambiar</span>
            </div>
            <button id="cancel-edit" style="
                background: transparent;
                border: 1px solid white;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
            ">Cancelar</button>
        `;
        editToolbar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #2D5A3D 0%, #1E3F2B 100%);
            color: white;
            padding: 12px 24px;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(editToolbar);
        document.body.style.paddingTop = '52px';

        document.getElementById('cancel-edit').addEventListener('click', () => {
            if (confirm('¿Descartar cambios sin guardar?')) {
                location.reload();
            }
        });
    }

    // Hide editor toolbar
    function hideEditorToolbar() {
        if (editToolbar) {
            editToolbar.remove();
            editToolbar = null;
            document.body.style.paddingTop = '0';
        }
    }

    // Enable edit mode - make elements editable
    function enableEditMode() {
        // Make text elements editable
        const editableSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p:not(.no-edit)',
            '.hero-subtitle',
            '.hero-badge span',
            '.stat-number', '.stat-label',
            '.section-tag',
            '.about-text',
            '.mission-card p',
            '.service-card p',
            '.product-info p',
            '.blog-content p',
            'li:not(.nav-links li)'
        ];

        editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Skip if inside nav or footer links
                if (el.closest('.nav-links') || el.closest('.footer-links')) return;

                el.setAttribute('contenteditable', 'true');
                el.classList.add('editable-element');
                el.style.outline = '2px dashed transparent';
                el.style.transition = 'outline 0.2s';

                el.addEventListener('focus', handleFocus);
                el.addEventListener('blur', handleBlur);
                el.addEventListener('input', handleInput);
            });
        });

        // Make images clickable to change
        document.querySelectorAll('img:not(.no-edit)').forEach(img => {
            img.classList.add('editable-image');
            img.style.cursor = 'pointer';
            img.style.outline = '2px dashed transparent';
            img.style.transition = 'outline 0.2s';

            img.addEventListener('click', handleImageClick);
            img.addEventListener('mouseenter', () => {
                img.style.outline = '2px dashed #2D5A3D';
            });
            img.addEventListener('mouseleave', () => {
                img.style.outline = '2px dashed transparent';
            });
        });

        // Add edit hover styles
        const style = document.createElement('style');
        style.id = 'edit-mode-styles';
        style.textContent = `
            .editable-element:hover {
                outline: 2px dashed #2D5A3D !important;
            }
            .editable-element:focus {
                outline: 2px solid #2D5A3D !important;
                background: rgba(45, 90, 61, 0.05);
            }
            .editable-image:hover::after {
                content: 'Click para cambiar';
            }
        `;
        document.head.appendChild(style);
    }

    // Disable edit mode
    function disableEditMode() {
        document.querySelectorAll('.editable-element').forEach(el => {
            el.removeAttribute('contenteditable');
            el.classList.remove('editable-element');
            el.style.outline = '';
            el.style.transition = '';
        });

        document.querySelectorAll('.editable-image').forEach(img => {
            img.classList.remove('editable-image');
            img.style.cursor = '';
            img.style.outline = '';
        });

        const editStyles = document.getElementById('edit-mode-styles');
        if (editStyles) editStyles.remove();
    }

    // Handle element focus
    function handleFocus(e) {
        e.target.dataset.originalContent = e.target.innerHTML;
    }

    // Handle element blur
    function handleBlur(e) {
        if (e.target.innerHTML !== e.target.dataset.originalContent) {
            const id = getElementId(e.target);
            unsavedChanges[id] = {
                type: 'text',
                element: e.target,
                content: e.target.innerHTML,
                selector: getElementSelector(e.target)
            };
        }
    }

    // Handle input
    function handleInput(e) {
        // Mark as changed
        e.target.style.background = 'rgba(45, 90, 61, 0.1)';
    }

    // Handle image click
    function handleImageClick(e) {
        if (!editMode) return;

        const img = e.target;

        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Preview immediately
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
                img.style.outline = '2px solid #10B981';

                const id = getElementId(img);
                unsavedChanges[id] = {
                    type: 'image',
                    element: img,
                    file: file,
                    dataUrl: e.target.result
                };
            };
            reader.readAsDataURL(file);
        };

        input.click();
    }

    // Get unique element ID
    function getElementId(el) {
        if (el.id) return el.id;
        return el.tagName + '_' + Array.from(el.parentNode.children).indexOf(el) + '_' + el.textContent.substring(0, 20);
    }

    // Get element selector
    function getElementSelector(el) {
        if (el.id) return '#' + el.id;

        let path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.tagName.toLowerCase();
            if (el.id) {
                selector = '#' + el.id;
                path.unshift(selector);
                break;
            } else {
                let sibling = el;
                let nth = 1;
                while (sibling = sibling.previousElementSibling) {
                    if (sibling.tagName === el.tagName) nth++;
                }
                if (nth > 1) selector += ':nth-of-type(' + nth + ')';
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(' > ');
    }

    // Save all changes
    async function saveAllChanges() {
        const changes = Object.values(unsavedChanges);

        if (changes.length === 0) {
            return;
        }

        try {
            // Prepare changes for API
            const contentChanges = {};

            changes.forEach(change => {
                if (change.type === 'text') {
                    contentChanges[change.selector] = {
                        type: 'text',
                        content: change.content
                    };
                } else if (change.type === 'image') {
                    contentChanges[change.selector] = {
                        type: 'image',
                        dataUrl: change.dataUrl
                    };
                }
            });

            // Save to API
            await api.content.updateSection('page_edits', contentChanges);

            alert(`✅ ${changes.length} cambio(s) guardado(s) exitosamente!`);
            unsavedChanges = {};

        } catch (error) {
            console.error('Error saving:', error);
            alert('Error al guardar: ' + error.message);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditor);
    } else {
        // Small delay to ensure api.js is loaded
        setTimeout(initEditor, 500);
    }

})();
