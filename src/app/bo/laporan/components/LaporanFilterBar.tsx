'use client';

import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { PeriodePreset, ReportType } from '../types';

interface LaporanFilterBarProps {
  periodePreset: PeriodePreset;
  startDate: string;
  endDate: string;
  searchTerm: string;
  statusFilter: string;
  reportType: ReportType;
  onPresetChange: (p: PeriodePreset) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
}

export function LaporanFilterBar({
  periodePreset,
  startDate,
  endDate,
  searchTerm,
  statusFilter,
  reportType,
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
  onSearchChange,
  onStatusChange,
}: LaporanFilterBarProps) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Periode Preset Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Calendar className="w-3.5 h-3.5" /> Periode:
          </span>
          {[
            { id: 'bulan_ini', label: 'Bulan Ini' },
            { id: 'triwulan', label: 'Triwulan (3 Bln)' },
            { id: 'tahun_ini', label: 'Tahun Ini' },
            { id: 'kustom', label: 'Kustom Tanggal' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => onPresetChange(p.id as PeriodePreset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                periodePreset === p.id
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Date Pickers */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-xs text-slate-400 font-bold">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Second Filter Row: Search & Status Dropdown */}
      <div className="grid md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci nama anggota, ID transaksi, NIK..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {reportType !== 'keuangan' && reportType !== 'shu' && reportType !== 'sentra' && (
          <div>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="semua">Semua Status</option>
              {reportType === 'simpanan' && (
                <>
                  <option value="Setoran">Setoran</option>
                  <option value="Penarikan">Penarikan</option>
                </>
              )}
              {reportType === 'pinjaman' && (
                <>
                  <option value="Cair">Aktif (Cair)</option>
                  <option value="Review">Dalam Review</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Ditolak">Ditolak</option>
                </>
              )}
              {reportType === 'kolektibilitas' && (
                <>
                  <option value="1">Kol 1 - Lancar</option>
                  <option value="2">Kol 2 - DPK (1-90 hari)</option>
                  <option value="3">Kol 3 - Kurang Lancar (91-120 hari)</option>
                  <option value="4">Kol 4 - Diragukan (121-180 hari)</option>
                  <option value="5">Kol 5 - Macet (&gt;180 hari)</option>
                </>
              )}
              {reportType === 'anggota' && (
                <>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </>
              )}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
