'use client';

import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { useContentStore } from '@/store/useContentStore';

export function usePublicContent() {
  const store = useContentStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['public-content'],
    queryFn: async () => {
      try {
        const res = await contentApi.getPublicContent();
        if (res.status === 'success' && res.data) {
          const d = res.data;
          if (d.settings) store.updateSettings(d.settings);
          if (d.hero) store.updateHero(d.hero);
          if (d.layanan) store.setLayanan(d.layanan);
          if (d.berita) store.setBerita(d.berita);
          if (d.tentang) store.updateTentang(d.tentang);
          if (d.testimoni) store.setTestimoni(d.testimoni);
          return d;
        }
      } catch (err) {
        console.warn('Gagal memuat public content dari backend, menggunakan data offline store:', err);
      }
      return {
        settings: store.settings,
        hero: store.hero,
        layanan: store.layanan,
        berita: store.berita,
        tentang: store.tentang,
        testimoni: store.testimoni,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 menit
  });

  return {
    content: data || {
      settings: store.settings,
      hero: store.hero,
      layanan: store.layanan,
      berita: store.berita,
      tentang: store.tentang,
      testimoni: store.testimoni,
    },
    isLoading,
    refetch,
  };
}
