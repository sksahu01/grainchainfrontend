import React, { createContext, useContext, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';

// Toast Context
const ToastContext = createContext();

// Action Types
const ADD_TOAST = 'ADD_TOAST';
const REMOVE_TOAST = 'REMOVE_TOAST';

// Reducer
const toastReducer = (state, action) => {
    switch (action.type) {
        case ADD_TOAST:
            return [...state, action.payload];
        case REMOVE_TOAST:
            return state.filter(toast => toast.id !== action.payload);
        default:
            return state;
    }
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    // Add a new toast
    const addToast = useCallback(({ type, message, duration = 5000 }) => {
        const id = Date.now().toString();

        dispatch({
            type: ADD_TOAST,
            payload: {
                id,
                type,
                message,
                duration
            }
        });

        // Auto-remove toast after duration
        setTimeout(() => {
            dispatch({
                type: REMOVE_TOAST,
                payload: id
            });
        }, duration);

        return id;
    }, []);

    // Remove a toast
    const removeToast = useCallback((id) => {
        dispatch({
            type: REMOVE_TOAST,
            payload: id
        });
    }, []);

    // Convenience methods
    const toast = useCallback((message, duration) => {
        return addToast({ type: 'info', message, duration });
    }, [addToast]);

    const success = useCallback((message, duration) => {
        return addToast({ type: 'success', message, duration });
    }, [addToast]);

    const error = useCallback((message, duration) => {
        return addToast({ type: 'error', message, duration });
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        return addToast({ type: 'warning', message, duration });
    }, [addToast]);

    const value = {
        toasts,
        addToast,
        removeToast,
        toast,
        success,
        error,
        warning
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

ToastContainer.propTypes = {
    toasts: PropTypes.array.isRequired,
    removeToast: PropTypes.func.isRequired
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
    const { id, type, message } = toast;

    // Toast styles based on type
    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-100 border-green-500',
                    icon: (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ),
                    text: 'text-green-800'
                };
            case 'error':
                return {
                    bg: 'bg-red-100 border-red-500',
                    icon: (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    ),
                    text: 'text-red-800'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-100 border-yellow-500',
                    icon: (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    ),
                    text: 'text-yellow-800'
                };
            default:
                return {
                    bg: 'bg-blue-100 border-blue-500',
                    icon: (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    ),
                    text: 'text-blue-800'
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            key={id}
            className={`flex items-start p-4 rounded-lg shadow-md border-l-4 animate-slideIn ${styles.bg}`}
            role="alert"
        >
            <div className="flex-shrink-0">{styles.icon}</div>
            <div className={`ml-3 ${styles.text}`}>
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                onClick={onClose}
                className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${styles.text} hover:bg-opacity-25`}
            >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

Toast.propTypes = {
    toast: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['info', 'success', 'error', 'warning']).isRequired,
        message: PropTypes.string.isRequired,
        duration: PropTypes.number
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

// Hook for using the toast context
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Add animation to tailwind.config.js
// In tailwind.config.js, add:
// extend: {
//   keyframes: {
//     slideIn: {
//       '0%': { transform: 'translateX(100%)' },
//       '100%': { transform: 'translateX(0)' }
//     }
//   },
//   animation: {
//     'slideIn': 'slideIn 0.3s ease-out'
//   }
// }
