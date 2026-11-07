'use client';

import React from 'react';
import { BarChart3, FileText } from 'lucide-react';

export interface RekapRow {
  label: string;
  sub: string;
  setoran: number;
  penarikan: number;
  saldo: number;
  count: number;
}

interface LaporanSimpananChartTableProps {
  groupBy: 'bulan' | 'anggota' | 'jenis';
  activeData: RekapRow[];
  maxVal: number;
  totalSetoran: number;
  totalPenarikan: number;
  saldoBersih: number;
  totalFilteredCount: number;
  formatRupiah: (v: number) => string;
}

export function LaporanSimpananChartTable({
  groupBy,
  activeData,
  maxVal,
  totalSetoran,
  totalPenarikan,
  saldoBersih,
  totalFilteredCount,
  formatRupiah,
}: LaporanSimpananChartTableProps) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3 font-bold text-slate-800">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          Rekap per {groupBy === 'bulan' ? 'Bulan' : groupBy === 'anggota' ? 'Anggota' : 'Jenis'}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="w-3 h-3 rounded bg-emerald-400" />
            Setoran
          </span>
          <span className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="w-3 h-3 rounded bg-rose-400" />
            Penarikan
          </span>
        </div>
      </div>

      {activeData.length === 0 ? (
        <div className="p-16 text-center">
          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-bold">Tidak ada data pada periode ini.</p>
        </div>
      ) : (
        <>
          {/* Bar chart */}
          <div className="px-8 py-6 space-y-4">
            {activeData.map((row, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-sm font-bold text-slate-700 w-36 truncate">{row.label}</span>
                  {row.sub && <span className="text-xs text-slate-400 font-medium">{row.sub}</span>}
                  <span className="ml-auto text-xs font-bold text-slate-500">
                    {row.count} transaksi
                  </span>
                </div>
                {/* Setoran bar */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${(row.setoran / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 w-32 text-right">
                    {formatRupiah(row.setoran)}
                  </span>
                </div>
                {/* Penarikan bar */}
                {row.penarikan > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
                        style={{ width: `${(row.penarikan / maxVal) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-rose-600 w-32 text-right">
                      {formatRupiah(row.penarikan)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="border-t border-slate-100 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {[
                    groupBy === 'bulan' ? 'Periode' : groupBy === 'anggota' ? 'Anggota' : 'Jenis',
                    'Total Setoran',
                    'Total Penarikan',
                    'Saldo Bersih',
                    'Jml. Transaksi',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-left text-xs font-extrabold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{row.label}</div>
                      {row.sub && <div className="text-xs text-slate-400 mt-0.5">{row.sub}</div>}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-700">
                      {formatRupiah(row.setoran)}
                    </td>
                    <td className="px-6 py-4 font-bold text-rose-600">
                      {formatRupiah(row.penarikan)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-extrabold ${
                          row.saldo >= 0 ? 'text-slate-800' : 'text-rose-600'
                        }`}
                      >
                        {formatRupiah(row.saldo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.count}</td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-emerald-50/50 border-t-2 border-emerald-100">
                  <td className="px-6 py-4 font-extrabold text-slate-800">TOTAL</td>
                  <td className="px-6 py-4 font-extrabold text-emerald-700">
                    {formatRupiah(totalSetoran)}
                  </td>
                  <td className="px-6 py-4 font-extrabold text-rose-600">
                    {formatRupiah(totalPenarikan)}
                  </td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">
                    {formatRupiah(saldoBersih)}
                  </td>
                  <td className="px-6 py-4 font-extrabold text-slate-800">
                    {totalFilteredCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
