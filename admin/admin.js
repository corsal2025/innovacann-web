// ================================
// INNOVACANN - Admin Dashboard
// ================================

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!api.isLoggedIn() || !api.isAdmin()) {
        window.location.href = 'index.html';
        return;
    }

    // Set user name
    const user = api.getUser();
    document.getElementById('user-name').textContent = user?.name || 'Admin';

    // Initialize dashboard
    await loadDashboardStats();
    await loadRecentMembers();

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            api.logout();
        }
    });

    // Filter tabs for members
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadMembers(tab.dataset.filter);
        });
    });

    // Product modal
    const productModal = document.getElementById('product-modal');
    document.getElementById('add-product-btn')?.addEventListener('click', () => {
        openProductModal();
    });
    document.getElementById('modal-close')?.addEventListener('click', () => {
        productModal.classList.remove('show');
    });
    document.getElementById('cancel-product')?.addEventListener('click', () => {
        productModal.classList.remove('show');
    });
    document.getElementById('product-form')?.addEventListener('submit', saveProduct);

    // Content tabs
    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadContentEditor(tab.dataset.content);
        });
    });

    // Gallery upload
    initGalleryUpload();
});

// Switch sections
function switchSection(section) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');

    const titles = {
        dashboard: 'Dashboard',
        members: 'Gestión de Miembros',
        products: 'Gestión de Productos',
        gallery: 'Galería de Eventos',
        content: 'Editar Contenido'
    };
    document.getElementById('page-title').textContent = titles[section] || 'Dashboard';

    // Load section data
    if (section === 'members') loadMembers('all');
    if (section === 'products') loadProducts();
    if (section === 'gallery') loadGallery();
    if (section === 'content') loadContentEditor('hero');
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        const users = await api.auth.getUsers();
        const members = users.filter(u => u.role !== 'admin');
        const pending = users.filter(u => u.membershipStatus === 'pendiente');

        document.getElementById('stat-members').textContent = members.length;
        document.getElementById('stat-pending').textContent = pending.length;

        // Try to get products count
        try {
            const products = await api.products.getAll();
            document.getElementById('stat-products').textContent = products.length;
        } catch (e) {
            document.getElementById('stat-products').textContent = '0';
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load recent members
async function loadRecentMembers() {
    try {
        const users = await api.auth.getUsers();
        const recent = users.slice(-5).reverse();

        const tbody = document.getElementById('recent-members-body');
        tbody.innerHTML = recent.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge ${user.membershipStatus}">${user.membershipStatus}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString('es-CL')}</td>
                <td>
                    ${user.membershipStatus === 'pendiente' ? `
                        <button class="action-btn approve" onclick="approveUser('${user._id}')">Aprobar</button>
                        <button class="action-btn reject" onclick="rejectUser('${user._id}')">Rechazar</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

// Load all members with filter
async function loadMembers(filter) {
    try {
        let users = await api.auth.getUsers();

        if (filter !== 'all') {
            users = users.filter(u => u.membershipStatus === filter);
        }

        const tbody = document.getElementById('members-table-body');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td><span class="status-badge ${user.membershipStatus}">${user.membershipStatus}</span></td>
                <td>${user.role}</td>
                <td>
                    ${user.membershipStatus === 'pendiente' ? `
                        <button class="action-btn approve" onclick="approveUser('${user._id}')">Aprobar</button>
                        <button class="action-btn reject" onclick="rejectUser('${user._id}')">Rechazar</button>
                    ` : user.role !== 'admin' ? `
                        <button class="action-btn reject" onclick="rejectUser('${user._id}')">Suspender</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

// Approve user
async function approveUser(userId) {
    if (!confirm('¿Aprobar esta membresía?')) return;
    try {
        await api.auth.approveUser(userId);
        alert('Membresía aprobada');
        loadDashboardStats();
        loadRecentMembers();
        loadMembers('all');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Reject user
async function rejectUser(userId) {
    if (!confirm('¿Rechazar esta solicitud?')) return;
    try {
        await api.auth.rejectUser(userId);
        alert('Solicitud rechazada');
        loadDashboardStats();
        loadRecentMembers();
        loadMembers('all');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Load products
async function loadProducts() {
    try {
        const products = await api.products.getAll();
        const grid = document.getElementById('products-grid');

        if (products.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-secondary); padding: 40px; text-align: center;">No hay productos. Agrega el primero.</p>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-card-image">
                    <i class="fas fa-cannabis"></i>
                </div>
                <div class="product-card-body">
                    <h4>${product.name}</h4>
                    <p>${product.description?.substring(0, 80)}...</p>
                    <span class="product-price">$${product.price?.toLocaleString('es-CL')}</span>
                    <div class="product-actions">
                        <button class="action-btn edit" onclick="editProduct('${product._id}')">Editar</button>
                        <button class="action-btn delete" onclick="deleteProduct('${product._id}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = '<p style="color: var(--text-secondary); padding: 40px; text-align: center;">No hay productos todavía.</p>';
    }
}

// Open product modal
function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-title').textContent = product ? 'Editar Producto' : 'Agregar Producto';

    if (product) {
        document.getElementById('product-id').value = product._id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock || 0;
        document.getElementById('product-thc').value = product.thcContent || '';
        document.getElementById('product-cbd').value = product.cbdContent || '';
    } else {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
    }

    modal.classList.add('show');
}

// Save product
async function saveProduct(e) {
    e.preventDefault();

    const productId = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        price: parseInt(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value) || 0,
        thcContent: document.getElementById('product-thc').value,
        cbdContent: document.getElementById('product-cbd').value
    };

    try {
        if (productId) {
            await api.products.update(productId, productData);
        } else {
            await api.products.create(productData);
        }
        document.getElementById('product-modal').classList.remove('show');
        loadProducts();
        loadDashboardStats();
        alert('Producto guardado');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Edit product
async function editProduct(productId) {
    try {
        const product = await api.products.getOne(productId);
        openProductModal(product);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
        await api.products.delete(productId);
        loadProducts();
        loadDashboardStats();
        alert('Producto eliminado');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Load content editor
async function loadContentEditor(section) {
    const container = document.getElementById('content-form');

    try {
        const content = await api.content.getSection(section);
        const data = content.content || {};

        let formHtml = '';

        if (section === 'hero') {
            formHtml = `
                <div class="form-group">
                    <label>Badge</label>
                    <input type="text" id="content-badge" value="${data.badge || ''}">
                </div>
                <div class="form-group">
                    <label>Título Principal</label>
                    <input type="text" id="content-title" value="${data.title || ''}">
                </div>
                <div class="form-group">
                    <label>Subtítulo</label>
                    <textarea id="content-subtitle" rows="3">${data.subtitle || ''}</textarea>
                </div>
            `;
        } else if (section === 'about') {
            formHtml = `
                <div class="form-group">
                    <label>Título de Sección</label>
                    <input type="text" id="content-title" value="${data.title || ''}">
                </div>
                <div class="form-group">
                    <label>Texto</label>
                    <textarea id="content-text" rows="5">${data.text || ''}</textarea>
                </div>
            `;
        } else if (section === 'contact') {
            formHtml = `
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="content-email" value="${data.email || ''}">
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" id="content-phone" value="${data.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Dirección</label>
                    <input type="text" id="content-address" value="${data.address || ''}">
                </div>
            `;
        }

        formHtml += `
            <div class="form-actions">
                <button type="button" class="btn-primary" onclick="saveContent('${section}')">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        `;

        container.innerHTML = formHtml;
    } catch (error) {
        container.innerHTML = `
            <p style="color: var(--text-secondary); text-align: center; padding: 40px;">
                No hay contenido guardado. Agrega contenido y guarda.
            </p>
            <div class="form-actions">
                <button type="button" class="btn-primary" onclick="initContent()">
                    Inicializar Contenido
                </button>
            </div>
        `;
    }
}

// Save content
async function saveContent(section) {
    let content = {};

    if (section === 'hero') {
        content = {
            badge: document.getElementById('content-badge')?.value,
            title: document.getElementById('content-title')?.value,
            subtitle: document.getElementById('content-subtitle')?.value
        };
    } else if (section === 'about') {
        content = {
            title: document.getElementById('content-title')?.value,
            text: document.getElementById('content-text')?.value
        };
    } else if (section === 'contact') {
        content = {
            email: document.getElementById('content-email')?.value,
            phone: document.getElementById('content-phone')?.value,
            address: document.getElementById('content-address')?.value
        };
    }

    try {
        await api.content.updateSection(section, content);
        alert('Contenido guardado');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ================================
// GALLERY MANAGEMENT
// ================================

let galleryPhotos = [];
let galleryPreviewData = null;

async function loadGallery() {
    try {
        const result = await api.content.getSection('gallery');
        galleryPhotos = Array.isArray(result.content) ? result.content : [];
    } catch (e) {
        galleryPhotos = [];
    }
    renderAdminGallery();
}

function renderAdminGallery() {
    const grid = document.getElementById('gallery-admin-grid');
    if (!grid) return;

    if (galleryPhotos.length === 0) {
        grid.innerHTML = '<p class="gallery-empty">No hay fotos publicadas todavía.</p>';
        return;
    }

    grid.innerHTML = galleryPhotos.map((photo, index) => `
        <div class="gallery-admin-item">
            <img src="${photo.url}" alt="${photo.title || ''}">
            ${photo.featured ? '<span class="featured-badge">Destacada</span>' : ''}
            <div class="item-overlay">
                <span class="item-title">${photo.title || 'Sin título'}</span>
                <button class="item-delete" onclick="deleteGalleryPhoto(${index})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

async function saveGallery() {
    await api.content.updateSection('gallery', galleryPhotos);
}

async function deleteGalleryPhoto(index) {
    if (!confirm('¿Eliminar esta foto de la galería?')) return;
    galleryPhotos.splice(index, 1);
    try {
        await saveGallery();
        renderAdminGallery();
    } catch (e) {
        alert('Error al eliminar: ' + e.message);
    }
}

function compressImage(file, maxWidth = 900) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.75));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function initGalleryUpload() {
    const dropArea = document.getElementById('gallery-drop-area');
    const fileInput = document.getElementById('gallery-file-input');
    const uploadLink = document.getElementById('gallery-upload-link');
    const previewWrap = document.getElementById('gallery-preview-wrap');
    const previewImg = document.getElementById('gallery-preview-img');
    const removeBtn = document.getElementById('gallery-remove-preview');
    const addBtn = document.getElementById('gallery-add-btn');

    if (!dropArea) return;

    uploadLink?.addEventListener('click', () => fileInput.click());
    dropArea.addEventListener('click', () => fileInput.click());

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
    dropArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) await handleImageFile(file);
    });

    fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        if (file) await handleImageFile(file);
    });

    removeBtn?.addEventListener('click', () => {
        galleryPreviewData = null;
        previewWrap.style.display = 'none';
        dropArea.style.display = 'block';
        fileInput.value = '';
    });

    addBtn?.addEventListener('click', async () => {
        if (!galleryPreviewData) { alert('Selecciona una imagen primero.'); return; }
        const title = document.getElementById('gallery-title-input').value.trim();
        const date = document.getElementById('gallery-date-input').value.trim();
        const featured = document.getElementById('gallery-featured').checked;

        galleryPhotos.push({ url: galleryPreviewData, title, date, featured });

        try {
            addBtn.disabled = true;
            addBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            await saveGallery();
            // Reset form
            galleryPreviewData = null;
            previewWrap.style.display = 'none';
            dropArea.style.display = 'block';
            fileInput.value = '';
            document.getElementById('gallery-title-input').value = '';
            document.getElementById('gallery-date-input').value = '';
            document.getElementById('gallery-featured').checked = false;
            renderAdminGallery();
            addBtn.innerHTML = '<i class="fas fa-check"></i> Foto agregada';
            setTimeout(() => { addBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar a la galería'; addBtn.disabled = false; }, 2000);
        } catch (e) {
            alert('Error al guardar: ' + e.message);
            addBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar a la galería';
            addBtn.disabled = false;
        }
    });

    async function handleImageFile(file) {
        const compressed = await compressImage(file);
        galleryPreviewData = compressed;
        previewImg.src = compressed;
        dropArea.style.display = 'none';
        previewWrap.style.display = 'block';
    }
}

// Make functions global
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.saveContent = saveContent;
window.deleteGalleryPhoto = deleteGalleryPhoto;
