import { useState, useEffect, useCallback } from 'react';
import { moduleService, type PaginationParams } from '../../services/modules';
import { sousModuleService } from '../../services/sousModules';
import type { ModuleDto, ModuleRequestDto } from '../../types/modules';
import type { SousModuleDto } from '../../types/sousModules';

interface UseModulesOptions {
    initialPage?: number;
    initialSize?: number;
    autoFetch?: boolean;
}

interface UseModulesReturn {
    modules: ModuleDto[];
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
    fetchModules: (params?: PaginationParams) => Promise<void>;
    createModule: (module: ModuleRequestDto) => Promise<ModuleDto | null>;
    updateModule: (id: number, module: ModuleRequestDto) => Promise<ModuleDto | null>;
    deleteModule: (id: number) => Promise<boolean>;
    getModuleSousModules: (moduleId: number) => Promise<SousModuleDto[]>;
    refresh: () => Promise<void>;
}

export const useModules = (options: UseModulesOptions = {}): UseModulesReturn => {
    const { initialPage = 0, initialSize = 10, autoFetch = true } = options;

    const [modules, setModules] = useState<ModuleDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState<number>(initialSize);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchModules = useCallback(async (params?: PaginationParams) => {
        setLoading(true);
        setError(null);
        try {
            const pageData = await moduleService.getAll({
                page: params?.page ?? currentPage,
                size: params?.size ?? pageSize,
                sort: params?.sort,
            });
            setModules(pageData.content);
            setTotalPages(pageData.totalPages);
            setTotalElements(pageData.totalElements);
            if (params?.page !== undefined) {
                setCurrentPage(params.page);
            }
            if (params?.size !== undefined) {
                setPageSize(params.size);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des modules';
            setError(errorMessage);
            console.error('Error fetching modules:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    const getModuleSousModules = useCallback(async (moduleId: number) => {
        try {
            const sousModulesData = await sousModuleService.getAll({ page: 0, size: 1000 });
            return sousModulesData.content.filter(sm => sm.moduleId === moduleId);
        } catch (err) {
            console.error('Error fetching sous-modules:', err);
            return [];
        }
    }, []);

    const createModule = useCallback(async (module: ModuleRequestDto): Promise<ModuleDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const newModule = await moduleService.create(module);
            await fetchModules({ page: currentPage, size: pageSize });
            return newModule;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du module';
            setError(errorMessage);
            console.error('Error creating module:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchModules]);

    const updateModule = useCallback(async (id: number, module: ModuleRequestDto): Promise<ModuleDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const updatedModule = await moduleService.update(id, module);
            await fetchModules({ page: currentPage, size: pageSize });
            return updatedModule;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du module';
            setError(errorMessage);
            console.error('Error updating module:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchModules]);

    const deleteModule = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            // Supprimer tous les sous-modules associés d'abord
            const sousModules = await getModuleSousModules(id);
            for (const sousModule of sousModules) {
                await sousModuleService.delete(sousModule.id);
            }
            // Puis supprimer le module
            await moduleService.delete(id);
            await fetchModules({ page: currentPage, size: pageSize });
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du module';
            setError(errorMessage);
            console.error('Error deleting module:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchModules, getModuleSousModules]);

    const refresh = useCallback(async () => {
        await fetchModules({ page: currentPage, size: pageSize });
    }, [fetchModules, currentPage, pageSize]);

    useEffect(() => {
        if (autoFetch) {
            fetchModules();
        }
    }, [autoFetch, fetchModules]);

    return {
        modules,
        loading,
        error,
        pagination: {
            currentPage,
            totalPages,
            totalElements,
            pageSize,
            setPage: (page: number) => {
                setCurrentPage(page);
                fetchModules({ page, size: pageSize });
            },
            setPageSize: (size: number) => {
                setPageSize(size);
                setCurrentPage(0);
                fetchModules({ page: 0, size });
            },
        },
        fetchModules,
        createModule,
        updateModule,
        deleteModule,
        getModuleSousModules,
        refresh,
    };
};

