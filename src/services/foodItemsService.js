import api from './api';

/**
 * Service for food item operations
 */
const foodItemsService = {
    /**
     * Get all food items with optional filtering
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Object>} Promise resolving to food items with pagination
     */
    getAllFoodItems: async (params = {}) => {
        try {
            const response = await api.get('/food-items', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching food items:', error);
            throw error;
        }
    },

    /**
     * Get available food items (not picked up yet)
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Object>} Promise resolving to available food items
     */
    getAvailableFoodItems: async (params = {}) => {
        try {
            const response = await api.get('/food-items/available', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching available food items:', error);
            throw error;
        }
    },

    /**
     * Get a specific food item by ID
     * @param {string} id - Food item ID
     * @returns {Promise<Object>} Promise resolving to food item details
     */
    getFoodItemById: async (id) => {
        try {
            const response = await api.get(`/food-items/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching food item with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new food item
     * @param {Object} foodItemData - Food item data
     * @returns {Promise<Object>} Promise resolving to created food item
     */
    createFoodItem: async (foodItemData) => {
        try {
            const response = await api.post('/food-items', foodItemData);
            return response.data;
        } catch (error) {
            console.error('Error creating food item:', error);
            throw error;
        }
    },

    /**
     * Update an existing food item
     * @param {string} id - Food item ID
     * @param {Object} foodItemData - Updated food item data
     * @returns {Promise<Object>} Promise resolving to updated food item
     */
    updateFoodItem: async (id, foodItemData) => {
        try {
            const response = await api.put(`/food-items/${id}`, foodItemData);
            return response.data;
        } catch (error) {
            console.error(`Error updating food item with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete a food item
     * @param {string} id - Food item ID
     * @returns {Promise<Object>} Promise resolving to deletion status
     */
    deleteFoodItem: async (id) => {
        try {
            const response = await api.delete(`/food-items/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting food item with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get food items donated by a specific user
     * @param {string} userId - User ID
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Object>} Promise resolving to user's donated food items
     */
    getUserDonations: async (userId, params = {}) => {
        try {
            const response = await api.get(`/food-items/donated-by/${userId}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching donations by user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Search food items by criteria
     * @param {Object} searchParams - Search parameters
     * @returns {Promise<Object>} Promise resolving to matching food items
     */
    searchFoodItems: async (searchParams = {}) => {
        try {
            const response = await api.get('/food-items/search', { params: searchParams });
            return response.data;
        } catch (error) {
            console.error('Error searching food items:', error);
            throw error;
        }
    },

    /**
     * Get food items by category
     * @param {string} category - Food category
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise<Object>} Promise resolving to food items in the category
     */
    getFoodItemsByCategory: async (category, params = {}) => {
        try {
            const response = await api.get(`/food-items/category/${category}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching food items in category ${category}:`, error);
            throw error;
        }
    },

    /**
     * Mark a food item as picked up
     * @param {string} id - Food item ID
     * @param {Object} pickupData - Pickup details
     * @returns {Promise<Object>} Promise resolving to updated food item
     */
    markAsPickedUp: async (id, pickupData) => {
        try {
            const response = await api.patch(`/food-items/${id}/pickup`, pickupData);
            return response.data;
        } catch (error) {
            console.error(`Error marking food item ${id} as picked up:`, error);
            throw error;
        }
    },

    /**
     * Generate mock data for testing when backend is not available
     * @param {number} count - Number of items to generate
     * @returns {Array} Array of mock food items
     */
    getMockFoodItems: (count = 10) => {
        const foodNames = [
            'Apples', 'Bananas', 'Bread', 'Milk', 'Eggs', 'Cheese', 'Pasta',
            'Rice', 'Potatoes', 'Tomatoes', 'Lettuce', 'Chicken', 'Beef',
            'Fish', 'Yogurt', 'Cereal', 'Canned Beans', 'Carrots', 'Onions', 'Flour'
        ];

        const units = ['kg', 'lbs', 'pcs', 'dozen', 'liters', 'gallons', 'packages'];

        const descriptions = [
            'Fresh and organic, locally sourced',
            'Nearing expiry but still good quality',
            'Excess inventory from our store',
            'Unopened and unused',
            'Slightly bruised but perfectly edible',
            'Packaging slightly damaged but contents are perfect',
            'Bought too much and won\'t be able to use before expiry',
            'Restaurant surplus, never served to customers',
            'Farm fresh, just harvested',
            'Bulk purchase split, more than we need'
        ];

        const locations = [
            '123 Main St, Downtown',
            '456 Oak Ave, Westside',
            '789 Pine Rd, Northgate',
            '321 Elm Blvd, Eastend',
            '654 Maple Dr, Southpark'
        ];

        const donorNames = [
            'Local Supermarket',
            'Corner Grocery',
            'Farm Fresh Co-op',
            'Restaurant Depot',
            'Community Kitchen',
            'John\'s Bakery',
            'Green Acres Farm',
            'Sarah\'s Organic Store'
        ];

        // Generate a random date within the next 7 days
        const getRandomFutureDate = () => {
            const today = new Date();
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + Math.floor(Math.random() * 7));
            return futureDate.toISOString().split('T')[0];
        };

        // Generate mock food items
        return Array.from({ length: count }, (_, index) => ({
            id: `food-${Date.now()}-${index}`,
            name: foodNames[Math.floor(Math.random() * foodNames.length)],
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            quantity: Math.floor(Math.random() * 20) + 1,
            unit: units[Math.floor(Math.random() * units.length)],
            expiryDate: getRandomFutureDate(),
            imageUrl: `https://source.unsplash.com/200x200/?food,${index}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            donorName: donorNames[Math.floor(Math.random() * donorNames.length)],
            donorId: `user-${Math.floor(Math.random() * 1000)}`,
            isAvailable: Math.random() > 0.2, // 80% chance of being available
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            category: Math.random() > 0.5 ? 'Perishable' : 'Non-perishable',
            tags: ['food', index % 2 === 0 ? 'vegetarian' : 'general']
        }));
    }
};

export default foodItemsService;
