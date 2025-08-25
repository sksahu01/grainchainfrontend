import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { currentUser, logout, isDonor, isReceiver, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-green-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold flex items-center">
                    <span className="mr-2">🌱</span> GrainChain
                </Link>

                <div className="flex items-center space-x-4">
                    {currentUser ? (
                        <>
                            {/* Dashboard links based on role */}
                            {isDonor() && (
                                <Link to="/donor-dashboard" className="hover:text-green-200">
                                    Donor Dashboard
                                </Link>
                            )}

                            {isReceiver() && (
                                <Link to="/receiver-dashboard" className="hover:text-green-200">
                                    Receiver Dashboard
                                </Link>
                            )}

                            {isAdmin() && (
                                <Link to="/admin-dashboard" className="hover:text-green-200">
                                    Admin Dashboard
                                </Link>
                            )}

                            {/* Notification Bell */}
                            <NotificationBell />

                            <div className="relative group">
                                <button className="flex items-center hover:text-green-200">
                                    <span className="mr-1">{currentUser.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-green-200">Login</Link>
                            <Link to="/register" className="bg-white text-green-600 px-4 py-2 rounded hover:bg-green-100">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
