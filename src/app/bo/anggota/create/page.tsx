'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnggotaForm from '@/components/admin/AnggotaForm';
import { useAnggotaData, Anggota } from '@/hooks/useAnggotaData';
import { toast } from 'sonner';

export default function CreateAnggotaPage() {
  const router = useRouter();
  const { addAnggota, isLoaded } = useAnggotaData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Anggota, 'id'>) => {
    try {
      setIsSubmitting(true);
      await addAnggota(data);
      toast.success(`Anggota baru '${data.nama}' berhasil ditambahkan`);
      router.push('/bo/anggota');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan anggota');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
      <div className="flex items-center gap-5">
        <Link 
          href="/bo/anggota" 
          className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 shadow-sm transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Tambah Anggota Baru</h1>
          <p className="text-slate-500 font-semibold">Masukkan data lengkap untuk mendaftarkan anggota baru ke sistem koperasi.</p>
        </div>
      </div>

      <AnggotaForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
