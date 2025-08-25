import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PickupForm = ({ foodItem, onSubmit, isLoading, error }) => {
    const [formData, setFormData] = useState({
        pickupDate: '',
        pickupTime: '',
        notes: '',
    });

    const [formErrors, setFormErrors] = useState({});

    // Calculate minimum pickup date (today)
    const today = new Date().toISOString().split('T')[0];

    // Calculate maximum pickup date (expiry date or 7 days from now)
    const getMaxPickupDate = () => {
        if (foodItem.expiryDate) {
            return new Date(foodItem.expiryDate).toISOString().split('T')[0];
        } else {
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 7);
            return maxDate.toISOString().split('T')[0];
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: null,
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.pickupDate) {
            errors.pickupDate = 'Pickup date is required';
        }

        if (!formData.pickupTime) {
            errors.pickupTime = 'Pickup time is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validation = validateForm();
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        // Combine date and time for submission
        const combinedDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);

        onSubmit({
            foodItemId: foodItem.id,
            pickupDateTime: combinedDateTime.toISOString(),
            notes: formData.notes,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Schedule Pickup</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Date
                    </label>
                    {formErrors.pickupDate && (
                        <span className="text-xs text-red-600">{formErrors.pickupDate}</span>
                    )}
                </div>
                <input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={today}
                    max={getMaxPickupDate()}
                    className={`w-full p-2 border rounded-md ${formErrors.pickupDate ? 'border-red-300' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Time
                    </label>
                    {formErrors.pickupTime && (
                        <span className="text-xs text-red-600">{formErrors.pickupTime}</span>
                    )}
                </div>
                <input
                    type="time"
                    id="pickupTime"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${formErrors.pickupTime ? 'border-red-300' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special instructions or notes for the donor..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    <p>Food Item: {foodItem.name}</p>
                    <p>Quantity: {foodItem.quantity} {foodItem.unit}</p>
                    {foodItem.expiryDate && (
                        <p>Expires: {new Date(foodItem.expiryDate).toLocaleDateString()}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-md ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300`}
                >
                    {isLoading ? 'Submitting...' : 'Request Pickup'}
                </button>
            </div>
        </form>
    );
};

PickupForm.propTypes = {
    foodItem: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        expiryDate: PropTypes.string,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
};

PickupForm.defaultProps = {
    isLoading: false,
    error: null,
};

export default PickupForm;
