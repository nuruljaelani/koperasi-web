'use client';

import { create } from 'zustand';

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

interface JenisPinjamanState {
  dataList: JenisPinjaman[];
  isLoaded: boolean;
  setDataList: (data: JenisPinjaman[]) => void;
  setLoaded: (loaded: boolean) => void;
  addData: (item: Omit<JenisPinjaman, 'id'>) => void;
  updateData: (id: string, updated: Omit<JenisPinjaman, 'id'>) => void;
  deleteData: (id: string) => void;
}

export const useJenisPinjamanStore = create<JenisPinjamanState>((set, get) => ({
  dataList: [],
  isLoaded: true,

  setDataList: (dataList) => set({ dataList }),
  setLoaded: (isLoaded) => set({ isLoaded }),

  addData: (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    set({ dataList: [...get().dataList, newItem] });
  },

  updateData: (id, updated) => {
    set({
      dataList: get().dataList.map((a) => (a.id === id ? { ...updated, id } : a)),
    });
  },

  deleteData: (id) => {
    set({
      dataList: get().dataList.filter((a) => a.id !== id),
    });
  },
}));
