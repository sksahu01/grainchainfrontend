import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for handling pagination
 * @param {Array} items - The full array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @param {number} initialPage - Initial page number (1-based)
 * @returns {Object} - Pagination state and methods
 */
export const useClientPagination = (items = [], itemsPerPage = 10, initialPage = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [paginatedItems, setPaginatedItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    // Calculate total pages
    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(items.length / itemsPerPage)));

        // Reset to page 1 if current page is out of bounds with new items
        if (currentPage > Math.ceil(items.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    }, [items, itemsPerPage, currentPage]);

    // Update paginated items when currentPage, items, or itemsPerPage changes
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedItems(items.slice(startIndex, endIndex));
    }, [items, currentPage, itemsPerPage]);

    // Handle page change
    const goToPage = useCallback((page) => {
        const pageNumber = Math.min(Math.max(1, page), totalPages);
        setCurrentPage(pageNumber);
    }, [totalPages]);

    // Navigation helpers
    const nextPage = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);
    const prevPage = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);
    const firstPage = useCallback(() => goToPage(1), [goToPage]);
    const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

    return {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
};

/**
 * Custom hook for handling server-side pagination
 * @param {Function} fetchFunction - Function to fetch data from server (should accept page and pageSize)
 * @param {number} initialPage - Initial page number (1-based)
 * @param {number} initialPageSize - Initial page size
 * @returns {Object} - Pagination state and methods
 */
export const useServerPagination = (fetchFunction, initialPage = 1, initialPageSize = 10) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchFunction({
                page: currentPage,
                pageSize
            });

            setItems(response.data || []);
            setTotalItems(response.totalItems || 0);
            setTotalPages(response.totalPages || Math.ceil((response.totalItems || 0) / pageSize) || 1);
        } catch (err) {
            setError(err.message || 'Failed to fetch items');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [fetchFunction, currentPage, pageSize]);

    // Fetch items when page or pageSize changes
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Handle page change
    const goToPage = useCallback((page) => {
        const pageNumber = Math.min(Math.max(1, page), totalPages);
        setCurrentPage(pageNumber);
    }, [totalPages]);

    // Navigation helpers
    const nextPage = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);
    const prevPage = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);
    const firstPage = useCallback(() => goToPage(1), [goToPage]);
    const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

    // Change page size
    const changePageSize = useCallback((newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
    }, []);

    // Refresh items (useful after actions like add/edit/delete)
    const refreshItems = useCallback(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        currentPage,
        pageSize,
        items,
        totalItems,
        totalPages,
        loading,
        error,
        goToPage,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        changePageSize,
        refreshItems,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
};

export default {
    useClientPagination,
    useServerPagination
};
