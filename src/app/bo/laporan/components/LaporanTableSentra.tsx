'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { formatRupiah } from '../types';

interface LaporanTableSentraProps {
  sentraLoading: boolean;
  filteredData: any[];
}

export function LaporanTableSentra({ sentraLoading, filteredData }: LaporanTableSentraProps) {
  return (
    <table className="w-full text-left text-xs sm:text-sm">
      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
        <tr>
          <th className="py-3.5 px-4">Nama Sentra / Wilayah</th>
          <th className="py-3.5 px-4 text-center">Total Anggota</th>
          <th className="py-3.5 px-4 text-right">Total Simpanan</th>
          <th className="py-3.5 px-4 text-right">Penyaluran Pinjaman</th>
          <th className="py-3.5 px-4 text-right">Sisa Baki Debet</th>
          <th className="py-3.5 px-4 text-center">Peminjam Aktif</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {sentraLoading ? (
          <tr>
            <td colSpan={6} className="py-8 text-center text-slate-400">
              Memuat rekapitulasi data sentra...
            </td>
          </tr>
        ) : filteredData.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-8 text-center text-slate-400">
              Belum ada data sentra / wilayah tercatat.
            </td>
          </tr>
        ) : (
          filteredData.map((s, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">{s.namaSentra}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                {s.totalAnggota} Anggota
              </td>
              <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                {formatRupiah(s.totalSimpanan)}
              </td>
              <td className="py-3.5 px-4 text-right text-slate-700 font-semibold">
                {formatRupiah(s.totalPinjaman)}
              </td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                {formatRupiah(s.totalSisaPokok)}
              </td>
              <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                {s.jumlahPeminjam} Orang
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
