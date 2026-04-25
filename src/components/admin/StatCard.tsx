import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  colorClass: string;
}

export default function StatCard({ 
  title, 
  amount, 
  trend, 
  trendUp, 
  icon: Icon,
  colorClass 
}: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-[32px] border border-slate-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 group">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center bg-linear-to-br ${colorClass} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trendUp ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
              <path d="M6 10.5V1.5M6 1.5L1.5 6M6 1.5L10.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
              <path d="M6 1.5V10.5M6 10.5L1.5 6M6 10.5L10.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )} 
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 font-semibold text-sm mb-1.5">{title}</h3>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">{amount}</h2>
      </div>
    </div>
  );
}
