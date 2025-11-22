import type { Column } from '../../types/datagrid/dataGrid.types';

export const getStudentColumns = (): Column[] => [
    {
        key: 'id',
        label: 'ID',
        sortable: true,
        editable: false,
        type: 'number',
        width: '80px',
    },
    {
        key: 'email',
        label: 'Email',
        sortable: true,
        editable: true,
        required: true,
        type: 'email',
        width: '200px',
    },
    {
        key: 'firstName',
        label: 'Prénom',
        sortable: true,
        editable: true,
        required: true,
        type: 'string',
        width: '150px',
    },
    {
        key: 'lastName',
        label: 'Nom',
        sortable: true,
        editable: true,
        required: true,
        type: 'string',
        width: '150px',
    },
    {
        key: 'role',
        label: 'Rôle',
        sortable: true,
        editable: false,
        type: 'string',
        width: '120px',
        render: (value: string) => (
            <span style={{ 
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                backgroundColor: getRoleColor(value),
                color: '#fff',
                fontWeight: '500'
            }}>
                {value}
            </span>
        ),
    },
    {
        key: 'approved',
        label: 'Approuvé',
        sortable: true,
        editable: true,
        type: 'string',
        width: '120px',
        render: (value: boolean) => (
            <span style={{ 
                color: value ? '#4caf50' : '#f44336',
                fontWeight: 'bold',
                fontSize: '0.875rem'
            }}>
                {value ? '✓ Oui' : '✗ Non'}
            </span>
        ),
    },
    {
        key: 'groupeId',
        label: 'Groupe ID',
        sortable: true,
        editable: true,
        type: 'number',
        width: '120px',
        render: (value: number | null) => (
            <span>{value ?? 'Aucun'}</span>
        ),
    },
];

const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
        'ADMIN': '#d32f2f',
        'PROFESSOR': '#1976d2',
        'STUDENT': '#388e3c',
        'MONITOR': '#f57c00',
    };
    return colors[role] || '#757575';
};

