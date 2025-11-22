import { useState, useEffect, useCallback } from 'react';
import { salleService, type PaginationParams } from '../../services/salles';
import type { SalleDto, SalleRequestDto } from '../../types/salles';

interface UseSallesOptions {
    initialPage?: number;
    initialSize?: number;
    autoFetch?: boolean;
}

interface UseSallesReturn {
    salles: SalleDto[];
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
        setPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };
    fetchSalles: (params?: PaginationParams) => Promise<void>;
    createSalle: (salle: SalleRequestDto) => Promise<SalleDto | null>;
    updateSalle: (id: number, salle: SalleRequestDto) => Promise<SalleDto | null>;
    deleteSalle: (id: number) => Promise<boolean>;
    refresh: () => Promise<void>;
}

export const useSalles = (options: UseSallesOptions = {}): UseSallesReturn => {
    const { initialPage = 0, initialSize = 10, autoFetch = true } = options;

    const [salles, setSalles] = useState<SalleDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState<number>(initialSize);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchSalles = useCallback(async (params?: PaginationParams) => {
        setLoading(true);
        setError(null);
        try {
            const pageData = await salleService.getAll({
                page: params?.page ?? currentPage,
                size: params?.size ?? pageSize,
                sort: params?.sort,
            });
            setSalles(pageData.content);
            setTotalPages(pageData.totalPages);
            setTotalElements(pageData.totalElements);
            if (params?.page !== undefined) {
                setCurrentPage(params.page);
            }
            if (params?.size !== undefined) {
                setPageSize(params.size);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des salles';
            setError(errorMessage);
            console.error('Error fetching salles:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    const createSalle = useCallback(async (salle: SalleRequestDto): Promise<SalleDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const newSalle = await salleService.create(salle);
            await fetchSalles({ page: currentPage, size: pageSize });
            return newSalle;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la salle';
            setError(errorMessage);
            console.error('Error creating salle:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchSalles]);

    const updateSalle = useCallback(async (id: number, salle: SalleRequestDto): Promise<SalleDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const updatedSalle = await salleService.update(id, salle);
            await fetchSalles({ page: currentPage, size: pageSize });
            return updatedSalle;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la salle';
            setError(errorMessage);
            console.error('Error updating salle:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchSalles]);

    const deleteSalle = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await salleService.delete(id);
            await fetchSalles({ page: currentPage, size: pageSize });
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la salle';
            setError(errorMessage);
            console.error('Error deleting salle:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchSalles]);

    const refresh = useCallback(async () => {
        await fetchSalles({ page: currentPage, size: pageSize });
    }, [fetchSalles, currentPage, pageSize]);

    useEffect(() => {
        if (autoFetch) {
            fetchSalles();
        }
    }, [autoFetch, fetchSalles]);

    return {
        salles,
        loading,
        error,
        pagination: {
            currentPage,
            totalPages,
            totalElements,
            pageSize,
            setPage: (page: number) => {
                setCurrentPage(page);
                fetchSalles({ page, size: pageSize });
            },
            setPageSize: (size: number) => {
                setPageSize(size);
                setCurrentPage(0);
                fetchSalles({ page: 0, size });
            },
        },
        fetchSalles,
        createSalle,
        updateSalle,
        deleteSalle,
        refresh,
    };
};

