'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { useContentStore, type Layanan } from '@/store/useContentStore';

export function useLayananData() {
  const queryClient = useQueryClient();
  const { layanan, setLayanan } = useContentStore();

  const { data: serverItems, isLoading } = useQuery({
    queryKey: ['content-layanan'],
    queryFn: async () => {
      try {
        const res = await contentApi.getLayanan(true);
        if (res.status === 'success' && res.data) {
          setLayanan(res.data);
          return res.data as Layanan[];
        }
      } catch (err) {
        console.warn('Gagal memuat layanan dari server:', err);
      }
      return layanan;
    },
  });

  const items = serverItems || layanan;

  const add = useCallback(
    async (item: Omit<Layanan, 'id'>) => {
      try {
        await contentApi.createLayanan(item);
        queryClient.invalidateQueries({ queryKey: ['content-layanan'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal simpan layanan ke server, fallback ke local store:', err);
        const next = [...layanan, { ...item, id: Date.now().toString(36) }];
        setLayanan(next);
      }
    },
    [layanan, setLayanan, queryClient]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Layanan, 'id'>>) => {
      try {
        await contentApi.updateLayanan(id, patch);
        queryClient.invalidateQueries({ queryKey: ['content-layanan'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal update layanan ke server, fallback ke local store:', err);
        const next = layanan.map((l) => (l.id === id ? { ...l, ...patch } : l));
        setLayanan(next);
      }
    },
    [layanan, setLayanan, queryClient]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await contentApi.deleteLayanan(id);
        queryClient.invalidateQueries({ queryKey: ['content-layanan'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal hapus layanan dari server, fallback ke local store:', err);
        const next = layanan.filter((l) => l.id !== id);
        setLayanan(next);
      }
    },
    [layanan, setLayanan, queryClient]
  );

  const reorder = useCallback(
    (ordered: Layanan[]) => setLayanan(ordered),
    [setLayanan]
  );

  return { items, add, update, remove, reorder, isLoading };
}
