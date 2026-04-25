'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import JenisPinjamanForm from '@/components/admin/JenisPinjamanForm';
import { useJenisPinjamanData, JenisPinjaman } from '@/hooks/useJenisPinjamanData';

export default function EditJenisPinjamanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getData, updateData, isLoaded } = useJenisPinjamanData();
  const [data, setData] = useState<JenisPinjaman | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const existing = getData(params.id);
      if (existing) {
        setData(existing);
      } else {
        router.push('/admin/jenis-pinjaman');
      }
    }
  }, [isLoaded, params.id, getData, router]);

  const handleSubmit = (updatedData: Omit<JenisPinjaman, 'id'>) => {
    updateData(params.id, updatedData);
    router.push('/admin/jenis-pinjaman');
  };

  if (!isLoaded || !data) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
      <div className="flex items-center gap-5">
        <Link href="/admin/jenis-pinjaman" className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 shadow-sm transition-all active:scale-95 group">
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Edit Jenis Pinjaman</h1>
          <p className="text-slate-500 font-semibold text-lg">Perbarui konfigurasi untuk <span className="text-emerald-600 font-bold">{data.nama}</span>.</p>
        </div>
      </div>

      <JenisPinjamanForm initialData={data} onSubmit={handleSubmit} />
    </div>
  );
}
