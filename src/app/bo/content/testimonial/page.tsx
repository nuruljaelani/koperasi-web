'use client';

import { useState } from 'react';
import { useTestimoniData, type Testimoni } from '@/hooks/useContentData';
import { Plus, Pencil, Trash2, X, Save, Star, Quote } from 'lucide-react';

const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all';

type FormState = Omit<Testimoni, 'id'>;
const EMPTY_FORM: FormState = { nama: '', jabatan: '', teks: '', bintang: 5 };

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`transition-transform hover:scale-110 ${n <= value ? 'text-amber-400' : 'text-slate-200'}`}
        >
          <Star size={22} className={n <= value ? 'fill-amber-400' : ''} />
        </button>
      ))}
    </div>
  );
}

function TestimoniModal({
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
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nama <span className="text-red-400">*</span></label>
              <input className={inputCls} value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Nama anggota" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Keterangan</label>
              <input className={inputCls} value={form.jabatan} onChange={e => setForm({ ...form, jabatan: e.target.value })} placeholder="Anggota sejak 2020" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Teks Testimoni <span className="text-red-400">*</span></label>
            <textarea
              rows={4}
              className={`${inputCls} resize-none`}
              value={form.teks}
              onChange={e => setForm({ ...form, teks: e.target.value })}
              placeholder="Saya sangat puas dengan layanan..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Rating Bintang</label>
            <StarRating value={form.bintang} onChange={bintang => setForm({ ...form, bintang })} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
          <button
            onClick={onSave}
            disabled={!form.nama.trim() || !form.teks.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <Save size={15} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < count ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
      ))}
    </div>
  );
}

export default function TestimoniContentPage() {
  const { items, add, update, remove } = useTestimoniData();
  const [modal, setModal] = useState<'add' | { id: string } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openEdit = (item: Testimoni) => {
    setForm({ nama: item.nama, jabatan: item.jabatan, teks: item.teks, bintang: item.bintang });
    setModal({ id: item.id });
  };

  const handleSave = () => {
    if (!form.nama.trim() || !form.teks.trim()) return;
    if (modal === 'add') add(form);
    else if (modal && typeof modal === 'object') update(modal.id, form);
    setModal(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => { remove(id); setDeletingId(null); }, 300);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {modal !== null && (
        <TestimoniModal
          title={modal === 'add' ? 'Tambah Testimoni' : 'Edit Testimoni'}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Testimoni Anggota</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola ulasan anggota yang tampil di beranda. Saat ini: <span className="font-semibold text-emerald-600">{items.length} testimoni</span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <Plus size={16} />
          Tambah Testimoni
        </button>
      </div>

      {/* Grid cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <Quote size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">Belum ada testimoni. Klik &quot;Tambah Testimoni&quot; untuk mulai.</p>
          </div>
        )}
        {items.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3 transition-all duration-300 ${
              deletingId === item.id ? 'opacity-0 scale-95' : 'opacity-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <StarDisplay count={item.bintang} />
              <div className="flex items-center gap-1.5">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed flex-grow">
              &ldquo;{item.teks}&rdquo;
            </p>

            <div className="border-t border-slate-100 pt-3 flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0">
                {item.nama.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{item.nama}</p>
                {item.jabatan && <p className="text-xs text-slate-400">{item.jabatan}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
