'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnggotaForm from '@/components/admin/AnggotaForm';
import { useAnggotaData, Anggota } from '@/hooks/useAnggotaData';

// Because it's Next.js app router 15+, page params might be a Promise.
// But mostly in older Next.js app routers it's synchronous. Let's use it as synchronous directly, but Next.js might complain if it is 15.
// We will destructure it carefully.
export default function EditAnggotaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getAnggota, updateAnggota, isLoaded } = useAnggotaData();
  const [data, setData] = useState<Anggota | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const existing = getAnggota(params.id);
      if (existing) {
        setData(existing);
      } else {
        router.push('/admin/anggota');
      }
    }
  }, [isLoaded, params.id, getAnggota, router]);

  const handleSubmit = (updatedData: Omit<Anggota, 'id'>) => {
    updateAnggota(params.id, updatedData);
    router.push('/admin/anggota');
  };

  if (!isLoaded || !data) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
      <div className="flex items-center gap-5">
        <Link href="/admin/anggota" className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 shadow-sm transition-all active:scale-95 group">
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Edit Data Anggota</h1>
          <p className="text-slate-500 font-semibold text-lg">Perbarui informasi untuk <span className="text-emerald-600 font-bold">{data.nama}</span>.</p>
        </div>
      </div>

      <AnggotaForm initialData={data} onSubmit={handleSubmit} />
    </div>
  );
}
