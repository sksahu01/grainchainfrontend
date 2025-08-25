import api from './api';

const ENDPOINTS = {
    METRICS: '/metrics',
    IMPACT: '/metrics/impact',
    TREND: '/metrics/trend',
    DISTRIBUTION: '/metrics/distribution',
    SAVED: '/metrics/saved'
};

/**
 * Service to handle all metrics-related API calls
 */
const metricsService = {
    /**
     * Get overall platform metrics
     * @returns {Promise} - Promise with metrics data
     */
    getMetrics: async () => {
        try {
            const response = await api.get(ENDPOINTS.METRICS);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get social impact metrics
     * @returns {Promise} - Promise with impact data
     */
    getImpactMetrics: async () => {
        try {
            const response = await api.get(ENDPOINTS.IMPACT);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get trend metrics over time (for charts)
     * @param {string} timeframe - 'day', 'week', 'month', 'year'
     * @returns {Promise} - Promise with trend data
     */
    getTrendMetrics: async (timeframe = 'month') => {
        try {
            const response = await api.get(`${ENDPOINTS.TREND}?timeframe=${timeframe}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get food type distribution metrics
     * @returns {Promise} - Promise with distribution data
     */
    getDistributionMetrics: async () => {
        try {
            const response = await api.get(ENDPOINTS.DISTRIBUTION);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get metrics for a specific user/organization
     * @param {string} userId - The user ID
     * @returns {Promise} - Promise with user metrics data
     */
    getUserMetrics: async (userId) => {
        try {
            const response = await api.get(`${ENDPOINTS.METRICS}/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get saved resources metrics (carbon, water, etc.)
     * @returns {Promise} - Promise with saved resources data
     */
    getSavedResourcesMetrics: async () => {
        try {
            const response = await api.get(ENDPOINTS.SAVED);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default metricsService;
