'use client';

import { create } from 'zustand';

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

interface SimpananState {
  dataList: Simpanan[];
  isLoaded: boolean;
  setDataList: (data: Simpanan[]) => void;
  setLoaded: (loaded: boolean) => void;
  addSimpanan: (
    anggotaId: string,
    jenis: SimpananJenis,
    jumlah: number,
    keterangan: string,
    tipe?: 'Setoran' | 'Penarikan',
    status?: 'Selesai' | 'Menunggu' | 'Ditolak'
  ) => Simpanan;
  addBulkSimpanan: (entries: Omit<Simpanan, 'id'>[]) => Simpanan[];
  updateSimpananStatus: (id: string, status: 'Selesai' | 'Menunggu' | 'Ditolak') => void;
}

export const useSimpananStore = create<SimpananState>((set, get) => ({
  dataList: [],
  isLoaded: true,

  setDataList: (dataList) => set({ dataList }),
  setLoaded: (isLoaded) => set({ isLoaded }),

  addSimpanan: (anggotaId, jenis, jumlah, keterangan, tipe = 'Setoran', status = 'Selesai') => {
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
    set({ dataList: [...get().dataList, newSimpanan] });
    return newSimpanan;
  },

  addBulkSimpanan: (entries) => {
    const newItems: Simpanan[] = entries.map((e, i) => ({
      ...e,
      id: `s${Date.now()}_${i}`,
    }));
    set({ dataList: [...get().dataList, ...newItems] });
    return newItems;
  },

  updateSimpananStatus: (id, status) => {
    set({
      dataList: get().dataList.map((s) => (s.id === id ? { ...s, status } : s)),
    });
  },
}));
