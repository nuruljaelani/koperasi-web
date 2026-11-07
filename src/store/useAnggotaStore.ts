'use client';

import { create } from 'zustand';

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
  fotoProfil?: string;
}

interface AnggotaState {
  anggotaList: Anggota[];
  isLoaded: boolean;
  setAnggotaList: (data: Anggota[]) => void;
  setLoaded: (loaded: boolean) => void;
  addAnggota: (anggota: Omit<Anggota, 'id'>) => void;
  updateAnggota: (id: string, updated: Omit<Anggota, 'id'>) => void;
  deleteAnggota: (id: string) => void;
}

export const useAnggotaStore = create<AnggotaState>((set, get) => ({
  anggotaList: [],
  isLoaded: true,

  setAnggotaList: (anggotaList) => set({ anggotaList }),
  setLoaded: (isLoaded) => set({ isLoaded }),

  addAnggota: (anggota) => {
    const newAnggota = { ...anggota, id: Date.now().toString() };
    set({ anggotaList: [...get().anggotaList, newAnggota] });
  },

  updateAnggota: (id, updated) => {
    set({
      anggotaList: get().anggotaList.map((a) => (a.id === id ? { ...updated, id } : a)),
    });
  },

  deleteAnggota: (id) => {
    set({
      anggotaList: get().anggotaList.filter((a) => a.id !== id),
    });
  },
}));
