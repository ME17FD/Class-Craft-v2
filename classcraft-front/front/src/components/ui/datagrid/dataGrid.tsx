/* eslint-disable @typescript-eslint/no-explicit-any */
// DataGrid.tsx
import React from 'react';
import type { DataGridProps } from '../../../types/datagrid/dataGrid.types';
import { useDataGrid } from '../../../hooks/datagrid/useDataGrid';
import { DataGridHeader } from './components/DataGridHeader';
import { DataGridBody } from './components/DataGridBody';
import { DataGridPagination } from './components/DataGridPagination';
import '../../../styles/components/datagrid/dataGrid.css';

export const DataGrid: React.FC<DataGridProps> = (props) => {
  const {
    title,
    loading = false,
    pagination,
    className = '',
    height
  } = props;

  const {
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
    getInputType
  } = useDataGrid(props);

  if (loading) {
    return (
      <div className={`blue-data-grid ${className}`}>
        {title && <DataGridHeader title={title} />}
        <div className="loading-state">
          <div>Chargement des données...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`blue-data-grid ${className}`} style={height ? { height } : undefined}>
      {/* En-tête de sauvegarde si modifications */}
      {hasChanges && props.onBulkUpdate && (
        <div className="save-header">
          <div className="save-info">
            {getModifiedCount()} modification(s) en attente
          </div>
          <div className="save-actions">
            <button className="save-btn secondary" onClick={handleCancel}>
              Annuler
            </button>
            <button className="save-btn primary" onClick={handleSave}>
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* En-tête normal avec bouton Ajouter */}
      <DataGridHeader
        title={title}
        actions={props.actions}
        canAddNewRow={canAddNewRow}
        addLabel={props.addLabel}
        onAddClick={handleAddClick}
      />

      {/* Tableau */}
      <DataGridBody
        sortedData={sortedData}
        gridColumns={gridColumns}
        isAdding={isAdding}
        editingCell={editingCell}
        validationErrors={validationErrors}
        newRow={newRow}
        onSort={handleSort}
        onCellClick={handleCellClick}
        onCellChange={handleCellChange}
        onCellBlur={handleCellBlur}
        onDelete={handleDelete}
        onConfirmAdd={handleConfirmAdd}
        onCancelAdd={handleCancelAdd}
        onAddClick={handleAddClick}
        onNewRowCellChange={handleNewRowCellChange}
        isNewRowEditing={isNewRowEditing}
        getInputType={getInputType}
        editState={editState}
        deleteLabel={props.deleteLabel}
        sorting={props.sorting}
        onAdd={props.onAdd}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <DataGridPagination
          pagination={pagination}
          dataLength={props.data.length}
          totalDataLength={props.data.length} 
        />
      )}
    </div>
  );
};

export default DataGrid;