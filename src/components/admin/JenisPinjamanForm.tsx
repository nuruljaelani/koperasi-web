'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  jenisPinjamanSchema,
  type JenisPinjamanFormValues,
} from '@/lib/validations/jenisPinjaman';
import { JenisPinjaman } from '@/hooks/useJenisPinjamanData';
import { AlertCircle } from 'lucide-react';

interface JenisPinjamanFormProps {
  initialData?: Omit<JenisPinjaman, 'id'>;
  onSubmit: (data: Omit<JenisPinjaman, 'id'>) => void;
  isLoading?: boolean;
}

const defaultValues: JenisPinjamanFormValues = {
  nama: '',
  tipeBunga: 'Flat',
  sukuBunga: 12,
  tenorMaksimal: 12,
  biayaAdmin: 1,
  denda: 0.1,
  status: 'Aktif',
};

export default function JenisPinjamanForm({
  initialData,
  onSubmit,
  isLoading,
}: JenisPinjamanFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JenisPinjamanFormValues>({
    resolver: zodResolver(jenisPinjamanSchema) as any,
    defaultValues: initialData || defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        kode: initialData.kode || '',
        nama: initialData.nama || '',
        tipeBunga: initialData.tipeBunga || 'Flat',
        sukuBunga: Number(initialData.sukuBunga ?? 12),
        tenorMaksimal: Number(initialData.tenorMaksimal ?? 12),
        biayaAdmin: Number(initialData.biayaAdmin ?? 1),
        denda: Number(initialData.denda ?? 0.1),
        status: initialData.status || 'Aktif',
      });
    }
  }, [initialData, reset]);

  const onValidSubmit = (values: JenisPinjamanFormValues) => {
    onSubmit({
      ...values,
      kode: initialData?.kode || undefined,
    } as any);
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-8"
    >
      {initialData?.kode && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kode Produk (Sistem)</span>
          <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100/60 px-3.5 py-1 rounded-xl">
            {initialData.kode}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {/* Kolom Kiri */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Nama Jenis Pinjaman <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('nama')}
              placeholder="Contoh: Pinjaman Konsumtif Reguler"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Tipe Bunga <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('tipeBunga')}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-4 transition-all cursor-pointer ${
                  errors.tipeBunga
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                    : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
                }`}
              >
                <option value="Flat">Flat</option>
                <option value="Menurun">Menurun</option>
                <option value="Anuitas">Anuitas</option>
              </select>
              {errors.tipeBunga && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.tipeBunga.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Suku Bunga (%/Thn) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                {...register('sukuBunga', { valueAsNumber: true })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-bold focus:outline-none focus:ring-4 transition-all ${
                  errors.sukuBunga
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                    : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
                }`}
              />
              {errors.sukuBunga && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.sukuBunga.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Status Produk <span className="text-rose-500">*</span>
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
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Tenor Maks (Bln) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                {...register('tenorMaksimal', { valueAsNumber: true })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-bold focus:outline-none focus:ring-4 transition-all ${
                  errors.tenorMaksimal
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                    : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
                }`}
              />
              {errors.tenorMaksimal && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.tenorMaksimal.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Biaya Admin (%) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                {...register('biayaAdmin', { valueAsNumber: true })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-bold focus:outline-none focus:ring-4 transition-all ${
                  errors.biayaAdmin
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                    : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
                }`}
              />
              {errors.biayaAdmin && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.biayaAdmin.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Denda Keterlambatan (% / Hari)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('denda', { valueAsNumber: true })}
              className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-slate-800 font-bold focus:outline-none focus:ring-4 transition-all ${
                errors.denda
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                  : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
              }`}
            />
            {errors.denda && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mt-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.denda.message}
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
          {isLoading ? 'Menyimpan...' : 'Simpan Jenis Pinjaman'}
        </button>
      </div>
    </form>
  );
}
