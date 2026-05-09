'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { usePinjamanData, Pinjaman, PinjamanStatus } from '@/hooks/usePinjamanData';
import { useAnggotaData } from '@/hooks/useAnggotaData';

export default function EditPinjamanPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { dataList, updateData, isLoaded: pinjamanLoaded } = usePinjamanData();
  const { anggotaList, isLoaded: anggotaLoaded } = useAnggotaData();

  const [data, setData] = useState<Pinjaman | null>(null);

  // Form states specifically for Admin
  const [status, setStatus] = useState<PinjamanStatus>('Draft');
  const [catatanAdmin, setCatatanAdmin] = useState('');
  const id = React.use(params).id;

  useEffect(() => {
    if (pinjamanLoaded && anggotaLoaded) {
      const existing = dataList.find(p => p.id === id);
      if (existing) {
        setData(existing);
        setStatus(existing.status);
        setCatatanAdmin(existing.catatanAdmin);
      } else {
        router.push('/admin/pinjaman');
      }
    }
  }, [pinjamanLoaded, anggotaLoaded, id, dataList, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data) {
      updateData(id, {
        ...data,
        status,
        catatanAdmin
      });
      router.push('/admin/pinjaman');
    }
  };

  if (!pinjamanLoaded || !anggotaLoaded || !data) return null;

  const anggota = anggotaList.find(a => a.id === data.anggotaId);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
      <div className="flex items-center gap-5">
        <Link href="/admin/pinjaman" className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 shadow-sm transition-all active:scale-95 group">
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Tinjau & Ubah Status Pinjaman</h1>
          <p className="text-slate-500 font-semibold">Pembaruan status pengajuan oleh Admin.</p>
        </div>
      </div>

      <div className="bg-emerald-50/50 rounded-[32px] p-6 border border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-slate-800 text-xl">{data.nomorPinjaman}</div>
            <div className="text-sm font-semibold text-emerald-600">Anggota: {anggota?.nama || '-'}</div>
          </div>
        </div>
        <div className="md:text-right">
          <div className="font-extrabold text-slate-800 text-2xl">{formatRupiah(data.jumlahPengajuan)}</div>
          <div className="text-sm font-semibold text-slate-500">Tenor: {data.tenor} Bulan</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-6 lg:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Status Pinjaman</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as PinjamanStatus)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all appearance-none cursor-pointer"
          >
            <option value="Draft">📝 Draft</option>
            <option value="Review">⏳ Menunggu Persetujuan</option>
            <option value="Disetujui">✅ Disetujui</option>
            <option value="Ditolak">❌ Ditolak</option>
            <option value="Cair">🚀 Berjalan</option>
            <option value="Lunas">🎉 Lunas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Catatan Admin</label>
          <textarea 
            value={catatanAdmin}
            onChange={(e) => setCatatanAdmin(e.target.value)}
            placeholder="Tulis alasan penolakan, syarat tambahan, atau dokumen yang kurang..."
            rows={5}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all resize-none"
          />
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors active:scale-95 cursor-pointer"
          >
            Batalkan
          </button>
          <button 
            type="submit"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl font-medium shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
          >
            Simpan Pembaruan
          </button>
        </div>
      </form>
    </div>
  );
}
