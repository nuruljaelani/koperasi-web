export type ReportType =
  | 'simpanan'
  | 'pinjaman'
  | 'kolektibilitas'
  | 'sentra'
  | 'keuangan'
  | 'anggota'
  | 'shu';

export type PeriodePreset = 'bulan_ini' | 'triwulan' | 'tahun_ini' | 'kustom';

export interface LaporanMetrics {
  card1Title: string;
  card1Val: string;
  card2Title: string;
  card2Val: string;
  card3Title: string;
  card3Val: string;
  card4Title: string;
  card4Val: string;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
