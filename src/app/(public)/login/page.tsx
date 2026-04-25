'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, role, isLoaded } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      if (role === 'admin') router.replace('/bo/dashboard');
      else router.replace('/member/dashboard');
    }
  }, [isLoaded, isAuthenticated, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 600));

    const result = login(username.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Login gagal.');
      return;
    }

    if (result.role === 'admin') {
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
    <div className="min-h-[85vh] bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 sm:p-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 4L16 2L24 4L28 12L24 20L16 28L8 20L4 12L8 4Z" fill="#D4A017" />
              <path d="M12 8L16 6L20 8L22 12L20 16L16 20L12 16L10 12L12 8Z" fill="#1B5E20" />
              <path d="M14 10L16 9L18 10L19 12L18 14L16 16L14 14L13 12L14 10Z" fill="#F5C518" />
            </svg>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">UPK Mekarsari</span>
          </Link>
          <h2 className="text-2xl font-bold text-neutral-900">Selamat Datang Kembali</h2>
          <p className="text-neutral-500 mt-2 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        {/* Demo hint */}
        <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-700 mb-1">Akun Demo:</p>
          <p className="text-xs text-emerald-600">Admin: <strong>admin</strong> / <strong>admin123</strong></p>
          <p className="text-xs text-emerald-600">Anggota: <strong>A-1001</strong> / <strong>anggota123</strong></p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-sm text-rose-600 font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nomor Anggota / Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="Masukkan nomor anggota atau username"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-neutral-700">Password</label>
              <Link href="#" className="text-sm text-primary-700 hover:text-primary-800 font-medium">
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              'Masuk Sekarang'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary-700 hover:text-primary-800 font-semibold">
              Daftar Anggota Baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
