import { toast } from './toast';

const BASE_URL = import.meta.env.VITE_API_URL as string;

const getToken = (): string | null => localStorage.getItem('token');

const buildHeaders = (withBody = false): Record<string, string> => {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (withBody) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response: Response) => {
  if (response.status === 204) return true;

  if (response.status === 403) {
    toast.error('Akses Ditolak', 'Anda tidak memiliki izin untuk melakukan tindakan ini.');
    throw { status: 403, message: 'Forbidden' };
  }

  const data = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    return data;
  };

export const apiClient = {
  get: (endpoint: string) =>
    fetch(`${BASE_URL}${endpoint}`, { method: 'GET', headers: buildHeaders() })
      .then(handleResponse),

  post: (endpoint: string, data?: unknown) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }).then(handleResponse),

  put: (endpoint: string, data?: unknown) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }).then(handleResponse),

  delete: (endpoint: string) =>
    fetch(`${BASE_URL}${endpoint}`, { method: 'DELETE', headers: buildHeaders() })
      .then(handleResponse),
};
