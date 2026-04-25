'use client';

import { useHeroContent } from '@/hooks/useContentData';
import { Save, CheckCircle2, LayoutTemplate, BarChart3, ExternalLink } from 'lucide-react';

function SectionCard({ title, icon: Icon, desc, children }: { title: string; icon: React.ElementType; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 bg-slate-50/60">
        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-emerald-600" size={18} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 text-sm">{title}</h2>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      <div className="p-8 space-y-5">{children}</div>
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all';

export default function HeroContentPage() {
  const { data, update, commit, saved } = useHeroContent();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hero Section</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola teks utama, tombol CTA, dan statistik yang tampil di hero beranda.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-xl transition-all"
          >
            <ExternalLink size={15} />
            Preview
          </a>
          <button
            onClick={commit}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? 'Tersimpan!' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Preview Banner */}
      <div
        className="relative rounded-2xl overflow-hidden py-8 px-8"
        style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #164d1a 40%, #0d3311 100%)' }}
      >
        <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-2">Preview — Hero Section</p>
        <h2 className="text-2xl font-bold text-white mb-2 max-w-xl leading-tight">{data.judul || 'Judul utama akan tampil di sini'}</h2>
        <p className="text-white/70 text-sm max-w-md mb-4">{data.subjudul || 'Subjudul akan tampil di sini...'}</p>
        <div className="flex gap-6">
          <div>
            <p className="text-xl font-bold text-amber-400">{data.statAnggota}</p>
            <p className="text-white/50 text-xs">Anggota Aktif</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-400">{data.statTahun}</p>
            <p className="text-white/50 text-xs">Tahun</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-400">{data.statRating}</p>
            <p className="text-white/50 text-xs">Rating</p>
          </div>
        </div>
      </div>

      {/* Teks & CTA */}
      <SectionCard title="Konten Teks & CTA" icon={LayoutTemplate} desc="Teks utama dan tombol ajakan bertindak di hero">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Judul Utama <span className="text-red-400">*</span></label>
          <textarea
            rows={2}
            className={`${inputCls} resize-none`}
            value={data.judul}
            onChange={e => update({ judul: e.target.value })}
            placeholder="Wujudkan Impian bersama UPK Mekarsari"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Subjudul / Deskripsi</label>
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={data.subjudul}
            onChange={e => update({ subjudul: e.target.value })}
            placeholder="Koperasi bersyariah yang siap membantu..."
          />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Teks Tombol CTA</label>
            <input className={inputCls} value={data.labelTombol} onChange={e => update({ labelTombol: e.target.value })} placeholder="Mulai Sekarang" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Link Tombol CTA</label>
            <input className={inputCls} value={data.hrefTombol} onChange={e => update({ hrefTombol: e.target.value })} placeholder="/register" />
          </div>
        </div>
      </SectionCard>

      {/* Statistik */}
      <SectionCard title="Statistik Highlight" icon={BarChart3} desc="3 angka statistik yang tampil di bawah hero">
        <div className="grid grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Jumlah Anggota</label>
            <input className={inputCls} value={data.statAnggota} onChange={e => update({ statAnggota: e.target.value })} placeholder="2000+" />
            <p className="text-xs text-slate-400">Label: "Anggota Aktif"</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Tahun Berdiri</label>
            <input className={inputCls} value={data.statTahun} onChange={e => update({ statTahun: e.target.value })} placeholder="20+" />
            <p className="text-xs text-slate-400">Label: "Tahun"</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Rating Kepuasan</label>
            <input className={inputCls} value={data.statRating} onChange={e => update({ statRating: e.target.value })} placeholder="98%" />
            <p className="text-xs text-slate-400">Label: "Rating"</p>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end pb-4">
        <button
          onClick={commit}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl transition-all shadow-sm"
        >
          {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saved ? 'Berhasil Disimpan!' : 'Simpan Semua Perubahan'}
        </button>
      </div>
    </div>
  );
}
