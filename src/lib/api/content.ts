import { apiFetch } from "./client";

export const contentApi = {
  getPublicContent: async () => {
    return apiFetch('/content/public');
  },
  getSettings: async () => {
    return apiFetch('/content/settings');
  },
  updateSettings: async (payload: any) => {
    return apiFetch('/content/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getHero: async () => {
    return apiFetch('/content/hero');
  },
  updateHero: async (payload: any) => {
    return apiFetch('/content/hero', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getLayanan: async (all = false) => {
    return apiFetch(`/content/layanan${all ? '?all=true' : ''}`);
  },
  createLayanan: async (payload: any) => {
    return apiFetch('/content/layanan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateLayanan: async (id: string | number, payload: any) => {
    return apiFetch(`/content/layanan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteLayanan: async (id: string | number) => {
    return apiFetch(`/content/layanan/${id}`, {
      method: 'DELETE',
    });
  },
  getBerita: async (query?: { status?: string; limit?: number }) => {
    const q = query ? '?' + new URLSearchParams(query as any).toString() : '';
    return apiFetch(`/content/berita${q}`);
  },
  getBeritaDetail: async (idOrSlug: string | number) => {
    return apiFetch(`/content/berita/${idOrSlug}`);
  },
  createBerita: async (payload: any) => {
    return apiFetch('/content/berita', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateBerita: async (id: string | number, payload: any) => {
    return apiFetch(`/content/berita/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteBerita: async (id: string | number) => {
    return apiFetch(`/content/berita/${id}`, {
      method: 'DELETE',
    });
  },
  getTentang: async () => {
    return apiFetch('/content/tentang');
  },
  updateTentang: async (payload: any) => {
    return apiFetch('/content/tentang', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getTestimoni: async (all = false) => {
    return apiFetch(`/content/testimoni${all ? '?all=true' : ''}`);
  },
  createTestimoni: async (payload: any) => {
    return apiFetch('/content/testimoni', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateTestimoni: async (id: string | number, payload: any) => {
    return apiFetch(`/content/testimoni/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteTestimoni: async (id: string | number) => {
    return apiFetch(`/content/testimoni/${id}`, {
      method: 'DELETE',
    });
  },
};
