'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type UserRole } from '@/hooks/useAuth';
import { Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
  fallback,
}: ProtectedRouteProps) {
  const { user, isLoaded, isAuthenticated, role } = useAuth();
  const router = useRouter();

  // Helper untuk mengecek apakah role saat ini diizinkan
  const isAuthorized =
    !allowedRoles ||
    (role && allowedRoles.includes(role)) ||
    // Normalisasi alias role: 'anggota' dan 'member'
    (role === 'anggota' && allowedRoles.includes('member')) ||
    (role === 'member' && allowedRoles.includes('anggota'));

  useEffect(() => {
    if (!isLoaded) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isLoaded, isAuthenticated, redirectTo, router]);

  // 1. Tampilkan state loading jika sesi auth masih dimuat
  if (!isLoaded) {
    return (
      fallback || (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-neutral-500 font-medium">Memverifikasi sesi akun...</p>
        </div>
      )
    );
  }

  // 2. Jika belum login, return null sementara router mengalihkan
  if (!isAuthenticated || !user) {
    return null;
  }

  // 3. Jika sudah login tetapi role tidak memiliki otorisasi (403 Forbidden)
  if (!isAuthorized) {
    const dashboardLink =
      role === 'admin' || role === 'staf' || role === 'operator' || role === 'superadmin'
        ? '/bo/dashboard'
        : '/member/dashboard';

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-100 shadow-xl p-8 text-center animate-in fade-in zoom-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Akses Ditolak (403)</h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">
            Akun Anda dengan hak akses <strong className="text-neutral-800 capitalize">{role}</strong> tidak memiliki izin untuk membuka halaman ini.
          </p>
          <Link
            href={dashboardLink}
            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Kembali ke Dashboard Utama
          </Link>
        </div>
      </div>
    );
  }

  // 4. Pengguna terautentikasi dan terotorisasi
  return <>{children}</>;
}
