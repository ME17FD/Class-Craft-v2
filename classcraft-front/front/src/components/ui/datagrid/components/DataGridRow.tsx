/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DataGridRow.tsx
import React from 'react';
import type { Column, EditState } from '../dataGrid.types';
import { DataGridCell } from './DataGridCell';

interface DataGridRowProps {
  row: any;
  rowIndex: number;
  columns: Column[];
  isNewRow: boolean;
  isEditing: (columnKey: string) => boolean;
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

export const DataGridRow: React.FC<DataGridRowProps> = ({
  row,
  rowIndex,
  columns,
  isNewRow,
  isEditing,
  editingCell,
  validationErrors,
  newRowData,
  editState,
  deleteLabel,
  onCellClick,
  onCellChange,
  onCellBlur,
  onDelete,
  onConfirmAdd,
  onCancelAdd,
  onNewRowCellChange,
  getInputType
}) => {
  return (
    <tr className={isNewRow ? 'new-row' : ''}>
      {columns.map((column) => (
        <DataGridCell
          key={column.key}
          row={row}
          rowIndex={rowIndex}
          column={column}
          isNewRow={isNewRow}
          isEditing={isEditing(column.key)}
          editingCell={editingCell}
          validationErrors={validationErrors}
          newRowData={newRowData}
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
      ))}
    </tr>
  );
};