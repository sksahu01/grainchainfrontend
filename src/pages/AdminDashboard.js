import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usersAPI, analyticsAPI } from '../services/api';

// Chart component (you would typically use a library like Chart.js or Recharts)
// This is a simplified placeholder
const Chart = ({ data, title, type }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm h-64 flex flex-col">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <div className="flex-grow flex items-end justify-around">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div
                        className="bg-green-500 w-16"
                        style={{
                            height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                            minHeight: '10px',
                            backgroundColor: item.color || '#10B981'
                        }}
                    ></div>
                    <div className="text-xs mt-2">{item.label}</div>
                </div>
            ))}
        </div>
    </div>
);

const AdminDashboard = () => {
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Dashboard data
    const [users, setUsers] = useState([]);
    const [summaryData, setSummaryData] = useState({
        totalUsers: 0,
        totalDonors: 0,
        totalReceivers: 0,
        totalFoodItems: 0,
        totalPickups: 0,
        totalKgSaved: 0,
        co2Reduction: 0,
    });

    // Charts data
    const [foodSavedData, setFoodSavedData] = useState([]);
    const [co2ReductionData, setCO2ReductionData] = useState([]);
    const [donationsByRegionData, setDonationsByRegionData] = useState([]);

    // User management
    const [selectedUser, setSelectedUser] = useState(null);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [userRoleToChange, setUserRoleToChange] = useState('');

    // Time frame for charts
    const [timeFrame, setTimeFrame] = useState('month');

    // Fetch admin dashboard data
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);

                // Fetch users
                const usersResponse = await usersAPI.getAll();
                setUsers(usersResponse.data);

                // Fetch summary data
                const summaryResponse = await analyticsAPI.getSummary();
                setSummaryData(summaryResponse.data);

                // Fetch chart data
                const foodSavedResponse = await analyticsAPI.getFoodSaved(timeFrame);
                setFoodSavedData(foodSavedResponse.data);

                const co2Response = await analyticsAPI.getCO2Reduction(timeFrame);
                setCO2ReductionData(co2Response.data);

                const regionResponse = await analyticsAPI.getDonationsByRegion();
                setDonationsByRegionData(regionResponse.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        if (currentUser?.id && currentUser?.role === 'admin') {
            fetchAdminData();
        } else {
            setError('You do not have permission to view this page.');
            setLoading(false);
        }
    }, [currentUser, timeFrame]);

    // Handle time frame change
    const handleTimeFrameChange = (newTimeFrame) => {
        setTimeFrame(newTimeFrame);
    };

    // Handle user role change
    const handleRoleChange = async () => {
        if (!selectedUser || !userRoleToChange) return;

        try {
            await usersAPI.changeRole(selectedUser.id, userRoleToChange);

            // Update user in the list
            setUsers(users.map(user =>
                user.id === selectedUser.id
                    ? { ...user, role: userRoleToChange }
                    : user
            ));

            // Close modal
            setUserModalOpen(false);
            setSelectedUser(null);
            setUserRoleToChange('');

        } catch (err) {
            console.error('Error changing user role:', err);
            setError('Failed to change user role. Please try again.');
        }
    };

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await usersAPI.delete(userId);

                // Remove user from the list
                setUsers(users.filter(user => user.id !== userId));

            } catch (err) {
                console.error('Error deleting user:', err);
                setError('Failed to delete user. Please try again.');
            }
        }
    };

    // Format large numbers for display
    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    // Generate sample chart data for demonstration
    // In a real app, these would come from the API
    const sampleFoodSavedData = [
        { label: 'Jan', value: 120, color: '#10B981' },
        { label: 'Feb', value: 150, color: '#10B981' },
        { label: 'Mar', value: 180, color: '#10B981' },
        { label: 'Apr', value: 220, color: '#10B981' },
        { label: 'May', value: 200, color: '#10B981' },
        { label: 'Jun', value: 250, color: '#10B981' },
    ];

    const sampleCO2ReductionData = [
        { label: 'Jan', value: 80, color: '#6366F1' },
        { label: 'Feb', value: 100, color: '#6366F1' },
        { label: 'Mar', value: 120, color: '#6366F1' },
        { label: 'Apr', value: 150, color: '#6366F1' },
        { label: 'May', value: 140, color: '#6366F1' },
        { label: 'Jun', value: 170, color: '#6366F1' },
    ];

    const sampleDonationsByRegionData = [
        { label: 'Downtown', value: 350, color: '#F59E0B' },
        { label: 'Uptown', value: 250, color: '#F59E0B' },
        { label: 'Midtown', value: 180, color: '#F59E0B' },
        { label: 'Suburbs', value: 120, color: '#F59E0B' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    {/* Loading state */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-500">Loading dashboard data...</div>
                        </div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* Total Users */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                                            <p className="text-2xl font-semibold text-gray-900">{formatNumber(summaryData.totalUsers || 0)}</p>
                                        </div>
                                        <div className="bg-green-100 rounded-full p-3">
                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex text-sm mt-4">
                                        <div className="mr-4">
                                            <span className="text-gray-500">Donors:</span>
                                            <span className="font-medium ml-1">{formatNumber(summaryData.totalDonors || 0)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Receivers:</span>
                                            <span className="font-medium ml-1">{formatNumber(summaryData.totalReceivers || 0)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Food Items */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Food Items</p>
                                            <p className="text-2xl font-semibold text-gray-900">{formatNumber(summaryData.totalFoodItems || 0)}</p>
                                        </div>
                                        <div className="bg-blue-100 rounded-full p-3">
                                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <span className="text-gray-500">Completed Pickups:</span>
                                        <span className="font-medium ml-1">{formatNumber(summaryData.totalPickups || 0)}</span>
                                    </div>
                                </div>

                                {/* Food Saved */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Food Saved</p>
                                            <p className="text-2xl font-semibold text-gray-900">{formatNumber(summaryData.totalKgSaved || 0)} kg</p>
                                        </div>
                                        <div className="bg-green-100 rounded-full p-3">
                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-green-600">
                                        <span className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                            </svg>
                                            12% increase this month
                                        </span>
                                    </div>
                                </div>

                                {/* CO2 Reduction */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">CO₂ Reduction</p>
                                            <p className="text-2xl font-semibold text-gray-900">{formatNumber(summaryData.co2Reduction || 0)} kg</p>
                                        </div>
                                        <div className="bg-indigo-100 rounded-full p-3">
                                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-green-600">
                                        <span className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                            </svg>
                                            8% increase this month
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Analytics</h2>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleTimeFrameChange('month')}
                                            className={`px-3 py-1 text-sm rounded ${timeFrame === 'month'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white text-gray-600'
                                                }`}
                                        >
                                            Month
                                        </button>
                                        <button
                                            onClick={() => handleTimeFrameChange('quarter')}
                                            className={`px-3 py-1 text-sm rounded ${timeFrame === 'quarter'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white text-gray-600'
                                                }`}
                                        >
                                            Quarter
                                        </button>
                                        <button
                                            onClick={() => handleTimeFrameChange('year')}
                                            className={`px-3 py-1 text-sm rounded ${timeFrame === 'year'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white text-gray-600'
                                                }`}
                                        >
                                            Year
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Food Saved Chart */}
                                    <Chart
                                        data={sampleFoodSavedData}
                                        title="Food Saved (kg)"
                                        type="bar"
                                    />

                                    {/* CO2 Reduction Chart */}
                                    <Chart
                                        data={sampleCO2ReductionData}
                                        title="CO₂ Reduction (kg)"
                                        type="bar"
                                    />

                                    {/* Donations by Region Chart */}
                                    <Chart
                                        data={sampleDonationsByRegionData}
                                        title="Donations by Region"
                                        type="bar"
                                    />
                                </div>
                            </div>

                            {/* User Management Section */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-6">User Management</h2>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Registered On
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {/* Sample user data - would come from API in real app */}
                                            {[
                                                { id: '1', name: 'John Doe', email: 'john@example.com', role: 'donor', createdAt: '2023-05-10T10:30:00Z' },
                                                { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'receiver', createdAt: '2023-06-15T14:20:00Z' },
                                                { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'donor', createdAt: '2023-07-22T09:45:00Z' },
                                                { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'receiver', createdAt: '2023-08-05T16:10:00Z' },
                                            ].map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'donor'
                                                                ? 'bg-green-100 text-green-800'
                                                                : user.role === 'receiver'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-purple-100 text-purple-800'
                                                            }`}>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setUserRoleToChange(user.role);
                                                                setUserModalOpen(true);
                                                            }}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Change Role
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* User Role Change Modal */}
            {userModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Change User Role</h3>
                                <button
                                    onClick={() => {
                                        setUserModalOpen(false);
                                        setSelectedUser(null);
                                        setUserRoleToChange('');
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <p className="mb-4">
                                Change role for user: <span className="font-medium">{selectedUser.name}</span>
                            </p>

                            <div className="mb-4">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    value={userRoleToChange}
                                    onChange={(e) => setUserRoleToChange(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="donor">Donor</option>
                                    <option value="receiver">Receiver</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        setUserModalOpen(false);
                                        setSelectedUser(null);
                                        setUserRoleToChange('');
                                    }}
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md mr-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRoleChange}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AdminDashboard;
