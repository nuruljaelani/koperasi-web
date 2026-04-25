'use client';
import { useState, useEffect, useCallback } from 'react';

export interface Anggota {
  id: string;
  nomorAnggota: string;
  nik: string;
  nama: string;
  nomorHp: string;
  alamat: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  status: 'Aktif' | 'Tidak Aktif';
}

const initialData: Anggota[] = [
  {
    id: '1',
    nomorAnggota: 'A-1001',
    nik: '3201010101010001',
    nama: 'Ahmad Sudirman',
    nomorHp: '081234567890',
    alamat: 'Jl. Melati No. 12, Jakarta',
    tanggalLahir: '1985-05-12',
    jenisKelamin: 'Laki-laki',
    status: 'Aktif'
  },
  {
    id: '2',
    nomorAnggota: 'A-1002',
    nik: '3201010101010002',
    nama: 'Siti Aminah',
    nomorHp: '081298765432',
    alamat: 'Jl. Kenanga No. 8, Bandung',
    tanggalLahir: '1990-08-21',
    jenisKelamin: 'Perempuan',
    status: 'Aktif'
  }
];

export function useAnggotaData() {
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount (Client-side only)
    const saved = localStorage.getItem('koperasi_anggota_mock');
    if (saved) {
      // eslint-disable-next-line
      setAnggotaList(JSON.parse(saved));
    } else {
      // eslint-disable-next-line
      setAnggotaList(initialData);
      localStorage.setItem('koperasi_anggota_mock', JSON.stringify(initialData));
    }
    setIsLoaded(true);
  }, []);

  const saveToStorage = (data: Anggota[]) => {
    setAnggotaList(data);
    localStorage.setItem('koperasi_anggota_mock', JSON.stringify(data));
  };

  const addAnggota = (anggota: Omit<Anggota, 'id'>) => {
    const newAnggota = { ...anggota, id: Date.now().toString() };
    saveToStorage([...anggotaList, newAnggota]);
  };

  const updateAnggota = (id: string, updated: Omit<Anggota, 'id'>) => {
    saveToStorage(anggotaList.map(a => a.id === id ? { ...updated, id } : a));
  };

  const deleteAnggota = (id: string) => {
    saveToStorage(anggotaList.filter(a => a.id !== id));
  };

  // useCallback ensures a stable reference — prevents infinite loops in useEffect dependencies
  const getAnggota = useCallback(
    (id: string) => anggotaList.find(a => a.id === id),
    [anggotaList]
  );

  return {
    anggotaList,
    isLoaded,
    addAnggota,
    updateAnggota,
    deleteAnggota,
    getAnggota
  };
}
