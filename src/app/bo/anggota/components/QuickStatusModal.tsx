import { ShieldCheck } from 'lucide-react';
import { Anggota } from '@/hooks/useAnggotaData';
import Modal from '@/components/ui/Modal';

interface QuickStatusModalProps {
  isOpen: boolean;
  selectedAnggota: Anggota | null;
  newStatus: string;
  isUpdatingStatus: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
  onSave: () => void;
}

export function QuickStatusModal({
  isOpen,
  selectedAnggota,
  newStatus,
  isUpdatingStatus,
  onClose,
  onStatusSelect,
  onSave,
}: QuickStatusModalProps) {
  if (!selectedAnggota) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ubah Status Cepat"
      description={`${selectedAnggota.nomorAnggota} • ${selectedAnggota.nama}`}
      icon={<ShieldCheck className="w-5 h-5" />}
      size="md"
    >
      <div className="p-6 space-y-6">

        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">
            Pilih Status Keanggotaan Baru
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onStatusSelect('active')}
              className={`p-4 rounded-2xl border font-bold text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                newStatus === 'active'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Aktif
            </button>
            <button
              type="button"
              onClick={() => onStatusSelect('inactive')}
              className={`p-4 rounded-2xl border font-bold text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                newStatus === 'inactive'
                  ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              Tidak Aktif
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdatingStatus}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isUpdatingStatus}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-[0_4px_12px_rgba(5,150,105,0.2)] cursor-pointer"
          >
            {isUpdatingStatus ? 'Menyimpan...' : 'Simpan Status'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
