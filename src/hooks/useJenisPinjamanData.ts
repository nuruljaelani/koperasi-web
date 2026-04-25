'use client';
import { useState, useEffect } from 'react';

export interface JenisPinjaman {
  id: string;
  kode: string;
  nama: string;
  sukuBunga: number;
  tipeBunga: 'Flat' | 'Menurun' | 'Anuitas';
  tenorMaksimal: number;
  biayaAdmin: number;
  denda: number;
  status: 'Aktif' | 'Tidak Aktif';
}

const initialData: JenisPinjaman[] = [
  {
    id: '1',
    kode: 'JP-01',
    nama: 'Pinjaman Modal Usaha',
    sukuBunga: 1.5,
    tipeBunga: 'Menurun',
    tenorMaksimal: 36,
    biayaAdmin: 1.0,
    denda: 0.1,
    status: 'Aktif'
  },
  {
    id: '2',
    kode: 'JP-02',
    nama: 'Kredit Kendaraan Bermotor',
    sukuBunga: 1.2,
    tipeBunga: 'Flat',
    tenorMaksimal: 60,
    biayaAdmin: 2.0,
    denda: 0.2,
    status: 'Aktif'
  }
];

export function useJenisPinjamanData() {
  const [dataList, setDataList] = useState<JenisPinjaman[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('koperasi_jenis_pinjaman_mock');
    if (saved) {
      // eslint-disable-next-line
      setDataList(JSON.parse(saved));
    } else {
      setDataList(initialData);
      localStorage.setItem('koperasi_jenis_pinjaman_mock', JSON.stringify(initialData));
    }
    setIsLoaded(true);
  }, []);

  const saveToStorage = (data: JenisPinjaman[]) => {
    setDataList(data);
    localStorage.setItem('koperasi_jenis_pinjaman_mock', JSON.stringify(data));
  };

  const addData = (item: Omit<JenisPinjaman, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    saveToStorage([...dataList, newItem]);
  };

  const updateData = (id: string, updated: Omit<JenisPinjaman, 'id'>) => {
    saveToStorage(dataList.map(a => a.id === id ? { ...updated, id } : a));
  };

  const deleteData = (id: string) => {
    saveToStorage(dataList.filter(a => a.id !== id));
  };

  const getData = (id: string) => {
    return dataList.find(a => a.id === id);
  };

  return {
    dataList,
    isLoaded,
    addData,
    updateData,
    deleteData,
    getData
  };
}
