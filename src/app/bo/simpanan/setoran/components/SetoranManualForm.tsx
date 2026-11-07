'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  setoranKasirSchema,
  type SetoranKasirFormValues,
} from '@/lib/validations/simpanan';
import { AlertCircle, Banknote, CreditCard, Printer } from 'lucide-react';
import { Anggota } from '@/hooks/useAnggotaData';
import { useMemberCashierRekening } from '@/hooks/useSimpananData';
import { AnggotaSelector } from './AnggotaSelector';

interface SetoranManualFormProps {
  anggotaList: Anggota[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: SetoranKasirFormValues, selectedAccount: any) => Promise<void>;
  formatRupiah: (v: number) => string;
}

export function SetoranManualForm({
  anggotaList,
  isSubmitting,
  onCancel,
  onSubmit,
  formatRupiah,
}: SetoranManualFormProps) {
  const [manualError, setManualError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SetoranKasirFormValues>({
    resolver: zodResolver(setoranKasirSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      anggotaId: '',
      jenis: 'Wajib',
      jumlah: '',
      metodePembayaran: 'tunai',
      keterangan: '',
    },
  });

  const selectedAnggotaId = watch('anggotaId');
  const jenis = watch('jenis');
  const jumlah = watch('jumlah');
  const metodePembayaran = watch('metodePembayaran');

  const { data: memberRekeningData, isLoading: rekeningLoading } =
    useMemberCashierRekening(selectedAnggotaId || null);

  const setQuickAmount = (val: number) => {
    setValue('jumlah', val.toLocaleString('id-ID'), {
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const handleFormSubmit = async (values: SetoranKasirFormValues) => {
    setManualError('');
    const selectedAccount = memberRekeningData?.rekening?.find(
      (r: any) =>
        r.nama.toLowerCase().includes(values.jenis.toLowerCase()) ||
        r.tipe.toLowerCase().includes(values.jenis.toLowerCase())
    );

    try {
      await onSubmit(values, selectedAccount);
    } catch (err: any) {
      setManualError(err.message || 'Gagal memproses setoran kasir.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {manualError && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 font-bold animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {manualError}
        </div>
      )}

      {/* 1. Anggota Selector */}
      <AnggotaSelector
        anggotaList={anggotaList}
        selectedAnggotaId={selectedAnggotaId}
        onSelect={(id) => setValue('anggotaId', id, { shouldValidate: true, shouldTouch: true })}
        onClear={() => setValue('anggotaId', '', { shouldValidate: true, shouldTouch: true })}
        errorMessage={errors.anggotaId?.message}
        memberRekeningData={memberRekeningData}
        rekeningLoading={rekeningLoading}
        formatRupiah={formatRupiah}
      />

      {/* 2. Jenis Simpanan & Metode Pembayaran */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Jenis Simpanan <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Wajib', 'Sukarela', 'Pokok'] as const).map((j) => (
              <button
                key={j}
                type="button"
                onClick={() => setValue('jenis', j, { shouldValidate: true, shouldTouch: true })}
                className={`py-3 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  jenis === j
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
          {errors.jenis && (
            <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.jenis.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-2">
            {(['tunai', 'transfer'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() =>
                  setValue('metodePembayaran', m, { shouldValidate: true, shouldTouch: true })
                }
                className={`py-3 px-3 rounded-xl text-xs font-bold capitalize text-center border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  metodePembayaran === m
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m === 'tunai' ? <Banknote size={15} /> : <CreditCard size={15} />}
                {m === 'tunai' ? 'Tunai (Kas)' : 'Transfer Bank'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Jumlah Setoran */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Nominal Setoran (Rp) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">
            Rp
          </span>
          <input
            type="text"
            placeholder="0"
            className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 font-bold text-lg outline-none transition-all ${
              errors.jumlah
                ? 'border-rose-500 focus:ring-4 focus:ring-rose-100 focus:border-rose-500'
                : 'border-slate-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500'
            }`}
            value={jumlah || ''}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              setValue(
                'jumlah',
                digits ? parseInt(digits, 10).toLocaleString('id-ID') : '',
                { shouldValidate: true, shouldTouch: true }
              );
            }}
            onBlur={() => trigger('jumlah')}
          />
        </div>
        {errors.jumlah && (
          <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.jumlah.message}
          </p>
        )}

        {/* Quick nominal buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          <span className="text-xs text-slate-400 font-semibold mr-1">Cepat:</span>
          {[25000, 50000, 100000, 250000, 500000, 1000000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setQuickAmount(val)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-all border border-slate-200/60 cursor-pointer"
            >
              +{val >= 1000000 ? `${val / 1000000}jt` : `${val / 1000}rb`}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Keterangan */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Catatan / Keterangan (Opsional)
        </label>
        <input
          type="text"
          placeholder={`Contoh: Setoran Simpanan ${jenis} periode berjalan`}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
          {...register('keterangan')}
        />
      </div>

      {/* Tombol Simpan & Cetak */}
      <div className="pt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-2xl transition-all cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <Printer size={18} />
          {isSubmitting ? 'Memproses Transaksi...' : 'Proses & Cetak Kuitansi'}
        </button>
      </div>
    </form>
  );
}
