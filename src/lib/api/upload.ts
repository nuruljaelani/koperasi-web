import { apiFetch, API_BASE_URL } from "./client";
import { useAuthStore } from "@/store/useAuthStore";

export const uploadApi = {
  uploadAvatar: async (payload: { image?: string; file?: File; memberId?: string }) => {
    if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      if (payload.memberId) formData.append('memberId', payload.memberId);

      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE_URL}/upload/avatar`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        credentials: 'include',
      });
      return await res.json();
    } else {
      return apiFetch('/upload/avatar', {
        method: 'POST',
        body: JSON.stringify({
          image: payload.image,
          memberId: payload.memberId,
        }),
      });
    }
  },

  uploadFile: async (payload: { file: File | string; folder?: string }) => {
    if (payload.file instanceof File) {
      const formData = new FormData();
      formData.append('file', payload.file);
      if (payload.folder) formData.append('folder', payload.folder);

      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_BASE_URL}/upload/file`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        credentials: 'include',
      });
      return await res.json();
    } else {
      return apiFetch('/upload/file', {
        method: 'POST',
        body: JSON.stringify({
          file: payload.file,
          folder: payload.folder,
        }),
      });
    }
  },
};
