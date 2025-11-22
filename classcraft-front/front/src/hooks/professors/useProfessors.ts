import { useState, useEffect, useCallback } from 'react';
import { professorService, type PaginationParams } from '../../services/professors';
import { moduleService } from '../../services/modules';
import { sousModuleService } from '../../services/sousModules';
import type { ProfessorDto, ProfessorRequestDto } from '../../types/professors';
import type { ModuleDto } from '../../types/modules';
import type { SousModuleDto } from '../../types/sousModules';

interface UseProfessorsOptions {
    initialPage?: number;
    initialSize?: number;
    autoFetch?: boolean;
}

interface UseProfessorsReturn {
    professors: ProfessorDto[];
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
    fetchProfessors: (params?: PaginationParams) => Promise<void>;
    createProfessor: (professor: ProfessorRequestDto) => Promise<ProfessorDto | null>;
    updateProfessor: (id: number, professor: ProfessorRequestDto) => Promise<ProfessorDto | null>;
    deleteProfessor: (id: number) => Promise<boolean>;
    getProfessorCourses: (professorId: number) => Promise<{ modules: ModuleDto[]; sousModules: SousModuleDto[] }>;
    refresh: () => Promise<void>;
}

export const useProfessors = (options: UseProfessorsOptions = {}): UseProfessorsReturn => {
    const { initialPage = 0, initialSize = 10, autoFetch = true } = options;

    const [professors, setProfessors] = useState<ProfessorDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState<number>(initialSize);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchProfessors = useCallback(async (params?: PaginationParams) => {
        setLoading(true);
        setError(null);
        try {
            const pageData = await professorService.getAll({
                page: params?.page ?? currentPage,
                size: params?.size ?? pageSize,
                sort: params?.sort,
            });
            setProfessors(pageData.content);
            setTotalPages(pageData.totalPages);
            setTotalElements(pageData.totalElements);
            if (params?.page !== undefined) {
                setCurrentPage(params.page);
            }
            if (params?.size !== undefined) {
                setPageSize(params.size);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des professeurs';
            setError(errorMessage);
            console.error('Error fetching professors:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    const getProfessorCourses = useCallback(async (professorId: number) => {
        try {
            // Récupérer tous les modules et sous-modules, puis filtrer par professorId
            const [modulesData, sousModulesData] = await Promise.all([
                moduleService.getAll({ page: 0, size: 1000 }),
                sousModuleService.getAll({ page: 0, size: 1000 }),
            ]);

            const modules = modulesData.content.filter(m => m.professorId === professorId);
            const sousModules = sousModulesData.content.filter(sm => sm.professorId === professorId);

            return { modules, sousModules };
        } catch (err) {
            console.error('Error fetching professor courses:', err);
            return { modules: [], sousModules: [] };
        }
    }, []);

    const createProfessor = useCallback(async (professor: ProfessorRequestDto): Promise<ProfessorDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const newProfessor = await professorService.create(professor);
            await fetchProfessors({ page: currentPage, size: pageSize });
            return newProfessor;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du professeur';
            setError(errorMessage);
            console.error('Error creating professor:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchProfessors]);

    const updateProfessor = useCallback(async (id: number, professor: ProfessorRequestDto): Promise<ProfessorDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const updatedProfessor = await professorService.update(id, professor);
            await fetchProfessors({ page: currentPage, size: pageSize });
            return updatedProfessor;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du professeur';
            setError(errorMessage);
            console.error('Error updating professor:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchProfessors]);

    const deleteProfessor = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await professorService.delete(id);
            await fetchProfessors({ page: currentPage, size: pageSize });
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du professeur';
            setError(errorMessage);
            console.error('Error deleting professor:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchProfessors]);

    const refresh = useCallback(async () => {
        await fetchProfessors({ page: currentPage, size: pageSize });
    }, [fetchProfessors, currentPage, pageSize]);

    useEffect(() => {
        if (autoFetch) {
            fetchProfessors();
        }
    }, [autoFetch, fetchProfessors]);

    return {
        professors,
        loading,
        error,
        pagination: {
            currentPage,
            totalPages,
            totalElements,
            pageSize,
            setPage: (page: number) => {
                setCurrentPage(page);
                fetchProfessors({ page, size: pageSize });
            },
            setPageSize: (size: number) => {
                setPageSize(size);
                setCurrentPage(0);
                fetchProfessors({ page: 0, size });
            },
        },
        fetchProfessors,
        createProfessor,
        updateProfessor,
        deleteProfessor,
        getProfessorCourses,
        refresh,
    };
};

