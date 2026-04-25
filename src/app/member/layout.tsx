'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PiggyBank,
  WalletCards,
  FileText,
  LogOut,
  Building2,
  Menu,
  X,
  Loader2,
  User
} from 'lucide-react';

const memberNav = [
  { name: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard },
  { name: 'Simpanan', href: '/member/simpanan', icon: PiggyBank },
  { name: 'Pinjaman', href: '/member/pinjaman', icon: WalletCards },
  { name: 'Profil', href: '/member/profil', icon: User },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isAuthenticated, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (role === 'admin') {
      router.replace('/bo/dashboard');
    }
  }, [isLoaded, isAuthenticated, role, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isLoaded || !isAuthenticated || role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const initials = user!.nama
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F0FBF4] flex font-sans">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
          <Link href="/member/dashboard" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-105">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-emerald-700 leading-tight">
                UPK Mekarsari
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Portal Anggota
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-slate-400 rounded-xl hover:bg-slate-50 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member identity card */}
        <div className="mx-4 mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user!.nama}</p>
              <p className="text-xs text-emerald-700 font-semibold">{user!.username}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {memberNav.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.3)]'
                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-medium transition-all active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <span className="text-base font-bold text-emerald-700">UPK Mekarsari</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user!.nama}</p>
              <p className="text-xs text-slate-400">{user!.username}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-8 text-center text-xs text-slate-400 border-t border-slate-100">
          © 2026 UPK Mekarsari · Koperasi Simpan Pinjam
        </footer>
      </div>
    </div>
  );
}
