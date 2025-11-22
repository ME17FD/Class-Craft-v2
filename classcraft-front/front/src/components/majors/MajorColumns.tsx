import type { Column } from '../../types/datagrid/dataGrid.types';

export const getMajorColumns = (onNameClick?: (id: number) => void): Column[] => [
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
        width: '250px',
        render: (value: string, row: any) => {
            if (onNameClick && row?.id) {
                return (
                    <span
                        style={{
                            color: '#1976d2',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontWeight: '500'
                        }}
                        onClick={() => onNameClick(row.id)}
                    >
                        {value}
                    </span>
                );
            }
            return <span>{value}</span>;
        },
    },
    {
        key: 'description',
        label: 'Description',
        sortable: false,
        editable: true,
        type: 'string',
        width: '400px',
        render: (value: string) => (
            <span style={{ 
                display: 'block',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}>
                {value || 'Aucune description'}
            </span>
        ),
    },
];

