'use client';

import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Printer } from 'lucide-react';
import { Simpanan } from '@/hooks/useSimpananData';

interface SimpananTableColumnsParams {
  openKuitansiForRow: (row: Simpanan) => void;
  formatRupiah: (amount: number) => string;
}

export function createSimpananTableColumns({
  openKuitansiForRow,
  formatRupiah,
}: SimpananTableColumnsParams) {
  return [
    {
      header: 'No. Transaksi',
      accessor: (row: Simpanan) => (
        <div>
          <span className="font-mono font-bold text-xs text-slate-800 block">
            {row.kodeTransaksi || '-'}
          </span>
          <span className="text-[11px] text-slate-400 capitalize">
            {row.metodePembayaran || 'Tunai'}
          </span>
        </div>
      ),
    },
    {
      header: 'Anggota',
      accessor: (row: Simpanan) => (
        <div>
          <div className="font-bold text-slate-900 text-sm">{row.namaAnggota || 'Unknown'}</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">
            {row.nomorAnggota || '-'}
          </div>
        </div>
      ),
    },
    {
      header: 'Jenis',
      accessor: (row: Simpanan) => {
        const colors: Record<string, string> = {
          Pokok: 'bg-blue-50 text-blue-700 border-blue-200/60',
          Wajib: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          Sukarela: 'bg-amber-50 text-amber-700 border-amber-200/60',
        };
        return (
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
              colors[row.jenis] ?? 'bg-slate-50 text-slate-700'
            }`}
          >
            {row.jenis}
          </span>
        );
      },
    },
    {
      header: 'Tipe Mutasi',
      accessor: (row: Simpanan) => (
        <div
          className={`flex items-center gap-1.5 font-bold text-xs ${
            row.tipe === 'Setoran' ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {row.tipe === 'Setoran' ? (
            <ArrowDownLeft className="w-4 h-4" />
          ) : (
            <ArrowUpRight className="w-4 h-4" />
          )}
          {row.tipe}
        </div>
      ),
    },
    {
      header: 'Nominal',
      accessor: (row: Simpanan) => (
        <span
          className={`font-black font-mono text-sm ${
            row.tipe === 'Setoran' ? 'text-emerald-700' : 'text-rose-600'
          }`}
        >
          {row.tipe === 'Penarikan' ? '- ' : '+ '}
          {formatRupiah(row.jumlah)}
        </span>
      ),
    },
    {
      header: 'Tanggal',
      accessor: (row: Simpanan) => (
        <span className="font-medium text-slate-600 text-xs">
          {new Date(row.tanggal).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Kasir',
      accessor: (row: Simpanan) => (
        <span className="text-xs text-slate-600 font-semibold">{row.operator || 'Kasir'}</span>
      ),
    },
    {
      header: 'Aksi',
      accessor: (row: Simpanan) => (
        <button
          onClick={() => openKuitansiForRow(row)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
          title="Cetak Kuitansi Transaksi"
        >
          <Printer size={13} /> Kuitansi
        </button>
      ),
    },
  ];
}
