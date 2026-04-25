import { Users, WalletCards, PiggyBank, Landmark } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';

const stats = [
  {
    title: 'Total Anggota Aktif',
    amount: '1,248',
    trend: '+12% bln ini',
    trendUp: true,
    icon: Users,
    colorClass: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Total Simpanan',
    amount: 'Rp 4,25 M',
    trend: '+8.4% bln ini',
    trendUp: true,
    icon: PiggyBank,
    colorClass: 'from-emerald-400 to-teal-600',
  },
  {
    title: 'Total Pinjaman Aktif',
    amount: 'Rp 2,15 M',
    trend: '-2.1% bln ini',
    trendUp: false,
    icon: WalletCards,
    colorClass: 'from-amber-400 to-orange-500',
  },
  {
    title: 'Total Kas & Bank',
    amount: 'Rp 3,84 M',
    trend: '+15.2% bln ini',
    trendUp: true,
    icon: Landmark,
    colorClass: 'from-rose-400 to-red-600',
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Ringkasan Statistik</h1>
        <p className="text-slate-500 font-semibold">Pantau kinerja keuangan koperasi secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] min-h-[460px] flex flex-col hover:shadow-xl transition-shadow duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Arus Kas Bulanan</h2>
            <select className="bg-slate-50 border-none text-sm font-semibold text-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-emerald-50 hover:bg-slate-100 transition-colors cursor-pointer appearance-none">
              <option>Pilih Tahun: 2026</option>
              <option>Pilih Tahun: 2025</option>
            </select>
          </div>
          <div className="flex-1 rounded-[24px] bg-slate-50/50 border-2 border-slate-100 border-dashed flex items-center justify-center text-slate-400 font-medium tracking-wide">
            [ Area Rendering Grafik Arus Kas ]
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] min-h-[460px] flex flex-col hover:shadow-xl transition-shadow duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Transaksi Terbaru</h2>
          </div>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-4 items-center gap-5 group cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-lg transition-transform group-hover:scale-110 duration-300 col-span-1 ${
                  i === 3 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {i === 3 ? 'P' : 'S'}
                </div>
                <div className="flex-1 col-span-2">
                  <h4 className="font-semibold text-slate-800 text-md group-hover:text-emerald-600 transition-colors">{i === 3 ? 'Pinjaman Cair' : 'Setoran Wajib'}</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Anggota #100{i}</p>
                </div>
                <span className={`font-semibold text-md col-span-1 ${i === 3 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {i === 3 ? '-' : '+'}Rp 1.000k
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all active:scale-[0.98]">
            Lihat Semua Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}
