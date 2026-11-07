'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { PengaturanSystemFormValues } from '@/lib/validations/settings';
import { SectionCard, FormField, Toggle, getInputClass } from './common';
import { GantiPasswordSection } from './GantiPasswordSection';

export function TabKeamanan() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PengaturanSystemFormValues>();

  const logAktivitas = watch('keamanan.logAktivitas');
  const keamananErrors = errors.keamanan;

  return (
    <div className="space-y-6">
      <GantiPasswordSection />

      <SectionCard
        title="Pengaturan Sesi & Akses"
        icon={Clock}
        description="Atur batas waktu sesi dan percobaan login yang diizinkan"
      >
        <div className="grid md:grid-cols-2 gap-5 max-w-xl">
          <FormField
            label="Session Timeout"
            hint="Waktu tidak aktif sebelum otomatis logout (menit)"
            required
            error={keamananErrors?.sessionTimeout?.message}
          >
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('keamanan.sessionTimeout', { valueAsNumber: true })}
                className={`${getInputClass(!!keamananErrors?.sessionTimeout)} pl-9 pr-14`}
                type="number"
                min={5}
                max={1440}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                menit
              </span>
            </div>
          </FormField>
          <FormField
            label="Maks. Percobaan Login"
            hint="Jumlah login gagal sebelum akun dikunci sementara"
            required
            error={keamananErrors?.maxLoginAttempts?.message}
          >
            <input
              {...register('keamanan.maxLoginAttempts', { valueAsNumber: true })}
              className={getInputClass(!!keamananErrors?.maxLoginAttempts)}
              type="number"
              min={1}
              max={20}
            />
          </FormField>
        </div>

        <Toggle
          value={logAktivitas}
          onChange={(v) =>
            setValue('keamanan.logAktivitas', v, { shouldDirty: true, shouldValidate: true })
          }
          label="Rekam Log Aktivitas Admin"
          desc="Catat semua tindakan admin (login, ubah data, approve pinjaman, dll) ke dalam log audit"
        />
      </SectionCard>
    </div>
  );
}
