import React from 'react';
import PropTypes from 'prop-types';

const SimpleChart = ({
    title,
    data,
    type = 'bar',
    labels,
    height = 200,
    colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
}) => {
    // This is a simple placeholder for a chart component
    // In a real app, you would use a library like Chart.js, Recharts, or Victory

    // Calculate the max value for scaling
    const maxValue = data.reduce((max, dataset) => {
        const datasetMax = Math.max(...dataset.values);
        return datasetMax > max ? datasetMax : max;
    }, 0);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

            <div className="relative" style={{ height: `${height}px` }}>
                {/* Chart placeholder */}
                <div className="flex h-full items-end">
                    {data.length > 0 && labels && labels.map((label, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            {/* Bar group */}
                            <div className="w-full flex justify-center space-x-1">
                                {data.map((dataset, datasetIndex) => {
                                    const value = dataset.values[index] || 0;
                                    const heightPercent = (value / maxValue) * 100;

                                    return (
                                        <div
                                            key={`${index}-${datasetIndex}`}
                                            className="relative w-4 md:w-6 rounded-t-sm"
                                            style={{
                                                height: `${heightPercent}%`,
                                                backgroundColor: colors[datasetIndex % colors.length],
                                                transition: 'height 0.3s ease'
                                            }}
                                            title={`${dataset.name}: ${value}`}
                                        >
                                            {/* Tooltip on hover could be added here */}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* X-axis label */}
                            <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Y-axis lines (grid) */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="border-t border-gray-200 w-full"
                            style={{ bottom: `${(i / 4) * 100}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Legend */}
            {data.length > 1 && (
                <div className="flex flex-wrap items-center justify-center mt-4 gap-4">
                    {data.map((dataset, i) => (
                        <div key={i} className="flex items-center">
                            <span
                                className="inline-block w-3 h-3 mr-2 rounded-sm"
                                style={{ backgroundColor: colors[i % colors.length] }}
                            />
                            <span className="text-sm text-gray-600">{dataset.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

SimpleChart.propTypes = {
    title: PropTypes.string,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            values: PropTypes.arrayOf(PropTypes.number).isRequired
        })
    ).isRequired,
    type: PropTypes.oneOf(['bar', 'line']),
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    height: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string)
};

export default SimpleChart;
