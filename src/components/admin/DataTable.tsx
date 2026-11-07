import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

export interface TablePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
  limitOptions?: number[];
  isLoading?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  pagination?: TablePagination;
  emptyState?: ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  pagination,
  emptyState,
}: DataTableProps<T>) {
  // Helper untuk membuat daftar halaman pagination bernomor dengan ellipsis
  const getPageNumbers = () => {
    if (!pagination) return [];
    const { page, totalPages } = pagination;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  const limitOptions = pagination?.limitOptions || [10, 25, 50, 100];
  const pageNumbers = getPageNumbers();

  const startRecord = pagination
    ? pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1
    : 1;
  const endRecord = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : data.length;

  return (
    <div className="w-full bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Table Container with horizontal scroll */}
      <div className="w-full overflow-x-auto relative">
        {/* Loading overlay */}
        {pagination?.isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-md border border-slate-100 text-emerald-600 font-semibold text-xs animate-in fade-in duration-200">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memuat data...</span>
            </div>
          </div>
        )}

        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`p-6 text-xs font-bold text-slate-400 uppercase tracking-widest ${
                    col.className || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-slate-50/50 transition-colors duration-300 group"
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className={`p-6 text-sm font-semibold text-slate-700 ${col.className || ''}`}
                  >
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && !pagination?.isLoading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-16 text-center text-slate-400 font-bold"
                >
                  {emptyState || 'Tidak ada data yang ditemukan.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pagination && (
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
          {/* Sisi Kiri: Range Records & Limit Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-slate-500 font-medium">
              Menampilkan <strong className="text-slate-800 font-bold">{startRecord}</strong> -{' '}
              <strong className="text-slate-800 font-bold">{endRecord}</strong> dari{' '}
              <strong className="text-slate-800 font-bold">{pagination.total}</strong> data
            </span>

            {pagination.onLimitChange && (
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-400 hidden sm:inline">|</span>
                <span className="text-slate-400">Tampilkan</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => pagination.onLimitChange?.(Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-sm cursor-pointer"
                >
                  {limitOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="text-slate-400">baris</span>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Page Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            {/* First Page */}
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page <= 1 || pagination.isLoading}
              title="Halaman Pertama"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors shadow-sm"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Prev Page */}
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || pagination.isLoading}
              title="Halaman Sebelumnya"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Numeric Page Buttons */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((num, idx) => {
                if (num === '...') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 py-1 text-slate-400 font-bold select-none"
                    >
                      &hellip;
                    </span>
                  );
                }
                const isCurrent = num === pagination.page;
                return (
                  <button
                    key={num}
                    onClick={() => pagination.onPageChange(num as number)}
                    disabled={pagination.isLoading}
                    className={`min-w-[34px] h-[34px] px-2.5 rounded-xl font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-[0_2px_8px_rgba(5,150,105,0.3)] scale-105'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Next Page */}
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || pagination.isLoading}
              title="Halaman Selanjutnya"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages || pagination.isLoading}
              title="Halaman Terakhir"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors shadow-sm"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
