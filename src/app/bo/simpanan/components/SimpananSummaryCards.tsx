'use client';

import React from 'react';
import { PiggyBank, TrendingUp, TrendingDown, Receipt } from 'lucide-react';

interface SimpananSummaryCardsProps {
  totalSaldoVal: number;
  totalSetorVal: number;
  totalTarikVal: number;
  totalTrxCount: number;
  formatRupiah: (amount: number) => string;
}

export function SimpananSummaryCards({
  totalSaldoVal,
  totalSetorVal,
  totalTarikVal,
  totalTrxCount,
  formatRupiah,
}: SimpananSummaryCardsProps) {
  const summaryCards = [
    {
      label: 'Total Saldo Simpanan',
      value: formatRupiah(totalSaldoVal),
      icon: PiggyBank,
      color: 'from-emerald-500 to-teal-500',
      sub: 'Net akumulasi kas anggota',
    },
    {
      label: 'Total Setoran Masuk',
      value: formatRupiah(totalSetorVal),
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      sub: 'Penerimaan kas simpanan',
    },
    {
      label: 'Total Penarikan Keluar',
      value: formatRupiah(totalTarikVal),
      icon: TrendingDown,
      color: 'from-rose-500 to-pink-500',
      sub: 'Pengeluaran kas penarikan',
    },
    {
      label: 'Total Transaksi',
      value: `${totalTrxCount}`,
      icon: Receipt,
      color: 'from-amber-500 to-orange-500',
      sub: 'Transaksi tercatat di sistem',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {summaryCards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
        >
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-sm`}
          >
            <card.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">{card.value}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {card.label}
          </div>
          <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
