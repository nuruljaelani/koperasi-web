import { Search, Filter, RotateCcw } from 'lucide-react';
import { JenisPinjaman } from '@/hooks/useJenisPinjamanData';

interface PinjamanFilterBarProps {
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  currentStatus: string;
  onStatusChange: (val: string) => void;
  currentJenis: string;
  onJenisChange: (val: string) => void;
  jenisList: JenisPinjaman[];
  currentDateFrom: string;
  onDateFromChange: (val: string) => void;
  currentDateTo: string;
  onDateToChange: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilter: () => void;
}

export function PinjamanFilterBar({
  searchInput,
  onSearchInputChange,
  currentStatus,
  onStatusChange,
  currentJenis,
  onJenisChange,
  jenisList,
  currentDateFrom,
  onDateFromChange,
  currentDateTo,
  onDateToChange,
  hasActiveFilters,
  onResetFilter,
}: PinjamanFilterBarProps) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-3 mb-5 text-slate-800 font-bold">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-emerald-600" />
          Saring Pengajuan Pinjaman
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilter}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center gap-3 focus-within:ring-4 focus-within:ring-emerald-100 transition-all">
          <div className="w-10 h-10 flex items-center justify-center text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Cari Nama / No. Pinjaman / No. Anggota"
            className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700 placeholder:text-slate-400 text-sm w-full"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={currentStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 cursor-pointer"
        >
          <option value="Semua">Semua Status</option>
          <option value="Review">Menunggu Review</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Cair">Berjalan / Cair</option>
          <option value="Lunas">Lunas</option>
          <option value="Ditolak">Ditolak</option>
          <option value="Draft">Draft</option>
        </select>

        {/* Jenis Dropdown */}
        <select
          value={currentJenis}
          onChange={(e) => onJenisChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 cursor-pointer"
        >
          <option value="Semua">Semua Jenis Pinjaman</option>
          {jenisList.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nama}
            </option>
          ))}
        </select>

        {/* Date Range */}
        <div className="flex gap-2">
          <input
            type="date"
            title="Tanggal Mulai"
            value={currentDateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 font-medium text-xs focus:outline-none focus:ring-4 focus:ring-emerald-100 cursor-pointer"
          />
          <input
            type="date"
            title="Tanggal Akhir"
            value={currentDateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 font-medium text-xs focus:outline-none focus:ring-4 focus:ring-emerald-100 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
