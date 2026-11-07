'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Bell,
  Shield,
  BarChart3,
  Info,
  LucideIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { TabKey } from './types';
import {
  PengaturanSystemFormValues,
  pengaturanSystemSchema,
} from '@/lib/validations/settings';
import { SaveBanner } from './components/common';
import { TabProfilKoperasi } from './components/TabProfilKoperasi';
import { TabNotifikasi } from './components/TabNotifikasi';
import { TabKeamanan } from './components/TabKeamanan';
import { TabLaporan } from './components/TabLaporan';
import { TabTentangSistem } from './components/TabTentangSistem';
import { usePengaturan } from '@/hooks/usePengaturan';

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'profil', label: 'Profil Koperasi', icon: Building2 },
  { key: 'notifikasi', label: 'Notifikasi', icon: Bell },
  { key: 'keamanan', label: 'Keamanan', icon: Shield },
  { key: 'laporan', label: 'Laporan & Backup', icon: BarChart3 },
  { key: 'tentang', label: 'Tentang Sistem', icon: Info },
];

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profil');

  const { profil, notifikasi, keamanan, laporan, isLoading, isSaving, saveSettings } =
    usePengaturan();

  const methods = useForm<PengaturanSystemFormValues>({
    resolver: zodResolver(pengaturanSystemSchema),
    defaultValues: {
      profil,
      notifikasi,
      keamanan,
      laporan,
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = methods;

  // Sync state once data from backend is loaded
  useEffect(() => {
    if (!isLoading) {
      reset({ profil, notifikasi, keamanan, laporan });
    }
  }, [isLoading, profil, notifikasi, keamanan, laporan, reset]);

  const onSubmit = async (values: PengaturanSystemFormValues) => {
    try {
      await saveSettings(values);
      reset(values);
    } catch {
      // toast is already handled in mutation hook
    }
  };

  const onError = (formErrors: FieldErrors<PengaturanSystemFormValues>) => {
    if (formErrors.profil) {
      toast.error('Ada kesalahan input pada tab Profil Koperasi');
      setActiveTab('profil');
    } else if (formErrors.notifikasi) {
      toast.error('Ada kesalahan input pada tab Notifikasi');
      setActiveTab('notifikasi');
    } else if (formErrors.keamanan) {
      toast.error('Ada kesalahan input pada tab Keamanan');
      setActiveTab('keamanan');
    } else if (formErrors.laporan) {
      toast.error('Ada kesalahan input pada tab Laporan');
      setActiveTab('laporan');
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 flex items-center justify-center gap-3 text-slate-400 font-bold">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span>Memuat Pengaturan Sistem...</span>
      </div>
    );
  }

  const hasTabError = (key: TabKey) => {
    if (key === 'profil') return !!errors.profil;
    if (key === 'notifikasi') return !!errors.notifikasi;
    if (key === 'keamanan') return !!errors.keamanan;
    if (key === 'laporan') return !!errors.laporan;
    return false;
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-0">
        <SaveBanner onSave={handleSubmit(onSubmit, onError)} saved={!isDirty} isSaving={isSaving} />

        {/* Page Header */}
        <div className="pt-6 pb-2 space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Pengaturan Sistem
          </h1>
          <p className="text-slate-500 text-sm">
            Kelola konfigurasi dan preferensi sistem koperasi dengan validasi schema
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const tabError = hasTabError(tab.key);
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
                {tabError && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === 'profil' && <TabProfilKoperasi />}
          {activeTab === 'notifikasi' && <TabNotifikasi />}
          {activeTab === 'keamanan' && <TabKeamanan />}
          {activeTab === 'laporan' && <TabLaporan />}
          {activeTab === 'tentang' && <TabTentangSistem />}
        </div>
      </div>
    </FormProvider>
  );
}
