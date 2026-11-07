'use client';

import React from 'react';
import { Printer, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { ReportType, LaporanMetrics, formatRupiah } from '../types';

interface LaporanPrintModalProps {
  show: boolean;
  onClose: () => void;
  reportType: ReportType;
  startDate: string;
  endDate: string;
  metrics: LaporanMetrics;
  filteredData: any[];
}

export function LaporanPrintModal({
  show,
  onClose,
  reportType,
  startDate,
  endDate,
  metrics,
  filteredData,
}: LaporanPrintModalProps) {
  if (!show) return null;

  const handleExecutePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">
              Pratinjau Laporan Resmi Cetak (PDF)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExecutePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Cetak / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Official Report Document Area */}
        <div className="space-y-6 p-4 border border-slate-200 rounded-2xl bg-white">
          {/* Official Kop Surat */}
          <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
            <div className="flex items-center justify-center gap-3">
              <Building2 className="w-8 h-8 text-emerald-700" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-wide uppercase">
                UNIT PENGELOLA KEGIATAN (UPK) MEKARSARI
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Jl. Mekarsari No. 12 RT 03 RW 05, Bandung, Jawa Barat • Telp: (022) 5678901 • Email:
              info@upkmekarsari.co.id
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              SK Pendirian: SK/BH/PAD/XVI/IV/2010 • NPWP: 12.345.678.9-012.000
            </p>
          </div>

          {/* Document Metadata */}
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-800 uppercase underline">
              LAPORAN REKAPITULASI {reportType.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Periode Tanggal:{' '}
              {format(new Date(startDate), 'dd MMMM yyyy', { locale: localeID })} s/d{' '}
              {format(new Date(endDate), 'dd MMMM yyyy', { locale: localeID })}
            </p>
          </div>

          {/* Brief Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block">{metrics.card1Title}</span>
              <span className="font-bold text-slate-800">{metrics.card1Val}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{metrics.card2Title}</span>
              <span className="font-bold text-slate-800">{metrics.card2Val}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{metrics.card3Title}</span>
              <span className="font-bold text-slate-800">{metrics.card3Val}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{metrics.card4Title}</span>
              <span className="font-bold text-slate-800">{metrics.card4Val}</span>
            </div>
          </div>

          {/* Printable Table Summary */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Keterangan / Subjek</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Nilai Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.slice(0, 15).map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2 px-3">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium">
                      {item.namaSentra ||
                        item.anggota?.namaLengkap ||
                        item.nama ||
                        item.nomorPinjaman ||
                        item.id ||
                        `Transaksi #${idx + 1}`}
                    </td>
                    <td className="py-2 px-3 text-slate-500">
                      {item.kolektibilitasLabel
                        ? `Kol ${item.kolektibilitas} - ${item.kolektibilitasLabel}`
                        : item.namaSentra
                        ? `${item.totalAnggota} Anggota`
                        : item.jenis || item.status || 'Umum'}
                    </td>
                    <td className="py-2 px-3 text-right font-bold">
                      {formatRupiah(
                        item.sisaPokok ??
                          item.totalSimpanan ??
                          item.jumlah ??
                          item.jumlahPengajuan ??
                          item.totalShu ??
                          0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signatures Block */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-12">
              <p className="text-slate-500">
                Mengetahui,
                <br />
                <strong className="text-slate-800">Ketua Koperasi UPK Mekarsari</strong>
              </p>
              <p className="font-bold text-slate-900 underline">( H. Ahmad Subarkah, S.E. )</p>
            </div>
            <div className="space-y-12">
              <p className="text-slate-500">
                Bandung, {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
                <br />
                <strong className="text-slate-800">Bendahara / Admin Utama</strong>
              </p>
              <p className="font-bold text-slate-900 underline">( Hj. Nurul Jaelani, M.M. )</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
