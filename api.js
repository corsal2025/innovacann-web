// ================================
// INNOVACANN - API Configuration
// ================================

const API_CONFIG = {
    BASE_URL: 'https://innovacann-api.onrender.com',
    ENDPOINTS: {
        // Auth
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        ME: '/api/auth/me',
        USERS: '/api/auth/users',

        // Products
        PRODUCTS: '/api/products',
        PRODUCTS_PUBLIC: '/api/products/public',

        // Content
        CONTENT: '/api/content',

        // Health
        HEALTH: '/api/health'
    }
};

// API Helper Functions
const api = {
    // Get auth token from localStorage
    getToken: () => localStorage.getItem('innovacann_token'),

    // Set auth token
    setToken: (token) => localStorage.setItem('innovacann_token', token),

    // Remove auth token
    removeToken: () => localStorage.removeItem('innovacann_token'),

    // Get current user from localStorage
    getUser: () => {
        const user = localStorage.getItem('innovacann_user');
        return user ? JSON.parse(user) : null;
    },

    // Set current user
    setUser: (user) => localStorage.setItem('innovacann_user', JSON.stringify(user)),

    // Remove user
    removeUser: () => localStorage.removeItem('innovacann_user'),

    // Check if user is logged in
    isLoggedIn: () => !!api.getToken(),

    // Check if user is admin
    isAdmin: () => {
        const user = api.getUser();
        return user && user.role === 'admin';
    },

    // Check if user is approved member
    isMember: () => {
        const user = api.getUser();
        return user && (user.role === 'miembro' || user.role === 'admin') && user.membershipStatus === 'aprobado';
    },

    // Logout
    logout: () => {
        api.removeToken();
        api.removeUser();
        window.location.href = '/';
    },

    // Make API request
    request: async (endpoint, options = {}) => {
        const url = API_CONFIG.BASE_URL + endpoint;
        const token = api.getToken();

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }

        return data;
    },

    // Auth methods
    auth: {
        login: async (email, password) => {
            const data = await api.request(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            api.setToken(data.token);
            api.setUser(data);
            return data;
        },

        register: async (userData) => {
            const data = await api.request(API_CONFIG.ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            api.setToken(data.token);
            api.setUser(data);
            return data;
        },

        getProfile: async () => {
            return await api.request(API_CONFIG.ENDPOINTS.ME);
        },

        getUsers: async () => {
            return await api.request(API_CONFIG.ENDPOINTS.USERS);
        },

        approveUser: async (userId) => {
            return await api.request(`${API_CONFIG.ENDPOINTS.USERS}/${userId}/approve`, {
                method: 'PUT'
            });
        },

        rejectUser: async (userId) => {
            return await api.request(`${API_CONFIG.ENDPOINTS.USERS}/${userId}/reject`, {
                method: 'PUT'
            });
        }
    },

    // Product methods
    products: {
        getAll: async () => {
            return await api.request(API_CONFIG.ENDPOINTS.PRODUCTS);
        },

        getPublic: async () => {
            return await api.request(API_CONFIG.ENDPOINTS.PRODUCTS_PUBLIC);
        },

        getOne: async (id) => {
            return await api.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
        },

        create: async (productData) => {
            return await api.request(API_CONFIG.ENDPOINTS.PRODUCTS, {
                method: 'POST',
                body: JSON.stringify(productData)
            });
        },

        update: async (id, productData) => {
            return await api.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
        },

        delete: async (id) => {
            return await api.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // Content methods
    content: {
        getAll: async () => {
            return await api.request(API_CONFIG.ENDPOINTS.CONTENT);
        },

        getSection: async (section) => {
            return await api.request(`${API_CONFIG.ENDPOINTS.CONTENT}/${section}`);
        },

        updateSection: async (section, content) => {
            return await api.request(`${API_CONFIG.ENDPOINTS.CONTENT}/${section}`, {
                method: 'PUT',
                body: JSON.stringify({ content })
            });
        }
    }
};

// Export for use in other scripts
window.API_CONFIG = API_CONFIG;
window.api = api;
