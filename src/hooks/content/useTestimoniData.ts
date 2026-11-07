'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { useContentStore, type Testimoni } from '@/store/useContentStore';

export function useTestimoniData() {
  const queryClient = useQueryClient();
  const { testimoni, setTestimoni } = useContentStore();

  const { data: serverItems, isLoading } = useQuery({
    queryKey: ['content-testimoni'],
    queryFn: async () => {
      try {
        const res = await contentApi.getTestimoni(true);
        if (res.status === 'success' && res.data) {
          setTestimoni(res.data);
          return res.data as Testimoni[];
        }
      } catch (err) {
        console.warn('Gagal memuat testimoni dari server:', err);
      }
      return testimoni;
    },
  });

  const items = serverItems || testimoni;

  const add = useCallback(
    async (item: Omit<Testimoni, 'id'>) => {
      try {
        await contentApi.createTestimoni(item);
        queryClient.invalidateQueries({ queryKey: ['content-testimoni'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal simpan testimoni ke server, fallback local:', err);
        const next = [...testimoni, { ...item, id: Date.now().toString(36) }];
        setTestimoni(next);
      }
    },
    [testimoni, setTestimoni, queryClient]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Testimoni, 'id'>>) => {
      try {
        await contentApi.updateTestimoni(id, patch);
        queryClient.invalidateQueries({ queryKey: ['content-testimoni'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal update testimoni ke server, fallback local:', err);
        const next = testimoni.map((t) => (t.id === id ? { ...t, ...patch } : t));
        setTestimoni(next);
      }
    },
    [testimoni, setTestimoni, queryClient]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await contentApi.deleteTestimoni(id);
        queryClient.invalidateQueries({ queryKey: ['content-testimoni'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal hapus testimoni dari server, fallback local:', err);
        const next = testimoni.filter((t) => t.id !== id);
        setTestimoni(next);
      }
    },
    [testimoni, setTestimoni, queryClient]
  );

  return { items, add, update, remove, isLoading };
}
