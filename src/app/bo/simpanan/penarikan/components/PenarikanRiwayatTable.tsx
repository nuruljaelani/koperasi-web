'use client';

import React from 'react';
import { TrendingDown, ArrowUpRight, Printer } from 'lucide-react';
import { Simpanan } from '@/hooks/useSimpananData';
import TableFilter from '@/components/TableFilter';

interface PenarikanRiwayatTableProps {
  filtered: Simpanan[];
  searchTerm: string;
  onSearchChange: (v: string) => void;
  jenisFilter: string[];
  onJenisFilterChange: (v: string[]) => void;
  onOpenKuitansi: (row: Simpanan) => void;
  formatRupiah: (v: number) => string;
}

export function PenarikanRiwayatTable({
  filtered,
  searchTerm,
  onSearchChange,
  jenisFilter,
  onJenisFilterChange,
  onOpenKuitansi,
  formatRupiah,
}: PenarikanRiwayatTableProps) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Filters */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/40">
        <TableFilter
          title="Saring Riwayat Penarikan"
          defaultOpen={false}
          fields={[
            {
              id: 'search',
              label: 'Pencarian',
              type: 'input',
              placeholder: 'Cari nama, no. anggota, atau kode transaksi...',
              value: searchTerm,
              onChange: onSearchChange,
            },
            {
              id: 'jenis',
              label: 'Jenis Simpanan',
              type: 'checkbox',
              value: jenisFilter,
              onChange: onJenisFilterChange,
              options: [
                { label: 'Simpanan Sukarela', value: 'Sukarela' },
                { label: 'Simpanan Wajib', value: 'Wajib' },
                { label: 'Simpanan Pokok', value: 'Pokok' },
              ],
            },
          ]}
          onReset={
            searchTerm || jenisFilter.length > 0
              ? () => {
                  onSearchChange('');
                  onJenisFilterChange([]);
                }
              : undefined
          }
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center">
          <TrendingDown className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-bold">Belum ada transaksi penarikan tercatat.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {[
                  'Kode Transaksi',
                  'Anggota',
                  'Jenis Simpanan',
                  'Nominal Penarikan',
                  'Sisa Saldo',
                  'Tanggal',
                  'Kasir',
                  'Aksi',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-xs font-extrabold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-4 font-mono font-bold text-xs text-slate-800">
                    {row.kodeTransaksi || '-'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {row.namaAnggota || '-'}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {row.nomorAnggota || '-'}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                      {row.jenis}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-black text-rose-600 flex items-center gap-1 font-mono text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      {formatRupiah(row.jumlah)}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-700 text-sm">
                    {formatRupiah(row.saldo || 0)}
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium text-xs">
                    {new Date(row.tanggal).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                    {row.operator || 'Kasir'}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onOpenKuitansi(row)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                      <Printer size={13} /> Cetak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
