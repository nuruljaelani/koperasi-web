'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { useContentStore, type Berita } from '@/store/useContentStore';

export function useBeritaData() {
  const queryClient = useQueryClient();
  const { berita, setBerita } = useContentStore();

  const { data: serverItems, isLoading } = useQuery({
    queryKey: ['content-berita'],
    queryFn: async () => {
      try {
        const res = await contentApi.getBerita();
        if (res.status === 'success' && res.data) {
          setBerita(res.data);
          return res.data as Berita[];
        }
      } catch (err) {
        console.warn('Gagal memuat berita dari server:', err);
      }
      return berita;
    },
  });

  const items = serverItems || berita;

  const add = useCallback(
    async (item: Omit<Berita, 'id'>) => {
      try {
        await contentApi.createBerita(item);
        queryClient.invalidateQueries({ queryKey: ['content-berita'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal simpan berita ke server, fallback local:', err);
        const base = item.isUtama ? berita.map((b) => ({ ...b, isUtama: false })) : berita;
        const next = [{ ...item, id: Date.now().toString(36) }, ...base];
        setBerita(next);
      }
    },
    [berita, setBerita, queryClient]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Berita, 'id'>>) => {
      try {
        await contentApi.updateBerita(id, patch);
        queryClient.invalidateQueries({ queryKey: ['content-berita'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal update berita ke server, fallback local:', err);
        let next = berita;
        if (patch.isUtama) {
          next = berita.map((b) => ({ ...b, isUtama: b.id === id }));
        } else {
          next = berita.map((b) => (b.id === id ? { ...b, ...patch } : b));
        }
        setBerita(next);
      }
    },
    [berita, setBerita, queryClient]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await contentApi.deleteBerita(id);
        queryClient.invalidateQueries({ queryKey: ['content-berita'] });
        queryClient.invalidateQueries({ queryKey: ['public-content'] });
      } catch (err) {
        console.warn('Gagal hapus berita dari server, fallback local:', err);
        const next = berita.filter((b) => b.id !== id);
        setBerita(next);
      }
    },
    [berita, setBerita, queryClient]
  );

  return { items, add, update, remove, isLoading };
}

export function useBeritaDetail(idOrSlug: string) {
  return useQuery({
    queryKey: ['content-berita-detail', idOrSlug],
    queryFn: async () => {
      const res = await contentApi.getBeritaDetail(idOrSlug);
      if (res.status === 'success' && res.data) {
        return res.data as Berita;
      }
      throw new Error(res.message || 'Berita tidak ditemukan');
    },
    enabled: Boolean(idOrSlug),
  });
}
