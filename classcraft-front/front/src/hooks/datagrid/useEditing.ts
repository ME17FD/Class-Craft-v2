/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useEditing.ts
import { useState } from 'react';
import type { EditState } from '../dataGrid.types';

export const useEditing = () => {
    const [editState, setEditState] = useState<EditState>({});
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const updateEditState = (rowIndex: number, columnKey: string, value: any) => {
        setEditState(prev => ({
            ...prev,
            [rowIndex]: {
                ...prev[rowIndex],
                [columnKey]: value
            }
        }));
    };

    const clearEditState = () => {
        setEditState({});
        setHasChanges(false);
    };

    const getModifiedCount = () => {
        return Object.keys(editState).length;
    };

    return {
        editState,
        setEditState,
        editingCell,
        setEditingCell,
        hasChanges,
        setHasChanges,
        updateEditState,
        clearEditState,
        getModifiedCount
    };
};