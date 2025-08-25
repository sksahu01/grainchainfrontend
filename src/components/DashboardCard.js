import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({
    title,
    subtitle,
    value,
    icon,
    iconBgColor = 'bg-green-100',
    iconColor = 'text-green-600',
    trend,
    trendPercentage,
    trendLabel,
    className,
    onClick,
    footer,
}) => {
    // Determine trend color
    const getTrendColor = () => {
        if (!trend) return 'text-gray-500';
        return trend === 'up' ? 'text-green-500' : 'text-red-500';
    };

    // Trend icon
    const renderTrendIcon = () => {
        if (!trend) return null;

        if (trend === 'up') {
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            );
        } else {
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            );
        }
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 ${onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''} ${className || ''}`}
            onClick={onClick}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                        {subtitle && (
                            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                        )}
                    </div>

                    {icon && (
                        <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
                            {icon}
                        </div>
                    )}
                </div>

                <div className="mt-3">
                    <div className="text-3xl font-bold text-gray-900">{value}</div>
                </div>

                {(trend || trendLabel) && (
                    <div className="mt-4 flex items-center">
                        {trend && (
                            <span className={`flex items-center ${getTrendColor()}`}>
                                {renderTrendIcon()}
                                <span className="ml-1 text-sm font-medium">
                                    {trendPercentage && `${trendPercentage}%`}
                                </span>
                            </span>
                        )}

                        {trendLabel && (
                            <span className="text-sm text-gray-500 ml-1">
                                {trendLabel}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {footer && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                    {footer}
                </div>
            )}
        </div>
    );
};

DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node
    ]).isRequired,
    icon: PropTypes.node,
    iconBgColor: PropTypes.string,
    iconColor: PropTypes.string,
    trend: PropTypes.oneOf(['up', 'down', null]),
    trendPercentage: PropTypes.number,
    trendLabel: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    footer: PropTypes.node
};

export default DashboardCard;
