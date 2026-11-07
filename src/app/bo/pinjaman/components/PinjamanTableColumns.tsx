import Link from 'next/link';
import { Eye, Edit3 } from 'lucide-react';
import { Pinjaman } from '@/hooks/usePinjamanData';
import { JenisPinjaman } from '@/hooks/useJenisPinjamanData';

interface GetPinjamanColumnsProps {
  jenisList: JenisPinjaman[];
}

export function getPinjamanColumns({ jenisList }: GetPinjamanColumnsProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return [
    {
      header: 'No. Pinjaman',
      accessor: (row: Pinjaman) => (
        <div className="font-extrabold text-slate-800 font-mono text-xs">
          {row.nomorPinjaman}
        </div>
      ),
    },
    {
      header: 'Anggota',
      accessor: (row: Pinjaman) => (
        <div>
          <div className="font-bold text-slate-800 text-sm">
            {row.namaAnggota || 'Unknown'}
          </div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">
            {row.nomorAnggota ? `No: ${row.nomorAnggota}` : '-'}
          </div>
        </div>
      ),
    },
    {
      header: 'Jenis Pinjaman',
      accessor: (row: Pinjaman) => {
        const jns = jenisList.find((j) => j.id === row.jenisPinjamanId);
        return (
          <span className="font-bold text-emerald-600 text-xs">
            {row.namaJenisPinjaman || jns?.nama || 'Unknown'}
          </span>
        );
      },
    },
    {
      header: 'Pengajuan',
      accessor: (row: Pinjaman) => (
        <div>
          <div className="font-extrabold text-slate-900 font-mono text-sm">
            {formatRupiah(row.jumlahPengajuan)}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">
            Tenor {row.tenor} Bulan
          </div>
        </div>
      ),
    },
    {
      header: 'Tanggal',
      accessor: (row: Pinjaman) => {
        const date = new Date(row.tanggalPengajuan);
        return (
          <span className="font-medium text-slate-600 text-xs">
            {date.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessor: (row: Pinjaman) => {
        let colors = '';
        switch (row.status) {
          case 'Draft':
            colors = 'bg-slate-100 text-slate-600 border-slate-200';
            break;
          case 'Review':
            colors = 'bg-amber-50 text-amber-700 border-amber-200/60';
            break;
          case 'Disetujui':
            colors = 'bg-blue-50 text-blue-700 border-blue-200/60';
            break;
          case 'Ditolak':
            colors = 'bg-rose-50 text-rose-700 border-rose-200/60';
            break;
          case 'Cair':
            colors = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
            break;
          case 'Lunas':
            colors = 'bg-slate-50 text-slate-600 border-slate-200';
            break;
          default:
            colors = 'bg-slate-50 text-slate-600 border-slate-200';
        }
        return (
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${colors}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Aksi',
      accessor: (row: Pinjaman) => (
        <div className="flex gap-2">
          <Link
            href={`/bo/pinjaman/detail/${row.id}`}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-95 shadow-sm"
            title="Lihat Detail & Jadwal"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/bo/pinjaman/edit/${row.id}`}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95 shadow-sm"
            title="Review / Ubah Status"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];
}
