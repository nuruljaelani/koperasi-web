'use client';

import React from 'react';
import { LaporanMetrics } from '../types';

interface LaporanKpiCardsProps {
  metrics: LaporanMetrics;
}

export function LaporanKpiCards({ metrics }: LaporanKpiCardsProps) {
  const cards = [
    { title: metrics.card1Title, val: metrics.card1Val, text: 'text-emerald-800' },
    { title: metrics.card2Title, val: metrics.card2Val, text: 'text-blue-800' },
    { title: metrics.card3Title, val: metrics.card3Val, text: 'text-purple-800' },
    { title: metrics.card4Title, val: metrics.card4Val, text: 'text-amber-800' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1"
        >
          <span className="text-xs font-medium text-slate-400 block">{card.title}</span>
          <p className={`text-xl sm:text-2xl font-extrabold ${card.text}`}>{card.val}</p>
        </div>
      ))}
    </div>
  );
}
