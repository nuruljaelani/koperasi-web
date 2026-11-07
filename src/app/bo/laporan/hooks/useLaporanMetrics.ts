import { useMemo } from 'react';
import { ReportType, LaporanMetrics, formatRupiah } from '../types';

interface UseLaporanMetricsParams {
  reportType: ReportType;
  filteredData: any[];
  simpananList: any[];
  pinjamanList: any[];
  anggotaList: any[];
  kolReport: any;
  sentraReport: any;
}

export function useLaporanMetrics({
  reportType,
  filteredData,
  simpananList,
  pinjamanList,
  anggotaList,
  kolReport,
  sentraReport,
}: UseLaporanMetricsParams): LaporanMetrics {
  return useMemo(() => {
    if (reportType === 'simpanan') {
      const data = filteredData as typeof simpananList;
      const totalSetoran = data
        .filter((s) => s.tipe === 'Setoran')
        .reduce((acc, s) => acc + s.jumlah, 0);
      const totalPenarikan = data
        .filter((s) => s.tipe === 'Penarikan')
        .reduce((acc, s) => acc + s.jumlah, 0);
      const saldoNetto = totalSetoran - totalPenarikan;
      return {
        card1Title: 'Total Setoran',
        card1Val: formatRupiah(totalSetoran),
        card2Title: 'Total Penarikan',
        card2Val: formatRupiah(totalPenarikan),
        card3Title: 'Arus Bersih (Netto)',
        card3Val: formatRupiah(saldoNetto),
        card4Title: 'Jumlah Transaksi',
        card4Val: `${data.length} Trx`,
      };
    }

    if (reportType === 'pinjaman') {
      const data = filteredData as typeof pinjamanList;
      const totalDisalurkan = data
        .filter((p) => p.status === 'Cair' || p.status === 'Lunas')
        .reduce((acc, p) => acc + p.jumlahPengajuan, 0);
      const totalCairCount = data.filter((p) => p.status === 'Cair').length;
      const totalReviewCount = data.filter((p) => p.status === 'Review').length;
      return {
        card1Title: 'Total Pinjaman Cair',
        card1Val: formatRupiah(totalDisalurkan),
        card2Title: 'Pinjaman Aktif (Cair)',
        card2Val: `${totalCairCount} Berkas`,
        card3Title: 'Menunggu Review',
        card3Val: `${totalReviewCount} Berkas`,
        card4Title: 'Total Berkas Masuk',
        card4Val: `${data.length} Pengajuan`,
      };
    }

    if (reportType === 'kolektibilitas') {
      const ringkasan = kolReport?.ringkasan;
      return {
        card1Title: 'Total Debitur Pinjaman',
        card1Val: `${ringkasan?.totalDebitur ?? 0} Debitur`,
        card2Title: 'Total Baki Debet',
        card2Val: formatRupiah(ringkasan?.totalBakiDebet ?? 0),
        card3Title: 'Rasio NPL (Kol 3-5)',
        card3Val: `${ringkasan?.nplRatio ?? 0}%`,
        card4Title: 'Portfolio At Risk (PAR)',
        card4Val: `${ringkasan?.parRatio ?? 0}%`,
      };
    }

    if (reportType === 'sentra') {
      const ringkasan = sentraReport?.ringkasan;
      return {
        card1Title: 'Total Sentra Terdaftar',
        card1Val: `${ringkasan?.totalSentra ?? 0} Sentra`,
        card2Title: 'Anggota Per Sentra',
        card2Val: `${ringkasan?.totalAnggota ?? 0} Anggota`,
        card3Title: 'Total Saldo Simpanan',
        card3Val: formatRupiah(ringkasan?.totalSimpanan ?? 0),
        card4Title: 'Total Baki Debet Pinjaman',
        card4Val: formatRupiah(ringkasan?.totalSisaPokok ?? 0),
      };
    }

    if (reportType === 'keuangan') {
      const totalSimpanan = (simpananList || []).reduce(
        (acc, s) => acc + (s.tipe === 'Setoran' ? s.jumlah : -s.jumlah),
        0
      );
      const totalPinjamanCair = (pinjamanList || [])
        .filter((p) => p.status === 'Cair')
        .reduce((acc, p) => acc + p.jumlahPengajuan, 0);
      const estimasiBunga = Math.round(totalPinjamanCair * 0.015 * 12);
      const kasKoperasi = Math.max(0, totalSimpanan - totalPinjamanCair + 500000000);

      return {
        card1Title: 'Estimasi Kas & Bank',
        card1Val: formatRupiah(kasKoperasi),
        card2Title: 'Portofolio Simpanan',
        card2Val: formatRupiah(totalSimpanan),
        card3Title: 'Pinjaman Beredar (Cair)',
        card3Val: formatRupiah(totalPinjamanCair),
        card4Title: 'Est. Pendapatan Bunga (Thn)',
        card4Val: formatRupiah(estimasiBunga),
      };
    }

    if (reportType === 'anggota') {
      const data = filteredData as typeof anggotaList;
      const aktifCount = data.filter((a) => a.status === 'Aktif').length;
      const nonAktifCount = data.filter((a) => a.status !== 'Aktif').length;
      return {
        card1Title: 'Total Anggota Registered',
        card1Val: `${data.length} Orang`,
        card2Title: 'Anggota Aktif',
        card2Val: `${aktifCount} Orang`,
        card3Title: 'Anggota Non-Aktif',
        card3Val: `${nonAktifCount} Orang`,
        card4Title: 'Rasio Keaktifan',
        card4Val: `${data.length > 0 ? Math.round((aktifCount / data.length) * 100) : 0}%`,
      };
    }

    if (reportType === 'shu') {
      const data = filteredData as Array<{
        totalShu: number;
        shuSimpanan?: number;
        shuPinjaman?: number;
        shuJasaModal?: number;
        shuJasaUsaha?: number;
      }>;
      const totalSHU = data.reduce((acc, item) => acc + (item.totalShu || 0), 0);
      const totalSHUSimpanan = data.reduce(
        (acc, item) => acc + (item.shuJasaModal || item.shuSimpanan || 0),
        0
      );
      const totalSHUPinjaman = data.reduce(
        (acc, item) => acc + (item.shuJasaUsaha || item.shuPinjaman || 0),
        0
      );
      return {
        card1Title: 'Total Alokasi SHU',
        card1Val: formatRupiah(totalSHU),
        card2Title: 'SHU Jasa Simpanan (50%)',
        card2Val: formatRupiah(totalSHUSimpanan),
        card3Title: 'SHU Jasa Pinjaman (50%)',
        card3Val: formatRupiah(totalSHUPinjaman),
        card4Title: 'Penerima SHU',
        card4Val: `${data.length} Anggota`,
      };
    }

    return {
      card1Title: '-',
      card1Val: '-',
      card2Title: '-',
      card2Val: '-',
      card3Title: '-',
      card3Val: '-',
      card4Title: '-',
      card4Val: '-',
    };
  }, [
    reportType,
    filteredData,
    simpananList,
    pinjamanList,
    anggotaList,
    kolReport,
    sentraReport,
  ]);
}
