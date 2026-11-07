import { useMemo } from 'react';
import { RekapRow } from '../components/LaporanSimpananChartTable';
import { Simpanan } from '@/hooks/useSimpananData';
import { Anggota } from '@/hooks/useAnggotaData';

export type GroupBy = 'bulan' | 'anggota' | 'jenis';

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

interface UseRekapSimpananProps {
  filtered: Simpanan[];
  anggotaList: Anggota[];
  groupBy: GroupBy;
}

export function useRekapSimpanan({ filtered, anggotaList, groupBy }: UseRekapSimpananProps) {
  /* ── Group by bulan ── */
  const byBulan = useMemo((): RekapRow[] => {
    const map: Record<string, { setoran: number; penarikan: number; count: number }> = {};
    filtered.forEach((s) => {
      const d = new Date(s.tanggal);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { setoran: 0, penarikan: 0, count: 0 };
      if (s.tipe === 'Setoran') map[key].setoran += s.jumlah;
      else map[key].penarikan += s.jumlah;
      map[key].count++;
    });
    return Object.entries(map)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, v]): RekapRow => {
        const [y, m] = key.split('-');
        return {
          label: `${monthNames[parseInt(m) - 1]} ${y}`,
          sub: '',
          ...v,
          saldo: v.setoran - v.penarikan,
        };
      });
  }, [filtered]);

  /* ── Group by anggota ── */
  const byAnggota = useMemo((): RekapRow[] => {
    const map: Record<string, { setoran: number; penarikan: number; count: number }> = {};
    filtered.forEach((s) => {
      if (!map[s.anggotaId]) map[s.anggotaId] = { setoran: 0, penarikan: 0, count: 0 };
      if (s.tipe === 'Setoran') map[s.anggotaId].setoran += s.jumlah;
      else map[s.anggotaId].penarikan += s.jumlah;
      map[s.anggotaId].count++;
    });
    return Object.entries(map)
      .sort((a, b) => b[1].setoran - b[1].penarikan - (a[1].setoran - a[1].penarikan))
      .map(([id, v]): RekapRow => {
        const a = anggotaList.find((x) => x.id === id);
        return {
          label: a?.nama || id,
          sub: a?.nomorAnggota || '',
          ...v,
          saldo: v.setoran - v.penarikan,
        };
      });
  }, [filtered, anggotaList]);

  /* ── Group by jenis ── */
  const byJenis = useMemo((): RekapRow[] => {
    const map: Record<string, { setoran: number; penarikan: number; count: number }> = {};
    filtered.forEach((s) => {
      if (!map[s.jenis]) map[s.jenis] = { setoran: 0, penarikan: 0, count: 0 };
      if (s.tipe === 'Setoran') map[s.jenis].setoran += s.jumlah;
      else map[s.jenis].penarikan += s.jumlah;
      map[s.jenis].count++;
    });
    return Object.entries(map).map(([jenis, v]): RekapRow => ({
      label: jenis,
      sub: '',
      ...v,
      saldo: v.setoran - v.penarikan,
    }));
  }, [filtered]);

  const activeData: RekapRow[] =
    groupBy === 'bulan' ? byBulan : groupBy === 'anggota' ? byAnggota : byJenis;

  const maxVal = Math.max(...activeData.map((r) => r.setoran), 1);

  const exportCsv = (year: string, month: string) => {
    let header = '';
    let rows: string[] = [];
    if (groupBy === 'bulan') {
      header = 'Periode,Total Setoran,Total Penarikan,Saldo Bersih,Jumlah Transaksi';
      rows = activeData.map((r) => `${r.label},${r.setoran},${r.penarikan},${r.saldo},${r.count}`);
    } else if (groupBy === 'anggota') {
      header = 'Nama Anggota,No. Anggota,Total Setoran,Total Penarikan,Saldo,Transaksi';
      rows = activeData.map(
        (r) => `${r.label},${r.sub},${r.setoran},${r.penarikan},${r.saldo},${r.count}`
      );
    } else {
      header = 'Jenis Simpanan,Total Setoran,Total Penarikan,Saldo,Transaksi';
      rows = activeData.map((r) => `${r.label},${r.setoran},${r.penarikan},${r.saldo},${r.count}`);
    }
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_simpanan_${year || 'semua'}_${month || 'semua-bulan'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    byBulan,
    byAnggota,
    byJenis,
    activeData,
    maxVal,
    exportCsv,
    monthNames,
  };
}
