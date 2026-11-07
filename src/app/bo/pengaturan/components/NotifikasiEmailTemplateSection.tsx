'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { PengaturanSystemFormValues } from '@/lib/validations/settings';
import { SectionCard, FormField, getTextareaClass } from './common';

const VAR_HINT =
  'Variabel: {nama_anggota}, {jumlah}, {status}, {tanggal_jatuh_tempo}, {jumlah_angsuran}';

export function NotifikasiEmailTemplateSection() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PengaturanSystemFormValues>();

  const emailAktif = watch('notifikasi.emailAktif');
  const notifErrors = errors.notifikasi;

  if (!emailAktif) return null;

  return (
    <SectionCard
      title="Template Email"
      icon={Mail}
      description="Teks email yang dikirimkan ke anggota pada setiap kejadian"
    >
      <div className="space-y-5">
        <FormField
          label="Template: Pengajuan Diterima"
          hint={VAR_HINT}
          required
          error={notifErrors?.templatePengajuan?.message}
        >
          <textarea
            {...register('notifikasi.templatePengajuan')}
            className={`${getTextareaClass(!!notifErrors?.templatePengajuan)} h-28`}
          />
        </FormField>
        <FormField
          label="Template: Pinjaman Disetujui"
          hint={VAR_HINT}
          required
          error={notifErrors?.templateDisetujui?.message}
        >
          <textarea
            {...register('notifikasi.templateDisetujui')}
            className={`${getTextareaClass(!!notifErrors?.templateDisetujui)} h-28`}
          />
        </FormField>
        <FormField
          label="Template: Pinjaman Ditolak"
          hint={VAR_HINT}
          required
          error={notifErrors?.templateDitolak?.message}
        >
          <textarea
            {...register('notifikasi.templateDitolak')}
            className={`${getTextareaClass(!!notifErrors?.templateDitolak)} h-28`}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
