import { useState, useEffect, useCallback } from 'react';
import { groupeService, type PaginationParams } from '../../services/groupes';
import { studentService } from '../../services/students';
import type { GroupeDto, GroupeRequestDto } from '../../types/groupes';
import type { StudentDto, StudentRequestDto } from '../../types/students';

interface UseGroupesOptions {
    initialPage?: number;
    initialSize?: number;
    autoFetch?: boolean;
}

interface UseGroupesReturn {
    groupes: GroupeDto[];
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
    fetchGroupes: (params?: PaginationParams) => Promise<void>;
    createGroupe: (groupe: GroupeRequestDto) => Promise<GroupeDto | null>;
    updateGroupe: (id: number, groupe: GroupeRequestDto) => Promise<GroupeDto | null>;
    deleteGroupe: (id: number) => Promise<boolean>;
    getGroupeStudents: (groupeId: number) => Promise<StudentDto[]>;
    getAllStudents: () => Promise<StudentDto[]>;
    addStudentToGroupe: (studentId: number, groupeId: number) => Promise<boolean>;
    removeStudentFromGroupe: (studentId: number) => Promise<boolean>;
    refresh: () => Promise<void>;
}

export const useGroupes = (options: UseGroupesOptions = {}): UseGroupesReturn => {
    const { initialPage = 0, initialSize = 10, autoFetch = true } = options;

    const [groupes, setGroupes] = useState<GroupeDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState<number>(initialSize);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchGroupes = useCallback(async (params?: PaginationParams) => {
        setLoading(true);
        setError(null);
        try {
            const pageData = await groupeService.getAll({
                page: params?.page ?? currentPage,
                size: params?.size ?? pageSize,
                sort: params?.sort,
            });
            setGroupes(pageData.content);
            setTotalPages(pageData.totalPages);
            setTotalElements(pageData.totalElements);
            if (params?.page !== undefined) {
                setCurrentPage(params.page);
            }
            if (params?.size !== undefined) {
                setPageSize(params.size);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des groupes';
            setError(errorMessage);
            console.error('Error fetching groupes:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    const getGroupeStudents = useCallback(async (groupeId: number) => {
        try {
            // Récupérer tous les étudiants et filtrer par groupeId
            const studentsData = await studentService.getAll({ page: 0, size: 1000 });
            return studentsData.content.filter(s => s.groupeId === groupeId);
        } catch (err) {
            console.error('Error fetching groupe students:', err);
            return [];
        }
    }, []);

    const getAllStudents = useCallback(async () => {
        try {
            const studentsData = await studentService.getAll({ page: 0, size: 1000 });
            return studentsData.content;
        } catch (err) {
            console.error('Error fetching all students:', err);
            return [];
        }
    }, []);

    const addStudentToGroupe = useCallback(async (studentId: number, groupeId: number) => {
        try {
            // Récupérer l'étudiant et mettre à jour son groupeId
            const student = await studentService.getById(studentId);
            await studentService.update(studentId, {
                email: student.email,
                password: 'temp123',
                firstName: student.firstName,
                lastName: student.lastName,
                approved: student.approved,
                groupeId: groupeId,
            });
            return true;
        } catch (err) {
            console.error('Error adding student to groupe:', err);
            return false;
        }
    }, []);

    const removeStudentFromGroupe = useCallback(async (studentId: number) => {
        try {
            // Récupérer l'étudiant et mettre son groupeId à null
            const student = await studentService.getById(studentId);
            await studentService.update(studentId, {
                email: student.email,
                password: 'temp123',
                firstName: student.firstName,
                lastName: student.lastName,
                approved: student.approved,
                groupeId: null,
            });
            return true;
        } catch (err) {
            console.error('Error removing student from groupe:', err);
            return false;
        }
    }, []);

    const createGroupe = useCallback(async (groupe: GroupeRequestDto): Promise<GroupeDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const newGroupe = await groupeService.create(groupe);
            await fetchGroupes({ page: currentPage, size: pageSize });
            return newGroupe;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du groupe';
            setError(errorMessage);
            console.error('Error creating groupe:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchGroupes]);

    const updateGroupe = useCallback(async (id: number, groupe: GroupeRequestDto): Promise<GroupeDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const updatedGroupe = await groupeService.update(id, groupe);
            await fetchGroupes({ page: currentPage, size: pageSize });
            return updatedGroupe;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du groupe';
            setError(errorMessage);
            console.error('Error updating groupe:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchGroupes]);

    const deleteGroupe = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            // Récupérer tous les étudiants du groupe et retirer leur groupeId (ne pas les supprimer)
            const students = await getGroupeStudents(id);
            for (const student of students) {
                await removeStudentFromGroupe(student.id);
            }
            // Supprimer le groupe (les étudiants ne sont pas supprimés)
            await groupeService.delete(id);
            await fetchGroupes({ page: currentPage, size: pageSize });
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du groupe';
            setError(errorMessage);
            console.error('Error deleting groupe:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchGroupes, getGroupeStudents, removeStudentFromGroupe]);

    const refresh = useCallback(async () => {
        await fetchGroupes({ page: currentPage, size: pageSize });
    }, [fetchGroupes, currentPage, pageSize]);

    useEffect(() => {
        if (autoFetch) {
            fetchGroupes();
        }
    }, [autoFetch, fetchGroupes]);

    return {
        groupes,
        loading,
        error,
        pagination: {
            currentPage,
            totalPages,
            totalElements,
            pageSize,
            setPage: (page: number) => {
                setCurrentPage(page);
                fetchGroupes({ page, size: pageSize });
            },
            setPageSize: (size: number) => {
                setPageSize(size);
                setCurrentPage(0);
                fetchGroupes({ page: 0, size });
            },
        },
        fetchGroupes,
        createGroupe,
        updateGroupe,
        deleteGroupe,
        getGroupeStudents,
        getAllStudents,
        addStudentToGroupe,
        removeStudentFromGroupe,
        refresh,
    };
};

