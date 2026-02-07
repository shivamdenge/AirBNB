import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

let accessToken: string | null = null;
let isRefreshing = false;
let queue: Array<() => void> = [];

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  }
};

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status !== 401 || !originalRequest || (originalRequest as any)._retry) {
      return Promise.reject(error);
    }

    (originalRequest as any)._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await http.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
        tokenStore.set(refreshRes.data.data.accessToken);
        queue.forEach((cb) => cb());
        queue = [];
      } catch (refreshError) {
        tokenStore.set(null);
        queue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    await new Promise<void>((resolve) => {
      queue.push(resolve);
    });

    return http(originalRequest);
  }
);

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await promise;
  if (res.data.error) {
    throw new Error(res.data.error.message);
  }
  return res.data.data;
}
