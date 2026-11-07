import { format } from 'date-fns';
import { ReportType, LaporanMetrics } from '../types';

interface ExportCsvParams {
  reportType: ReportType;
  filteredData: any[];
  anggotaMap: Map<string, string>;
  jenisMap: Map<string, string>;
  metrics: LaporanMetrics;
}

export function exportLaporanToCsv({
  reportType,
  filteredData,
  anggotaMap,
  jenisMap,
  metrics,
}: ExportCsvParams) {
  let headers: string[] = [];
  let rows: string[][] = [];

  if (reportType === 'simpanan') {
    headers = ['No', 'ID Transaksi', 'Anggota', 'Jenis Simpanan', 'Tipe', 'Tanggal', 'Jumlah (Rp)'];
    rows = filteredData.map((s, idx) => [
      (idx + 1).toString(),
      s.id || '-',
      `"${anggotaMap.get(s.anggotaId) || s.anggotaId}"`,
      s.jenis,
      s.tipe,
      s.tanggal ? format(new Date(s.tanggal), 'dd/MM/yyyy') : '-',
      s.jumlah.toString(),
    ]);
  } else if (reportType === 'pinjaman') {
    headers = [
      'No',
      'Nomor Pinjaman',
      'Anggota',
      'Jenis Pinjaman',
      'Jumlah (Rp)',
      'Tenor (Bln)',
      'Status',
      'Tanggal Pengajuan',
    ];
    rows = filteredData.map((p, idx) => [
      (idx + 1).toString(),
      p.nomorPinjaman,
      `"${anggotaMap.get(p.anggotaId) || p.anggotaId}"`,
      `"${jenisMap.get(p.jenisPinjamanId) || p.jenisPinjamanId}"`,
      p.jumlahPengajuan.toString(),
      p.tenor.toString(),
      p.status,
      format(new Date(p.tanggalPengajuan), 'dd/MM/yyyy'),
    ]);
  } else if (reportType === 'kolektibilitas') {
    headers = [
      'No',
      'Nomor Pinjaman',
      'No Anggota',
      'Nama Anggota',
      'No HP',
      'Jumlah Pinjaman (Rp)',
      'Sisa Pokok (Rp)',
      'Kolektibilitas',
      'Kategori',
      'Hari Keterlambatan (DPD)',
      'Bulan Menunggak',
      'Nominal Tunggakan (Rp)',
    ];
    rows = filteredData.map((item, idx) => [
      (idx + 1).toString(),
      item.nomorPinjaman || '-',
      item.anggota?.noAnggota || '-',
      `"${item.anggota?.namaLengkap || '-'}"`,
      `'${item.anggota?.noHp || '-'}`,
      (item.jumlahPinjaman || 0).toString(),
      (item.sisaPokok || 0).toString(),
      `Kol ${item.kolektibilitas}`,
      `"${item.kolektibilitasLabel || '-'}"`,
      (item.hariKeterlambatan || 0).toString(),
      (item.jumlahBulanTunggakan || 0).toString(),
      (item.nominalTunggakan || 0).toString(),
    ]);
  } else if (reportType === 'sentra') {
    headers = [
      'No',
      'Nama Sentra / Wilayah',
      'Jumlah Anggota',
      'Total Simpanan (Rp)',
      'Total Pinjaman Disalurkan (Rp)',
      'Baki Debet Sisa Pokok (Rp)',
      'Jumlah Peminjam Aktif',
    ];
    rows = filteredData.map((item, idx) => [
      (idx + 1).toString(),
      `"${item.namaSentra || '-'}"`,
      (item.totalAnggota || 0).toString(),
      (item.totalSimpanan || 0).toString(),
      (item.totalPinjaman || 0).toString(),
      (item.totalSisaPokok || 0).toString(),
      (item.jumlahPeminjam || 0).toString(),
    ]);
  } else if (reportType === 'anggota') {
    headers = ['No', 'Nomor Anggota', 'Nama Lengkap', 'NIK', 'No Telepon', 'Alamat', 'Status'];
    rows = filteredData.map((a, idx) => [
      (idx + 1).toString(),
      a.nomorAnggota,
      `"${a.nama}"`,
      `'${a.nik}`,
      `'${a.nomorHp}`,
      `"${a.alamat}"`,
      a.status,
    ]);
  } else if (reportType === 'shu') {
    headers = [
      'No',
      'No Anggota',
      'Nama Anggota',
      'Total Simpanan (Rp)',
      'Total Pinjaman (Rp)',
      'SHU Simpanan (Rp)',
      'SHU Pinjaman (Rp)',
      'Total SHU (Rp)',
    ];
    rows = filteredData.map((item, idx) => [
      (idx + 1).toString(),
      item.noAnggota || item.nomorAnggota || '-',
      `"${item.nama || '-'}"`,
      (item.totalSimpanan || 0).toString(),
      (item.totalPinjaman || 0).toString(),
      (item.shuJasaModal || item.shuSimpanan || 0).toString(),
      (item.shuJasaUsaha || item.shuPinjaman || 0).toString(),
      (item.totalShu || 0).toString(),
    ]);
  } else if (reportType === 'keuangan') {
    headers = ['Kategori Keuangan', 'Nilai (Rp)', 'Keterangan'];
    rows = [
      ['Estimasi Kas & Bank Koperasi', (metrics.card1Val || '0').replace(/\D/g, ''), 'Kas berjalan'],
      ['Total Portofolio Simpanan Anggota', (metrics.card2Val || '0').replace(/\D/g, ''), 'Kewajiban kepada anggota'],
      ['Total Pinjaman Beredar (Cair)', (metrics.card3Val || '0').replace(/\D/g, ''), 'Piutang pinjaman'],
      ['Est. Pendapatan Bunga Per Tahun', (metrics.card4Val || '0').replace(/\D/g, ''), 'Estimasi pendapatan operasional'],
    ];
  }

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `Laporan_${reportType.toUpperCase()}_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
