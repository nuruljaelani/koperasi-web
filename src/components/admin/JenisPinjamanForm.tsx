'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JenisPinjaman } from '@/hooks/useJenisPinjamanData';

interface JenisPinjamanFormProps {
  initialData?: Omit<JenisPinjaman, 'id'>;
  onSubmit: (data: Omit<JenisPinjaman, 'id'>) => void;
  isLoading?: boolean;
}

const defaultData: Omit<JenisPinjaman, 'id'> = {
  kode: '',
  nama: '',
  sukuBunga: 0,
  tipeBunga: 'Flat',
  tenorMaksimal: 12,
  biayaAdmin: 0,
  denda: 0,
  status: 'Aktif'
};

export default function JenisPinjamanForm({ initialData, onSubmit, isLoading }: JenisPinjamanFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || defaultData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;

    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-3 md:p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Kode Pinjaman</label>
            <input 
              required
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              placeholder="Contoh: JP-01"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Nama Jenis Pinjaman</label>
            <input 
              required
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Kredit Cepat Cair"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Tipe Bunga</label>
            <select 
              name="tipeBunga"
              value={formData.tipeBunga}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all appearance-none cursor-pointer"
            >
              <option value="Flat">Flat</option>
              <option value="Menurun">Menurun</option>
              <option value="Anuitas">Anuitas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Tenor Maksimal (Bulan)</label>
            <input 
              required
              type="number"
              name="tenorMaksimal"
              value={formData.tenorMaksimal}
              onChange={handleChange}
              min="1"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Suku Bunga (%) per bulan</label>
            <input 
              required
              type="number"
              name="sukuBunga"
              value={formData.sukuBunga}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Biaya Administrasi (%)</label>
            <input 
              required
              type="number"
              name="biayaAdmin"
              value={formData.biayaAdmin}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Denda Keterlambatan (% per hari)</label>
            <input 
              required
              type="number"
              name="denda"
              value={formData.denda}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Status Pinjaman</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all appearance-none cursor-pointer"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
        <button 
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-4 py-2 rounded-2xl font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors active:scale-95 cursor-pointer"
        >
          Batalkan
        </button>
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-2xl font-medium shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Jenis Pinjaman'}
        </button>
      </div>
    </form>
  );
}
