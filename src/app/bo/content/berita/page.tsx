'use client';

import { useState } from 'react';
import { useBeritaData, type Berita } from '@/hooks/useContentData';
import { Plus, Pencil, Trash2, Star, Newspaper, Eye, EyeOff } from 'lucide-react';
import {
  BeritaModal,
  EMPTY_FORM,
  type FormState,
} from './components/BeritaModal';

const KATEGORI_COLOR: Record<string, string> = {
  Pengumuman: 'bg-blue-100 text-blue-700',
  Layanan: 'bg-emerald-100 text-emerald-700',
  'Kisah Sukses': 'bg-amber-100 text-amber-700',
  Sosial: 'bg-pink-100 text-pink-700',
  Kegiatan: 'bg-purple-100 text-purple-700',
  Lainnya: 'bg-slate-100 text-slate-600',
};

function formatTanggal(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BeritaContentPage() {
  const { items, add, update, remove } = useBeritaData();
  const [modal, setModal] = useState<'add' | { id: string } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal('add');
  };

  const openEdit = (item: Berita) => {
    setForm({
      judul: item.judul,
      kategori: item.kategori,
      tanggal: item.tanggal,
      excerpt: item.excerpt,
      gambar: item.gambar,
      isUtama: item.isUtama,
      status: item.status,
    });
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
    setTimeout(() => {
      remove(id);
      setDeletingId(null);
    }, 300);
  };

  const published = items.filter((b) => b.status === 'published').length;
  const drafts = items.filter((b) => b.status === 'draft').length;

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Berita & Pengumuman
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola artikel dan pengumuman yang tampil di halaman Berita publik.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          Tulis Berita
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Total Berita',
            value: items.length,
            color: 'text-slate-800',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
          },
          {
            label: 'Published',
            value: published,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
          },
          {
            label: 'Draft',
            value: drafts,
            color: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
          },
        ].map((s) => (
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
            <p className="text-slate-400 text-sm">
              Belum ada berita. Klik &quot;Tulis Berita&quot; untuk mulai.
            </p>
          </div>
        )}
        {items.map((item) => (
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
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    KATEGORI_COLOR[item.kategori] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.kategori}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'published'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.status === 'published' ? <Eye size={10} /> : <EyeOff size={10} />}
                  {item.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{item.judul}</h3>
              <p className="text-slate-500 text-xs mt-1 line-clamp-1">{item.excerpt}</p>
              <p className="text-slate-400 text-xs mt-1">{formatTanggal(item.tanggal)}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 mt-1">
              <button
                onClick={() => openEdit(item)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
