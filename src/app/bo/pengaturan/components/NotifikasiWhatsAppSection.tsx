'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MessageCircle } from 'lucide-react';
import WhatsAppDeviceManager from '@/components/admin/WhatsAppDeviceManager';
import { PengaturanSystemFormValues } from '@/lib/validations/settings';
import { SectionCard, FormField, getTextareaClass } from './common';

const VAR_HINT =
  'Variabel: {nama_anggota}, {jumlah}, {status}, {tanggal_jatuh_tempo}, {jumlah_angsuran}';

export function NotifikasiWhatsAppSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PengaturanSystemFormValues>();

  const notifErrors = errors.notifikasi;

  return (
    <>
      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[#F8FAFC] text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5" /> Notifikasi WhatsApp
          </span>
        </div>
      </div>

      {/* Perangkat & Koneksi WhatsApp Real-Time */}
      <WhatsAppDeviceManager />

      <SectionCard
        title="Template Pesan WhatsApp"
        icon={MessageCircle}
        description="Pesan WhatsApp yang dikirimkan ke anggota secara otomatis"
      >
        <div className="space-y-5">
          <FormField
            label="Template: Pengajuan Masuk"
            hint={VAR_HINT}
            required
            error={notifErrors?.templateWaPengajuan?.message}
          >
            <textarea
              {...register('notifikasi.templateWaPengajuan')}
              className={`${getTextareaClass(!!notifErrors?.templateWaPengajuan)} h-24`}
            />
          </FormField>
          <FormField
            label="Template: Status Berubah"
            hint={VAR_HINT}
            required
            error={notifErrors?.templateWaStatus?.message}
          >
            <textarea
              {...register('notifikasi.templateWaStatus')}
              className={`${getTextareaClass(!!notifErrors?.templateWaStatus)} h-24`}
            />
          </FormField>
          <FormField
            label="Template: Pengingat Jatuh Tempo"
            hint={VAR_HINT}
            required
            error={notifErrors?.templateWaJatuhTempo?.message}
          >
            <textarea
              {...register('notifikasi.templateWaJatuhTempo')}
              className={`${getTextareaClass(!!notifErrors?.templateWaJatuhTempo)} h-24`}
            />
          </FormField>
        </div>
      </SectionCard>
    </>
  );
}
