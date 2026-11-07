'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  penarikanKasirSchema,
  type PenarikanKasirFormValues,
} from '@/lib/validations/simpanan';
import { AlertCircle, Banknote, CreditCard, Printer } from 'lucide-react';
import { Anggota } from '@/hooks/useAnggotaData';
import { useMemberCashierRekening } from '@/hooks/useSimpananData';
import { PenarikanAnggotaSelector } from './PenarikanAnggotaSelector';

interface PenarikanKasirFormProps {
  anggotaList: Anggota[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: PenarikanKasirFormValues, selectedAccount: any) => Promise<void>;
  formatRupiah: (v: number) => string;
}

export function PenarikanKasirForm({
  anggotaList,
  isSubmitting,
  onCancel,
  onSubmit,
  formatRupiah,
}: PenarikanKasirFormProps) {
  const [selectedRekeningId, setSelectedRekeningId] = useState('');
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    trigger,
    formState: { errors },
  } = useForm<PenarikanKasirFormValues>({
    resolver: zodResolver(penarikanKasirSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      anggotaId: '',
      jenisSimpanan: 'Sukarela',
      jumlahTarik: '',
      metodePembayaran: 'tunai',
      keterangan: '',
    },
  });

  const selectedAnggotaId = watch('anggotaId');
  const jenisSimpanan = watch('jenisSimpanan');
  const jumlahTarik = watch('jumlahTarik');
  const metodePembayaran = watch('metodePembayaran');

  const selectedAnggotaData = anggotaList.find((a) => a.id === selectedAnggotaId);

  const { data: memberRekeningData, isLoading: rekeningLoading } =
    useMemberCashierRekening(selectedAnggotaId || null);

  const selectedAccount = memberRekeningData?.rekening?.find(
    (r: any) =>
      r.rekeningId === selectedRekeningId ||
      r.nama.toLowerCase().includes(jenisSimpanan.toLowerCase()) ||
      r.tipe.toLowerCase().includes(jenisSimpanan.toLowerCase())
  );

  const maxTarik = selectedAccount?.saldo || 0;

  const handleFormSubmit = async (values: PenarikanKasirFormValues) => {
    setFormError('');
    const jumlahNum = parseInt(values.jumlahTarik.replace(/\D/g, ''), 10);

    if (jumlahNum > maxTarik) {
      setError('jumlahTarik', {
        type: 'manual',
        message: `Saldo tidak mencukupi! Saldo ${values.jenisSimpanan} tersedia saat ini hanya ${formatRupiah(maxTarik)}.`,
      });
      return;
    }

    try {
      await onSubmit(values, selectedAccount);
    } catch (err: any) {
      setFormError(err.message || 'Gagal memproses penarikan simpanan.');
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Form Tarik Tunai Simpanan</h2>
        <p className="text-xs text-slate-500 mt-1">
          Periksa saldo simpanan sukarela anggota sebelum memproses pengeluaran kas.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {formError && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 font-bold text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {formError}
          </div>
        )}

        {/* 1. Pilih Anggota & Rekening */}
        <PenarikanAnggotaSelector
          anggotaList={anggotaList}
          selectedAnggotaId={selectedAnggotaId}
          onSelect={(id) => {
            setValue('anggotaId', id, { shouldValidate: true, shouldTouch: true });
          }}
          onClear={() => {
            setValue('anggotaId', '', { shouldValidate: true, shouldTouch: true });
            setSelectedRekeningId('');
          }}
          errorMessage={errors.anggotaId?.message}
          memberRekeningData={memberRekeningData}
          rekeningLoading={rekeningLoading}
          selectedRekeningId={selectedRekeningId}
          onSelectRekening={(rekeningId, jenis) => {
            setSelectedRekeningId(rekeningId);
            setValue('jenisSimpanan', jenis, { shouldValidate: true, shouldTouch: true });
          }}
          formatRupiah={formatRupiah}
        />

        {/* 2. Jumlah Penarikan */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-700">
              Nominal Penarikan (Rp) <span className="text-rose-500">*</span>
            </label>
            {selectedAnggotaData && (
              <button
                type="button"
                onClick={() =>
                  setValue('jumlahTarik', maxTarik.toLocaleString('id-ID'), {
                    shouldValidate: true,
                    shouldTouch: true,
                  })
                }
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
              >
                Tarik Semua (Maksimal: {formatRupiah(maxTarik)})
              </button>
            )}
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">
              Rp
            </span>
            <input
              type="text"
              placeholder="0"
              className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 font-bold text-lg outline-none transition-all ${
                errors.jumlahTarik
                  ? 'border-rose-500 focus:ring-4 focus:ring-rose-100 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500'
              }`}
              value={jumlahTarik || ''}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                setValue('jumlahTarik', digits ? parseInt(digits, 10).toLocaleString('id-ID') : '', {
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              onBlur={() => trigger('jumlahTarik')}
            />
          </div>
          {errors.jumlahTarik && (
            <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.jumlahTarik.message}
            </p>
          )}
        </div>

        {/* 3. Metode Pembayaran & Catatan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Metode Pengeluaran Kas
            </label>
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

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Catatan / Keterangan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Penarikan sukarela untuk keperluan usaha"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
              {...register('keterangan')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
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
            {isSubmitting ? 'Memproses Penarikan...' : 'Cairkan & Cetak Kuitansi'}
          </button>
        </div>
      </form>
    </div>
  );
}
