'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['admin', 'staf', 'operator', 'superadmin']}>
      <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col lg:pl-62 transition-all duration-300">
          <Topbar setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-4 md:p-8 w-full animate-in fade-in zoom-in-95 duration-500">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
