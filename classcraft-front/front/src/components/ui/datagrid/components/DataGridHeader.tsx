// components/DataGridHeader.tsx
import React from 'react';

interface DataGridHeaderProps {
  title?: string;
  actions?: React.ReactNode;
  canAddNewRow?: boolean;
  addLabel?: string;
  onAddClick?: () => void;
}

export const DataGridHeader: React.FC<DataGridHeaderProps> = ({
  title,
  actions,
  canAddNewRow,
  addLabel = 'Ajouter',
  onAddClick
}) => {
  if (!title && !actions && !canAddNewRow) return null;

  return (
    <div className="grid-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {title && <h3>{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
        {canAddNewRow && (
          <button className="add-btn" onClick={onAddClick}>
            <span className="btn-icon">+</span>
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};