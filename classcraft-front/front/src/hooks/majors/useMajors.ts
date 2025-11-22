import { useState, useEffect, useCallback } from 'react';
import { majorService, type PaginationParams } from '../../services/majors';
import { moduleService } from '../../services/modules';
import { sousModuleService } from '../../services/sousModules';
import type { MajorDto, MajorRequestDto } from '../../types/majors';
import type { ModuleDto } from '../../types/modules';
import type { SousModuleDto } from '../../types/sousModules';

interface UseMajorsOptions {
    initialPage?: number;
    initialSize?: number;
    autoFetch?: boolean;
}

interface UseMajorsReturn {
    majors: MajorDto[];
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
    fetchMajors: (params?: PaginationParams) => Promise<void>;
    createMajor: (major: MajorRequestDto) => Promise<MajorDto | null>;
    updateMajor: (id: number, major: MajorRequestDto) => Promise<MajorDto | null>;
    deleteMajor: (id: number) => Promise<boolean>;
    getMajorCourses: (majorId: number) => Promise<{ modules: ModuleDto[]; sousModules: SousModuleDto[] }>;
    refresh: () => Promise<void>;
}

export const useMajors = (options: UseMajorsOptions = {}): UseMajorsReturn => {
    const { initialPage = 0, initialSize = 10, autoFetch = true } = options;

    const [majors, setMajors] = useState<MajorDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState<number>(initialSize);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchMajors = useCallback(async (params?: PaginationParams) => {
        setLoading(true);
        setError(null);
        try {
            const pageData = await majorService.getAll({
                page: params?.page ?? currentPage,
                size: params?.size ?? pageSize,
                sort: params?.sort,
            });
            setMajors(pageData.content);
            setTotalPages(pageData.totalPages);
            setTotalElements(pageData.totalElements);
            if (params?.page !== undefined) {
                setCurrentPage(params.page);
            }
            if (params?.size !== undefined) {
                setPageSize(params.size);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des filières';
            setError(errorMessage);
            console.error('Error fetching majors:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    const getMajorCourses = useCallback(async (majorId: number) => {
        try {
            // Récupérer tous les modules et sous-modules
            // Note: Il faudrait un endpoint backend pour récupérer les modules/sous-modules d'une filière
            // Pour l'instant, on récupère tout et on filtre (solution temporaire)
            const [modulesData, sousModulesData] = await Promise.all([
                moduleService.getAll({ page: 0, size: 1000 }),
                sousModuleService.getAll({ page: 0, size: 1000 }),
            ]);

            // Filtrer par majorId via semestreId (nécessite une relation semestre -> major)
            // Pour l'instant, on retourne tout (à améliorer avec un endpoint backend)
            return { 
                modules: modulesData.content, 
                sousModules: sousModulesData.content 
            };
        } catch (err) {
            console.error('Error fetching major courses:', err);
            return { modules: [], sousModules: [] };
        }
    }, []);

    const createMajor = useCallback(async (major: MajorRequestDto): Promise<MajorDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const newMajor = await majorService.create(major);
            await fetchMajors({ page: currentPage, size: pageSize });
            return newMajor;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la filière';
            setError(errorMessage);
            console.error('Error creating major:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchMajors]);

    const updateMajor = useCallback(async (id: number, major: MajorRequestDto): Promise<MajorDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const updatedMajor = await majorService.update(id, major);
            await fetchMajors({ page: currentPage, size: pageSize });
            return updatedMajor;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la filière';
            setError(errorMessage);
            console.error('Error updating major:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchMajors]);

    const deleteMajor = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            // Récupérer tous les modules et sous-modules associés
            const courses = await getMajorCourses(id);
            
            // Supprimer tous les sous-modules
            for (const sousModule of courses.sousModules) {
                await sousModuleService.delete(sousModule.id);
            }
            
            // Supprimer tous les modules
            for (const module of courses.modules) {
                await moduleService.delete(module.id);
            }
            
            // Supprimer la filière
            await majorService.delete(id);
            await fetchMajors({ page: currentPage, size: pageSize });
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la filière';
            setError(errorMessage);
            console.error('Error deleting major:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchMajors, getMajorCourses]);

    const refresh = useCallback(async () => {
        await fetchMajors({ page: currentPage, size: pageSize });
    }, [fetchMajors, currentPage, pageSize]);

    useEffect(() => {
        if (autoFetch) {
            fetchMajors();
        }
    }, [autoFetch, fetchMajors]);

    return {
        majors,
        loading,
        error,
        pagination: {
            currentPage,
            totalPages,
            totalElements,
            pageSize,
            setPage: (page: number) => {
                setCurrentPage(page);
                fetchMajors({ page, size: pageSize });
            },
            setPageSize: (size: number) => {
                setPageSize(size);
                setCurrentPage(0);
                fetchMajors({ page: 0, size });
            },
        },
        fetchMajors,
        createMajor,
        updateMajor,
        deleteMajor,
        getMajorCourses,
        refresh,
    };
};

