import { useMemo } from 'react';
import DataGrid from '../ui/datagrid/dataGrid';
import type { Column } from '../../types/datagrid/dataGrid.types';
import type { SalleDto, SalleRequestDto } from '../../types/salles';
import { getSalleColumns } from './SalleColumns';

interface SalleDataGridProps {
    salles: SalleDto[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
        setPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };
    onDelete: (salle: SalleDto) => void;
    onBulkUpdate: (updatedSalles: SalleDto[]) => void;
    onAdd: (salle: SalleRequestDto) => void;
}

export const SalleDataGrid: React.FC<SalleDataGridProps> = ({
    salles,
    loading,
    pagination,
    onDelete,
    onBulkUpdate,
    onAdd,
}) => {
    const columns: Column[] = useMemo(() => getSalleColumns(), []);

    const emptySalleTemplate: Partial<SalleRequestDto> = {
        name: '',
        type: 'SALLETD',
        capacity: 30,
    };

    const handleDelete = (salle: any) => {
        onDelete(salle as SalleDto);
    };

    const handleBulkUpdate = (updatedData: any[]) => {
        onBulkUpdate(updatedData as SalleDto[]);
    };

    const handleAdd = (newRow: any) => {
        const newSalle: SalleRequestDto = {
            name: newRow.name || '',
            type: newRow.type || 'SALLETD',
            capacity: newRow.capacity || 30,
        };
        onAdd(newSalle);
    };

    return (
        <DataGrid
            title={`Gestion des Salles (${pagination.totalElements} salles)`}
            data={salles}
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
            emptyRowTemplate={emptySalleTemplate}
            addLabel="Nouvelle salle"
            deleteLabel="Supprimer"
            className="salles-grid"
            showActionsColumn={true}
            showAddButton={true}
        />
    );
};

