'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  GantiPasswordFormValues,
  gantiPasswordSchema,
} from '@/lib/validations/settings';
import { SectionCard, FormField, getInputClass } from './common';

export function GantiPasswordSection() {
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GantiPasswordFormValues>({
    resolver: zodResolver(gantiPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onGantiPassword = async (data: GantiPasswordFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPwSuccess(true);
      toast.success('Password admin berhasil diubah!');
      reset();
      setTimeout(() => setPwSuccess(false), 4000);
    } catch {
      toast.error('Gagal mengubah password admin');
    }
  };

  return (
    <SectionCard
      title="Ganti Password Admin"
      icon={Lock}
      description="Ubah password untuk akun administrator dengan validasi aman"
    >
      <form onSubmit={handleSubmit(onGantiPassword)} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5 max-w-xl">
          <div className="md:col-span-2">
            <FormField
              label="Password Saat Ini"
              required
              error={errors.currentPassword?.message}
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('currentPassword')}
                  className={`${getInputClass(!!errors.currentPassword)} pl-9 pr-10`}
                  type={showCurrentPw ? 'text' : 'password'}
                  placeholder="Password saat ini"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>
          </div>
          <FormField
            label="Password Baru"
            required
            error={errors.newPassword?.message}
          >
            <div className="relative">
              <input
                {...register('newPassword')}
                className={`${getInputClass(!!errors.newPassword)} pr-10`}
                type={showNewPw ? 'text' : 'password'}
                placeholder="Minimal 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>
          <FormField
            label="Konfirmasi Password Baru"
            required
            error={errors.confirmPassword?.message}
          >
            <input
              {...register('confirmPassword')}
              className={getInputClass(!!errors.confirmPassword)}
              type="password"
              placeholder="Ulangi password baru"
            />
          </FormField>
        </div>

        {pwSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Password berhasil diubah!
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer shadow-sm"
        >
          {isSubmitting ? 'Memproses...' : 'Ganti Password'}
        </button>
      </form>
    </SectionCard>
  );
}
