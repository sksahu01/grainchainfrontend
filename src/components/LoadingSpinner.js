import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', color = 'blue', className = '', fullScreen = false }) => {
    // Size mapping
    const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    // Color mapping
    const colorMap = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600',
        yellow: 'text-yellow-600',
        purple: 'text-purple-600',
        gray: 'text-gray-600',
        white: 'text-white',
    };

    const spinnerSize = sizeMap[size] || sizeMap.md;
    const spinnerColor = colorMap[color] || colorMap.blue;

    const spinner = (
        <div className={`inline-block animate-spin rounded-full border-2 border-solid ${spinnerColor} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${spinnerSize} ${className}`}
            role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
            </span>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow', 'purple', 'gray', 'white']),
    className: PropTypes.string,
    fullScreen: PropTypes.bool
};

export default LoadingSpinner;
