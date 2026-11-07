'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { anggotaSchema, type AnggotaFormValues } from '@/lib/validations/anggota';
import { Anggota } from '@/hooks/useAnggotaData';
import { AlertCircle } from 'lucide-react';

interface AnggotaFormProps {
  initialData?: Omit<Anggota, 'id'>;
  onSubmit: (data: Omit<Anggota, 'id'>) => void;
  isLoading?: boolean;
}

const defaultValues: AnggotaFormValues = {
  nik: '',
  nama: '',
  nomorHp: '',
  alamat: '',
  tanggalLahir: '',
  jenisKelamin: 'Laki-laki',
  status: 'Aktif',
};

export default function AnggotaForm({ initialData, onSubmit, isLoading }: AnggotaFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnggotaFormValues>({
    resolver: zodResolver(anggotaSchema) as any,
    defaultValues: initialData ? {
      nik: initialData.nik || '',
      nama: initialData.nama || '',
      nomorHp: initialData.nomorHp || '',
      alamat: initialData.alamat || '',
      tanggalLahir: initialData.tanggalLahir || '',
      jenisKelamin: initialData.jenisKelamin || 'Laki-laki',
      status: initialData.status || 'Aktif',
    } : defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nik: initialData.nik || '',
        nama: initialData.nama || '',
        nomorHp: initialData.nomorHp || '',
        alamat: initialData.alamat || '',
        tanggalLahir: initialData.tanggalLahir || '',
        jenisKelamin: initialData.jenisKelamin || 'Laki-laki',
        status: initialData.status || 'Aktif',
      });
    }
  }, [initialData, reset]);

  const onValidSubmit = (values: AnggotaFormValues) => {
    onSubmit({
      ...values,
      nomorAnggota: initialData?.nomorAnggota || '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6"
    >
      {initialData?.nomorAnggota && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">No. Anggota (Sistem)</span>
          <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100/60 px-3.5 py-1 rounded-xl">
            {initialData.nomorAnggota}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {/* Kolom Kiri */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              NIK KTP <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('nik')}
              maxLength={16}
              placeholder="16 Digit NIK KTP"
              className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all ${
                errors.nik
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                  : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
              }`}
            />
            {errors.nik && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nik.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('nama')}
              placeholder="Sesuai yang tertera di KTP"
              className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all ${
                errors.nama
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                  : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
              }`}
            />
            {errors.nama && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nama.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Nomor HP Aktif <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('nomorHp')}
              placeholder="Contoh: 08123456789"
              className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all ${
                errors.nomorHp
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                  : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
              }`}
            />
            {errors.nomorHp && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nomorHp.message}
              </p>
            )}
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Tanggal Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register('tanggalLahir')}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-4 transition-all cursor-pointer ${
                  errors.tanggalLahir
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                    : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
                }`}
              />
              {errors.tanggalLahir && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.tanggalLahir.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('jenisKelamin')}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-4 transition-all cursor-pointer ${
                  errors.jenisKelamin
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                    : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
                }`}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              {errors.jenisKelamin && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.jenisKelamin.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Status Keanggotaan <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('status')}
              className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-4 transition-all cursor-pointer ${
                errors.status
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                  : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
              }`}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
            {errors.status && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Alamat Tinggal / Domisili <span className="text-rose-500">*</span>
            </label>
            <textarea
              {...register('alamat')}
              placeholder="Alamat lengkap domisili saat ini"
              rows={3}
              className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-medium placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all resize-none ${
                errors.alamat
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                  : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
              }`}
            />
            {errors.alamat && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.alamat.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors active:scale-95 cursor-pointer"
        >
          Batalkan
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Data Anggota'}
        </button>
      </div>
    </form>
  );
}
