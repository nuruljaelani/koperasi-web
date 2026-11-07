'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { useContentStore, type HeroContent } from '@/store/useContentStore';

export function useHeroContent() {
  const queryClient = useQueryClient();
  const { hero, updateHero } = useContentStore();
  const [data, setData] = useState<HeroContent>(hero);
  const [saved, setSaved] = useState(false);

  const { data: serverData, isLoading } = useQuery({
    queryKey: ['content-hero'],
    queryFn: async () => {
      try {
        const res = await contentApi.getHero();
        if (res.status === 'success' && res.data) {
          updateHero(res.data);
          return res.data;
        }
      } catch (err) {
        console.warn('Gagal memuat hero dari server:', err);
      }
      return hero;
    },
  });

  useEffect(() => {
    if (serverData) {
      setData(serverData);
    }
  }, [serverData]);

  const updateMutation = useMutation({
    mutationFn: async (payload: HeroContent) => {
      return contentApi.updateHero(payload);
    },
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        updateHero(res.data);
        setData(res.data);
      }
      queryClient.invalidateQueries({ queryKey: ['content-hero'] });
      queryClient.invalidateQueries({ queryKey: ['public-content'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: () => {
      updateHero(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const update = useCallback((patch: Partial<HeroContent>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const commit = useCallback(() => {
    updateMutation.mutate(data);
  }, [data, updateMutation]);

  return { data, update, commit, saved, isLoading, isSaving: updateMutation.isPending };
}
