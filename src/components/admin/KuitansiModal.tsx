'use client';

import { useRef } from 'react';
import {
  Printer,
  X,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  User,
  Hash,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { terbilang } from '@/lib/terbilang';

export interface KuitansiData {
  kodeTransaksi: string;
  tanggalTransaksi: string;
  jenisMutasi: 'setor' | 'tarik' | 'Setoran' | 'Penarikan';
  nominal: number;
  saldoAwal?: number;
  saldoAkhir?: number;
  metodePembayaran?: string;
  keterangan?: string;
  nomorRekening?: string;
  jenisSimpanan?: string;
  namaAnggota: string;
  nomorAnggota?: string;
  nik?: string;
  noHp?: string;
  alamat?: string;
  operator?: string;
}

interface KuitansiModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KuitansiData | null;
}

export default function KuitansiModal({ isOpen, onClose, data }: KuitansiModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const isSetor =
    data.jenisMutasi === 'setor' ||
    data.jenisMutasi === 'Setoran' ||
    data.kodeTransaksi.includes('-STR-');

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const formatTanggal = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Styles for direct clean printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #kuitansi-print-area,
          #kuitansi-print-area * {
            visibility: visible !important;
          }
          #kuitansi-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        title={
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isSetor ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isSetor ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
            Kuitansi {isSetor ? 'Setoran' : 'Penarikan'} Simpanan
          </span>
        }
        footer={
          <div className="no-print flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Printer size={16} />
              Cetak Kuitansi
            </button>
          </div>
        }
      >
        {/* Printable Receipt Container */}
        <div id="kuitansi-print-area" ref={printRef} className="p-8 space-y-6 bg-white text-slate-800">
          {/* Header Kop Surat Koperasi */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
                <Building2 size={26} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  KOPERASI SIMPAN PINJAM
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Sistem Informasi Simpan Pinjam Terintegrasi
                </p>
                <p className="text-[11px] text-slate-400">
                  Layanan Keuangan Anggota Mandiri & Terpercaya
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                BUKTI TRANSAKSI KASIR
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-1.5">
                {data.kodeTransaksi}
              </p>
              <p className="text-[11px] text-slate-500">{formatTanggal(data.tanggalTransaksi)}</p>
            </div>
          </div>

          {/* Judul & Tipe Mutasi */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Jenis Transaksi
              </span>
              <p className="text-base font-bold text-slate-900">
                {isSetor ? 'SETORAN SIMPANAN' : 'PENARIKAN SIMPANAN'} (
                {data.jenisSimpanan || 'Simpanan'})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Metode Pembayaran
              </span>
              <span className="inline-block mt-0.5 px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg capitalize">
                {data.metodePembayaran || 'Tunai'}
              </span>
            </div>
          </div>

          {/* Data Detail Pihak & Rekening */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Kolom Anggota */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-emerald-800">
                Data Anggota
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Anggota:</span>
                  <span className="font-bold text-slate-900">{data.namaAnggota}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">No. Anggota:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {data.nomorAnggota || '-'}
                  </span>
                </div>
                {data.noHp && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">No. Telepon/WA:</span>
                    <span className="text-slate-700">{data.noHp}</span>
                  </div>
                )}
                {data.alamat && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alamat:</span>
                    <span className="text-slate-700 text-right truncate max-w-[160px]">
                      {data.alamat}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Rekening & Transaksi */}
            <div className="space-y-2 pl-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-emerald-800">
                Rincian Rekening
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">No. Rekening:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {data.nomorRekening || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kategori:</span>
                  <span className="font-semibold text-slate-800">
                    {data.jenisSimpanan || 'Simpanan'}
                  </span>
                </div>
                {data.keterangan && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Keterangan:</span>
                    <span className="text-slate-700 text-right italic">{data.keterangan}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Petugas Kasir:</span>
                  <span className="font-medium text-slate-700">{data.operator || 'Kasir'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kotak Nominal Jumlah & Terbilang */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Jumlah {isSetor ? 'Setoran' : 'Penarikan'}
              </span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {formatRupiah(data.nominal)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                Terbilang:
              </span>
              <p className="text-xs font-bold italic text-emerald-800 bg-emerald-50/60 p-2 rounded-lg mt-1 border border-emerald-100">
                "{terbilang(data.nominal)}"
              </p>
            </div>

            {data.saldoAkhir !== undefined && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex justify-between text-xs font-semibold text-slate-600">
                <span>Saldo Rekening Saat Ini:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatRupiah(data.saldoAkhir)}
                </span>
              </div>
            )}
          </div>

          {/* Tanda Tangan */}
          <div className="pt-4 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-12">
              <p className="text-slate-500 font-medium">Penyetor / Anggota,</p>
              <div className="border-b border-slate-400 w-44 mx-auto pb-1 font-bold text-slate-800">
                {data.namaAnggota}
              </div>
            </div>

            <div className="space-y-12">
              <p className="text-slate-500 font-medium">Petugas Kasir / Teller,</p>
              <div className="border-b border-slate-400 w-44 mx-auto pb-1 font-bold text-slate-800">
                {data.operator || 'Kasir Koperasi'}
              </div>
            </div>
          </div>

          {/* Footer Catatan */}
          <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
            <p>Bukti transaksi ini adalah dokumen sah yang diterbitkan oleh sistem komputer koperasi.</p>
            <p>Simpan tanda terima ini sebagai bukti pembayaran/penarikan simpanan yang sah.</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
