/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DataGridBody.tsx
import React from 'react';
import type { Column, EditState } from '../dataGrid.types';
import { DataGridRow } from './DataGridRow';

interface DataGridBodyProps {
  sortedData: any[];
  gridColumns: Column[];
  isAdding: boolean;
  editingCell: { rowIndex: number; columnKey: string } | null;
  validationErrors: {[key: string]: string};
  newRow: any;
  editState: EditState;
  deleteLabel?: string;
  sorting?: any;
  onAdd?: (newRow: any) => void;
  onSort: (columnKey: string) => void;
  onCellClick: (rowIndex: number, columnKey: string, column: Column, isNewRow?: boolean) => void;
  onCellChange: (rowIndex: number, columnKey: string, value: any, isNewRow?: boolean) => void;
  onCellBlur: () => void;
  onDelete: (row: any, event: React.MouseEvent) => void;
  onAddClick?: () => void;
  onConfirmAdd: () => void;
  onCancelAdd: () => void;
  onNewRowCellChange: (columnKey: string, value: any) => void;
  isNewRowEditing: (columnKey: string) => boolean;
  getInputType: (columnType?: string) => string;
}

export const DataGridBody: React.FC<DataGridBodyProps> = ({
  sortedData,
  gridColumns,
  isAdding,
  editingCell,
  validationErrors,
  newRow,
  editState,
  deleteLabel,
  sorting,
  onAdd,
  onSort,
  onCellClick,
  onCellChange,
  onCellBlur,
  onDelete,
  onAddClick,
  onConfirmAdd,
  onCancelAdd,
  onNewRowCellChange,
  isNewRowEditing,
  getInputType
}) => {
  const canAddNewRow = onAdd && !isAdding;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="grid-table">
        <thead>
          <tr>
            {gridColumns.map((column) => (
              <th 
                key={column.key}
                style={{ width: column.width, cursor: column.sortable ? 'pointer' : 'default' }}
                onClick={() => column.sortable && onSort(column.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={column.required ? 'required-field' : ''}>
                    {column.label}
                  </span>
                  {column.sortable && sorting && (
                    <span style={{ fontSize: '12px' }}>
                      {sorting.sortBy === column.key ? (
                        sorting.sortOrder === 'asc' ? '↑' : '↓'
                      ) : '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Nouvelle ligne en cours d'ajout */}
          {isAdding && (
            <DataGridRow
              row={null}
              rowIndex={-1}
              columns={gridColumns}
              isNewRow={true}
              isEditing={isNewRowEditing}
              editingCell={editingCell}
              validationErrors={validationErrors}
              newRowData={newRow}
              editState={editState}
              deleteLabel={deleteLabel}
              onCellClick={onCellClick}
              onCellChange={onCellChange}
              onCellBlur={onCellBlur}
              onDelete={onDelete}
              onConfirmAdd={onConfirmAdd}
              onCancelAdd={onCancelAdd}
              onNewRowCellChange={onNewRowCellChange}
              getInputType={getInputType}
            />
          )}
          
          {/* Données existantes */}
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <DataGridRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                columns={gridColumns}
                isNewRow={false}
                isEditing={(columnKey: string) => 
                  editingCell?.rowIndex === rowIndex && editingCell?.columnKey === columnKey
                }
                editingCell={editingCell}
                validationErrors={validationErrors}
                newRowData={newRow}
                editState={editState}
                deleteLabel={deleteLabel}
                onCellClick={onCellClick}
                onCellChange={onCellChange}
                onCellBlur={onCellBlur}
                onDelete={onDelete}
                onConfirmAdd={onConfirmAdd}
                onCancelAdd={onCancelAdd}
                onNewRowCellChange={onNewRowCellChange}
                getInputType={getInputType}
              />
            ))
          ) : (
            !isAdding && (
              <tr>
                <td colSpan={gridColumns.length}>
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3H21V21H3V3ZM5 5V19H19V5H5Z" fill="currentColor"/>
                      <path d="M15 7H9V9H15V7ZM15 11H9V13H15V11ZM15 15H9V17H15V15Z" fill="currentColor"/>
                    </svg>
                    <div>Aucune donnée disponible</div>
                    {canAddNewRow && (
                      <button 
                        className="add-btn" 
                        onClick={onAddClick}
                        style={{ marginTop: '16px' }}
                      >
                        <span className="btn-icon">+</span>
                        Ajouter le premier élément
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};