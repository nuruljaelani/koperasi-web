'use client';

import React from 'react';
import { FileText, BadgePercent, Clock, Edit3, Trash2 } from 'lucide-react';
import { JenisPinjaman } from '@/hooks/useJenisPinjamanData';

export const getBungaBadge = (tipe: string) => {
  switch (tipe) {
    case 'Flat':
      return 'bg-blue-50 text-blue-700 border-blue-200/70';
    case 'Menurun':
      return 'bg-amber-50 text-amber-700 border-amber-200/70';
    case 'Anuitas':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/70';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

interface ColumnHandlers {
  onOpenEdit: (item: JenisPinjaman) => void;
  onConfirmDelete: (item: JenisPinjaman) => void;
}

export function createJenisPinjamanColumns({ onOpenEdit, onConfirmDelete }: ColumnHandlers) {
  return [
    {
      header: 'Kode',
      accessor: (row: JenisPinjaman) => (
        <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">
          {row.kode || '—'}
        </span>
      ),
    },
    {
      header: 'Nama Pinjaman',
      accessor: (row: JenisPinjaman) => (
        <div>
          <div className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {row.nama}
          </div>
          <div className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-slate-400" />
            Produk Pembiayaan
          </div>
        </div>
      ),
    },
    {
      header: 'Bunga & Metode',
      accessor: (row: JenisPinjaman) => (
        <div className="space-y-1">
          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
            <BadgePercent className="w-4 h-4 text-emerald-600" />
            {row.sukuBunga}% <span className="text-slate-400 font-medium text-xs">/ thn</span>
          </div>
          <span
            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${getBungaBadge(
              row.tipeBunga
            )}`}
          >
            {row.tipeBunga}
          </span>
        </div>
      ),
    },
    {
      header: 'Tenor Maksimal',
      accessor: (row: JenisPinjaman) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-800 text-sm">{row.tenorMaksimal}</span>
            <span className="text-xs text-slate-500 font-semibold ml-1">Bulan</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Biaya & Denda',
      accessor: (row: JenisPinjaman) => (
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-slate-600">
            Admin: <span className="font-bold text-slate-900">{row.biayaAdmin}%</span>
          </div>
          <div className="text-[11px] font-bold text-rose-500">
            Denda: {row.denda}% <span className="text-slate-400 font-normal">/ hari</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: JenisPinjaman) => (
        <span
          className={`px-3 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border shadow-2xs ${
            row.status === 'Aktif'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          {row.status}
        </span>
      ),
    },
    {
      header: 'Aksi',
      accessor: (row: JenisPinjaman) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenEdit(row)}
            title="Edit Parameter Pinjaman"
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 cursor-pointer border border-transparent hover:border-emerald-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onConfirmDelete(row)}
            title="Hapus Produk Pinjaman"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95 cursor-pointer border border-transparent hover:border-rose-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
}
