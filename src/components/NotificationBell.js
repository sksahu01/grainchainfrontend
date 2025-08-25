import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import notificationService from '../services/notificationService';

const NotificationBell = ({ maxDisplayNotifications = 5 }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();


    // Fetch notifications from the API
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            // For demo, we'll use mock data
            // In production, uncomment the API call below
            // const response = await notificationService.getUserNotifications({ 
            //   limit: maxDisplayNotifications, 
            //   sort: 'createdAt:desc' 
            // });
            // setNotifications(response.data);
            // setUnreadCount(response.data.filter(notif => !notif.isRead).length);

            // Mock data for development
            const mockNotifications = notificationService.getMockNotifications(maxDisplayNotifications);
            setNotifications(mockNotifications);
            setUnreadCount(mockNotifications.filter(notif => !notif.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [maxDisplayNotifications]);

    // Fetch notifications on component mount
    useEffect(() => {
        fetchNotifications();

        // Set up an interval to check for new notifications
        const intervalId = setInterval(() => {
            fetchUnreadCount();
        }, 60000); // Check every minute

        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ...existing code...

    // Fetch only the unread count
    const fetchUnreadCount = async () => {
        try {
            // For demo, we'll use mock data
            // In production, uncomment the API call below
            // const count = await notificationService.getUnreadCount();
            // setUnreadCount(count);

            // Mock data for development
            const mockCount = Math.floor(Math.random() * 5);
            setUnreadCount(mockCount);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    // Toggle the notification dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    // Mark a notification as read
    const markAsRead = async (id) => {
        try {
            // In production, uncomment the API call below
            // await notificationService.markAsRead(id);

            // Update local state
            setNotifications(notifications.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(`Failed to mark notification ${id} as read:`, error);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            // In production, uncomment the API call below
            // await notificationService.markAllAsRead();

            // Update local state
            setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Navigate based on notification type
        if (notification.type === 'pickup_request' && notification.data?.requestId) {
            navigate(`/pickup-requests/${notification.data.requestId}`);
        } else if (notification.type === 'food_item_added' && notification.data?.itemId) {
            navigate(`/food-items/${notification.data.itemId}`);
        } else if (notification.type === 'system_alert') {
            navigate('/announcements');
        } else {
            navigate('/notifications');
        }

        // Close the dropdown
        setIsOpen(false);
    };

    // Format notification time
    const formatNotificationTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell icon with unread count */}
            <button
                className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={toggleDropdown}
                aria-label="Notifications"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                    <div className="py-2 px-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                        {loading ? (
                            <div className="py-6 text-center text-gray-500">
                                <svg className="w-6 h-6 mx-auto animate-spin text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <p className="mt-1 text-sm">Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-6 text-center text-gray-500">
                                <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="mt-1 text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="py-3 px-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-blue-800' : 'text-gray-800'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-gray-500 ml-2">
                                                {formatNotificationTime(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="py-2 px-4 bg-gray-50 border-t border-gray-200 text-center">
                        <button
                            onClick={() => {
                                navigate('/notifications');
                                setIsOpen(false);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

NotificationBell.propTypes = {
    maxDisplayNotifications: PropTypes.number
};

export default NotificationBell;
