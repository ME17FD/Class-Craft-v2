import { useMemo } from 'react';
import DataGrid from '../ui/datagrid/dataGrid';
import type { Column } from '../../types/datagrid/dataGrid.types';
import type { ModuleDto, ModuleRequestDto } from '../../types/modules';
import { getModuleColumns } from './ModuleColumns';

interface ModuleDataGridProps {
    modules: ModuleDto[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
        setPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };
    onDelete: (module: ModuleDto) => void;
    onBulkUpdate: (updatedModules: ModuleDto[]) => void;
    onAdd: (module: ModuleRequestDto) => void;
    onNameClick: (id: number) => void;
}

export const ModuleDataGrid: React.FC<ModuleDataGridProps> = ({
    modules,
    loading,
    pagination,
    onDelete,
    onBulkUpdate,
    onAdd,
    onNameClick,
}) => {
    const columns: Column[] = useMemo(() => getModuleColumns(onNameClick), [onNameClick]);

    const emptyModuleTemplate: Partial<ModuleRequestDto> = {
        name: '',
        code: '',
        numberOfHours: 0,
        professorId: 0,
        semestreId: 0,
    };

    const handleDelete = (module: any) => {
        onDelete(module as ModuleDto);
    };

    const handleBulkUpdate = (updatedData: any[]) => {
        onBulkUpdate(updatedData as ModuleDto[]);
    };

    const handleAdd = (newRow: any) => {
        const newModule: ModuleRequestDto = {
            name: newRow.name || '',
            code: newRow.code || '',
            numberOfHours: newRow.numberOfHours || 0,
            professorId: newRow.professorId || 0,
            semestreId: newRow.semestreId || 0,
        };
        onAdd(newModule);
    };

    return (
        <DataGrid
            title={`Gestion des Modules (${pagination.totalElements} modules)`}
            data={modules}
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
            emptyRowTemplate={emptyModuleTemplate}
            addLabel="Nouveau module"
            deleteLabel="Supprimer"
            className="modules-grid"
            showActionsColumn={true}
            showAddButton={true}
        />
    );
};

