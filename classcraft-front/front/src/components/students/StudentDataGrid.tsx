import { useMemo } from 'react';
import DataGrid from '../ui/datagrid/dataGrid';
import type { Column } from '../../types/datagrid/dataGrid.types';
import type { StudentDto, StudentRequestDto } from '../../types/students';
import { getStudentColumns } from './StudentColumns';

interface StudentDataGridProps {
    students: StudentDto[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
        setPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };
    onDelete: (student: StudentDto) => void;
    onBulkUpdate: (updatedStudents: StudentDto[]) => void;
    onAdd: (student: StudentRequestDto) => void;
}

export const StudentDataGrid: React.FC<StudentDataGridProps> = ({
    students,
    loading,
    pagination,
    onDelete,
    onBulkUpdate,
    onAdd,
}) => {
    const columns: Column[] = useMemo(() => getStudentColumns(), []);

    const emptyStudentTemplate: Partial<StudentRequestDto> = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        approved: false,
        groupeId: null,
    };

    const handleDelete = (student: any) => {
        onDelete(student as StudentDto);
    };

    const handleBulkUpdate = (updatedData: any[]) => {
        onBulkUpdate(updatedData as StudentDto[]);
    };

    const handleAdd = (newRow: any) => {
        const newStudent: StudentRequestDto = {
            email: newRow.email || '',
            password: newRow.password || 'defaultPassword123', // Devrait être généré ou demandé
            firstName: newRow.firstName || '',
            lastName: newRow.lastName || '',
            approved: newRow.approved ?? false,
            groupeId: newRow.groupeId || null,
        };
        onAdd(newStudent);
    };

    return (
        <DataGrid
            title={`Gestion des Étudiants (${pagination.totalElements} étudiants)`}
            data={students}
            columns={columns}
            loading={loading}
            pagination={{
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                onPageChange: pagination.setPage,
                pageSize: pagination.pageSize,
            }}
            onDelete={handleDelete}
            onBulkUpdate={handleBulkUpdate}
            onAdd={handleAdd}
            emptyRowTemplate={emptyStudentTemplate}
            addLabel="Nouvel étudiant"
            deleteLabel="Supprimer"
            className="students-grid"
            showActionsColumn={true}
            showAddButton={true}
        />
    );
};

