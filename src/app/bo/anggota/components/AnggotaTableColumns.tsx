import Link from 'next/link';
import { UserCheck, Edit3, Trash2 } from 'lucide-react';
import { Anggota } from '@/hooks/useAnggotaData';
import { confirmDialog } from '@/lib/confirm';
import { toast } from 'sonner';

interface GetAnggotaColumnsProps {
  onOpenStatusModal: (anggota: Anggota) => void;
  deleteAnggota: (id: string) => Promise<void>;
}

export function getAnggotaColumns({
  onOpenStatusModal,
  deleteAnggota,
}: GetAnggotaColumnsProps) {
  return [
    { header: 'No. Anggota', accessor: 'nomorAnggota' as keyof Anggota },
    {
      header: 'Nama Lengkap',
      accessor: (row: Anggota) => (
        <div>
          <div className="font-extrabold text-slate-800">{row.nama}</div>
          <div className="text-xs text-slate-400 font-bold mt-0.5">
            {row.nik || 'NIK belum diatur'}
          </div>
        </div>
      ),
    },
    { header: 'No. HP', accessor: 'nomorHp' as keyof Anggota },
    {
      header: 'Status',
      accessor: (row: Anggota) => (
        <button
          onClick={() => onOpenStatusModal(row)}
          title="Klik untuk ubah status cepat"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
            row.status === 'Aktif'
              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          {row.status}
        </button>
      ),
    },
    {
      header: 'Aksi',
      accessor: (row: Anggota) => (
        <div className="flex items-center gap-2">
          {/* Quick Status Change Action */}
          <button
            onClick={() => onOpenStatusModal(row)}
            title="Ubah Status"
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          {/* Full Edit Page Action */}
          <Link
            href={`/bo/anggota/edit/${row.id}`}
            title="Edit Biodata Lengkap"
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
          {/* Deactivate/Delete Action */}
          <button
            onClick={async () => {
              const isConfirmed = await confirmDialog({
                title: 'Hapus / Nonaktifkan Anggota?',
                message: `Apakah Anda yakin ingin menghapus atau menonaktifkan akun anggota '${
                  row.nama || row.nomorAnggota
                }'? Tindakan ini akan membatasi akses akun terkait.`,
                confirmText: 'Ya, Hapus Anggota',
                cancelText: 'Batalkan',
                variant: 'danger',
              });

              if (isConfirmed) {
                try {
                  await deleteAnggota(row.id);
                  toast.success(
                    `Data anggota '${row.nama || row.nomorAnggota}' berhasil dihapus`
                  );
                } catch (err: any) {
                  toast.error(err.message || 'Gagal menghapus anggota');
                }
              }
            }}
            title="Hapus / Nonaktifkan"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
}
