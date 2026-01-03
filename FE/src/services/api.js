import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const userId = JSON.parse(atob(refreshToken.split('.')[1])).sub;

                const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                    userId,
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API endpoints
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

export const classesAPI = {
    getAll: () => api.get('/classes'),
    getById: (id) => api.get(`/classes/${id}`),
    create: (data) => api.post('/classes', data),
    update: (id, data) => api.put(`/classes/${id}`, data),
    delete: (id) => api.delete(`/classes/${id}`),
    join: (code) => api.post('/classes/join', { code }),
    leave: (id) => api.delete(`/classes/${id}/leave`),
    getMembers: (id) => api.get(`/classes/${id}/members`),
};

export const setsAPI = {
    getByClass: (classId) => api.get(`/sets/by-class/${classId}`),
    getById: (id) => api.get(`/sets/${id}`),
    create: (data) => api.post('/sets', data),
    update: (id, data) => api.put(`/sets/${id}`, data),
    delete: (id) => api.delete(`/sets/${id}`),
    copy: (id, targetClassId) => api.post(`/sets/${id}/copy`, { targetClassId }),
    getProgress: (id) => api.get(`/sets/${id}/progress`),
};

export const vocabulariesAPI = {
    getBySet: (setId) => api.get(`/vocabularies/by-set/${setId}`),
    getById: (id) => api.get(`/vocabularies/${id}`),
    create: (data) => api.post('/vocabularies', data),
    createBulk: (data) => api.post('/vocabularies/bulk', data),
    update: (id, data) => api.put(`/vocabularies/${id}`, data),
    delete: (id) => api.delete(`/vocabularies/${id}`),
    toggleLearned: (id) => api.post(`/vocabularies/${id}/toggle-learned`),
    getQuiz: (setId, count = 10) => api.get(`/vocabularies/quiz/${setId}?count=${count}`),
    checkAnswer: (vocabularyId, answer) => api.post('/vocabularies/check-answer', { vocabularyId, answer }),
};

export const activityAPI = {
    log: () => api.post('/activity/log'),
    getStreak: () => api.get('/activity/streak'),
    getCalendar: (days = 98) => api.get(`/activity/calendar?days=${days}`),
    getLeaderboard: (limit = 10) => api.get(`/activity/leaderboard?limit=${limit}`),
    getStats: () => api.get('/activity/stats'),
};

export const aiAPI = {
    generateVocabulary: (topic, count = 10) => api.post('/ai/generate-vocabulary', { topic, count }),
    suggestPinyin: (chinese) => api.post('/ai/suggest-pinyin', { chinese }),
};

export default api;
