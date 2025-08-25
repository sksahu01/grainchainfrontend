import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import PickupForm from '../components/PickupForm';
import { foodItemsAPI, pickupRequestsAPI } from '../services/api';

const ReceiverDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for available food items
    const [availableFoodItems, setAvailableFoodItems] = useState([]);
    const [selectedFoodItem, setSelectedFoodItem] = useState(null);

    // State for pickup requests
    const [pickupRequests, setPickupRequests] = useState([]);
    const [selectedTab, setSelectedTab] = useState('active');

    // State for filters
    const [filters, setFilters] = useState({
        category: 'all',
        expiryDate: 'all',
        searchQuery: '',
    });

    // State for pickup form
    const [showPickupForm, setShowPickupForm] = useState(false);
    const [pickupFormError, setPickupFormError] = useState('');
    const [isSubmittingPickup, setIsSubmittingPickup] = useState(false);

    // Fetch available food items and receiver's pickup requests
    useEffect(() => {
        const fetchReceiverData = async () => {
            try {
                setLoading(true);

                // Fetch available food items
                const foodItemsResponse = await foodItemsAPI.getAll({ isAvailable: true });
                setAvailableFoodItems(foodItemsResponse.data);

                // Fetch pickup requests made by this receiver
                const pickupRequestsResponse = await pickupRequestsAPI.getByReceiver(currentUser.id);
                setPickupRequests(pickupRequestsResponse.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching receiver data:', err);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            }
        };

        if (currentUser?.id) {
            fetchReceiverData();
        }
    }, [currentUser]);

    // Filter food items based on selected filters
    const filteredFoodItems = availableFoodItems.filter(item => {
        // Filter by category
        if (filters.category !== 'all' && item.category !== filters.category) {
            return false;
        }

        // Filter by expiry date
        if (filters.expiryDate !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiryDate = new Date(item.expiryDate);

            if (filters.expiryDate === 'today') {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                if (!(expiryDate >= today && expiryDate < tomorrow)) {
                    return false;
                }
            } else if (filters.expiryDate === 'this-week') {
                const weekLater = new Date(today);
                weekLater.setDate(weekLater.getDate() + 7);
                if (!(expiryDate >= today && expiryDate <= weekLater)) {
                    return false;
                }
            }
        }

        // Filter by search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            return (
                item.name.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query)) ||
                (item.donorName && item.donorName.toLowerCase().includes(query))
            );
        }

        return true;
    });

    // Filter pickup requests based on selected tab
    const filteredPickupRequests = pickupRequests.filter(request => {
        if (selectedTab === 'active') {
            return ['pending', 'approved'].includes(request.status);
        } else if (selectedTab === 'completed') {
            return request.status === 'completed';
        } else if (selectedTab === 'cancelled') {
            return request.status === 'cancelled';
        }
        return true; // Show all by default
    });

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    // Handle search query change
    const handleSearchChange = (e) => {
        setFilters({
            ...filters,
            searchQuery: e.target.value,
        });
    };

    // Handle pickup request
    const handleRequestPickup = (foodItemId) => {
        const foodItem = availableFoodItems.find(item => item.id === foodItemId);
        if (foodItem) {
            setSelectedFoodItem(foodItem);
            setShowPickupForm(true);
            setPickupFormError('');
        }
    };

    // Handle pickup form submit
    const handleSubmitPickup = async (pickupData) => {
        try {
            setIsSubmittingPickup(true);
            setPickupFormError('');

            // Add receiver ID to pickup data
            const fullPickupData = {
                ...pickupData,
                receiverId: currentUser.id,
            };

            // Send pickup request to API
            const response = await pickupRequestsAPI.create(fullPickupData);

            // Refresh pickup requests
            const pickupRequestsResponse = await pickupRequestsAPI.getByReceiver(currentUser.id);
            setPickupRequests(pickupRequestsResponse.data);

            // Close form and reset selection
            setShowPickupForm(false);
            setSelectedFoodItem(null);

            // Show success message or notification
            alert('Pickup request submitted successfully!');

        } catch (err) {
            console.error('Error submitting pickup request:', err);
            setPickupFormError(err.response?.data?.message || 'Failed to submit pickup request. Please try again.');
        } finally {
            setIsSubmittingPickup(false);
        }
    };

    // Handle cancellation of pickup request
    const handleCancelPickup = async (requestId) => {
        if (window.confirm('Are you sure you want to cancel this pickup request?')) {
            try {
                await pickupRequestsAPI.cancel(requestId);

                // Refresh pickup requests
                const pickupRequestsResponse = await pickupRequestsAPI.getByReceiver(currentUser.id);
                setPickupRequests(pickupRequestsResponse.data);

            } catch (err) {
                console.error('Error cancelling pickup request:', err);
                setError('Failed to cancel pickup request. Please try again.');
            }
        }
    };

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Receiver Dashboard</h1>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    {/* Welcome section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                        <h2 className="text-xl font-semibold mb-2">Welcome, {currentUser?.name || 'Receiver'}!</h2>
                        <p className="text-gray-600">
                            Browse available food items below and request pickups. You can track your pickup requests in the "Your Pickup Requests" section.
                        </p>
                    </div>

                    {/* Available Food Items Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                        <h2 className="text-xl font-semibold mb-6">Available Food Items</h2>

                        {/* Filters */}
                        <div className="bg-gray-50 p-4 rounded-md mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Category Filter */}
                                <div className="flex-1">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="produce">Fresh Produce</option>
                                        <option value="dairy">Dairy</option>
                                        <option value="bakery">Bakery</option>
                                        <option value="meat">Meat & Seafood</option>
                                        <option value="grocery">Grocery & Pantry</option>
                                        <option value="prepared">Prepared Meals</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Expiry Date Filter */}
                                <div className="flex-1">
                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date
                                    </label>
                                    <select
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={filters.expiryDate}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="all">All Dates</option>
                                        <option value="today">Expiring Today</option>
                                        <option value="this-week">Expiring This Week</option>
                                    </select>
                                </div>

                                {/* Search */}
                                <div className="flex-1">
                                    <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        id="searchQuery"
                                        name="searchQuery"
                                        value={filters.searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search food items..."
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Food Items Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="text-gray-500">Loading available food items...</div>
                            </div>
                        ) : filteredFoodItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredFoodItems.map((item) => (
                                    <FoodCard
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        description={item.description}
                                        quantity={item.quantity}
                                        unit={item.unit}
                                        expiryDate={item.expiryDate}
                                        imageUrl={item.imageUrl}
                                        donorName={item.donorName}
                                        location={item.location}
                                        isAvailable={item.isAvailable}
                                        onRequestPickup={handleRequestPickup}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No available food items match your filters.</p>
                            </div>
                        )}
                    </div>

                    {/* Pickup Requests Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Your Pickup Requests</h2>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex -mb-px space-x-8">
                                <button
                                    onClick={() => setSelectedTab('active')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'active'
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setSelectedTab('completed')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'completed'
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Completed
                                </button>
                                <button
                                    onClick={() => setSelectedTab('cancelled')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'cancelled'
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Cancelled
                                </button>
                            </nav>
                        </div>

                        {/* Pickup Requests List */}
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="text-gray-500">Loading pickup requests...</div>
                            </div>
                        ) : filteredPickupRequests.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Food Item
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Donor
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pickup Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPickupRequests.map((request) => (
                                            <tr key={request.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{request.foodItem?.name || 'Unknown Item'}</div>
                                                    <div className="text-sm text-gray-500">{request.foodItem?.quantity} {request.foodItem?.unit}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{request.donor?.name || 'Unknown Donor'}</div>
                                                    <div className="text-sm text-gray-500">{request.donor?.organizationName || ''}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(request.pickupDateTime).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(request.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {(request.status === 'pending' || request.status === 'approved') && (
                                                        <button
                                                            onClick={() => handleCancelPickup(request.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No {selectedTab} pickup requests found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Pickup Request Modal */}
            {showPickupForm && selectedFoodItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Request Pickup</h3>
                                <button
                                    onClick={() => {
                                        setShowPickupForm(false);
                                        setSelectedFoodItem(null);
                                        setPickupFormError('');
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <PickupForm
                                foodItem={selectedFoodItem}
                                onSubmit={handleSubmitPickup}
                                isLoading={isSubmittingPickup}
                                error={pickupFormError}
                            />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ReceiverDashboard;
