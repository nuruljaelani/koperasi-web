'use client';
import { useState, useEffect, useCallback } from 'react';

export type UserRole = 'admin' | 'anggota';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  anggotaId?: string; // links to Anggota record if role === 'anggota'
  nama: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

const MOCK_USERS: StoredUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    nama: 'Administrator',
  },
  {
    id: 'anggota-1',
    username: 'A-1001',
    password: 'anggota123',
    role: 'anggota',
    anggotaId: '1',
    nama: 'Ahmad Sudirman',
  },
  {
    id: 'anggota-2',
    username: 'A-1002',
    password: 'anggota123',
    role: 'anggota',
    anggotaId: '2',
    nama: 'Siti Aminah',
  },
];

const AUTH_KEY = 'koperasi_auth_session';

function seedMockUsers() {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem('koperasi_mock_users');
  if (!existing) {
    localStorage.setItem('koperasi_mock_users', JSON.stringify(MOCK_USERS));
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    seedMockUsers();
    const session = localStorage.getItem(AUTH_KEY);
    if (session) {
      // eslint-disable-next-line
      setUser(JSON.parse(session));
    }
    setIsLoaded(true);
  }, []);

  const login = useCallback(
    (username: string, password: string): { success: boolean; role?: UserRole; error?: string } => {
      const stored = localStorage.getItem('koperasi_mock_users');
      const users: StoredUser[] = stored ? JSON.parse(stored) : MOCK_USERS;

      const found = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.password === password
      );

      if (!found) {
        return { success: false, error: 'Username atau password salah.' };
      }

      // eslint-disable-next-line
      const { password: _pw, ...authUser } = found;
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true, role: authUser.role };
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const updateIdentity = useCallback((id: string, namaBaru: string) => {
    const stored = localStorage.getItem('koperasi_mock_users');
    const users: StoredUser[] = stored ? JSON.parse(stored) : MOCK_USERS;
    const updatedUsers = users.map(u => u.id === id ? { ...u, nama: namaBaru } : u);
    localStorage.setItem('koperasi_mock_users', JSON.stringify(updatedUsers));
    
    // Also update session
    const session = localStorage.getItem(AUTH_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.id === id) {
         parsed.nama = namaBaru;
         localStorage.setItem(AUTH_KEY, JSON.stringify(parsed));
         setUser(parsed);
      }
    }
  }, []);

  const changePassword = useCallback((id: string, oldPw: string, newPw: string): { success: boolean, error?: string } => {
    const stored = localStorage.getItem('koperasi_mock_users');
    const users: StoredUser[] = stored ? JSON.parse(stored) : MOCK_USERS;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return { success: false, error: 'User tidak ditemukan' };
    if (users[userIndex].password !== oldPw) return { success: false, error: 'Password lama salah' };
    
    users[userIndex].password = newPw;
    localStorage.setItem('koperasi_mock_users', JSON.stringify(users));
    return { success: true };
  }, []);

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    login,
    logout,
    updateIdentity,
    changePassword,
  };
}
