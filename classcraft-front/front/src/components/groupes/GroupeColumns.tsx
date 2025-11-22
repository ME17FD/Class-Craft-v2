import type { Column } from '../../types/datagrid/dataGrid.types';

export const getGroupeColumns = (onNameClick?: (id: number) => void): Column[] => [
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
        key: 'sectionId',
        label: 'Section ID',
        sortable: true,
        editable: true,
        required: true,
        type: 'number',
        width: '120px',
    },
];

