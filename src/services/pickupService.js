import api from './api';

/**
 * Service for pickup request operations
 */
const pickupService = {
    /**
     * Get all pickup requests with optional filtering
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Object>} Promise resolving to pickup requests with pagination
     */
    getAllPickupRequests: async (params = {}) => {
        try {
            const response = await api.get('/pickups', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching pickup requests:', error);
            throw error;
        }
    },

    /**
     * Get a specific pickup request by ID
     * @param {string} id - Pickup request ID
     * @returns {Promise<Object>} Promise resolving to pickup request details
     */
    getPickupRequestById: async (id) => {
        try {
            const response = await api.get(`/pickups/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching pickup request with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new pickup request
     * @param {Object} pickupData - Pickup request data
     * @returns {Promise<Object>} Promise resolving to created pickup request
     */
    createPickupRequest: async (pickupData) => {
        try {
            const response = await api.post('/pickups', pickupData);
            return response.data;
        } catch (error) {
            console.error('Error creating pickup request:', error);
            throw error;
        }
    },

    /**
     * Update an existing pickup request
     * @param {string} id - Pickup request ID
     * @param {Object} pickupData - Updated pickup request data
     * @returns {Promise<Object>} Promise resolving to updated pickup request
     */
    updatePickupRequest: async (id, pickupData) => {
        try {
            const response = await api.put(`/pickups/${id}`, pickupData);
            return response.data;
        } catch (error) {
            console.error(`Error updating pickup request with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete a pickup request
     * @param {string} id - Pickup request ID
     * @returns {Promise<Object>} Promise resolving to deletion status
     */
    deletePickupRequest: async (id) => {
        try {
            const response = await api.delete(`/pickups/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting pickup request with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get pickup requests by receiver ID
     * @param {string} receiverId - Receiver user ID
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Object>} Promise resolving to receiver's pickup requests
     */
    getReceiverPickupRequests: async (receiverId, params = {}) => {
        try {
            const response = await api.get(`/pickups/receiver/${receiverId}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching pickup requests for receiver ${receiverId}:`, error);
            throw error;
        }
    },

    /**
     * Get pickup requests for a donor's food items
     * @param {string} donorId - Donor user ID
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Object>} Promise resolving to donor's food item pickup requests
     */
    getDonorPickupRequests: async (donorId, params = {}) => {
        try {
            const response = await api.get(`/pickups/donor/${donorId}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching pickup requests for donor ${donorId}:`, error);
            throw error;
        }
    },

    /**
     * Get pickup requests for a specific food item
     * @param {string} foodItemId - Food item ID
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Object>} Promise resolving to food item's pickup requests
     */
    getFoodItemPickupRequests: async (foodItemId, params = {}) => {
        try {
            const response = await api.get(`/pickups/food-item/${foodItemId}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching pickup requests for food item ${foodItemId}:`, error);
            throw error;
        }
    },

    /**
     * Change pickup request status
     * @param {string} id - Pickup request ID
     * @param {string} status - New status (pending, approved, rejected, completed, cancelled)
     * @param {Object} statusData - Additional data for status change
     * @returns {Promise<Object>} Promise resolving to updated pickup request
     */
    changePickupStatus: async (id, status, statusData = {}) => {
        try {
            const response = await api.patch(`/pickups/${id}/status`, {
                status,
                ...statusData
            });
            return response.data;
        } catch (error) {
            console.error(`Error changing pickup request ${id} status to ${status}:`, error);
            throw error;
        }
    },

    /**
     * Approve a pickup request
     * @param {string} id - Pickup request ID
     * @param {Object} approvalData - Approval details
     * @returns {Promise<Object>} Promise resolving to updated pickup request
     */
    approvePickupRequest: async (id, approvalData = {}) => {
        return this.changePickupStatus(id, 'approved', approvalData);
    },

    /**
     * Reject a pickup request
     * @param {string} id - Pickup request ID
     * @param {Object} rejectionData - Rejection details (e.g., reason)
     * @returns {Promise<Object>} Promise resolving to updated pickup request
     */
    rejectPickupRequest: async (id, rejectionData = {}) => {
        return this.changePickupStatus(id, 'rejected', rejectionData);
    },

    /**
     * Mark a pickup request as completed
     * @param {string} id - Pickup request ID
     * @param {Object} completionData - Completion details
     * @returns {Promise<Object>} Promise resolving to updated pickup request
     */
    completePickupRequest: async (id, completionData = {}) => {
        return this.changePickupStatus(id, 'completed', completionData);
    },

    /**
     * Cancel a pickup request
     * @param {string} id - Pickup request ID
     * @param {Object} cancellationData - Cancellation details (e.g., reason)
     * @returns {Promise<Object>} Promise resolving to updated pickup request
     */
    cancelPickupRequest: async (id, cancellationData = {}) => {
        return this.changePickupStatus(id, 'cancelled', cancellationData);
    },

    /**
     * Generate mock data for testing when backend is not available
     * @param {number} count - Number of items to generate
     * @returns {Array} Array of mock pickup requests
     */
    getMockPickupRequests: (count = 10) => {
        const statuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];

        const pickupTimes = [
            '09:00 AM - 12:00 PM',
            '12:00 PM - 03:00 PM',
            '03:00 PM - 06:00 PM',
            '06:00 PM - 09:00 PM'
        ];

        const foodNames = [
            'Apples', 'Bananas', 'Bread', 'Milk', 'Eggs', 'Cheese', 'Pasta',
            'Rice', 'Potatoes', 'Tomatoes', 'Lettuce', 'Chicken', 'Beef'
        ];

        const receiverNames = [
            'Community Shelter',
            'Food Bank Central',
            'Homeless Outreach',
            'Family Support Center',
            'Youth Services'
        ];

        const donorNames = [
            'Local Supermarket',
            'Corner Grocery',
            'Farm Fresh Co-op',
            'Restaurant Depot',
            'Community Kitchen'
        ];

        // Generate a random date within the next 5 days
        const getRandomFutureDate = () => {
            const today = new Date();
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + Math.floor(Math.random() * 5));
            return futureDate.toISOString().split('T')[0];
        };

        // Generate a random past date within the last 30 days
        const getRandomPastDate = () => {
            const today = new Date();
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - Math.floor(Math.random() * 30) - 1);
            return pastDate.toISOString();
        };

        // Generate mock pickup requests
        return Array.from({ length: count }, (_, index) => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const isCompleted = status === 'completed';
            const isCancelled = status === 'cancelled';
            const isRejected = status === 'rejected';

            return {
                id: `pickup-${Date.now()}-${index}`,
                foodItemId: `food-${Math.floor(Math.random() * 1000)}`,
                foodItemName: foodNames[Math.floor(Math.random() * foodNames.length)],
                receiverId: `user-receiver-${Math.floor(Math.random() * 100)}`,
                receiverName: receiverNames[Math.floor(Math.random() * receiverNames.length)],
                donorId: `user-donor-${Math.floor(Math.random() * 100)}`,
                donorName: donorNames[Math.floor(Math.random() * donorNames.length)],
                status,
                pickupDate: getRandomFutureDate(),
                pickupTime: pickupTimes[Math.floor(Math.random() * pickupTimes.length)],
                notes: `Please ${Math.random() > 0.5 ? 'call' : 'message'} before arriving.`,
                createdAt: getRandomPastDate(),
                updatedAt: new Date().toISOString(),
                completedAt: isCompleted ? new Date().toISOString() : null,
                cancelledAt: isCancelled ? new Date().toISOString() : null,
                rejectionReason: isRejected ? 'Item no longer available' : null,
                cancellationReason: isCancelled ? 'Changed plans, no longer needed' : null,
                quantity: Math.floor(Math.random() * 10) + 1
            };
        });
    }
};

export default pickupService;
