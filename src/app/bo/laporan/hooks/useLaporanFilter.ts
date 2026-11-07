import { useMemo } from 'react';
import { ReportType } from '../types';
import { useLaporanMetrics } from './useLaporanMetrics';

interface UseLaporanFilterParams {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  searchTerm: string;
  statusFilter: string;
  simpananList: any[];
  pinjamanList: any[];
  anggotaList: any[];
  kolReport: any;
  sentraReport: any;
  shuReport: any;
  anggotaMap: Map<string, string>;
}

export function useLaporanFilter({
  reportType,
  startDate,
  endDate,
  searchTerm,
  statusFilter,
  simpananList,
  pinjamanList,
  anggotaList,
  kolReport,
  sentraReport,
  shuReport,
  anggotaMap,
}: UseLaporanFilterParams) {
  const filteredData = useMemo(() => {
    const start = startDate ? new Date(startDate) : new Date(2020, 0, 1);
    const end = endDate ? new Date(`${endDate}T23:59:59`) : new Date();

    if (reportType === 'simpanan') {
      return (simpananList || []).filter((s) => {
        const itemDate = s.tanggal ? new Date(s.tanggal) : new Date();
        const inDateRange = itemDate >= start && itemDate <= end;
        const namaAnggota = anggotaMap.get(s.anggotaId) || '';
        const matchSearch =
          !searchTerm ||
          namaAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.id && s.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (s.keterangan && s.keterangan.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'semua' || s.tipe === statusFilter;
        return inDateRange && matchSearch && matchStatus;
      });
    }

    if (reportType === 'pinjaman') {
      return (pinjamanList || []).filter((p) => {
        const itemDate = p.tanggalPengajuan ? new Date(p.tanggalPengajuan) : new Date();
        const inDateRange = itemDate >= start && itemDate <= end;
        const namaAnggota = anggotaMap.get(p.anggotaId) || '';
        const matchSearch =
          !searchTerm ||
          namaAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.nomorPinjaman && p.nomorPinjaman.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'semua' || p.status === statusFilter;
        return inDateRange && matchSearch && matchStatus;
      });
    }

    if (reportType === 'anggota') {
      return (anggotaList || []).filter((a) => {
        const matchSearch =
          !searchTerm ||
          (a.nama && a.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (a.nik && a.nik.includes(searchTerm)) ||
          (a.nomorHp && a.nomorHp.includes(searchTerm)) ||
          (a.nomorAnggota && a.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'semua' || a.status === statusFilter;
        return matchSearch && matchStatus;
      });
    }

    if (reportType === 'kolektibilitas') {
      const items = (kolReport?.detail as any[]) || [];
      return items.filter((item) => {
        const matchSearch =
          !searchTerm ||
          (item.nomorPinjaman &&
            item.nomorPinjaman.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.anggota?.namaLengkap &&
            item.anggota.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.anggota?.noAnggota &&
            item.anggota.noAnggota.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'semua' || String(item.kolektibilitas) === statusFilter;
        return matchSearch && matchStatus;
      });
    }

    if (reportType === 'sentra') {
      const items = (sentraReport?.detail as any[]) || [];
      return items.filter((item) => {
        return (
          !searchTerm ||
          (item.namaSentra && item.namaSentra.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    if (reportType === 'shu') {
      if (shuReport?.detail && shuReport.detail.length > 0) {
        return shuReport.detail.filter((item: any) => {
          return (
            !searchTerm ||
            item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.noAnggota.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }

      return (anggotaList || [])
        .map((a) => {
          const mySimpanan = (simpananList || [])
            .filter((s) => s.anggotaId === a.id)
            .reduce((sum, s) => sum + (s.tipe === 'Setoran' ? s.jumlah : -s.jumlah), 0);
          const myPinjaman = (pinjamanList || [])
            .filter((p) => p.anggotaId === a.id && (p.status === 'Cair' || p.status === 'Lunas'))
            .reduce((sum, p) => sum + p.jumlahPengajuan, 0);

          const shuSimpanan = Math.round(mySimpanan * 0.05);
          const shuPinjaman = Math.round(myPinjaman * 0.03);
          const totalShu = shuSimpanan + shuPinjaman;

          return {
            id: a.id,
            nomorAnggota: a.nomorAnggota || '-',
            nama: a.nama || '-',
            totalSimpanan: Math.max(0, mySimpanan),
            totalPinjaman: myPinjaman,
            shuSimpanan,
            shuPinjaman,
            totalShu,
          };
        })
        .filter((item) => {
          return (
            !searchTerm ||
            item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
    }

    return [];
  }, [
    reportType,
    simpananList,
    pinjamanList,
    anggotaList,
    kolReport,
    sentraReport,
    shuReport,
    startDate,
    endDate,
    searchTerm,
    statusFilter,
    anggotaMap,
  ]);

  const metrics = useLaporanMetrics({
    reportType,
    filteredData,
    simpananList,
    pinjamanList,
    anggotaList,
    kolReport,
    sentraReport,
  });

  return { filteredData, metrics };
}
