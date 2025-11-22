/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/usePagination.ts
import { useState, useMemo } from 'react';

export const usePagination = (data: any[], initialPageSize: number = 10) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const totalPages = useMemo(() => {
        return Math.ceil(data.length / pageSize);
    }, [data.length, pageSize]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return data.slice(startIndex, startIndex + pageSize);
    }, [data, currentPage, pageSize]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return {
        currentPage,
        pageSize,
        totalPages,
        paginatedData,
        setPageSize,
        goToPage,
        nextPage,
        prevPage
    };
};