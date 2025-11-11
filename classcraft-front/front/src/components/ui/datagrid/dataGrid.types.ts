/* eslint-disable @typescript-eslint/no-explicit-any */
// dataGrid.types.ts
export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
    width?: string;
    editable?: boolean;
    required?: boolean;
    type?: 'text' | 'number' | 'email' | 'date' | 'string';
}

export interface DataGridProps {
    /** Données à afficher */
    data: any[];
    /** Configuration des colonnes */
    columns: Column[];
    /** Titre du tableau */
    title?: string;
    /** Chargement en cours */
    loading?: boolean;
    /** Pagination */
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        pageSize?: number;
    };
    /** Tri */
    sorting?: {
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    };
    /** Actions globales */
    actions?: React.ReactNode;
    /** Hauteur fixe */
    height?: string;
    /** ClassName personnalisé */
    className?: string;

    // Callbacks
    onDelete?: (row: any) => void;
    onBulkUpdate?: (updatedData: any[]) => void;
    onAdd?: (newRow: any) => void;

    // Labels
    deleteLabel?: string;
    addLabel?: string;

    // Options d'affichage
    showActionsColumn?: boolean;
    showAddButton?: boolean;

    // Template pour nouvelle ligne
    emptyRowTemplate?: any;
}

export interface SortConfig {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export interface EditState {
    [rowIndex: number]: {
        [columnKey: string]: any;
    };
}

export interface NewRowState {
    [columnKey: string]: any;
    isNew?: boolean;
}