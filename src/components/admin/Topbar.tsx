'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Search, Bell, LogOut } from 'lucide-react';

interface TopbarProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function Topbar({ setSidebarOpen }: TopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user?.nama
    ? user.nama.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AK';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100/50">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 text-slate-500 rounded-xl hover:bg-slate-100 lg:hidden transition-colors active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden lg:flex items-center gap-3 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50 focus-within:border-emerald-200 transition-all duration-300 w-80">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari anggota atau transaksi..." 
            className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all duration-300 active:scale-95">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(16,185,129,0.25)]">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-bold text-slate-800">{user?.nama ?? 'Admin Koperasi'}</span>
            <span className="text-xs font-medium text-emerald-600 capitalize">{user?.role ?? 'admin'}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Keluar"
          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
