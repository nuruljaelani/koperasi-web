'use client';

import { useSiteSettings } from '@/hooks/useContentData';
import { Save, CheckCircle2, Globe, Phone, MapPin, Clock, Share2 } from 'lucide-react';

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 bg-slate-50/60">
        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-emerald-600" size={18} />
        </div>
        <h2 className="font-semibold text-slate-800 text-sm">{title}</h2>
      </div>
      <div className="p-8 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all';

export default function SiteSettingsPage() {
  const { data, update, commit, saved } = useSiteSettings();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Situs</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola identitas, kontak, dan informasi dasar organisasi yang tampil di halaman publik.</p>
        </div>
        <button
          onClick={commit}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Identitas Organisasi */}
      <SectionCard title="Identitas Organisasi" icon={Globe}>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Nama Organisasi">
            <input className={inputCls} value={data.namaOrganisasi} onChange={e => update({ namaOrganisasi: e.target.value })} placeholder="UPK Mekarsari" />
          </Field>
          <Field label="Tagline / Slogan" hint="Ditampilkan di hero section beranda">
            <input className={inputCls} value={data.tagline} onChange={e => update({ tagline: e.target.value })} placeholder="Slogan organisasi" />
          </Field>
        </div>
        <Field label="Deskripsi Singkat" hint="Ditampilkan di hero section dan footer">
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={data.deskripsiSingkat}
            onChange={e => update({ deskripsiSingkat: e.target.value })}
            placeholder="Deskripsi singkat tentang organisasi..."
          />
        </Field>
      </SectionCard>

      {/* Informasi Kontak */}
      <SectionCard title="Informasi Kontak" icon={Phone}>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Nomor Telepon">
            <input className={inputCls} value={data.telepon} onChange={e => update({ telepon: e.target.value })} placeholder="(021) 000-0000" />
          </Field>
          <Field label="Nomor WhatsApp">
            <input className={inputCls} value={data.whatsapp} onChange={e => update({ whatsapp: e.target.value })} placeholder="+62 8xx-xxxx-xxxx" />
          </Field>
          <Field label="Email Utama">
            <input type="email" className={inputCls} value={data.email} onChange={e => update({ email: e.target.value })} placeholder="info@organisasi.com" />
          </Field>
          <Field label="Email Customer Service">
            <input type="email" className={inputCls} value={data.emailCs} onChange={e => update({ emailCs: e.target.value })} placeholder="cs@organisasi.com" />
          </Field>
        </div>
      </SectionCard>

      {/* Alamat & Peta */}
      <SectionCard title="Alamat & Peta" icon={MapPin}>
        <Field label="Alamat Lengkap">
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={data.alamat}
            onChange={e => update({ alamat: e.target.value })}
            placeholder="Jl. Contoh No. 1, Desa, Kecamatan, Kabupaten, Provinsi, Kodepos"
          />
        </Field>
        <Field label="URL Google Maps" hint="Link 'embed' atau 'share' dari Google Maps untuk menampilkan peta">
          <input className={inputCls} value={data.googleMapsUrl} onChange={e => update({ googleMapsUrl: e.target.value })} placeholder="https://maps.google.com/..." />
        </Field>
      </SectionCard>

      {/* Jam Operasional */}
      <SectionCard title="Jam Operasional" icon={Clock}>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Hari Kerja (Senin - Jumat)">
            <input className={inputCls} value={data.jamOperasional} onChange={e => update({ jamOperasional: e.target.value })} placeholder="Senin - Jumat: 08:00 - 16:00 WIB" />
          </Field>
          <Field label="Hari Sabtu">
            <input className={inputCls} value={data.jamSabtu} onChange={e => update({ jamSabtu: e.target.value })} placeholder="Sabtu: 08:00 - 13:00 WIB" />
          </Field>
        </div>
      </SectionCard>

      {/* Media Sosial */}
      <SectionCard title="Media Sosial" icon={Share2}>
        <div className="grid md:grid-cols-3 gap-5">
          <Field label="Facebook">
            <input className={inputCls} value={data.facebook} onChange={e => update({ facebook: e.target.value })} placeholder="https://facebook.com/..." />
          </Field>
          <Field label="Instagram">
            <input className={inputCls} value={data.instagram} onChange={e => update({ instagram: e.target.value })} placeholder="https://instagram.com/..." />
          </Field>
          <Field label="YouTube">
            <input className={inputCls} value={data.youtube} onChange={e => update({ youtube: e.target.value })} placeholder="https://youtube.com/..." />
          </Field>
        </div>
      </SectionCard>

      {/* Save bottom bar */}
      <div className="flex justify-end pt-2 pb-4">
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
