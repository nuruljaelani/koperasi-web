'use client';

import { useState } from 'react';
import { useLayananData, type Layanan } from '@/hooks/useContentData';
import Modal from '@/components/ui/Modal';
import { Plus, Pencil, Trash2, GripVertical, Save, CheckCircle2 } from 'lucide-react';

const WARNA_OPTIONS = [
  { label: 'Hijau (Primary)', border: 'border-green-700', ikon: 'text-green-700' },
  { label: 'Merah', border: 'border-red-500', ikon: 'text-red-600' },
  { label: 'Hijau Terang', border: 'border-green-500', ikon: 'text-green-600' },
  { label: 'Amber/Kuning', border: 'border-amber-500', ikon: 'text-amber-600' },
  { label: 'Biru', border: 'border-blue-500', ikon: 'text-blue-600' },
  { label: 'Slate', border: 'border-slate-500', ikon: 'text-slate-600' },
];

const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all';

type FormState = Omit<Layanan, 'id' | 'urutan'>;
const EMPTY_FORM: FormState = { judul: '', deskripsi: '', warnaBorder: 'border-green-700', warnaIkon: 'text-green-700' };

function ServiceModal({
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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!form.judul.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
          >
            <Save size={15} />
            Simpan
          </button>
        </div>
      }
    >
      <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Judul Layanan <span className="text-red-400">*</span></label>
            <input
              className={inputCls}
              value={form.judul}
              onChange={e => setForm({ ...form, judul: e.target.value })}
              placeholder="Contoh: Simpanan Pokok & Wajib"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Deskripsi</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={form.deskripsi}
              onChange={e => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Deskripsi singkat tentang layanan ini..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Warna Aksen</label>
            <div className="grid grid-cols-3 gap-2">
              {WARNA_OPTIONS.map(w => (
                <button
                  key={w.border}
                  onClick={() => setForm({ ...form, warnaBorder: w.border, warnaIkon: w.ikon })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all ${
                    form.warnaBorder === w.border
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${w.border} bg-white`} />
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    );
  }

export default function ServicesContentPage() {
  const { items, add, update, remove } = useLayananData();
  const [modal, setModal] = useState<'add' | { id: string } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal('add');
  };

  const openEdit = (item: Layanan) => {
    setForm({ judul: item.judul, deskripsi: item.deskripsi, warnaBorder: item.warnaBorder, warnaIkon: item.warnaIkon });
    setModal({ id: item.id });
  };

  const handleSave = () => {
    if (!form.judul.trim()) return;
    if (modal === 'add') {
      add({ ...form, urutan: items.length + 1 });
    } else if (modal && typeof modal === 'object') {
      update(modal.id, form);
      setFlashId(modal.id);
      setTimeout(() => setFlashId(null), 1500);
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      remove(id);
      setDeletingId(null);
    }, 300);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Modal */}
      {modal !== null && (
        <ServiceModal
          title={modal === 'add' ? 'Tambah Layanan Baru' : 'Edit Layanan'}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daftar Layanan</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola layanan yang ditampilkan pada halaman beranda publik. Saat ini: <span className="font-semibold text-emerald-600">{items.length} layanan</span></p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <Plus size={16} />
          Tambah Layanan
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <p className="text-slate-400 text-sm">Belum ada layanan. Klik &quot;Tambah Layanan&quot; untuk mulai.</p>
          </div>
        )}
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4 transition-all duration-300 ${
              deletingId === item.id ? 'opacity-0 scale-95' : 'opacity-100'
            } ${flashId === item.id ? 'ring-2 ring-emerald-400' : ''}`}
          >
            {/* Drag handle (visual only) */}
            <div className="flex items-center justify-center mt-1 text-slate-300 cursor-grab">
              <GripVertical size={18} />
            </div>

            {/* Urutan badge */}
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border-t-4 ${item.warnaBorder} bg-slate-50`}>
              <span className="text-sm font-bold text-slate-500">{idx + 1}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm">{item.judul}</h3>
              <p className="text-slate-500 text-xs mt-1 line-clamp-2">{item.deskripsi}</p>
            </div>

            {/* Warna tag */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border ${item.warnaBorder} bg-white shrink-0`}>
              <div className={`w-2 h-2 rounded-full border ${item.warnaBorder}`} />
              <span className="text-xs text-slate-500">Aksen</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEdit(item)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 size={14} className="text-emerald-400" />
          Perubahan tersimpan otomatis.
        </div>
      )}
    </div>
  );
}
