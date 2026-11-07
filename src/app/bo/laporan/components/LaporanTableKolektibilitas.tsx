'use client';

import React from 'react';
import { formatRupiah } from '../types';

interface LaporanTableKolektibilitasProps {
  kolReport: any;
  kolLoading: boolean;
  filteredData: any[];
}

export function LaporanTableKolektibilitas({
  kolReport,
  kolLoading,
  filteredData,
}: LaporanTableKolektibilitasProps) {
  return (
    <div className="space-y-4">
      {/* Visual Aging Portfolio Badges */}
      {kolReport?.ringkasan?.kolektibilitas && (
        <div className="px-6 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {kolReport.ringkasan.kolektibilitas.map((k: any) => (
            <div
              key={k.kode}
              className={`p-3 rounded-2xl border text-xs ${
                k.kode === 1
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : k.kode === 2
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : k.kode === 3
                  ? 'bg-orange-50/70 border-orange-200 text-orange-900'
                  : k.kode === 4
                  ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                  : 'bg-red-100/70 border-red-300 text-red-950 font-bold'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">
                  Kol {k.kode}: {k.label}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/70">
                  {k.porsi}%
                </span>
              </div>
              <p className="text-sm font-extrabold mt-1.5">{formatRupiah(k.bakiDebet)}</p>
              <span className="text-[10px] opacity-75">{k.debitur} Rekening / Debitur</span>
            </div>
          ))}
        </div>
      )}

      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
          <tr>
            <th className="py-3 px-4">No. Pinjaman</th>
            <th className="py-3 px-4">Anggota</th>
            <th className="py-3 px-4">Kontak / Wilayah</th>
            <th className="py-3 px-4 text-right">Sisa Baki Debet</th>
            <th className="py-3 px-4 text-center">Hari Keterlambatan</th>
            <th className="py-3 px-4 text-right">Tunggakan (Rp)</th>
            <th className="py-3 px-4 text-center">Kolektibilitas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {kolLoading ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-400">
                Memuat data analisis kolektibilitas...
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-400">
                Tidak ada data pinjaman yang cocok dengan filter.
              </td>
            </tr>
          ) : (
            filteredData.map((k) => (
              <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-slate-700">{k.nomorPinjaman}</td>
                <td className="py-3 px-4">
                  <p className="font-bold text-slate-800">{k.anggota?.namaLengkap || '-'}</p>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {k.anggota?.noAnggota || '-'}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <p className="font-mono text-xs">{k.anggota?.noHp || '-'}</p>
                  <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                    {k.anggota?.alamat || '-'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">
                  {formatRupiah(k.sisaPokok)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`font-mono font-bold text-xs ${
                      k.hariKeterlambatan > 0 ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {k.hariKeterlambatan} Hari
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-rose-600 font-bold">
                  {k.nominalTunggakan > 0 ? formatRupiah(k.nominalTunggakan) : '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      k.kolektibilitas === 1
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : k.kolektibilitas === 2
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : k.kolektibilitas === 3
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : k.kolektibilitas === 4
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-red-200 text-red-900 border border-red-300'
                    }`}
                  >
                    Kol {k.kolektibilitas} - {k.kolektibilitasLabel}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
