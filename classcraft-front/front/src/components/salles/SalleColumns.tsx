import type { Column } from '../../types/datagrid/dataGrid.types';

export const getSalleColumns = (): Column[] => [
    {
        key: 'id',
        label: 'ID',
        sortable: true,
        editable: false,
        type: 'number',
        width: '80px',
    },
    {
        key: 'name',
        label: 'Nom',
        sortable: true,
        editable: true,
        required: true,
        type: 'string',
        width: '200px',
    },
    {
        key: 'type',
        label: 'Type',
        sortable: true,
        editable: true,
        required: true,
        type: 'string',
        width: '150px',
        render: (value: string) => (
            <span style={{ 
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                backgroundColor: getTypeColor(value),
                color: '#fff',
                fontWeight: '500'
            }}>
                {value}
            </span>
        ),
    },
    {
        key: 'capacity',
        label: 'Capacité',
        sortable: true,
        editable: true,
        required: true,
        type: 'number',
        width: '120px',
    },
];

const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        'AMPHITHEATRE': '#1976d2',
        'SALLETD': '#388e3c',
        'SALLETP': '#f57c00',
    };
    return colors[type] || '#757575';
};

