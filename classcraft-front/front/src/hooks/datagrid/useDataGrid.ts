/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useDataGrid.ts
import { useMemo, useState, useEffect } from 'react';
import type { Column, DataGridProps, EditState, NewRowState } from '../dataGrid.types';

export const useDataGrid = (props: DataGridProps) => {
    const {
        data,
        columns,
        sorting,
        onDelete,
        onBulkUpdate,
        onAdd,
        emptyRowTemplate = {},
        showAddButton = true
    } = props;

    const [editState, setEditState] = useState<EditState>({});
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newRow, setNewRow] = useState<NewRowState>({});
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    // Vérifier s'il y a des modifications
    useEffect(() => {
        const changesExist = Object.keys(editState).length > 0;
        setHasChanges(changesExist);
    }, [editState]);

    // Initialiser la nouvelle ligne avec le template
    useEffect(() => {
        if (isAdding) {
            const initialNewRow: NewRowState = { isNew: true };
            columns.forEach(col => {
                if (col.key !== 'actions') {
                    initialNewRow[col.key] = emptyRowTemplate[col.key] ?? '';
                }
            });
            setNewRow(initialNewRow);
            setValidationErrors({});
            const firstEditableColumn = columns.find(col => col.editable && col.key !== 'actions');
            if (firstEditableColumn) {
                setEditingCell({ rowIndex: -1, columnKey: firstEditableColumn.key });
            }
        } else {
            setEditingCell(null);
        }
    }, [isAdding, columns, emptyRowTemplate]);

    const sortedData = useMemo(() => {
        if (!sorting || !sorting.sortBy) return data;
        return [...data].sort((a, b) => {
            const aValue = a[sorting.sortBy];
            const bValue = b[sorting.sortBy];
            if (aValue < bValue) return sorting.sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sorting.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sorting]);

    const gridColumns = useMemo(() => {
        const baseColumns = columns.filter(col => col.key !== 'actions');
        if (props.showActionsColumn && (onDelete || isAdding)) {
            return [
                ...baseColumns,
                {
                    key: 'actions',
                    label: 'Actions',
                    width: '140px',
                    sortable: false,
                    editable: false
                } as Column
            ];
        }
        return baseColumns;
    }, [columns, props.showActionsColumn, onDelete, isAdding]);

    const getInputType = (columnType?: string): string => {
        switch (columnType) {
            case 'number': return 'number';
            case 'email': return 'email';
            case 'date': return 'date';
            case 'string':
            case 'text':
            default: return 'text';
        }
    };

    const isNewRowEditing = (columnKey: string) => {
        return isAdding && editingCell?.rowIndex === -1 && editingCell?.columnKey === columnKey;
    };

    const handleSort = (columnKey: string) => {
        if (!sorting || !columnKey) return;
        const newSortOrder = sorting.sortBy === columnKey && sorting.sortOrder === 'asc' ? 'desc' : 'asc';
        sorting.onSort(columnKey, newSortOrder);
    };

    const handleCellClick = (rowIndex: number, columnKey: string, column: Column, isNewRow: boolean = false) => {
        if (column.editable) {
            setEditingCell({ rowIndex, columnKey });
        }
    };

    const handleCellChange = (rowIndex: number, columnKey: string, value: any, isNewRow: boolean = false) => {
        if (isNewRow) {
            setNewRow(prev => ({ ...prev, [columnKey]: value }));
            validateField(columnKey, value);
        } else {
            setEditState(prev => ({
                ...prev,
                [rowIndex]: { ...prev[rowIndex], [columnKey]: value }
            }));
        }
    };

    const validateField = (columnKey: string, value: any) => {
        const column = columns.find(col => col.key === columnKey);
        const errors = { ...validationErrors };
        if (column?.required && (!value || value.toString().trim() === '')) {
            errors[columnKey] = 'Ce champ est obligatoire';
        } else {
            delete errors[columnKey];
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateNewRow = () => {
        const errors: { [key: string]: string } = {};
        columns.forEach(col => {
            if (col.required && (!newRow[col.key] || newRow[col.key].toString().trim() === '')) {
                errors[col.key] = 'Ce champ est obligatoire';
            }
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCellBlur = () => {
        setEditingCell(null);
    };

    const handleSave = () => {
        if (!onBulkUpdate) return;
        const updatedData = sortedData.map((row, index) => {
            const rowChanges = editState[index];
            return rowChanges ? { ...row, ...rowChanges } : row;
        });
        onBulkUpdate(updatedData);
        setEditState({});
        setHasChanges(false);
    };

    const handleCancel = () => {
        setEditState({});
        setEditingCell(null);
        setHasChanges(false);
    };

    const handleDelete = (row: any, event: React.MouseEvent) => {
        event.stopPropagation();
        if (onDelete && window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            onDelete(row);
        }
    };

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleConfirmAdd = () => {
        if (!validateNewRow() || !onAdd) return;
        const { isNew, ...rowToAdd } = newRow;
        onAdd(rowToAdd);
        setIsAdding(false);
        setNewRow({});
        setValidationErrors({});
        setEditingCell(null);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewRow({});
        setValidationErrors({});
        setEditingCell(null);
    };

    const handleNewRowCellChange = (columnKey: string, value: any) => {
        setNewRow(prev => ({ ...prev, [columnKey]: value }));
        validateField(columnKey, value);
    };

    const getModifiedCount = () => {
        return Object.keys(editState).length;
    };


    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const canAddNewRow = showAddButton && onAdd && !isAdding;

    return {
        sortedData,
        gridColumns,
        isAdding,
        hasChanges,
        canAddNewRow,
        editState,
        editingCell,
        validationErrors,
        newRow,
        handleSort,
        handleCellClick,
        handleCellChange,
        handleCellBlur,
        handleSave,
        handleCancel,
        handleDelete,
        handleAddClick,
        handleConfirmAdd,
        handleCancelAdd,
        handleNewRowCellChange,
        getModifiedCount,
        isNewRowEditing,
        getInputType,
        isValidEmail
    };
};