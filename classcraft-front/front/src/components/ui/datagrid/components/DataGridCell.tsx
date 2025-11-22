/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DataGridCell.tsx
import React from 'react';
import type { Column, EditState } from '../../../../types/datagrid/dataGrid.types';
import '../../../../styles/components/datagrid/datagridcomponents/DataGridCell.css';

interface DataGridCellProps {
  row: any;
  rowIndex: number;
  column: Column;
  isNewRow: boolean;
  isEditing: boolean;
  editingCell: { rowIndex: number; columnKey: string } | null;
  validationErrors: {[key: string]: string};
  newRowData: any;
  editState: EditState;
  deleteLabel?: string;
  onCellClick: (rowIndex: number, columnKey: string, column: Column, isNewRow?: boolean) => void;
  onCellChange: (rowIndex: number, columnKey: string, value: any, isNewRow?: boolean) => void;
  onCellBlur: () => void;
  onDelete: (row: any, event: React.MouseEvent) => void;
  onConfirmAdd: () => void;
  onCancelAdd: () => void;
  onNewRowCellChange: (columnKey: string, value: any) => void;
  getInputType: (columnType?: string) => string;
}

export const DataGridCell: React.FC<DataGridCellProps> = ({
  row,
  rowIndex,
  column,
  isNewRow,
  isEditing,
  editingCell,
  validationErrors,
  newRowData,
  editState,
  deleteLabel = 'Supprimer',
  onCellClick,
  onCellChange,
  onCellBlur,
  onDelete,
  onConfirmAdd,
  onCancelAdd,
  onNewRowCellChange,
  getInputType
}) => {
  const handleCellClick = () => {
    onCellClick(rowIndex, column.key, column, isNewRow);
  };

  // Colonne actions pour les lignes normales
 if (column.key === 'actions' && !isNewRow) {
  return (
    <td className="actions-cell">
      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(row, e);
        }}
        title={deleteLabel}
      >
        {deleteLabel}
      </button>
    </td>
  );
}

// Colonne actions pour la nouvelle ligne
if (column.key === 'actions' && isNewRow) {
  return (
    <td className="actions-cell">
      <div className="new-row-actions">
        <button
          className="confirm-add-btn"
          onClick={(e) => {
            e.stopPropagation();
            onConfirmAdd();
          }}
          disabled={Object.keys(validationErrors).length > 0}
          title="Confirmer l'ajout"
        >
          ✓
        </button>
        <button
          className="cancel-add-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCancelAdd();
          }}
          title="Annuler l'ajout"
        >
          ✕
        </button>
      </div>
    </td>
  );
}

  const currentValue = isNewRow 
    ? newRowData[column.key] 
    : editState[rowIndex]?.[column.key] ?? row?.[column.key];
  
  const isModified = !isNewRow && editState[rowIndex]?.[column.key] !== undefined;
  const hasError = validationErrors[column.key];

  // Cellule éditable
  if (column.editable && isEditing) {
    return (
      <td 
        className={`${column.editable ? 'editable-cell' : ''} editing`}
        onClick={handleCellClick}
      >
        <div>
          <input
            className={`editable-input ${hasError ? 'invalid-field' : ''}`}
            value={currentValue ?? ''}
            onChange={(e) => isNewRow 
              ? onNewRowCellChange(column.key, e.target.value)
              : onCellChange(rowIndex, column.key, e.target.value, isNewRow)
            }
            onBlur={isNewRow ? undefined : onCellBlur}
            autoFocus={!isNewRow}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isNewRow) onCellBlur();
              if (e.key === 'Escape' && !isNewRow) {
                // Reset changes for this cell
                onCellChange(rowIndex, column.key, row?.[column.key], isNewRow);
                onCellBlur();
              }
              if (e.key === 'Enter' && isNewRow) {
                onConfirmAdd();
              }
            }}
            type={getInputType(column.type)}
            placeholder={isNewRow ? `Saisir ${column.label.toLowerCase()}` : ''}
          />
          {hasError && (
            <div className="validation-error">{validationErrors[column.key]}</div>
          )}
        </div>
      </td>
    );
  }

  // Affichage normal
  const displayValue = column.render 
    ? column.render(currentValue, row) 
    : currentValue;

  return (
    <td 
      className={`
        ${column.editable ? 'editable-cell' : ''}
        ${editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key ? 'editing' : ''}
      `}
      onClick={handleCellClick}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {displayValue ?? (isNewRow ? <span className="new-row-placeholder">Non renseigné</span> : '-')}
        {isModified && <span className="modified-badge" title="Modifié"></span>}
      </div>
    </td>
  );
};