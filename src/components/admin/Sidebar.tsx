'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  WalletCards, 
  PiggyBank, 
  Settings, 
  LogOut,
  X,
  Building2,
  ChevronDown,
  LayoutTemplate
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

type NavItem = {
  name: string;
  href?: string;
  icon: any;
  children?: { name: string; href: string }[];
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/bo/dashboard', icon: LayoutDashboard },
  
  { 
    name: 'Master Data', 
    icon: Users,
    children: [
      { name: 'Data Anggota', href: '/bo/anggota' },
      { name: 'Jenis Pinjaman', href: '/bo/jenis-pinjaman' }
    ]
  },
  { name: 'Pinjaman', href: '/bo/pinjaman', icon: WalletCards },
  {
    name: 'Simpanan',
    icon: PiggyBank,
    children: [
      { name: 'Semua Transaksi', href: '/bo/simpanan' },
      { name: 'Input Setoran', href: '/bo/simpanan/setoran' },
      { name: 'Proses Penarikan', href: '/bo/simpanan/penarikan' },
      { name: 'Laporan Rekap', href: '/bo/simpanan/laporan' },
    ]
  },
  { 
    name: 'Konten', 
    icon: LayoutTemplate,
    children: [
      { name: 'Pengaturan Situs', href: '/bo/content/settings' },
      { name: 'Hero Section', href: '/bo/content/hero' },
      { name: 'Layanan', href: '/bo/content/services' },
      { name: 'Berita & Pengumuman', href: '/bo/content/berita' },
      { name: 'Tentang Kami', href: '/bo/content/tentang' },
      { name: 'Testimoni', href: '/bo/content/testimonial' },
    ]
  },
  { name: 'Pengaturan', href: '/bo/pengaturan', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(
    navItems.find(item => item.children?.some(child => pathname?.startsWith(child.href)))?.name || null
  );

  useEffect(() => {
    // Automatically open the dropdown of the current active route when pathname changes
    const activeGroup = navItems.find(item => item.children?.some(child => pathname === child.href || pathname?.startsWith(`${child.href}/`)))?.name;
    if (activeGroup) {
      setOpenDropdown(activeGroup);
    }
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-62 bg-white flex flex-col transition-transform duration-300 ease-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-24 px-8 border-b border-slate-100">
          <Link href="/admin/dashboard" className="flex items-center gap-4 group">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-105 group-hover:rotate-3">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Koperasi
              </span>
              <span className="text-xs font-semibold tracking-wider text-slate-400">ADMIN PANEL</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 rounded-xl hover:bg-slate-50 transition-colors lg:hidden active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            if (item.children) {
              const isChildActive = item.children.some(child => pathname === child.href || pathname?.startsWith(`${child.href}/`));
              const isExpanded = openDropdown === item.name;

              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                      isChildActive 
                        ? 'text-emerald-700 bg-emerald-50/80 font-medium' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={`w-5 h-5 transition-transform duration-300 ${isChildActive ? 'text-emerald-600 scale-110' : 'text-slate-400 group-hover:text-emerald-500 group-hover:scale-110'}`} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-12 pr-4 space-y-1 mt-1">
                      {item.children.map((child) => {
                        const isActive = pathname === child.href || pathname?.startsWith(`${child.href}/`);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                              isActive
                                ? 'text-emerald-700 bg-emerald-50/50 font-bold'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50 font-medium'
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href || pathname?.startsWith(`${item.href!}/`);
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'text-emerald-700 bg-emerald-50/80 shadow-sm font-medium' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600 font-medium'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-lg" />
                )}
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? 'text-emerald-600 scale-110' : 'text-slate-400 group-hover:text-emerald-500 group-hover:scale-110'
                }`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center justify-center gap-3 w-full text-rose-600 rounded-2xl hover:bg-rose-50 transition-all active:scale-[0.98] font-medium border border-transparent hover:border-rose-100 py-3"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
