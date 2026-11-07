'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, role, isLoaded } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      if (role === 'admin' || role === 'operator' || role === 'staf' || role === 'superadmin') {
        router.replace('/bo/dashboard');
      } else {
        router.replace('/member/dashboard');
      }
    }
  }, [isLoaded, isAuthenticated, role, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError('');

    const result = await login(values.username.trim(), values.password);

    if (!result.success) {
      const err = result.error ?? 'Login gagal. Periksa kembali akun Anda.';
      setServerError(err);
      toast.error(err);
      return;
    }

    toast.success('Login berhasil! Mengalihkan ke dashboard...');
    if (result.role === 'admin' || result.role === 'staf' || result.role === 'operator' || result.role === 'superadmin') {
      router.push('/bo/dashboard');
    } else {
      router.push('/member/dashboard');
    }
  };

  if (!isLoaded || (isLoaded && isAuthenticated)) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-neutral-50 to-emerald-50/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-neutral-100 p-8 sm:p-10">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 4L16 2L24 4L28 12L24 20L16 28L8 20L4 12L8 4Z" fill="#D4A017" />
              <path d="M12 8L16 6L20 8L22 12L20 16L16 20L12 16L10 12L12 8Z" fill="#1B5E20" />
              <path d="M14 10L16 9L18 10L19 12L18 14L16 16L14 14L13 12L14 10Z" fill="#F5C518" />
            </svg>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">UPK Mekarsari</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Masuk ke Akun Anda</h1>
          <p className="text-neutral-500 mt-1.5 text-sm">Gunakan No. Anggota, No. Handphone, atau Username</p>
        </div>

        {/* Error alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-sm text-rose-600 font-medium leading-relaxed">
              <p>{serverError}</p>
              {serverError.toLowerCase().includes('aktivasi') && (
                <Link
                  href="/aktivasi"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                >
                  Klik di sini untuk Aktivasi Akun Anda &rarr;
                </Link>
              )}
            </div>
          </div>
        )}

        <form className="space-y-4.5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
              Nomor Anggota / No. HP / Username
            </label>
            <input
              type="text"
              {...register('username')}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors text-sm ${
                errors.username
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                  : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Contoh: KOP-2024-001, 08123456..., atau username"
            />
            {errors.username && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-neutral-800">Password</label>
              <Link href="#" className="text-xs text-primary-700 hover:text-primary-800 font-medium">
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`w-full px-4 py-3 pr-11 rounded-xl border outline-none transition-colors text-sm ${
                  errors.password
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                    : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                }`}
                placeholder="Masukkan password Anda"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-primary-700/20 text-sm cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              'Masuk Sekarang'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center space-y-2">
          <p className="text-sm text-neutral-700">
            Anggota belum memiliki password?{' '}
            <Link href="/aktivasi" className="text-primary-700 hover:text-primary-800 font-bold underline">
              Aktivasi Akun di sini
            </Link>
          </p>
          <p className="text-xs text-neutral-400">
            Belum menjadi anggota?{' '}
            <Link href="/register" className="text-neutral-500 hover:text-neutral-700 underline">
              Info pendaftaran anggota baru di kantor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
