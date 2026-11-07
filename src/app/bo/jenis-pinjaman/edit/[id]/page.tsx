'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import JenisPinjamanForm from '@/components/admin/JenisPinjamanForm';
import { useJenisPinjamanData, JenisPinjaman } from '@/hooks/useJenisPinjamanData';
import { toast } from 'sonner';

export default function EditJenisPinjamanPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  const router = useRouter();
  const resolvedParams = typeof (params as any)?.then === 'function' ? use(params as Promise<{ id: string }>) : (params as { id: string });
  const id = resolvedParams.id;

  const { getData, updateData, isLoaded } = useJenisPinjamanData();
  const [data, setData] = useState<JenisPinjaman | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const existing = getData(id);
      if (existing) {
        setData(existing);
      } else {
        router.push('/bo/jenis-pinjaman');
      }
    }
  }, [isLoaded, id, getData, router]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (updatedData: Omit<JenisPinjaman, 'id'>) => {
    try {
      setIsSubmitting(true);
      await updateData(id, updatedData);
      toast.success(`Produk '${updatedData.nama}' berhasil diperbarui`);
      router.push('/bo/jenis-pinjaman');
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui jenis pinjaman');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !data) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
      <div className="flex items-center gap-5">
        <Link 
          href="/bo/jenis-pinjaman" 
          className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 shadow-sm transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Edit Jenis Pinjaman</h1>
          <p className="text-slate-500 font-semibold">
            Perbarui konfigurasi untuk <span className="text-emerald-600 font-bold">{data.nama}</span>.
          </p>
        </div>
      </div>

      <JenisPinjamanForm initialData={data} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
