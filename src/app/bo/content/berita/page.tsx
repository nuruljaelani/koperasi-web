'use client';

import { useState } from 'react';
import { useBeritaData, type Berita } from '@/hooks/useContentData';
import { Plus, Pencil, Trash2, X, Save, Star, Newspaper, Eye, EyeOff } from 'lucide-react';

const KATEGORI_OPTIONS = ['Pengumuman', 'Layanan', 'Kisah Sukses', 'Sosial', 'Kegiatan', 'Lainnya'];

const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all';

type FormState = Omit<Berita, 'id'>;
const EMPTY_FORM: FormState = {
  judul: '',
  kategori: 'Pengumuman',
  tanggal: new Date().toISOString().slice(0, 10),
  excerpt: '',
  gambar: '/images/berita-1.png',
  isUtama: false,
  status: 'draft',
};

const KATEGORI_COLOR: Record<string, string> = {
  'Pengumuman': 'bg-blue-100 text-blue-700',
  'Layanan': 'bg-emerald-100 text-emerald-700',
  'Kisah Sukses': 'bg-amber-100 text-amber-700',
  'Sosial': 'bg-pink-100 text-pink-700',
  'Kegiatan': 'bg-purple-100 text-purple-700',
  'Lainnya': 'bg-slate-100 text-slate-600',
};

function BeritaModal({
  title,
  form,
  setForm,
  onSave,
  onClose,
}: {
  title: string;
  form: FormState;
  setForm: (f: FormState) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between sticky top-0 bg-white pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Judul Berita <span className="text-red-400">*</span></label>
            <input className={inputCls} value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} placeholder="Judul berita..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Kategori</label>
              <select className={inputCls} value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}>
                {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Tanggal Terbit</label>
              <input type="date" className={inputCls} value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Ringkasan / Excerpt <span className="text-red-400">*</span></label>
            <textarea
              rows={4}
              className={`${inputCls} resize-none`}
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Ringkasan singkat berita (tampil di daftar berita)..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Path Gambar</label>
            <input className={inputCls} value={form.gambar} onChange={e => setForm({ ...form, gambar: e.target.value })} placeholder="/images/nama-gambar.png" />
            <p className="text-xs text-slate-400">Gunakan path relatif, contoh: /images/berita-2.png</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Status Publikasi</label>
              <select className={inputCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-amber-400 w-full transition-all">
                <div
                  onClick={() => setForm({ ...form, isUtama: !form.isUtama })}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.isUtama ? 'bg-amber-400 border-amber-400' : 'border-slate-300'}`}
                >
                  {form.isUtama && <Star size={12} className="text-white fill-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Berita Utama</p>
                  <p className="text-xs text-slate-400">Tampil sebagai featured</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white border-t border-slate-100 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">Batal</button>
          <button
            onClick={onSave}
            disabled={!form.judul.trim() || !form.excerpt.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
          >
            <Save size={15} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTanggal(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BeritaContentPage() {
  const { items, add, update, remove } = useBeritaData();
  const [modal, setModal] = useState<'add' | { id: string } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openEdit = (item: Berita) => {
    setForm({ judul: item.judul, kategori: item.kategori, tanggal: item.tanggal, excerpt: item.excerpt, gambar: item.gambar, isUtama: item.isUtama, status: item.status });
    setModal({ id: item.id });
  };

  const handleSave = () => {
    if (!form.judul.trim() || !form.excerpt.trim()) return;
    if (modal === 'add') add(form);
    else if (modal && typeof modal === 'object') update(modal.id, form);
    setModal(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => { remove(id); setDeletingId(null); }, 300);
  };

  const published = items.filter(b => b.status === 'published').length;
  const drafts = items.filter(b => b.status === 'draft').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {modal !== null && (
        <BeritaModal
          title={modal === 'add' ? 'Tambah Berita Baru' : 'Edit Berita'}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Berita & Pengumuman</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola artikel dan pengumuman yang tampil di halaman Berita publik.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <Plus size={16} />
          Tulis Berita
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Berita', value: items.length, color: 'text-slate-800', bg: 'bg-slate-50', border: 'border-slate-200' },
          { label: 'Published', value: published, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Draft', value: drafts, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <Newspaper size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">Belum ada berita. Klik &quot;Tulis Berita&quot; untuk mulai.</p>
          </div>
        )}
        {items.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4 transition-all duration-300 ${
              deletingId === item.id ? 'opacity-0 scale-95' : 'opacity-100'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {item.isUtama && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                    <Star size={10} className="fill-amber-500 text-amber-500" /> Utama
                  </span>
                )}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${KATEGORI_COLOR[item.kategori] || 'bg-slate-100 text-slate-600'}`}>
                  {item.kategori}
                </span>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {item.status === 'published' ? <Eye size={10} /> : <EyeOff size={10} />}
                  {item.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{item.judul}</h3>
              <p className="text-slate-500 text-xs mt-1 line-clamp-1">{item.excerpt}</p>
              <p className="text-slate-400 text-xs mt-1">{formatTanggal(item.tanggal)}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 mt-1">
              <button onClick={() => openEdit(item)} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
