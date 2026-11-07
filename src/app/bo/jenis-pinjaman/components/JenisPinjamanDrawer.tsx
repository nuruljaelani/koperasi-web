'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sliders, X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { JenisPinjaman } from '@/hooks/useJenisPinjamanData';
import {
  jenisPinjamanSchema,
  type JenisPinjamanFormValues,
} from '@/lib/validations/jenisPinjaman';
import { JenisPinjamanSimulator } from './JenisPinjamanSimulator';

interface JenisPinjamanDrawerProps {
  open: boolean;
  onClose: () => void;
  modalMode: 'create' | 'edit';
  selectedItem: JenisPinjaman | null;
  onSubmit: (values: JenisPinjamanFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const defaultFormValues: JenisPinjamanFormValues = {
  nama: '',
  sukuBunga: 12,
  tipeBunga: 'Flat',
  tenorMaksimal: 12,
  biayaAdmin: 1,
  denda: 0.1,
  status: 'Aktif',
};

export function JenisPinjamanDrawer({
  open,
  onClose,
  modalMode,
  selectedItem,
  onSubmit,
  isSubmitting,
}: JenisPinjamanDrawerProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JenisPinjamanFormValues>({
    resolver: zodResolver(jenisPinjamanSchema) as any,
    defaultValues:
      modalMode === 'edit' && selectedItem
        ? {
            kode: selectedItem.kode,
            nama: selectedItem.nama,
            sukuBunga: Number(selectedItem.sukuBunga ?? 12),
            tipeBunga: selectedItem.tipeBunga,
            tenorMaksimal: Number(selectedItem.tenorMaksimal ?? 12),
            biayaAdmin: Number(selectedItem.biayaAdmin ?? 1),
            denda: Number(selectedItem.denda ?? 0.1),
            status: selectedItem.status,
          }
        : defaultFormValues,
  });

  const watchedBunga = useWatch({ control, name: 'sukuBunga', defaultValue: 12 });
  const watchedTenor = useWatch({ control, name: 'tenorMaksimal', defaultValue: 12 });
  const watchedTipe = useWatch({ control, name: 'tipeBunga', defaultValue: 'Flat' });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4">
      <div className="bg-white h-full sm:h-[95vh] w-full sm:max-w-xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header Drawer */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-emerald-100/70 text-emerald-700 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {modalMode === 'create' ? 'Tambah Jenis Pinjaman' : 'Edit Jenis Pinjaman'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {modalMode === 'create'
                  ? 'Kode produk di-generate otomatis oleh sistem'
                  : 'Memperbarui konfigurasi produk pinjaman'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form id="modalJenisPinjamanForm" onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Info Kode Produk jika Edit */}
            {modalMode === 'edit' && selectedItem?.kode && (
              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Kode Produk (Sistem)
                  </span>
                </div>
                <span className="font-mono text-xs font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200/60 shadow-xs">
                  {selectedItem.kode}
                </span>
              </div>
            )}

            {/* Section 1: Identitas & Status */}
            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                1. Identitas Produk
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">
                  Nama Pinjaman <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register('nama')}
                  placeholder="Contoh: Pinjaman Konsumtif Pegawai"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:ring-4 transition-all ${
                    errors.nama
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50'
                      : 'border-slate-200 focus:border-emerald-300 focus:ring-emerald-50'
                  }`}
                />
                {errors.nama && (
                  <p className="flex items-center gap-1 text-[11px] text-rose-500 font-bold mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.nama.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">
                    Status Produk <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('status')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all cursor-pointer"
                  >
                    <option value="Aktif">Aktif (Bisa Diajukan)</option>
                    <option value="Tidak Aktif">Tidak Aktif (Arsip)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">
                    Metode Bunga <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('tipeBunga')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all cursor-pointer"
                  >
                    <option value="Flat">Flat (Tetap per Bulan)</option>
                    <option value="Menurun">Menurun (Efektif)</option>
                    <option value="Anuitas">Anuitas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Skema Bunga & Tenor */}
            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                2. Parameter Suku Bunga & Tenor
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">
                    Suku Bunga (% / Tahun) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      {...register('sukuBunga', { valueAsNumber: true })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">
                    Tenor Maksimal (Bulan) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register('tenorMaksimal', { valueAsNumber: true })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-14 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">Bulan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Biaya & Denda */}
            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                3. Biaya Administrasi & Denda
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">
                    Biaya Admin (%) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      {...register('biayaAdmin', { valueAsNumber: true })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">
                    Denda (% / Hari)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      {...register('denda', { valueAsNumber: true })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Live Mini Simulator Preview Card */}
            <JenisPinjamanSimulator
              bunga={watchedBunga || 0}
              tenor={watchedTenor || 12}
              tipeBunga={watchedTipe || 'Flat'}
            />
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer text-sm"
          >
            Batalkan
          </button>
          <button
            type="submit"
            form="modalJenisPinjamanForm"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </div>
    </div>
  );
}
