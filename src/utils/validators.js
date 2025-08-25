/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Password validation - at least 8 characters, 1 uppercase, 1 lowercase, 1 number
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
};

/**
 * Check if required fields are filled
 * @param {object} data - Object containing form data
 * @param {array} fields - Array of required field names
 * @returns {boolean} - True if all required fields are filled, false otherwise
 */
export const validateRequiredFields = (data, fields) => {
    return fields.every((field) => data[field] && data[field].trim() !== '');
};

/**
 * Validate food item details
 * @param {object} foodItem - Food item data
 * @returns {object} - Object containing validation result and errors
 */
export const validateFoodItem = (foodItem) => {
    const errors = {};

    if (!foodItem.name || foodItem.name.trim() === '') {
        errors.name = 'Name is required';
    }

    if (!foodItem.quantity || foodItem.quantity <= 0) {
        errors.quantity = 'Quantity must be greater than 0';
    }

    if (!foodItem.expiryDate) {
        errors.expiryDate = 'Expiry date is required';
    } else {
        const currentDate = new Date();
        const expiryDate = new Date(foodItem.expiryDate);
        if (expiryDate < currentDate) {
            errors.expiryDate = 'Expiry date cannot be in the past';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
