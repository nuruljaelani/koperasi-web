import { PiggyBank, TrendingUp, TrendingDown, Users } from 'lucide-react';

interface LaporanSimpananSummaryCardsProps {
  saldoBersih: number;
  totalSetoran: number;
  totalPenarikan: number;
  totalAnggota: number;
  formatRupiah: (v: number) => string;
}

export function LaporanSimpananSummaryCards({
  saldoBersih,
  totalSetoran,
  totalPenarikan,
  totalAnggota,
  formatRupiah,
}: LaporanSimpananSummaryCardsProps) {
  const cards = [
    {
      label: 'Saldo Bersih',
      value: formatRupiah(saldoBersih),
      icon: PiggyBank,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Total Setoran',
      value: formatRupiah(totalSetoran),
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Penarikan',
      value: formatRupiah(totalPenarikan),
      icon: TrendingDown,
      color: 'from-rose-500 to-pink-500',
    },
    {
      label: 'Anggota Aktif',
      value: `${totalAnggota} orang`,
      icon: Users,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
        >
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}
          >
            <c.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mb-1">{c.value}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
