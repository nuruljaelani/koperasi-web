'use client';
import { useState, useEffect } from 'react';

export type SimpananJenis = 'Wajib' | 'Pokok' | 'Sukarela';

export interface Simpanan {
  id: string;
  anggotaId: string;
  jenis: SimpananJenis;
  jumlah: number;
  tanggal: string;
  keterangan: string;
  tipe: 'Setoran' | 'Penarikan';
  status: 'Selesai' | 'Menunggu' | 'Ditolak';
}

const initialData: Simpanan[] = [
  // Ahmad Sudirman (anggotaId: '1')
  { id: 's1', anggotaId: '1', jenis: 'Pokok', jumlah: 500000, tanggal: '2023-01-10', keterangan: 'Simpanan pokok awal masuk', tipe: 'Setoran', status: 'Selesai' },
  { id: 's2', anggotaId: '1', jenis: 'Wajib', jumlah: 150000, tanggal: '2024-03-01', keterangan: 'Simpanan wajib Mar 2024', tipe: 'Setoran', status: 'Selesai' },
  { id: 's3', anggotaId: '1', jenis: 'Wajib', jumlah: 150000, tanggal: '2024-04-01', keterangan: 'Simpanan wajib Apr 2024', tipe: 'Setoran', status: 'Selesai' },
  { id: 's4', anggotaId: '1', jenis: 'Sukarela', jumlah: 750000, tanggal: '2024-06-15', keterangan: 'Setoran sukarela', tipe: 'Setoran', status: 'Selesai' },
  { id: 's5', anggotaId: '1', jenis: 'Wajib', jumlah: 150000, tanggal: '2024-07-01', keterangan: 'Simpanan wajib Jul 2024', tipe: 'Setoran', status: 'Selesai' },
  { id: 's6', anggotaId: '1', jenis: 'Wajib', jumlah: 150000, tanggal: '2024-08-01', keterangan: 'Simpanan wajib Agu 2024', tipe: 'Setoran', status: 'Selesai' },
  { id: 's7', anggotaId: '1', jenis: 'Sukarela', jumlah: 1000000, tanggal: '2025-01-10', keterangan: 'Tabungan tambahan', tipe: 'Setoran', status: 'Selesai' },
  { id: 's8', anggotaId: '1', jenis: 'Wajib', jumlah: 150000, tanggal: '2025-03-01', keterangan: 'Simpanan wajib Mar 2025', tipe: 'Setoran', status: 'Selesai' },
  { id: 's9', anggotaId: '1', jenis: 'Wajib', jumlah: 150000, tanggal: '2026-01-01', keterangan: 'Simpanan wajib Jan 2026', tipe: 'Setoran', status: 'Selesai' },
  { id: 's10', anggotaId: '1', jenis: 'Wajib', jumlah: 150000, tanggal: '2026-02-01', keterangan: 'Simpanan wajib Feb 2026', tipe: 'Setoran', status: 'Selesai' },
  // Siti Aminah (anggotaId: '2')
  { id: 's11', anggotaId: '2', jenis: 'Pokok', jumlah: 500000, tanggal: '2023-06-05', keterangan: 'Simpanan pokok awal masuk', tipe: 'Setoran', status: 'Selesai' },
  { id: 's12', anggotaId: '2', jenis: 'Wajib', jumlah: 150000, tanggal: '2024-01-01', keterangan: 'Simpanan wajib Jan 2024', tipe: 'Setoran', status: 'Selesai' },
  { id: 's13', anggotaId: '2', jenis: 'Sukarela', jumlah: 500000, tanggal: '2024-09-20', keterangan: 'Setoran sukarela', tipe: 'Setoran', status: 'Selesai' },
  { id: 's14', anggotaId: '2', jenis: 'Wajib', jumlah: 150000, tanggal: '2025-02-01', keterangan: 'Simpanan wajib Feb 2025', tipe: 'Setoran', status: 'Selesai' },
  { id: 's15', anggotaId: '2', jenis: 'Wajib', jumlah: 150000, tanggal: '2026-03-01', keterangan: 'Simpanan wajib Mar 2026', tipe: 'Setoran', status: 'Selesai' },
];

export function useSimpananData() {
  const [dataList, setDataList] = useState<Simpanan[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('koperasi_simpanan_mock');
    if (saved) {
      // Compatibility code: ensure existing data has tipe and status
      const parsed = JSON.parse(saved);
      const migrated = parsed.map((item: any) => ({
        ...item,
        tipe: item.tipe || 'Setoran',
        status: item.status || 'Selesai',
      }));
      setDataList(migrated);
    } else {
      setDataList(initialData);
      localStorage.setItem('koperasi_simpanan_mock', JSON.stringify(initialData));
    }
    setIsLoaded(true);
  }, []);

  const saveToLocalStorage = (newData: Simpanan[]) => {
    setDataList(newData);
    localStorage.setItem('koperasi_simpanan_mock', JSON.stringify(newData));
  };

  const getByAnggota = (anggotaId: string) =>
    dataList.filter((s) => s.anggotaId === anggotaId);

  const getTotalByAnggota = (anggotaId: string) =>
    dataList
      .filter((s) => s.anggotaId === anggotaId && s.status === 'Selesai')
      .reduce((sum, s) => {
        if (s.tipe === 'Penarikan') {
          return sum - s.jumlah;
        }
        return sum + s.jumlah;
      }, 0);

  const getTotalSukarelaByAnggota = (anggotaId: string) =>
    dataList
      .filter((s) => s.anggotaId === anggotaId && s.jenis === 'Sukarela' && s.status === 'Selesai')
      .reduce((sum, s) => {
        if (s.tipe === 'Penarikan') return sum - s.jumlah;
        return sum + s.jumlah;
      }, 0);

  const addSimpanan = (
    anggotaId: string,
    jenis: SimpananJenis,
    jumlah: number,
    keterangan: string,
    tipe: 'Setoran' | 'Penarikan' = 'Setoran',
    status: 'Selesai' | 'Menunggu' | 'Ditolak' = 'Selesai'
  ) => {
    const newSimpanan: Simpanan = {
      id: `s${Date.now()}`,
      anggotaId,
      jenis,
      jumlah,
      tanggal: new Date().toISOString(),
      keterangan,
      tipe,
      status,
    };
    saveToLocalStorage([...dataList, newSimpanan]);
    return newSimpanan;
  };

  const addBulkSimpanan = (entries: Omit<Simpanan, 'id'>[]) => {
    const newItems: Simpanan[] = entries.map((e, i) => ({
      ...e,
      id: `s${Date.now()}_${i}`,
    }));
    saveToLocalStorage([...dataList, ...newItems]);
    return newItems;
  };

  const updateSimpananStatus = (id: string, status: 'Selesai' | 'Menunggu' | 'Ditolak') => {
    const updated = dataList.map(s => s.id === id ? { ...s, status } : s);
    saveToLocalStorage(updated);
  };

  const getTotalByJenis = (jenis: SimpananJenis) =>
    dataList
      .filter(s => s.jenis === jenis && s.status === 'Selesai')
      .reduce((sum, s) => (s.tipe === 'Penarikan' ? sum - s.jumlah : sum + s.jumlah), 0);

  return {
    dataList,
    isLoaded,
    getByAnggota,
    getTotalByAnggota,
    getTotalSukarelaByAnggota,
    addSimpanan,
    addBulkSimpanan,
    updateSimpananStatus,
    getTotalByJenis,
  };
}
