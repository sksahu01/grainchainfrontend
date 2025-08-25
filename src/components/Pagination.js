import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className,
    showPageNumbers = true,
    maxDisplayedPages = 5
}) => {
    if (totalPages <= 1) return null;

    // Generate array of page numbers to display
    const getPageNumbers = () => {
        if (totalPages <= maxDisplayedPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const halfDisplay = Math.floor(maxDisplayedPages / 2);
        let startPage = Math.max(currentPage - halfDisplay, 1);
        let endPage = Math.min(startPage + maxDisplayedPages - 1, totalPages);

        if (endPage - startPage + 1 < maxDisplayedPages) {
            startPage = Math.max(endPage - maxDisplayedPages + 1, 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const pageNumbers = showPageNumbers ? getPageNumbers() : [];

    return (
        <div className={`flex items-center justify-center space-x-1 ${className || ''}`}>
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                aria-label="Previous page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* First Page */}
            {showPageNumbers && pageNumbers[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        1
                    </button>
                    {pageNumbers[0] > 2 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                </>
            )}

            {/* Page Numbers */}
            {showPageNumbers &&
                pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}

            {/* Last Page */}
            {showPageNumbers && pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                aria-label="Next page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    showPageNumbers: PropTypes.bool,
    maxDisplayedPages: PropTypes.number
};

export default Pagination;
