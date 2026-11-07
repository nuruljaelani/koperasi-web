'use client';

import React from 'react';
import { Calculator } from 'lucide-react';

interface JenisPinjamanSimulatorProps {
  bunga: number;
  tenor: number;
  tipeBunga: string;
}

export function JenisPinjamanSimulator({
  bunga,
  tenor,
  tipeBunga,
}: JenisPinjamanSimulatorProps) {
  const simSamplePlafon = 10000000;
  const safeTenor = tenor && tenor > 0 ? tenor : 1;
  const simPokokBulanan = simSamplePlafon / safeTenor;
  const simBungaBulanan = (simSamplePlafon * ((bunga || 0) / 100)) / 12;
  const simTotalAngsuran = simPokokBulanan + simBungaBulanan;

  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-emerald-700">
          <Calculator className="w-4 h-4" />
          Simulasi Contoh (Plafon Rp 10.000.000)
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          Tenor: {tenor} Bulan
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
        <div>
          <span className="text-slate-500 text-[11px]">Bunga ({tipeBunga}):</span>
          <div className="font-bold text-slate-800">
            Rp {Math.round(simBungaBulanan).toLocaleString('id-ID')} / bln
          </div>
        </div>
        <div>
          <span className="text-slate-500 text-[11px]">Est. Angsuran:</span>
          <div className="font-extrabold text-emerald-600">
            Rp {Math.round(simTotalAngsuran).toLocaleString('id-ID')} / bln
          </div>
        </div>
      </div>
    </div>
  );
}
