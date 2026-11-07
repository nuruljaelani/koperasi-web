'use client';

import React from 'react';
import { Layers, Plus, Coins, CheckCircle2, Percent, Calendar } from 'lucide-react';

interface JenisPinjamanHeaderProps {
  totalProduk: number;
  totalAktif: number;
  avgBunga: string;
  maxTenor: number;
  onOpenCreate: () => void;
}

export function JenisPinjamanHeader({
  totalProduk,
  totalAktif,
  avgBunga,
  maxTenor,
  onOpenCreate,
}: JenisPinjamanHeaderProps) {
  return (
    <>
      {/* 1. Header Page */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-600 mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Master Data Back Office</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Jenis Pinjaman
            </h1>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-extrabold rounded-full">
              {totalProduk} Produk
            </span>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1.5">
            Konfigurasi produk pembiayaan, metode bunga angsuran, serta parameter denda &
            administrasi koperasi.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold tracking-wide shadow-[0_6px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk Pinjaman
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Produk
            </span>
            <div className="text-2xl font-extrabold text-slate-900">{totalProduk}</div>
            <span className="text-[11px] font-semibold text-slate-400">Terdaftar di sistem</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Produk Aktif
            </span>
            <div className="text-2xl font-extrabold text-emerald-600">{totalAktif}</div>
            <span className="text-[11px] font-semibold text-emerald-600/80">
              Siap diajukan anggota
            </span>
          </div>
          <div className="p-3 bg-emerald-50/70 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Rata-Rata Bunga
            </span>
            <div className="text-2xl font-extrabold text-slate-900">{avgBunga}%</div>
            <span className="text-[11px] font-semibold text-slate-400">Per tahun efektif</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tenor Maksimal
            </span>
            <div className="text-2xl font-extrabold text-slate-900">{maxTenor} Bln</div>
            <span className="text-[11px] font-semibold text-slate-400">Jangka waktu terpanjang</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>
    </>
  );
}
