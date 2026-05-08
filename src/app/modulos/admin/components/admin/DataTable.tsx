import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
}

export function DataTable<T>({ columns, data, loading }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-body uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-body">
                Nenhum registo encontrado.
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-heading">
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}