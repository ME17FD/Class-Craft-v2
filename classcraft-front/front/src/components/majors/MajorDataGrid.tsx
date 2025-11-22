import { useMemo } from 'react';
import DataGrid from '../ui/datagrid/dataGrid';
import type { Column } from '../../types/datagrid/dataGrid.types';
import type { MajorDto, MajorRequestDto } from '../../types/majors';
import { getMajorColumns } from './MajorColumns';

interface MajorDataGridProps {
    majors: MajorDto[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
        setPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };
    onDelete: (major: MajorDto) => void;
    onBulkUpdate: (updatedMajors: MajorDto[]) => void;
    onAdd: (major: MajorRequestDto) => void;
    onNameClick: (id: number) => void;
}

export const MajorDataGrid: React.FC<MajorDataGridProps> = ({
    majors,
    loading,
    pagination,
    onDelete,
    onBulkUpdate,
    onAdd,
    onNameClick,
}) => {
    const columns: Column[] = useMemo(() => getMajorColumns(onNameClick), [onNameClick]);

    const emptyMajorTemplate: Partial<MajorRequestDto> = {
        name: '',
        description: '',
    };

    const handleDelete = (major: any) => {
        onDelete(major as MajorDto);
    };

    const handleBulkUpdate = (updatedData: any[]) => {
        onBulkUpdate(updatedData as MajorDto[]);
    };

    const handleAdd = (newRow: any) => {
        const newMajor: MajorRequestDto = {
            name: newRow.name || '',
            description: newRow.description || '',
        };
        onAdd(newMajor);
    };

    return (
        <DataGrid
            title={`Gestion des Filières (${pagination.totalElements} filières)`}
            data={majors}
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
            emptyRowTemplate={emptyMajorTemplate}
            addLabel="Nouvelle filière"
            deleteLabel="Supprimer"
            className="majors-grid"
            showActionsColumn={true}
            showAddButton={true}
        />
    );
};

