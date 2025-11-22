import { useMemo } from 'react';
import DataGrid from '../ui/datagrid/dataGrid';
import type { Column } from '../../types/datagrid/dataGrid.types';
import type { ProfessorDto, ProfessorRequestDto } from '../../types/professors';
import { getProfessorColumns } from './ProfessorColumns';

interface ProfessorDataGridProps {
    professors: ProfessorDto[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
        setPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };
    onDelete: (professor: ProfessorDto) => void;
    onBulkUpdate: (updatedProfessors: ProfessorDto[]) => void;
    onAdd: (professor: ProfessorRequestDto) => void;
    onNameClick: (id: number) => void;
}

export const ProfessorDataGrid: React.FC<ProfessorDataGridProps> = ({
    professors,
    loading,
    pagination,
    onDelete,
    onBulkUpdate,
    onAdd,
    onNameClick,
}) => {
    const columns: Column[] = useMemo(() => getProfessorColumns(onNameClick), [onNameClick]);

    const emptyProfessorTemplate: Partial<ProfessorRequestDto> = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        approved: false,
        groupeId: null,
    };

    const handleDelete = (professor: any) => {
        onDelete(professor as ProfessorDto);
    };

    const handleBulkUpdate = (updatedData: any[]) => {
        onBulkUpdate(updatedData as ProfessorDto[]);
    };

    const handleAdd = (newRow: any) => {
        const newProfessor: ProfessorRequestDto = {
            email: newRow.email || '',
            password: newRow.password || 'defaultPassword123',
            firstName: newRow.firstName || '',
            lastName: newRow.lastName || '',
            approved: newRow.approved ?? false,
            groupeId: newRow.groupeId || null,
        };
        onAdd(newProfessor);
    };

    return (
        <DataGrid
            title={`Gestion des Professeurs (${pagination.totalElements} professeurs)`}
            data={professors}
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
            emptyRowTemplate={emptyProfessorTemplate}
            addLabel="Nouveau professeur"
            deleteLabel="Supprimer"
            className="professors-grid"
            showActionsColumn={true}
            showAddButton={true}
        />
    );
};

