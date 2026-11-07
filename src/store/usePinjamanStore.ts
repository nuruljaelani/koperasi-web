'use client';

import { create } from 'zustand';

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

interface PinjamanState {
  dataList: Pinjaman[];
  isLoaded: boolean;
  setDataList: (data: Pinjaman[]) => void;
  setLoaded: (loaded: boolean) => void;
  addData: (item: Omit<Pinjaman, 'id' | 'nomorPinjaman'>) => void;
  updateData: (id: string, updated: Omit<Pinjaman, 'id'>) => void;
  deleteData: (id: string) => void;
}

export const usePinjamanStore = create<PinjamanState>((set, get) => ({
  dataList: [],
  isLoaded: true,

  setDataList: (dataList) => set({ dataList }),
  setLoaded: (isLoaded) => set({ isLoaded }),

  addData: (item) => {
    const currentList = get().dataList;
    const nextNum = currentList.length + 1;
    const nomorPinjaman = `PJ-2026-${String(nextNum).padStart(3, '0')}`;
    const newItem = { ...item, id: Date.now().toString(), nomorPinjaman };
    set({ dataList: [...currentList, newItem] });
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
