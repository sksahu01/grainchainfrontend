import axios from 'axios';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'https://grainchainbackend.onrender.com/api';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized, clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getCurrentUser: () => api.get('/auth/me'),
};

// Food Items API
export const foodItemsAPI = {
    getAll: (filters = {}) => api.get('/food-items', { params: filters }),
    getById: (id) => api.get(`/food-items/${id}`),
    create: (foodItemData) => api.post('/food-items', foodItemData),
    update: (id, foodItemData) => api.put(`/food-items/${id}`, foodItemData),
    delete: (id) => api.delete(`/food-items/${id}`),
    getByDonor: (donorId) => api.get(`/food-items/donor/${donorId}`),
};

// Pickup Requests API
export const pickupRequestsAPI = {
    getAll: (filters = {}) => api.get('/pickup-requests', { params: filters }),
    getById: (id) => api.get(`/pickup-requests/${id}`),
    create: (pickupData) => api.post('/pickup-requests', pickupData),
    update: (id, pickupData) => api.put(`/pickup-requests/${id}`, pickupData),
    cancel: (id) => api.put(`/pickup-requests/${id}/cancel`),
    approve: (id) => api.put(`/pickup-requests/${id}/approve`),
    complete: (id) => api.put(`/pickup-requests/${id}/complete`),
    getByDonor: (donorId) => api.get(`/pickup-requests/donor/${donorId}`),
    getByReceiver: (receiverId) => api.get(`/pickup-requests/receiver/${receiverId}`),
};

// User Management API (admin only)
export const usersAPI = {
    getAll: (filters = {}) => api.get('/users', { params: filters }),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
    changeRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

// Analytics API (admin only)
export const analyticsAPI = {
    getSummary: () => api.get('/analytics/summary'),
    getFoodSaved: (timeframe = 'month') => api.get(`/analytics/food-saved?timeframe=${timeframe}`),
    getCO2Reduction: (timeframe = 'month') => api.get(`/analytics/co2-reduction?timeframe=${timeframe}`),
    getDonationsByRegion: () => api.get('/analytics/donations-by-region'),
};

export default api;
