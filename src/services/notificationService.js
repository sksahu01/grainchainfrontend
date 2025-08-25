import api from './api';

/**
 * Service for handling user notifications
 */
const notificationService = {
    /**
     * Get notifications for the current user
     * @param {Object} params - Query parameters (e.g., page, limit, read status)
     * @returns {Promise<Object>} Promise resolving to user notifications
     */
    getUserNotifications: async (params = {}) => {
        try {
            const response = await api.get('/notifications', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            throw error;
        }
    },

    /**
     * Get unread notifications count
     * @returns {Promise<number>} Promise resolving to unread count
     */
    getUnreadCount: async () => {
        try {
            const response = await api.get('/notifications/unread-count');
            return response.data.count;
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);
            throw error;
        }
    },

    /**
     * Mark a notification as read
     * @param {string} id - Notification ID
     * @returns {Promise<Object>} Promise resolving to updated notification
     */
    markAsRead: async (id) => {
        try {
            const response = await api.patch(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            console.error(`Error marking notification ${id} as read:`, error);
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     * @returns {Promise<Object>} Promise resolving to operation result
     */
    markAllAsRead: async () => {
        try {
            const response = await api.patch('/notifications/mark-all-read');
            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },

    /**
     * Delete a notification
     * @param {string} id - Notification ID
     * @returns {Promise<Object>} Promise resolving to deletion status
     */
    deleteNotification: async (id) => {
        try {
            const response = await api.delete(`/notifications/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting notification ${id}:`, error);
            throw error;
        }
    },

    /**
     * Clear all notifications for the user
     * @returns {Promise<Object>} Promise resolving to operation result
     */
    clearAllNotifications: async () => {
        try {
            const response = await api.delete('/notifications/clear-all');
            return response.data;
        } catch (error) {
            console.error('Error clearing all notifications:', error);
            throw error;
        }
    },

    /**
     * Update user notification preferences
     * @param {Object} preferences - User's notification preferences
     * @returns {Promise<Object>} Promise resolving to updated preferences
     */
    updateNotificationPreferences: async (preferences) => {
        try {
            const response = await api.put('/notifications/preferences', preferences);
            return response.data;
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            throw error;
        }
    },

    /**
     * Get user's notification preferences
     * @returns {Promise<Object>} Promise resolving to user's notification preferences
     */
    getNotificationPreferences: async () => {
        try {
            const response = await api.get('/notifications/preferences');
            return response.data;
        } catch (error) {
            console.error('Error fetching notification preferences:', error);
            throw error;
        }
    },

    /**
     * Generate mock notifications for testing when backend is not available
     * @param {number} count - Number of notifications to generate
     * @returns {Array} Array of mock notifications
     */
    getMockNotifications: (count = 10) => {
        const types = [
            'pickup_request',
            'pickup_approved',
            'pickup_rejected',
            'food_item_expiring',
            'food_item_added',
            'system_alert',
            'donation_received'
        ];

        const titles = {
            pickup_request: 'New Pickup Request',
            pickup_approved: 'Pickup Request Approved',
            pickup_rejected: 'Pickup Request Rejected',
            food_item_expiring: 'Food Item Expiring Soon',
            food_item_added: 'New Food Item Available',
            system_alert: 'System Alert',
            donation_received: 'Donation Received'
        };

        const messages = {
            pickup_request: 'Someone has requested to pick up your donation.',
            pickup_approved: 'Your pickup request has been approved.',
            pickup_rejected: 'Your pickup request has been rejected.',
            food_item_expiring: 'One of your food items is expiring soon.',
            food_item_added: 'New food item is available for pickup in your area.',
            system_alert: 'System maintenance scheduled for tonight.',
            donation_received: 'Thank you for your donation!'
        };

        // Generate a random past date within the last 7 days
        const getRandomPastDate = () => {
            const today = new Date();
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - Math.floor(Math.random() * 7));
            return pastDate.toISOString();
        };

        // Generate mock notifications
        return Array.from({ length: count }, (_, index) => {
            const type = types[Math.floor(Math.random() * types.length)];
            return {
                id: `notif-${Date.now()}-${index}`,
                type,
                title: titles[type],
                message: messages[type],
                isRead: Math.random() > 0.3, // 70% chance of being read
                createdAt: getRandomPastDate(),
                data: {
                    // Additional data related to the notification
                    itemId: type.includes('food') ? `food-${Math.floor(Math.random() * 1000)}` : null,
                    requestId: type.includes('pickup') ? `pickup-${Math.floor(Math.random() * 1000)}` : null,
                    userId: `user-${Math.floor(Math.random() * 100)}`
                }
            };
        });
    }
};

export default notificationService;
