'use client';

import { useTentangData } from '@/hooks/useContentData';
import { useState } from 'react';
import { Save, CheckCircle2, Target, Eye, Plus, X, ExternalLink } from 'lucide-react';

const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all';

function SectionCard({ title, icon: Icon, desc, children }: { title: string; icon: React.ElementType; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 bg-slate-50/60">
        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
          <Icon size={18} className="text-emerald-600" />
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

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [newItem, setNewItem] = useState('');

  const add = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem('');
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const edit = (i: number, val: string) => onChange(items.map((item, idx) => idx === i ? val : item));

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
          </div>
          <input
            className={`${inputCls} flex-1`}
            value={item}
            onChange={e => edit(i, e.target.value)}
          />
          <button
            onClick={() => remove(i)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-2">
        <input
          className={`${inputCls} flex-1`}
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
        />
        <button
          onClick={add}
          disabled={!newItem.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
        >
          <Plus size={14} />
          Tambah
        </button>
      </div>
    </div>
  );
}

export default function TentangKamiContentPage() {
  const { data, update, commit, saved } = useTentangData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tentang Kami</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola konten halaman profil organisasi — visi, misi, deskripsi, dan keunggulan.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/tentang-kami"
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

      {/* Deskripsi Perusahaan */}
      <SectionCard title="Deskripsi Organisasi" icon={Eye} desc="Paragraf penjelasan yang tampil di halaman Tentang Kami">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Paragraf Pertama</label>
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={data.deskripsi}
            onChange={e => update({ deskripsi: e.target.value })}
            placeholder="UPK Mekarsari adalah koperasi yang..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Paragraf Kedua</label>
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={data.deskripsiParagraf2}
            onChange={e => update({ deskripsiParagraf2: e.target.value })}
            placeholder="Dengan sistem yang transparan..."
          />
        </div>
      </SectionCard>

      {/* Visi */}
      <SectionCard title="Visi Organisasi" icon={Target} desc="Pernyataan visi jangka panjang organisasi">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Teks Visi</label>
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={data.visi}
            onChange={e => update({ visi: e.target.value })}
            placeholder="Menjadi koperasi terdepan..."
          />
        </div>
      </SectionCard>

      {/* Misi */}
      <SectionCard title="Misi Organisasi" icon={CheckCircle2} desc="Daftar butir misi (klik Enter untuk menambah)">
        <label className="text-sm font-medium text-slate-700 block mb-2">Butir-butir Misi</label>
        <ListEditor
          items={data.misi}
          onChange={misi => update({ misi })}
          placeholder="Tambah butir misi baru..."
        />
      </SectionCard>

      {/* Poin Keunggulan */}
      <SectionCard title="Poin Keunggulan" icon={CheckCircle2} desc="Daftar keunggulan yang tampil di samping foto kantor">
        <label className="text-sm font-medium text-slate-700 block mb-2">Daftar Keunggulan</label>
        <ListEditor
          items={data.poinKeunggulan}
          onChange={poinKeunggulan => update({ poinKeunggulan })}
          placeholder="Tambah poin keunggulan baru..."
        />
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
