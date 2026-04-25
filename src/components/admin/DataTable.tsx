import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
}

export default function DataTable<T>({ data, columns, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {columns.map((col, i) => (
              <th key={i} className={`p-6 text-xs font-bold text-slate-400 uppercase tracking-widest ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-slate-50/50 transition-colors duration-300 group">
              {columns.map((col, j) => (
                <td key={j} className={`p-6 text-sm font-semibold text-slate-700 ${col.className || ''}`}>
                  {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-16 text-center text-slate-400 font-bold">
                Tidak ada data yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
