import { useMemo } from 'react';
import DataGrid from '../ui/datagrid/dataGrid';
import type { Column } from '../../types/datagrid/dataGrid.types';
import type { GroupeDto, GroupeRequestDto } from '../../types/groupes';
import { getGroupeColumns } from './GroupeColumns';

interface GroupeDataGridProps {
    groupes: GroupeDto[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
        setPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };
    onDelete: (groupe: GroupeDto) => void;
    onBulkUpdate: (updatedGroupes: GroupeDto[]) => void;
    onAdd: (groupe: GroupeRequestDto) => void;
    onNameClick: (id: number) => void;
}

export const GroupeDataGrid: React.FC<GroupeDataGridProps> = ({
    groupes,
    loading,
    pagination,
    onDelete,
    onBulkUpdate,
    onAdd,
    onNameClick,
}) => {
    const columns: Column[] = useMemo(() => getGroupeColumns(onNameClick), [onNameClick]);

    const emptyGroupeTemplate: Partial<GroupeRequestDto> = {
        name: '',
        sectionId: 0,
    };

    const handleDelete = (groupe: any) => {
        onDelete(groupe as GroupeDto);
    };

    const handleBulkUpdate = (updatedData: any[]) => {
        onBulkUpdate(updatedData as GroupeDto[]);
    };

    const handleAdd = (newRow: any) => {
        const newGroupe: GroupeRequestDto = {
            name: newRow.name || '',
            sectionId: newRow.sectionId || 0,
        };
        onAdd(newGroupe);
    };

    return (
        <DataGrid
            title={`Gestion des Groupes (${pagination.totalElements} groupes)`}
            data={groupes}
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
            emptyRowTemplate={emptyGroupeTemplate}
            addLabel="Nouveau groupe"
            deleteLabel="Supprimer"
            className="groupes-grid"
            showActionsColumn={true}
            showAddButton={true}
        />
    );
};

