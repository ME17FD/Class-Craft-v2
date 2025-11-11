// components/DataGridPagination.tsx
import React from 'react';

interface DataGridPaginationProps {
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
  };
  dataLength: number;
}

export const DataGridPagination: React.FC<DataGridPaginationProps> = ({
  pagination,
  dataLength
}) => {
  const getPaginationInfo = () => {
    const start = ((pagination.currentPage - 1) * (pagination.pageSize || 10)) + 1;
    const end = Math.min(start + (pagination.pageSize || 10) - 1, dataLength);
    return `Affichage de ${start} à ${end} sur ${dataLength} éléments`;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        {getPaginationInfo()}
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={pagination.currentPage === 1}
          onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
        >
          Précédent
        </button>
        
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              className={`pagination-btn ${pagination.currentPage === pageNum ? 'active' : ''}`}
              onClick={() => pagination.onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          className="pagination-btn"
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};