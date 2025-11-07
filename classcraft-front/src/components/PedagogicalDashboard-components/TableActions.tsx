import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/TableActions.module.css";

interface TableColumn<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage?: string;
}

const Table = <T,>({
  data = [],
  columns = [],
  emptyMessage = "Aucune donnée disponible",
}: TableProps<T>) => {
  // Vérifier si les données ou les colonnes sont undefined
  if (!data || !columns) {
    return <div className={styles.emptyTable}>{emptyMessage}</div>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className={styles.emptyCell}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render
                    ? column.render(item)
                    : column.accessor && item
                    ? String(item[column.accessor])
                    : null}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
