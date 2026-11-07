'use client';

import { useAuth, type UserRole } from '@/hooks/useAuth';

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RoleGate digunakan untuk menampilkan/menyembunyikan elemen UI tertentu
 * berdasarkan hak akses role user saat ini (misal: tombol aksi khusus admin/superadmin).
 */
export default function RoleGate({
  allowedRoles,
  children,
  fallback = null,
}: RoleGateProps) {
  const { user, isLoaded, role } = useAuth();

  if (!isLoaded || !user || !role) {
    return <>{fallback}</>;
  }

  const isAllowed =
    allowedRoles.includes(role) ||
    (role === 'anggota' && allowedRoles.includes('member')) ||
    (role === 'member' && allowedRoles.includes('anggota'));

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
