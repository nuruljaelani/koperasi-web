'use client';

import React from 'react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { ReportType, LaporanMetrics, formatRupiah } from '../types';
import { LaporanTableKolektibilitas } from './LaporanTableKolektibilitas';
import { LaporanTableSentra } from './LaporanTableSentra';

interface LaporanTableProps {
  reportType: ReportType;
  filteredData: any[];
  anggotaMap: Map<string, string>;
  jenisMap: Map<string, string>;
  metrics: LaporanMetrics;
  kolReport: any;
  kolLoading: boolean;
  sentraLoading: boolean;
}

export function LaporanTable({
  reportType,
  filteredData,
  anggotaMap,
  jenisMap,
  metrics,
  kolReport,
  kolLoading,
  sentraLoading,
}: LaporanTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base">
            Pratinjau Data Laporan {reportType.toUpperCase()}
          </h3>
          <p className="text-xs text-slate-400">
            Menampilkan {filteredData.length} baris data transaksi untuk periode terfilter.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        {reportType === 'simpanan' && (
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">ID Transaksi</th>
                <th className="py-3 px-4">Nama Anggota</th>
                <th className="py-3 px-4">Jenis Simpanan</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">{s.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {anggotaMap.get(s.anggotaId) || s.anggotaId}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{s.jenis}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        s.tipe === 'Setoran'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {s.tipe}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {s.tanggal
                      ? format(new Date(s.tanggal), 'dd MMM yyyy', { locale: localeID })
                      : '-'}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-bold ${
                      s.tipe === 'Setoran' ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {s.tipe === 'Setoran' ? '+' : '-'}
                    {formatRupiah(s.jumlah)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'pinjaman' && (
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Pinjaman</th>
                <th className="py-3 px-4">Nama Anggota</th>
                <th className="py-3 px-4">Jenis Pinjaman</th>
                <th className="py-3 px-4 text-center">Tenor</th>
                <th className="py-3 px-4">Tgl Pengajuan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Jumlah Pinjaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {p.nomorPinjaman}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {anggotaMap.get(p.anggotaId) || p.anggotaId}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {jenisMap.get(p.jenisPinjamanId) || p.jenisPinjamanId}
                  </td>
                  <td className="py-3 px-4 text-center font-medium">{p.tenor} Bln</td>
                  <td className="py-3 px-4 text-slate-500">
                    {format(new Date(p.tanggalPengajuan), 'dd MMM yyyy', { locale: localeID })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.status === 'Cair'
                          ? 'bg-emerald-100 text-emerald-700'
                          : p.status === 'Review'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatRupiah(p.jumlahPengajuan)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'anggota' && (
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Anggota</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">NIK</th>
                <th className="py-3 px-4">Telepon</th>
                <th className="py-3 px-4">Alamat</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {a.nomorAnggota}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{a.nama}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{a.nik}</td>
                  <td className="py-3 px-4 text-slate-600">{a.nomorHp}</td>
                  <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{a.alamat}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        a.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'shu' && (
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Anggota</th>
                <th className="py-3 px-4">Nama Anggota</th>
                <th className="py-3 px-4 text-right">Tot. Simpanan</th>
                <th className="py-3 px-4 text-right">Tot. Pinjaman</th>
                <th className="py-3 px-4 text-right">SHU Jasa Simpanan</th>
                <th className="py-3 px-4 text-right">SHU Jasa Pinjaman</th>
                <th className="py-3 px-4 text-right">Total Est. SHU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {item.nomorAnggota}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{item.nama}</td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {formatRupiah(item.totalSimpanan)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {formatRupiah(item.totalPinjaman)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-emerald-700">
                    {formatRupiah(item.shuSimpanan)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-blue-700">
                    {formatRupiah(item.shuPinjaman)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-amber-700">
                    {formatRupiah(item.totalShu)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'keuangan' && (
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Pos Laporan Keuangan</th>
                <th className="py-3.5 px-6 text-right">Nilai Nominal (Rp)</th>
                <th className="py-3.5 px-6">Keterangan Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-4 px-6 font-bold text-slate-800">1. Kas & Setara Kas Koperasi</td>
                <td className="py-4 px-6 text-right font-bold text-emerald-700">
                  {metrics.card1Val}
                </td>
                <td className="py-4 px-6 text-slate-500">
                  Likuiditas kas siap pakai di bank & brankas
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-4 px-6 font-bold text-slate-800">
                  2. Portofolio Simpanan Anggota
                </td>
                <td className="py-4 px-6 text-right font-bold text-blue-700">{metrics.card2Val}</td>
                <td className="py-4 px-6 text-slate-500">
                  Kewajiban simpanan pokok, wajib & sukarela
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-4 px-6 font-bold text-slate-800">
                  3. Portofolio Pinjaman Beredar
                </td>
                <td className="py-4 px-6 text-right font-bold text-purple-700">
                  {metrics.card3Val}
                </td>
                <td className="py-4 px-6 text-slate-500">
                  Piutang pembiayaan yang sedang berjalan di anggota
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-4 px-6 font-bold text-slate-800">
                  4. Est. Pendapatan Bunga Operasional (Tahun)
                </td>
                <td className="py-4 px-6 text-right font-bold text-amber-700">
                  {metrics.card4Val}
                </td>
                <td className="py-4 px-6 text-slate-500">
                  Proyeksi bagi hasil & pendapatan jasa pinjaman
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {reportType === 'kolektibilitas' && (
          <LaporanTableKolektibilitas
            kolReport={kolReport}
            kolLoading={kolLoading}
            filteredData={filteredData}
          />
        )}

        {reportType === 'sentra' && (
          <LaporanTableSentra sentraLoading={sentraLoading} filteredData={filteredData} />
        )}
      </div>
    </div>
  );
}
