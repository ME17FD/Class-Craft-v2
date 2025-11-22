/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/dataGridHelpers.ts
import type { Column } from '../../../../types/datagrid/dataGrid.types';

export const dataGridHelpers = {
    // Fonction pour valider une ligne
    validateRow: (row: any, columns: Column[]): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        columns.forEach(column => {
            if (column.required && (!row[column.key] || row[column.key].toString().trim() === '')) {
                errors.push(`${column.label} est obligatoire`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Fonction pour formater les données d'export
    exportToCSV: (data: any[], columns: Column[]): string => {
        const headers = columns.map(col => col.label).join(',');
        const rows = data.map(row =>
            columns.map(col => {
                const value = row[col.key];
                // Échapper les virgules et guillemets
                return `"${String(value || '').replace(/"/g, '""')}"`;
            }).join(',')
        ).join('\n');

        return `${headers}\n${rows}`;
    },

    // Fonction pour trier les données
    sortData: (data: any[], sortBy: string, sortOrder: 'asc' | 'desc') => {
        return [...data].sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    },

    // Fonction pour filtrer les données
    filterData: (data: any[], filters: { [key: string]: string }) => {
        return data.filter(row => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                return String(row[key] || '').toLowerCase().includes(value.toLowerCase());
            });
        });
    },

    // Générer un ID unique pour les nouvelles lignes
    generateId: (): string => {
        return `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

// Export des helpers individuels
export const { validateRow, exportToCSV, sortData, filterData, generateId } = dataGridHelpers;