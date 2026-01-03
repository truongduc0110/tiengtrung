import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const adminAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    getClasses: () => api.get('/admin/classes'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    deleteClass: (id) => api.delete(`/admin/classes/${id}`),
};

export default api;
