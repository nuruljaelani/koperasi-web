'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoaded, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (role === 'anggota') {
      router.replace('/member/dashboard');
    }
  }, [isLoaded, isAuthenticated, role, router]);

  if (!isLoaded || !isAuthenticated || role === 'anggota') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col lg:pl-62 transition-all duration-300">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-8 w-full animate-in fade-in zoom-in-95 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
