'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, X, RefreshCw } from 'lucide-react';
import { WaSendTestFormValues, waSendTestSchema } from '@/lib/validations/whatsapp';

interface WhatsAppSendTestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: WaSendTestFormValues) => Promise<void>;
  loading: boolean;
}

export function WhatsAppSendTestModal({
  open,
  onClose,
  onSubmit,
  loading,
}: WhatsAppSendTestModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WaSendTestFormValues>({
    resolver: zodResolver(waSendTestSchema),
    defaultValues: {
      to: '',
      message: '',
    },
  });

  if (!open) return null;

  const handleFormSubmit = async (data: WaSendTestFormValues) => {
    await onSubmit(data);
    reset();
  };

  const handleFillTemplate = () => {
    const time = new Date().toLocaleTimeString('id-ID');
    setValue(
      'message',
      `Halo! Ini adalah pesan pengujian otomatis dari Sistem Koperasi Simpan Pinjam. Waktu uji: ${time}. Layanan notifikasi WhatsApp aktif dan siap digunakan. Terima kasih!`,
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Kirim Pesan Tes WhatsApp</h3>
              <p className="text-[11px] text-slate-500">Uji pengiriman langsung ke nomor WhatsApp</p>
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Nomor WhatsApp Penerima <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('to')}
              placeholder="08xxxxxxxxxx atau 628xxxxxxxxxx"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono font-medium focus:outline-none transition-all ${
                errors.to
                  ? 'bg-rose-50/40 border-rose-300 focus:ring-2 focus:ring-rose-400 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white'
              }`}
            />
            {errors.to && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.to.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Isi Pesan <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleFillTemplate}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                + Pasang Contoh Pesan
              </button>
            </div>
            <textarea
              {...register('message')}
              rows={4}
              placeholder="Tuliskan pesan yang ingin dikirimkan..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                errors.message
                  ? 'bg-rose-50/40 border-rose-300 focus:ring-2 focus:ring-rose-400 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white'
              }`}
            />
            {errors.message && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
