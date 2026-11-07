'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Mail, Server, Lock, Eye, EyeOff, Send, AlertCircle } from 'lucide-react';
import { PengaturanSystemFormValues } from '@/lib/validations/settings';
import { SectionCard, FormField, Toggle, getInputClass } from './common';

export function NotifikasiEmailSection() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PengaturanSystemFormValues>();

  const emailAktif = watch('notifikasi.emailAktif');
  const emailSsl = watch('notifikasi.emailSsl');
  const notifErrors = errors.notifikasi;

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[#F8FAFC] text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> Notifikasi Email
          </span>
        </div>
      </div>

      <SectionCard
        title="Konfigurasi SMTP"
        icon={Server}
        description="Server email untuk mengirimkan notifikasi kepada anggota"
      >
        <Toggle
          value={emailAktif}
          onChange={(v) =>
            setValue('notifikasi.emailAktif', v, { shouldDirty: true, shouldValidate: true })
          }
          label="Aktifkan Notifikasi Email"
          desc="Kirim email otomatis saat pengajuan, persetujuan, atau penolakan pinjaman"
        />

        {emailAktif && (
          <div className="space-y-5 pt-2">
            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <FormField
                  label="SMTP Host"
                  hint="Misal: smtp.gmail.com atau mail.domain.com"
                  error={notifErrors?.emailHost?.message}
                >
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register('notifikasi.emailHost')}
                      className={`${getInputClass(!!notifErrors?.emailHost)} pl-9`}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                </FormField>
              </div>
              <FormField
                label="Port"
                error={notifErrors?.emailPort?.message}
              >
                <input
                  {...register('notifikasi.emailPort')}
                  className={getInputClass(!!notifErrors?.emailPort)}
                  placeholder="587"
                />
              </FormField>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                label="Username SMTP"
                error={notifErrors?.emailUser?.message}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('notifikasi.emailUser')}
                    className={`${getInputClass(!!notifErrors?.emailUser)} pl-9`}
                    placeholder="user@gmail.com"
                  />
                </div>
              </FormField>
              <FormField
                label="Password SMTP"
                error={notifErrors?.emailPassword?.message}
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('notifikasi.emailPassword')}
                    className={`${getInputClass(!!notifErrors?.emailPassword)} pl-9 pr-10`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="App password / SMTP password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>
              <FormField
                label="Nama Pengirim"
                error={notifErrors?.namaPengirim?.message}
              >
                <input
                  {...register('notifikasi.namaPengirim')}
                  className={getInputClass(!!notifErrors?.namaPengirim)}
                  placeholder="UPK Mekarsari"
                />
              </FormField>
              <FormField
                label="Email Pengirim (From)"
                error={notifErrors?.emailPengirim?.message}
              >
                <div className="relative">
                  <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('notifikasi.emailPengirim')}
                    className={`${getInputClass(!!notifErrors?.emailPengirim)} pl-9`}
                    placeholder="noreply@koperasi.co.id"
                  />
                </div>
              </FormField>
            </div>

            <Toggle
              value={emailSsl}
              onChange={(v) =>
                setValue('notifikasi.emailSsl', v, { shouldDirty: true, shouldValidate: true })
              }
              label="Gunakan SSL/TLS"
              desc="Direkomendasikan untuk keamanan pengiriman email"
            />

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span>
                Untuk Gmail, gunakan <strong>App Password</strong> (bukan password akun). Aktifkan
                2-Step Verification terlebih dahulu di akun Google Anda.
              </span>
            </div>
          </div>
        )}
      </SectionCard>
    </>
  );
}
