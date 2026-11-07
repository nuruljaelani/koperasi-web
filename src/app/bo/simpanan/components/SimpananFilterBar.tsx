'use client';

import React from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';

interface SimpananFilterBarProps {
  searchInput: string;
  onSearchInputChange: (v: string) => void;
  currentJenis: string;
  onJenisChange: (v: string) => void;
  currentTipe: string;
  onTipeChange: (v: string) => void;
  currentDateFrom: string;
  onDateFromChange: (v: string) => void;
  currentDateTo: string;
  onDateToChange: (v: string) => void;
  hasActiveFilters: boolean;
  onResetFilter: () => void;
}

export function SimpananFilterBar({
  searchInput,
  onSearchInputChange,
  currentJenis,
  onJenisChange,
  currentTipe,
  onTipeChange,
  currentDateFrom,
  onDateFromChange,
  currentDateTo,
  onDateToChange,
  hasActiveFilters,
  onResetFilter,
}: SimpananFilterBarProps) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-3 mb-5 text-slate-800 font-bold">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-emerald-600" /> Saring Riwayat Transaksi
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="xl:col-span-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center gap-3 focus-within:ring-4 focus-within:ring-emerald-100 transition-all">
          <div className="w-10 h-10 flex items-center justify-center text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Cari kode trx / nama / nomor anggota"
            className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700 placeholder:text-slate-400 text-sm"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
          />
        </div>

        <select
          value={currentJenis}
          onChange={(e) => onJenisChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 cursor-pointer"
        >
          <option value="Semua">Semua Jenis Simpanan</option>
          <option value="Pokok">Simpanan Pokok</option>
          <option value="Wajib">Simpanan Wajib</option>
          <option value="Sukarela">Simpanan Sukarela</option>
        </select>

        <select
          value={currentTipe}
          onChange={(e) => onTipeChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 cursor-pointer"
        >
          <option value="Semua">Semua Tipe Mutasi</option>
          <option value="Setoran">Setoran</option>
          <option value="Penarikan">Penarikan</option>
        </select>

        <div className="flex gap-2">
          <input
            type="date"
            title="Dari Tanggal"
            value={currentDateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3.5 text-slate-700 font-medium text-xs focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
          <input
            type="date"
            title="Sampai Tanggal"
            value={currentDateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3.5 text-slate-700 font-medium text-xs focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </div>
    </div>
  );
}
