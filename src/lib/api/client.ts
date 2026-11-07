import { useAuthStore } from "@/store/useAuthStore";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data?: T;
  meta?: any;
  errors?: any;
}

export function buildQueryString(query?: Record<string, any>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      params.append(k, String(v));
    }
  });
  const str = params.toString();
  return str ? `?${str}` : "";
}

// Flag dan queue untuk menangani multiple concurrent requests saat refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Set credentials: "include" agar cookie refreshToken dikirim dan diterima antar-origin
  const fetchConfig: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, fetchConfig);

    // Interceptor: jika 401 Unauthorized dan bukan request login/refresh-token
    if (
      res.status === 401 &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise<ApiResponse<T>>((resolve, reject) => {
          failedQueue.push({
            resolve: async (newToken: string) => {
              headers["Authorization"] = `Bearer ${newToken}`;
              try {
                const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
                  ...options,
                  headers,
                  credentials: "include",
                });
                const retryData = await retryRes.json();
                resolve(retryData);
              } catch (err) {
                reject(err);
              }
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        const refreshData = await refreshRes.json();

        if (refreshRes.ok && refreshData.status === "success" && refreshData.data?.accessToken) {
          const newToken = refreshData.data.accessToken;
          useAuthStore.getState().setToken(newToken);
          processQueue(null, newToken);

          headers["Authorization"] = `Bearer ${newToken}`;
          const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
          });
          return await retryRes.json();
        } else {
          processQueue(new Error("Gagal refresh token"), null);
          useAuthStore.getState().logout();
          return {
            status: "error",
            message: "Sesi Anda telah kedaluwarsa. Silakan masuk kembali.",
          };
        }
      } catch (refreshErr: any) {
        processQueue(refreshErr, null);
        useAuthStore.getState().logout();
        return {
          status: "error",
          message: "Gagal memperbarui sesi login.",
        };
      } finally {
        isRefreshing = false;
      }
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      status: "error",
      message: error.message || "Gagal terhubung ke server backend.",
    };
  }
}
