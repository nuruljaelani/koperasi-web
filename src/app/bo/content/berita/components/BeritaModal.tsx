import { Save, Star, Upload } from 'lucide-react';
import { uploadApi } from '@/lib/api';
import { type Berita } from '@/hooks/useContentData';
import Modal from '@/components/ui/Modal';

export const KATEGORI_OPTIONS = [
  'Pengumuman',
  'Layanan',
  'Kisah Sukses',
  'Sosial',
  'Kegiatan',
  'Lainnya',
];

export const inputCls =
  'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all';

export type FormState = Omit<Berita, 'id'>;

export const EMPTY_FORM: FormState = {
  judul: '',
  kategori: 'Pengumuman',
  tanggal: new Date().toISOString().slice(0, 10),
  excerpt: '',
  gambar: '/images/berita-1.png',
  isUtama: false,
  status: 'draft',
};

interface BeritaModalProps {
  title: string;
  form: FormState;
  setForm: (f: FormState) => void;
  onSave: () => void;
  onClose: () => void;
}

export function BeritaModal({
  title,
  form,
  setForm,
  onSave,
  onClose,
}: BeritaModalProps) {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      size="2xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!form.judul.trim() || !form.excerpt.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Save size={15} />
            Simpan
          </button>
        </div>
      }
    >
      <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Judul Berita <span className="text-red-400">*</span>
            </label>
            <input
              className={inputCls}
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              placeholder="Judul berita..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Kategori</label>
              <select
                className={inputCls}
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              >
                {KATEGORI_OPTIONS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Tanggal Terbit</label>
              <input
                type="date"
                className={inputCls}
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Ringkasan / Excerpt <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Ringkasan singkat berita (tampil di card daftar berita)..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Isi Konten Berita Lengkap
            </label>
            <textarea
              rows={5}
              className={`${inputCls} resize-none font-sans`}
              value={(form as any).konten || ''}
              onChange={(e) => setForm({ ...form, konten: e.target.value } as any)}
              placeholder="Tuliskan isi berita atau artikel lengkap di sini..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Gambar Sampul / Thumbnail
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {form.gambar && (
                <div className="w-20 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={form.gambar}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-sm">
                    <Upload size={14} />
                    <span>Upload ke Cloudinary</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const res = await uploadApi.uploadFile({
                            file,
                            folder: 'koperasi/berita',
                          });
                          if (res.status === 'success' && res.data?.url) {
                            setForm({ ...form, gambar: res.data.url });
                          }
                        } catch (err) {
                          console.error('Gagal upload thumbnail:', err);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-slate-400">atau masukkan URL langsung</span>
                </div>
                <input
                  className={inputCls}
                  value={form.gambar}
                  onChange={(e) => setForm({ ...form, gambar: e.target.value })}
                  placeholder="https://... atau /images/berita-1.png"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Status Publikasi</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as 'published' | 'draft' })
                }
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-amber-400 w-full transition-all">
                <div
                  onClick={() => setForm({ ...form, isUtama: !form.isUtama })}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    form.isUtama ? 'bg-amber-400 border-amber-400' : 'border-slate-300'
                  }`}
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
      </Modal>
    );
  }
