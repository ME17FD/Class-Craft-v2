import { useState, useEffect, useCallback } from 'react';
import { studentService, type PaginationParams } from '../../services/students';
import type { StudentDto, StudentRequestDto } from '../../types/students';

interface UseStudentsOptions {
    initialPage?: number;
    initialSize?: number;
    autoFetch?: boolean;
}

interface UseStudentsReturn {
    students: StudentDto[];
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
    fetchStudents: (params?: PaginationParams) => Promise<void>;
    createStudent: (student: StudentRequestDto) => Promise<StudentDto | null>;
    updateStudent: (id: number, student: StudentRequestDto) => Promise<StudentDto | null>;
    deleteStudent: (id: number) => Promise<boolean>;
    refresh: () => Promise<void>;
}

export const useStudents = (options: UseStudentsOptions = {}): UseStudentsReturn => {
    const { initialPage = 0, initialSize = 10, autoFetch = true } = options;

    const [students, setStudents] = useState<StudentDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [pageSize, setPageSize] = useState<number>(initialSize);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchStudents = useCallback(async (params?: PaginationParams) => {
        setLoading(true);
        setError(null);
        try {
            const pageData = await studentService.getAll({
                page: params?.page ?? currentPage,
                size: params?.size ?? pageSize,
                sort: params?.sort,
            });
            setStudents(pageData.content);
            setTotalPages(pageData.totalPages);
            setTotalElements(pageData.totalElements);
            if (params?.page !== undefined) {
                setCurrentPage(params.page);
            }
            if (params?.size !== undefined) {
                setPageSize(params.size);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des étudiants';
            setError(errorMessage);
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    const createStudent = useCallback(async (student: StudentRequestDto): Promise<StudentDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const newStudent = await studentService.create(student);
            await fetchStudents({ page: currentPage, size: pageSize });
            return newStudent;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'étudiant';
            setError(errorMessage);
            console.error('Error creating student:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchStudents]);

    const updateStudent = useCallback(async (id: number, student: StudentRequestDto): Promise<StudentDto | null> => {
        setLoading(true);
        setError(null);
        try {
            const updatedStudent = await studentService.update(id, student);
            await fetchStudents({ page: currentPage, size: pageSize });
            return updatedStudent;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'étudiant';
            setError(errorMessage);
            console.error('Error updating student:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchStudents]);

    const deleteStudent = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await studentService.delete(id);
            await fetchStudents({ page: currentPage, size: pageSize });
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'étudiant';
            setError(errorMessage);
            console.error('Error deleting student:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, fetchStudents]);

    const refresh = useCallback(async () => {
        await fetchStudents({ page: currentPage, size: pageSize });
    }, [fetchStudents, currentPage, pageSize]);

    useEffect(() => {
        if (autoFetch) {
            fetchStudents();
        }
    }, [autoFetch, fetchStudents]);

    return {
        students,
        loading,
        error,
        pagination: {
            currentPage,
            totalPages,
            totalElements,
            pageSize,
            setPage: (page: number) => {
                setCurrentPage(page);
                fetchStudents({ page, size: pageSize });
            },
            setPageSize: (size: number) => {
                setPageSize(size);
                setCurrentPage(0);
                fetchStudents({ page: 0, size });
            },
        },
        fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent,
        refresh,
    };
};

