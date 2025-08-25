import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const FoodCard = ({
    id,
    name,
    description,
    quantity,
    unit,
    expiryDate,
    imageUrl,
    donorName,
    location,
    isAvailable,
    onRequestPickup,
    showActions = true,
    showDonorInfo = true,
}) => {
    // Format expiry date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Calculate days until expiry
    const getDaysUntilExpiry = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryDate = new Date(dateString);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

    // Determine badge color based on days until expiry
    const getBadgeColor = (days) => {
        if (days <= 1) return 'bg-red-100 text-red-800'; // Today or tomorrow
        if (days <= 3) return 'bg-yellow-100 text-yellow-800'; // 2-3 days
        return 'bg-green-100 text-green-800'; // 4+ days
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Food Image */}
            <div className="relative h-48 bg-gray-200">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-4xl">🍽️</span>
                    </div>
                )}

                {/* Availability Badge */}
                {isAvailable ? (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                        Available
                    </span>
                ) : (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">
                        Reserved
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                    {expiryDate && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getBadgeColor(daysUntilExpiry)}`}>
                            {daysUntilExpiry === 0 ? 'Expires Today' :
                                daysUntilExpiry === 1 ? 'Expires Tomorrow' :
                                    `Expires in ${daysUntilExpiry} days`}
                        </span>
                    )}
                </div>

                {description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
                )}

                <div className="flex items-center justify-between mb-3">
                    <div className="text-gray-700">
                        <span className="font-medium">{quantity}</span> {unit}
                    </div>
                    {expiryDate && (
                        <div className="text-xs text-gray-500">
                            Best before: {formatDate(expiryDate)}
                        </div>
                    )}
                </div>

                {/* Donor Info */}
                {showDonorInfo && donorName && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span>{donorName}</span>
                    </div>
                )}

                {/* Location */}
                {location && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{location}</span>
                    </div>
                )}

                {/* Action Buttons */}
                {showActions && (
                    <div className="flex space-x-2 mt-2">
                        <Link
                            to={`/food/${id}`}
                            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300"
                        >
                            View Details
                        </Link>
                        {isAvailable && onRequestPickup && (
                            <button
                                onClick={() => onRequestPickup(id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300"
                            >
                                Request Pickup
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

FoodCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    donorName: PropTypes.string,
    location: PropTypes.string,
    isAvailable: PropTypes.bool.isRequired,
    onRequestPickup: PropTypes.func,
    showActions: PropTypes.bool,
    showDonorInfo: PropTypes.bool,
};

export default FoodCard;
