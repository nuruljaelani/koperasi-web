'use client';
import { useState, useEffect } from 'react';

export type PinjamanStatus = 'Draft' | 'Review' | 'Disetujui' | 'Ditolak' | 'Cair' | 'Lunas';

export interface DokumenPersyaratan {
  jenis: string;
  namaFile: string;
  url: string;
}

export interface Pinjaman {
  id: string;
  nomorPinjaman: string;
  anggotaId: string;
  jenisPinjamanId: string;
  jumlahPengajuan: number;
  tenor: number;
  tanggalPengajuan: string;
  tujuanPinjaman: string;
  status: PinjamanStatus;
  dokumenPersyaratan: DokumenPersyaratan[];
  catatanAdmin: string;
}

const initialData: Pinjaman[] = [
  {
    id: '1',
    nomorPinjaman: 'PJ-2026-001',
    anggotaId: '1', // Budi Santoso
    jenisPinjamanId: '1', // Pinjaman Modal Usaha
    jumlahPengajuan: 15000000,
    tenor: 12,
    tanggalPengajuan: '2025-10-20',
    tujuanPinjaman: 'Tambahan modal warung',
    status: 'Cair',
    dokumenPersyaratan: [
      { jenis: 'KTP', namaFile: 'KTP_Budi.pdf', url: '#' },
      { jenis: 'KK', namaFile: 'KK_Budi.pdf', url: '#' }
    ],
    catatanAdmin: 'Disetujui. Dana sudah dicairkan.'
  },
  {
    id: '2',
    nomorPinjaman: 'PJ-2026-002',
    anggotaId: '1', // Budi Santoso
    jenisPinjamanId: '2', // Kredit Kendaraan Bermotor
    jumlahPengajuan: 25000000,
    tenor: 24,
    tanggalPengajuan: '2026-04-15',
    tujuanPinjaman: 'Beli motor untuk operasional',
    status: 'Review',
    dokumenPersyaratan: [
      { jenis: 'KTP', namaFile: 'KTP_Budi.pdf', url: '#' },
      { jenis: 'KK', namaFile: 'KK_Budi.pdf', url: '#' },
      { jenis: 'BPKB', namaFile: 'BPKB_Motor.pdf', url: '#' }
    ],
    catatanAdmin: ''
  }
];

export function usePinjamanData() {
  const [dataList, setDataList] = useState<Pinjaman[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('koperasi_pinjaman_mock_v2');
    if (saved) {
      // eslint-disable-next-line
      setDataList(JSON.parse(saved));
    } else {
      // eslint-disable-next-line
      setDataList(initialData);
      localStorage.setItem('koperasi_pinjaman_mock_v2', JSON.stringify(initialData));
    }
    setIsLoaded(true);
  }, []);

  const saveToStorage = (data: Pinjaman[]) => {
    setDataList(data);
    localStorage.setItem('koperasi_pinjaman_mock_v2', JSON.stringify(data));
  };

  const addData = (item: Omit<Pinjaman, 'id' | 'nomorPinjaman'>) => {
    const nextNum = dataList.length + 1;
    const nomorPinjaman = `PJ-2026-${String(nextNum).padStart(3, '0')}`;
    const newItem = { ...item, id: Date.now().toString(), nomorPinjaman };
    saveToStorage([...dataList, newItem]);
  };

  const updateData = (id: string, updated: Omit<Pinjaman, 'id'>) => {
    saveToStorage(dataList.map(a => a.id === id ? { ...updated, id } : a));
  };

  const deleteData = (id: string) => {
    saveToStorage(dataList.filter(a => a.id !== id));
  };

  const getByAnggotaId = (anggotaId: string) => {
    return dataList.filter(a => a.anggotaId === anggotaId);
  };

  return {
    dataList,
    isLoaded,
    addData,
    updateData,
    deleteData,
    getByAnggotaId
  };
}
