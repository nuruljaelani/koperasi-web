'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { useContentStore, type SiteSettings } from '@/store/useContentStore';

export function useSiteSettings() {
  const queryClient = useQueryClient();
  const { settings, updateSettings } = useContentStore();
  const [data, setData] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  const { data: serverData, isLoading } = useQuery({
    queryKey: ['content-settings'],
    queryFn: async () => {
      try {
        const res = await contentApi.getSettings();
        if (res.status === 'success' && res.data) {
          updateSettings(res.data);
          return res.data;
        }
      } catch (err) {
        console.warn('Gagal memuat settings dari server:', err);
      }
      return settings;
    },
  });

  useEffect(() => {
    if (serverData) {
      setData(serverData);
    }
  }, [serverData]);

  const updateMutation = useMutation({
    mutationFn: async (payload: SiteSettings) => {
      return contentApi.updateSettings(payload);
    },
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        updateSettings(res.data);
        setData(res.data);
      }
      queryClient.invalidateQueries({ queryKey: ['content-settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-content'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: () => {
      // Fallback update store lokal
      updateSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const update = useCallback((patch: Partial<SiteSettings>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const commit = useCallback(() => {
    updateMutation.mutate(data);
  }, [data, updateMutation]);

  return { data, update, commit, saved, isLoading, isSaving: updateMutation.isPending };
}
