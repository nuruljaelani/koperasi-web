'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import { usePinjamanData, Pinjaman } from '@/hooks/usePinjamanData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import { useJenisPinjamanData } from '@/hooks/useJenisPinjamanData';

export default function DetailPinjamanPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { dataList, isLoaded: pinjamanLoaded } = usePinjamanData();
  const { anggotaList, isLoaded: anggotaLoaded } = useAnggotaData();
  const { dataList: jenisList, isLoaded: jenisLoaded } = useJenisPinjamanData();

  const [data, setData] = useState<Pinjaman | null>(null);
  const id = React.use(params).id;

  useEffect(() => {
    if (pinjamanLoaded && anggotaLoaded && jenisLoaded) {
      const existing = dataList.find(p => p.id === id);
      if (existing) {
        setData(existing);
      } else {
        router.push('/admin/pinjaman');
      }
    }
  }, [pinjamanLoaded, anggotaLoaded, jenisLoaded, id, dataList, router]);

  if (!pinjamanLoaded || !anggotaLoaded || !jenisLoaded || !data) return null;

  const anggota = anggotaList.find(a => a.id === data.anggotaId);
  const jenis = jenisList.find(j => j.id === data.jenisPinjamanId);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const statusColors: Record<string, string> = {
    'Draft': 'bg-slate-50 text-slate-500 border-slate-200',
    'Review': 'bg-amber-50 text-amber-600 border-amber-200',
    'Disetujui': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Ditolak': 'bg-rose-50 text-rose-600 border-rose-200',
    'Cair': 'bg-blue-50 text-blue-600 border-blue-200',
    'Lunas': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
      <div className="flex items-center gap-5">
        <Link href="/admin/pinjaman" className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 shadow-sm transition-all active:scale-95 group">
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Detail Pinjaman</h1>
          <p className="text-slate-500 font-semibold">Informasi lengkap transaksi pinjaman anggota.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-sm font-bold text-slate-400 mb-1">Nomor Pinjaman</div>
            <div className="text-2xl font-bold text-slate-800">{data.nomorPinjaman}</div>
          </div>
          <div className={`px-4 py-2 rounded-2xl border font-medium text-sm flex items-center gap-2 ${statusColors[data.status] || ''}`}>
            {data.status === 'Disetujui' && <CheckCircle2 className="w-5 h-5" />}
            {data.status}
          </div>
        </div>

        {/* Anggota & Jenis Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-slate-500 font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Info Anggota
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-slate-400">Nama Lengkap</div>
                <div className="font-bold text-slate-800 text-lg">{anggota?.nama || '-'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">NIK / Nomor Anggota</div>
                <div className="font-semibold text-slate-700">{anggota?.nik || '-'} / {anggota?.nomorAnggota || '-'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">Nomor HP</div>
                <div className="font-semibold text-slate-700">{anggota?.nomorHp || '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-slate-500 font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Info Pengajuan
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-slate-400">Jenis Pinjaman</div>
                <div className="font-bold text-emerald-600 text-lg">{jenis?.nama || '-'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">Jumlah & Tenor</div>
                <div className="font-extrabold text-slate-800 text-xl">{formatRupiah(data.jumlahPengajuan)} <span className="text-sm text-slate-500">/ {data.tenor} Bulan</span></div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">Tanggal Pengajuan</div>
                <div className="font-semibold text-slate-700">{new Date(data.tanggalPengajuan).toLocaleDateString('id-ID', { dateStyle: 'long' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tujuan & Catatan */}
        <div className="space-y-6">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Tujuan Pinjaman</div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 font-medium text-slate-700">
              {data.tujuanPinjaman || 'Tidak ada keterangan'}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Catatan Admin</div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 font-medium text-slate-700">
              {data.catatanAdmin || 'Belum ada catatan dari admin'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
