import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import Modal from '../components/Modal';
import SimpleToast from '../components/SimpleToast';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';

const DonorDashboard = () => {
    const [activeTab, setActiveTab] = useState('food-items');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Mock data for food items
    const [foodItems] = useState([
        {
            id: 1,
            name: 'Fresh Apples',
            quantity: '50 kg',
            expiryDate: '2024-02-15',
            status: 'Available',
            category: 'Fruits',
            description: 'Organic red apples from local farm'
        },
        {
            id: 2,
            name: 'Bread Loaves',
            quantity: '30 units',
            expiryDate: '2024-02-10',
            status: 'Reserved',
            category: 'Bakery',
            description: 'Whole wheat bread loaves'
        },
        {
            id: 3,
            name: 'Rice Bags',
            quantity: '100 kg',
            expiryDate: '2024-06-01',
            status: 'Available',
            category: 'Grains',
            description: 'Basmati rice 5kg bags'
        },
        {
            id: 4,
            name: 'Vegetable Mix',
            quantity: '25 kg',
            expiryDate: '2024-02-08',
            status: 'Expired',
            category: 'Vegetables',
            description: 'Mixed seasonal vegetables'
        }
    ]);

    // Mock data for pickup requests
    const [pickupRequests] = useState([
        {
            id: 1,
            organizationName: 'City Food Bank',
            contactPerson: 'John Smith',
            phone: '+1-555-0123',
            requestedItems: ['Fresh Apples', 'Rice Bags'],
            requestDate: '2024-02-05',
            status: 'Pending',
            priority: 'High'
        },
        {
            id: 2,
            organizationName: 'Community Kitchen',
            contactPerson: 'Sarah Johnson',
            phone: '+1-555-0124',
            requestedItems: ['Bread Loaves'],
            requestDate: '2024-02-04',
            status: 'Approved',
            priority: 'Medium'
        },
        {
            id: 3,
            organizationName: 'Local Shelter',
            contactPerson: 'Mike Davis',
            phone: '+1-555-0125',
            requestedItems: ['Vegetable Mix'],
            requestDate: '2024-02-03',
            status: 'Completed',
            priority: 'Low'
        }
    ]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleAddFoodItem = () => {
        setModalType('add-food');
        setSelectedItem(null);
        setShowModal(true);
    };

    const handleEditFoodItem = (item) => {
        setModalType('edit-food');
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleViewPickupRequest = (request) => {
        setModalType('view-request');
        setSelectedItem(request);
        setShowModal(true);
    };

    const handleModalSubmit = (formData) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowModal(false);
            showToast(
                modalType === 'add-food'
                    ? 'Food item added successfully!'
                    : modalType === 'edit-food'
                        ? 'Food item updated successfully!'
                        : 'Request processed successfully!'
            );
        }, 1000);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'available': return 'text-green-600 bg-green-100';
            case 'reserved': return 'text-yellow-600 bg-yellow-100';
            case 'expired': return 'text-red-600 bg-red-100';
            case 'pending': return 'text-orange-600 bg-orange-100';
            case 'approved': return 'text-blue-600 bg-blue-100';
            case 'completed': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    // Calculate metrics
    const totalItems = foodItems.length;
    const availableItems = foodItems.filter(item => item.status === 'Available').length;
    const reservedItems = foodItems.filter(item => item.status === 'Reserved').length;
    const expiredItems = foodItems.filter(item => item.status === 'Expired').length;
    const pendingRequests = pickupRequests.filter(req => req.status === 'Pending').length;
    const completedRequests = pickupRequests.filter(req => req.status === 'Completed').length;

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFoodItems = foodItems.slice(indexOfFirstItem, indexOfLastItem);
    const currentPickupRequests = pickupRequests.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
                        <p className="mt-2 text-gray-600">Manage your food donations and track pickup requests</p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <DashboardCard
                        title="Total Food Items"
                        value={totalItems}
                        subtitle="All donated items"
                        icon={() => <div className="w-6 h-6 text-blue-600">📊</div>}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                        trend={{ value: 12, direction: 'up' }}
                    />
                    <DashboardCard
                        title="Available Items"
                        value={availableItems}
                        subtitle="Ready for pickup"
                        icon={() => <div className="w-6 h-6 text-green-600">✅</div>}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-100"
                        trend={{ value: 8, direction: 'up' }}
                    />
                    <DashboardCard
                        title="Reserved Items"
                        value={reservedItems}
                        subtitle="Awaiting pickup"
                        icon={() => <div className="w-6 h-6 text-yellow-600">⏰</div>}
                        iconColor="text-yellow-600"
                        iconBgColor="bg-yellow-100"
                        trend={{ value: 3, direction: 'down' }}
                    />
                    <DashboardCard
                        title="Pending Requests"
                        value={pendingRequests}
                        subtitle="Need approval"
                        icon={() => <div className="w-6 h-6 text-orange-600">🚚</div>}
                        iconColor="text-orange-600"
                        iconBgColor="bg-orange-100"
                        trend={{ value: 5, direction: 'up' }}
                    />
                </div>                {/* Navigation Tabs */}
                <div className="mb-6">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('food-items')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'food-items'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Food Items ({totalItems})
                        </button>
                        <button
                            onClick={() => setActiveTab('pickup-requests')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'pickup-requests'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Pickup Requests ({pickupRequests.length})
                        </button>
                    </nav>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'food-items' && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium text-gray-900">Food Items</h2>
                                <button
                                    onClick={handleAddFoodItem}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Add Food Item
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Item Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Expiry Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentFoodItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500">{item.category}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.expiryDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditFoodItem(item)}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination for food items */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(foodItems.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'pickup-requests' && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Pickup Requests</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Organization
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Request Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentPickupRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{request.organizationName}</div>
                                                    <div className="text-sm text-gray-500">{request.requestedItems.join(', ')}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm text-gray-900">{request.contactPerson}</div>
                                                    <div className="text-sm text-gray-500">{request.phone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {request.requestDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                                                    {request.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewPickupRequest(request)}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    View
                                                </button>
                                                {request.status === 'Pending' && (
                                                    <button className="text-blue-600 hover:text-blue-900">
                                                        Approve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination for pickup requests */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(pickupRequests.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={
                    modalType === 'add-food' ? 'Add Food Item' :
                        modalType === 'edit-food' ? 'Edit Food Item' :
                            'View Pickup Request'
                }
            >
                {modalType === 'add-food' || modalType === 'edit-food' ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleModalSubmit(); }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item Name</label>
                            <input
                                type="text"
                                defaultValue={selectedItem?.name || ''}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="text"
                                    defaultValue={selectedItem?.quantity || ''}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    defaultValue={selectedItem?.category || ''}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Grains">Grains</option>
                                    <option value="Bakery">Bakery</option>
                                    <option value="Dairy">Dairy</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input
                                type="date"
                                defaultValue={selectedItem?.expiryDate || ''}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows="3"
                                defaultValue={selectedItem?.description || ''}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                placeholder="Enter item description..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? <LoadingSpinner size="sm" /> : (modalType === 'add-food' ? 'Add Item' : 'Update Item')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Organization</h3>
                            <p className="mt-1 text-sm text-gray-900">{selectedItem?.organizationName}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                            <p className="mt-1 text-sm text-gray-900">{selectedItem?.contactPerson}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="mt-1 text-sm text-gray-900">{selectedItem?.phone}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Requested Items</h3>
                            <p className="mt-1 text-sm text-gray-900">{selectedItem?.requestedItems?.join(', ')}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Request Date</h3>
                                <p className="mt-1 text-sm text-gray-900">{selectedItem?.requestDate}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedItem?.priority)}`}>
                                    {selectedItem?.priority}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            {selectedItem?.status === 'Pending' && (
                                <button
                                    onClick={() => handleModalSubmit()}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Approve Request
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Toast */}
            <SimpleToast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ show: false, message: '', type: 'success' })}
            />
        </div>
    );
};

export default DonorDashboard;
