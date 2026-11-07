'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AnggotaForm from '@/components/admin/AnggotaForm';
import { useAnggotaData, useAnggotaDetail, Anggota } from '@/hooks/useAnggotaData';
import { toast } from 'sonner';

export default function EditAnggotaPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  const router = useRouter();
  const resolvedParams = typeof (params as any)?.then === 'function' ? use(params as Promise<{ id: string }>) : (params as { id: string });
  const id = resolvedParams.id;

  const { updateAnggota, getAnggota } = useAnggotaData();
  const { data: serverDetail, isLoading: loadingDetail } = useAnggotaDetail(id);
  const data: Anggota | null = serverDetail || getAnggota(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (updatedData: Omit<Anggota, 'id'>) => {
    try {
      setIsSubmitting(true);
      await updateAnggota(id, updatedData);
      toast.success('Data anggota berhasil diperbarui!');
      router.push('/bo/anggota');
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui data anggota');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4">
        <Link
          href="/bo/anggota"
          className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
            Ubah Data Anggota
          </h1>
          <p className="text-slate-500 font-semibold">
            Perbarui informasi biodata dan status keanggotaan.
          </p>
        </div>
      </div>

      {loadingDetail && !data ? (
        <div className="p-12 text-center text-slate-400 font-bold animate-pulse flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          Memuat data anggota...
        </div>
      ) : data ? (
        <AnggotaForm
          initialData={data}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-bold mb-4">Anggota tidak ditemukan</p>
          <Link
            href="/bo/anggota"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-2xl shadow-sm hover:bg-emerald-700 transition-all text-sm"
          >
            Kembali ke Daftar Anggota
          </Link>
        </div>
      )}
    </div>
  );
}
