// components/DataGridPagination.tsx
import React from 'react';
import '../../../../styles/components/datagrid/datagridcomponents/dataGridPagination.css';
interface DataGridPaginationProps {
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
  };
  dataLength: number;
  totalDataLength?: number; // Nouveau: longueur totale des données
}

export const DataGridPagination: React.FC<DataGridPaginationProps> = ({
  pagination,
  dataLength,
  totalDataLength
}) => {
  const { currentPage, totalPages, onPageChange, pageSize = 15 } = pagination;

  const getPaginationInfo = () => {
    const start = ((currentPage - 1) * pageSize) + 1;
    const end = start + dataLength - 1;
    const total = totalDataLength || (start + dataLength - 1);
    
    return `Affichage de ${start} à ${end} sur ${total} éléments`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajuster si on est proche du début
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Bouton première page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // Pages numérotées
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Bouton dernière page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        {getPaginationInfo()}
      </div>
      <div className="pagination-controls">
        {/* Flèche précédente */}
        <button
          className="pagination-btn pagination-arrow"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          title="Page précédente"
        >
          ‹
        </button>
        
        {/* Numéros de page */}
        {renderPageNumbers()}
        
        {/* Flèche suivante */}
        <button
          className="pagination-btn pagination-arrow"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          title="Page suivante"
        >
          ›
        </button>
      </div>
    </div>
  );
};