'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings2, X, Loader2, Sparkles } from 'lucide-react';
import {
  WaDeviceConfigFormValues,
  waDeviceConfigSchema,
} from '@/lib/validations/whatsapp';

interface WhatsAppEditDeviceModalProps {
  open: boolean;
  onClose: () => void;
  defaultValues: WaDeviceConfigFormValues;
  onSubmit: (data: WaDeviceConfigFormValues) => Promise<void>;
  loading: boolean;
}

export function WhatsAppEditDeviceModal({
  open,
  onClose,
  defaultValues,
  onSubmit,
  loading,
}: WhatsAppEditDeviceModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WaDeviceConfigFormValues>({
    resolver: zodResolver(waDeviceConfigSchema),
    values: defaultValues,
  });

  const deviceId = watch('device_id');

  // Auto-generate UUID if device_id is empty or default placeholder
  useEffect(() => {
    if (open && (!deviceId || deviceId === 'koperasi-app')) {
      const generated =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'dev-' + Math.random().toString(36).substring(2, 10);
      setValue('device_id', generated, { shouldValidate: true });
    }
  }, [open, deviceId, setValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Pengaturan Perangkat & Nomor</h3>
              <p className="text-[11px] text-slate-500">Ubah konfigurasi identifier dan gateway</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Nama Label Perangkat <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('name')}
              placeholder="Contoh: WhatsApp Notifikasi UPK Mekarsari"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none transition-all ${
                errors.name
                  ? 'bg-rose-50/40 border-rose-300 focus:ring-2 focus:ring-rose-400 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Device ID
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Auto Generated UUID
              </span>
            </div>
            <input
              {...register('device_id')}
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono font-medium bg-slate-100 border-slate-200 text-slate-600 select-all cursor-default focus:outline-none"
            />
            {errors.device_id ? (
              <p className="text-xs text-rose-500 font-medium mt-1">
                {errors.device_id.message}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Device ID unik dibuat otomatis oleh sistem untuk identifikasi perangkat dan event.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Nomor WhatsApp Pengirim <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('phone_number')}
              placeholder="Contoh: 081234567890 atau 6281234567890"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono font-medium focus:outline-none transition-all ${
                errors.phone_number
                  ? 'bg-rose-50/40 border-rose-300 focus:ring-2 focus:ring-rose-400 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white'
              }`}
            />
            {errors.phone_number ? (
              <p className="text-xs text-rose-500 font-medium mt-1">
                {errors.phone_number.message}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Nomor kartu SIM / akun WhatsApp yang digunakan untuk notifikasi member.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Base URL REST API Gateway (Opsional)
            </label>
            <input
              {...register('api_url')}
              placeholder="http://localhost:3333/api"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono font-medium focus:outline-none transition-all ${
                errors.api_url
                  ? 'bg-rose-50/40 border-rose-300 focus:ring-2 focus:ring-rose-400 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white'
              }`}
            />
            {errors.api_url ? (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.api_url.message}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Kosongkan jika menggunakan adapter dummy/simulasi internal saat development.
              </p>
            )}
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
