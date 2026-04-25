'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Anggota } from '@/hooks/useAnggotaData';

interface AnggotaFormProps {
  initialData?: Omit<Anggota, 'id'>;
  onSubmit: (data: Omit<Anggota, 'id'>) => void;
  isLoading?: boolean;
}

const defaultData: Omit<Anggota, 'id'> = {
  nomorAnggota: '',
  nik: '',
  nama: '',
  nomorHp: '',
  alamat: '',
  tanggalLahir: '',
  jenisKelamin: 'Laki-laki',
  status: 'Aktif'
};

export default function AnggotaForm({ initialData, onSubmit, isLoading }: AnggotaFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || defaultData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-3 md:p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Nomor Anggota</label>
            <input 
              required
              name="nomorAnggota"
              value={formData.nomorAnggota}
              onChange={handleChange}
              placeholder="Contoh: A-1023"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">NIK</label>
            <input 
              required
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="16 Digit NIK KTP"
              maxLength={16}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Nama Lengkap</label>
            <input 
              required
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Sesuai yang tertera di KTP"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Nomor HP Aktif</label>
            <input 
              required
              name="nomorHp"
              value={formData.nomorHp}
              onChange={handleChange}
              placeholder="Contoh: 08123456789"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Tanggal Lahir</label>
            <input 
              required
              type="date"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Jenis Kelamin</label>
            <select 
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all appearance-none cursor-pointer"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Status Keanggotaan</label>
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 ml-1">Alamat Tinggal</label>
            <textarea 
              required
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Alamat domisili saat ini"
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-slate-800 font-medium placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all resize-none"
            />
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
          {isLoading ? 'Menyimpan...' : 'Simpan Anggota'}
        </button>
      </div>
    </form>
  );
}
