'use client';

import React from 'react';
import { Cpu, Info } from 'lucide-react';
import { SectionCard } from './common';

export function TabTentangSistem() {
  const info = [
    { label: 'Nama Aplikasi', value: 'Koperasi Web — Portal Manajemen' },
    { label: 'Versi', value: 'v0.1.0' },
    { label: 'Framework', value: 'Next.js 16 + React 19' },
    { label: 'UI Library', value: 'Tailwind CSS v4 + Lucide React' },
    { label: 'Database (Mock)', value: 'localStorage (Client-side Mock)' },
    { label: 'Lingkungan', value: process.env.NODE_ENV || 'development' },
  ];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Informasi Sistem"
        icon={Cpu}
        description="Detail teknis aplikasi yang sedang berjalan"
      >
        <div className="divide-y divide-slate-100">
          {info.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500 font-medium">{item.label}</span>
              <span className="text-sm font-bold text-slate-800 font-mono bg-slate-50 px-3 py-1 rounded-lg">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Pengembang"
        icon={Info}
        description="Informasi kontak tim pengembang aplikasi"
      >
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
            <p className="text-sm font-bold text-emerald-900 mb-1">UPK Mekarsari Web Portal</p>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Sistem manajemen koperasi terintegrasi untuk pengelolaan anggota, simpanan, pinjaman,
              dan pelaporan keuangan secara digital.
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center pt-2">
            © 2026 UPK Mekarsari. Seluruh data bersifat rahasia dan dilindungi.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
