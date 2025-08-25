import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

// Create auth context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on component mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authAPI.getCurrentUser();
                    setCurrentUser(response.data);
                } catch (err) {
                    console.error('Failed to load user:', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Login user
    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authAPI.login(credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setCurrentUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            throw err;
        }
    };

    // Register new user
    const register = async (userData) => {
        try {
            setError(null);
            const response = await authAPI.register(userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setCurrentUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            throw err;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    // Check if user has a specific role
    const hasRole = (role) => {
        return currentUser?.role === role;
    };

    // Value to be provided by the context
    const value = {
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        hasRole,
        isDonor: () => hasRole('donor'),
        isReceiver: () => hasRole('receiver'),
        isAdmin: () => hasRole('admin'),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
