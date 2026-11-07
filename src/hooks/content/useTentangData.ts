'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { useContentStore, type TentangKami } from '@/store/useContentStore';

export function useTentangData() {
  const queryClient = useQueryClient();
  const { tentang, updateTentang } = useContentStore();
  const [data, setData] = useState<TentangKami>(tentang);
  const [saved, setSaved] = useState(false);

  const { data: serverData, isLoading } = useQuery({
    queryKey: ['content-tentang'],
    queryFn: async () => {
      try {
        const res = await contentApi.getTentang();
        if (res.status === 'success' && res.data) {
          updateTentang(res.data);
          return res.data;
        }
      } catch (err) {
        console.warn('Gagal memuat tentang kami dari server:', err);
      }
      return tentang;
    },
  });

  useEffect(() => {
    if (serverData) {
      setData(serverData);
    }
  }, [serverData]);

  const updateMutation = useMutation({
    mutationFn: async (payload: TentangKami) => {
      return contentApi.updateTentang(payload);
    },
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        updateTentang(res.data);
        setData(res.data);
      }
      queryClient.invalidateQueries({ queryKey: ['content-tentang'] });
      queryClient.invalidateQueries({ queryKey: ['public-content'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: () => {
      updateTentang(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const update = useCallback((patch: Partial<TentangKami>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const commit = useCallback(() => {
    updateMutation.mutate(data);
  }, [data, updateMutation]);

  return { data, update, commit, saved, isLoading, isSaving: updateMutation.isPending };
}
